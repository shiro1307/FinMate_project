from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Query
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
import pandas as pd
import io
import os
import google.generativeai as genai
import json
from database import engine, Base, get_db
import models
import schemas
import auth
import gamification
import ai_insights
import utils
from email_service import email_service
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Create database tables (using Alembic is recommended for production, but this is good for early hackathon stage)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="FinMate API", description="Your AI-powered financial companion")

# Add rate limiter
from utils import limiter, rate_limit_exceeded_handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

# Add CORS routing limits
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174", "http://localhost:5175", "http://127.0.0.1:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom error handlers
@app.exception_handler(utils.ValidationError)
async def validation_error_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(utils.BusinessLogicError)
async def business_logic_error_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.get("/")
def read_root():
    return {"message": "Welcome to FinMate API"}

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    return {"status": "ok"}

@app.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

# --- AUTHENTICATION ROUTES ---

@app.post("/signup", response_model=schemas.UserOut)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        password_hash=hashed_password,
        full_name=user.full_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create financial profile
    new_profile = models.FinancialProfile(user_id=new_user.user_id)
    db.add(new_profile)
    
    # Create user stats for gamification
    new_stats = models.UserStats(user_id=new_user.user_id)
    db.add(new_stats)
    
    db.commit()
    
    # Award first login achievement
    gamification.check_and_award_achievement(db, new_user, "first_transaction")
    gamification.create_notification(db, new_user.user_id, "Welcome to FinMate!", 
                                     "Start by importing transactions or scanning receipts to get insights.", "info")
    
    return new_user

@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# --- TRANSACTION & IMPORT ROUTES ---

@app.post("/transactions", response_model=schemas.TransactionOut)
def create_transaction(
    transaction: schemas.TransactionCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    # Validate transaction data
    try:
        utils.validate_amount(transaction.amount)
        utils.validate_category(transaction.category)
    except utils.ValidationError as e:
        raise HTTPException(status_code=422, detail=str(e.detail))
    
    # Auto-suggest category if not provided
    if transaction.category == "uncategorized":
        transaction.category = utils.suggest_category(transaction.description)
    
    new_transaction = models.Transaction(
        **transaction.model_dump(),
        user_id=current_user.user_id
    )
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    
    # Check for achievements
    if not current_user.stats:
        current_user.stats = models.UserStats(user_id=current_user.user_id)
        db.add(current_user.stats)
    
    current_user.stats.total_transactions += 1
    current_user.stats.total_spending += transaction.amount
    db.commit()
    
    # Award big spender achievement
    if transaction.amount > 100:
        gamification.check_and_award_achievement(db, current_user, "big_spender")
    
    utils.log_action("create_transaction", current_user.user_id, f"Amount: ${transaction.amount}")
    
    return new_transaction

@app.post("/upload-csv")
async def upload_transactions_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    content = await file.read()
    try:
        # Assuming CSV has columns: Date, Description, Amount
        df = pd.read_csv(io.StringIO(content.decode("utf-8")))
        
        # Super basic processing logic for standard bank CSVs
        # (This will be expanded greatly, just a skeleton for now)
        transactions_added = 0
        for _, row in df.iterrows():
            # Adjust column names depending on what sample CSV we provide realistically
            amount = float(row.get('Amount', 0.0))
            txn = models.Transaction(
                user_id=current_user.user_id,
                amount=amount,
                description=str(row.get('Description', 'Imported')),
                # Add simple rule based catergorizer here if we want initially later
                category="uncategorized",
                source="import"
            )
            db.add(txn)
            transactions_added += 1
        
        db.commit()
        return {"status": "success", "imported": transactions_added}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing CSV: {str(e)}")

@app.get("/analytics")
def get_analytics(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Fetch all transactions for this user
    transactions = db.query(models.Transaction).filter(
        models.Transaction.user_id == current_user.user_id
    ).all()
    
    total_spent = sum(t.amount for t in transactions)
    
    # Aggregate by category for Pie Chart
    category_totals = {}
    for t in transactions:
        cat = t.category.capitalize()
        category_totals[cat] = category_totals.get(cat, 0) + t.amount
        
    pie_data = [{"name": cat, "value": round(val, 2)} for cat, val in category_totals.items() if val > 0]
    
    # Sort for the largest categories first
    pie_data = sorted(pie_data, key=lambda x: x["value"], reverse=True)
    
    return {
        "status": "success",
        "total_spent": round(total_spent, 2),
        "pie_data": pie_data,
        "recent_transactions": [
            schemas.TransactionOut.model_validate(t).model_dump() for t in sorted(transactions, key=lambda x: x.date, reverse=True)[:5]
        ]
    }

@app.post("/scan-receipt")
async def scan_receipt(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=400, detail="Gemini API Key is not configured. Please add it to your .env file.")
        
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")
        
    try:
        content = await file.read()
        
        # Prepare the image payload for Gemini
        image_parts = [
            {
                "mime_type": file.content_type,
                "data": content
            }
        ]
        
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = """
        Analyze this receipt. Return ONLY a valid JSON object with the following keys:
        - amount: float (total amount paid)
        - merchant: string (name of the store)
        - category: string (one of: Food, Transportation, Entertainment, Utilities, Healthcare, Shopping, Other)
        - date: string (YYYY-MM-DD format if possible, else empty string)
        Make sure the response is strict JSON without markdown blocks or backticks.
        """
        
        response = model.generate_content([prompt, image_parts[0]])
        
        # Sanitize response to just json
        raw_text = response.text.replace('```json', '').replace('```', '').strip()
        data = json.loads(raw_text)
        
        # We could save this to DB immediately or send it back for user confirmation
        # Let's create the transaction
        txn = models.Transaction(
            user_id=current_user.user_id,
            amount=data.get('amount', 0.0),
            description=f"Receipt: {data.get('merchant', 'Unknown')}",
            category=data.get('category', 'uncategorized'),
            source="receipt"
        )
        db.add(txn)
        db.commit()
        db.refresh(txn)
        
        return {
            "status": "success", 
            "message": f"Extracted receipt from {data.get('merchant', 'Unknown')} for ${data.get('amount', 0.0)}",
            "transaction": txn
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Vision Processing Error: {str(e)}")

# --- CONVERSATIONAL AI & ACTIONS ---

@app.post("/chat", response_model=schemas.ChatResponse)
async def chat_with_ai(
    chat_req: schemas.ChatRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=400, detail="Gemini API Key is not configured. Please add it to your .env file.")
        
    try:
        # Get user context (last 5 transactions to keep it fast)
        recent_txns = db.query(models.Transaction)\
            .filter(models.Transaction.user_id == current_user.user_id)\
            .order_by(models.Transaction.date.desc())\
            .limit(5).all()
            
        txn_context = "\n".join([f"- ${t.amount} for {t.description} on {t.date.strftime('%Y-%m-%d') if t.date else 'unknown date'} ({t.category})" for t in recent_txns])
        if not txn_context:
            txn_context = "No recent transactions found."

        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Determine Persona
        if chat_req.roast_mode:
            system_prompt = f"""
            You are FinMate, an absolutely ruthless, sarcastic, and funny AI financial advisor.
            Your job is to roast the user's spending habits while technically giving sound financial advice. 
            Be punchy, mean (but in a fun way), and use Gen-Z/internet slang where appropriate.
            
            User Context (Recent spending):
            {txn_context}
            """
        else:
            system_prompt = f"""
            You are FinMate, a supportive, intelligent, and highly professional AI financial advisor.
            Provide actionable, empathetic, and clear financial guidance.
            
            User Context (Recent spending):
            {txn_context}
            """
            
        # Action Parser Prompt (to see if the AI should take agency)
        action_prompt = """
        IMPORTANT: If the user is asking to cancel a subscription, negotiate a bill, or draft an email related to finances, 
        you MUST output your response in valid JSON format EXACTLY like this (no markdown blocks around it):
        {
           "response": "Here is the template you requested...",
           "action_type": "email_template",
           "action_payload": {
               "subject": "Cancellation of Subscription",
               "body": "Your generated email text here"
           }
        }
        Do NOT output JSON if they are just asking a general question. If it's a general question, just output plain text.
        """
        
        full_prompt = system_prompt + "\n" + action_prompt + "\n\nUser says: " + chat_req.message
        
        response = model.generate_content(full_prompt)
        text = response.text.strip()
        
        # Check if the AI returned the Action JSON
        if text.startswith('{') and text.endswith('}'):
            try:
                # Need to strip possible markdown that might wrap it despite instructions
                clean_text = text.replace('```json', '').replace('```', '').strip()
                data = json.loads(clean_text)
                return schemas.ChatResponse(
                    response=data.get('response', 'Action executed.'),
                    action_type=data.get('action_type', 'none'),
                    action_payload=data.get('action_payload', None)
                )
            except json.JSONDecodeError:
                pass # Fall back to treating it as regular text
                
        return schemas.ChatResponse(
            response=text,
            action_type="none",
            action_payload=None
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM Error: {str(e)}")


# --- BUDGET GOALS ENDPOINTS ---

@app.post("/goals", response_model=schemas.BudgetGoalOut)
def create_budget_goal(
    goal: schemas.BudgetGoalCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Create a new budget goal"""
    try:
        if goal.target_amount <= 0:
            raise utils.ValidationError("Target amount must be positive")
        if goal.deadline <= datetime.utcnow():
            raise utils.ValidationError("Deadline must be in the future")
    except utils.ValidationError as e:
        raise HTTPException(status_code=422, detail=str(e.detail))
    
    new_goal = models.BudgetGoal(
        user_id=current_user.user_id,
        goal_type=goal.goal_type,
        target_amount=goal.target_amount,
        deadline=goal.deadline
    )
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    
    gamification.create_notification(db, current_user.user_id, "Goal Created!", 
                                     f"You set a {goal.goal_type} goal for ${goal.target_amount:.2f}", "achievement")
    
    return new_goal

@app.get("/goals", response_model=list[schemas.BudgetGoalOut])
def list_budget_goals(
    status: str = Query(None, description="Filter by state"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """List user's budget goals with optional filtering"""
    query = db.query(models.BudgetGoal).filter(models.BudgetGoal.user_id == current_user.user_id)
    
    if status:
        query = query.filter(models.BudgetGoal.status == status)
    
    return query.all()

@app.put("/goals/{goal_id}", response_model=schemas.BudgetGoalOut)
def update_budget_goal(
    goal_id: int,
    update: schemas.BudgetGoalUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Update a budget goal"""
    goal = db.query(models.BudgetGoal).filter(
        models.BudgetGoal.goal_id == goal_id,
        models.BudgetGoal.user_id == current_user.user_id
    ).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    update_data = update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(goal, key, value)
    
    db.commit()
    db.refresh(goal)
    return goal

@app.delete("/goals/{goal_id}")
def delete_budget_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Delete a budget goal"""
    goal = db.query(models.BudgetGoal).filter(
        models.BudgetGoal.goal_id == goal_id,
        models.BudgetGoal.user_id == current_user.user_id
    ).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    db.delete(goal)
    db.commit()
    return {"status": "success", "message": "Goal deleted"}


# --- GAMIFICATION ENDPOINTS ---

@app.get("/stats", response_model=schemas.UserStatsOut)
def get_user_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get user's gamification stats"""
    if not current_user.stats:
        stats = models.UserStats(user_id=current_user.user_id)
        db.add(stats)
        db.commit()
        db.refresh(stats)
        return stats
    
    return current_user.stats

@app.get("/achievements", response_model=list[schemas.AchievementOut])
def get_achievements(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get user's unlocked achievements"""
    achievements = db.query(models.Achievement).filter(
        models.Achievement.user_id == current_user.user_id
    ).order_by(models.Achievement.unlocked_at.desc()).all()
    
    return achievements

@app.get("/notifications", response_model=list[schemas.NotificationOut])
def get_notifications(
    unread_only: bool = False,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get user's notifications"""
    query = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.user_id
    )
    
    if unread_only:
        query = query.filter(models.Notification.is_read == False)
    
    return query.order_by(models.Notification.created_at.desc()).limit(20).all()

@app.put("/notifications/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Mark notification as read"""
    notification = db.query(models.Notification).filter(
        models.Notification.notification_id == notification_id,
        models.Notification.user_id == current_user.user_id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    db.commit()
    return {"status": "success"}


# --- AI INSIGHTS ENDPOINTS ---

@app.get("/insights/anomalies")
def get_spending_anomalies(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get AI-detected unusual spending patterns"""
    insight = ai_insights.analyze_spending_anomalies(db, current_user, GEMINI_API_KEY)
    unusual_expenses = ai_insights.detect_unusual_expenses(db, current_user)
    
    return {
        "insight": insight,
        "unusual_expenses": unusual_expenses
    }

@app.get("/insights/weekly-digest")
def get_weekly_digest(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get personalized weekly financial summary"""
    digest = ai_insights.generate_weekly_digest(db, current_user, GEMINI_API_KEY)
    return digest or {"title": "Weekly Summary", "summary": "No data yet", "total_spent": 0}

@app.get("/insights/budget-optimization")
def get_budget_optimization(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get AI-powered budget optimization suggestions"""
    suggestions = ai_insights.suggest_budget_optimization(db, current_user, GEMINI_API_KEY)
    return {"suggestions": suggestions or "Collect more transaction data to get personalized suggestions."}


# --- RECEIPT MANAGEMENT ENDPOINTS ---

@app.post("/receipts/scan-and-confirm")
async def scan_receipt_with_confirmation(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Scan receipt and save for user confirmation before creating transaction"""
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=400, detail="Gemini API Key is not configured.")
    
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")
    
    try:
        content = await file.read()
        
        image_parts = [{"mime_type": file.content_type, "data": content}]
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = """
        Analyze this receipt. Return ONLY a valid JSON object with the following keys:
        - amount: float (total amount paid)
        - merchant: string (name of the store)
        - category: string (one of: Food, Transportation, Entertainment, Utilities, Healthcare, Shopping, Other)
        - date: string (YYYY-MM-DD format if possible, else empty string)
        - description: string (human readable description)
        """
        
        response = model.generate_content([prompt, image_parts[0]])
        raw_text = response.text.replace('```json', '').replace('```', '').strip()
        data = json.loads(raw_text)
        
        # Save as pending receipt for confirmation
        pending = models.ReceiptPending(
            user_id=current_user.user_id,
            extracted_data=json.dumps(data),
            status="pending"
        )
        db.add(pending)
        db.commit()
        db.refresh(pending)
        
        return {
            "receipt_id": pending.receipt_id,
            "data": data,
            "status": "pending_confirmation"
        }
    
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse receipt: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Receipt processing error: {str(e)}")

@app.post("/receipts/{receipt_id}/confirm")
def confirm_receipt(
    receipt_id: int,
    confirm_req: schemas.ReceiptConfirmRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Confirm and create transaction from pending receipt"""
    pending = db.query(models.ReceiptPending).filter(
        models.ReceiptPending.receipt_id == receipt_id,
        models.ReceiptPending.user_id == current_user.user_id
    ).first()
    
    if not pending:
        raise HTTPException(status_code=404, detail="Receipt not found")
    
    if confirm_req.confirmed:
        data = json.loads(pending.extracted_data)
        
        # Override with user-provided values if any
        amount = confirm_req.amount or data.get('amount', 0)
        description = confirm_req.description or data.get('description', data.get('merchant', 'Receipt'))
        category = confirm_req.category or data.get('category', 'uncategorized')
        
        # Create transaction
        txn = models.Transaction(
            user_id=current_user.user_id,
            amount=amount,
            description=description,
            category=category.lower(),
            source="receipt"
        )
        db.add(txn)
        
        pending.status = "confirmed"
        db.commit()
        db.refresh(txn)
        
        gamification.check_and_award_achievement(db, current_user, "receipt_scanner")
        
        return {"status": "success", "transaction_id": txn.transaction_id}
    else:
        pending.status = "rejected"
        db.commit()
        return {"status": "success", "message": "Receipt rejected"}


# --- LEADERBOARD & SOCIAL ENDPOINTS ---

@app.get("/leaderboard/savings-rate")
def get_savings_leaderboard(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get top savers (simulated - in production would anonymize)"""
    # Get all users with stats
    all_stats = db.query(models.UserStats).filter(
        models.UserStats.total_xp > 0
    ).order_by(models.UserStats.longest_streak.desc(), models.UserStats.total_xp.desc()).limit(limit).all()
    
    leaderboard = []
    for stat in all_stats:
        user = db.query(models.User).filter(models.User.user_id == stat.user_id).first()
        leaderboard.append({
            "rank": len(leaderboard) + 1,
            "name": user.full_name if user else "Anonymous",
            "streak": stat.longest_streak,
            "xp": stat.total_xp
        })
    
    return {"leaderboard": leaderboard}


# --- ANALYTICS ENHANCEMENTS ---

@app.get("/analytics/enhanced")
def get_enhanced_analytics(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get enhanced analytics with trends and insights"""
    from datetime import timedelta
    
    start_date = datetime.utcnow() - timedelta(days=days)
    transactions = db.query(models.Transaction).filter(
        models.Transaction.user_id == current_user.user_id,
        models.Transaction.date >= start_date
    ).all()
    
    summary = utils.generate_spending_summary(transactions)
    health_score = utils.calculate_health_score(
        summary["total"],
        current_user.profile.monthly_income if current_user.profile else None
    )
    
    # Calculate daily average
    if transactions:
        daily_avg = summary["total"] / len(set(t.date.date() if t.date else None for t in transactions if t.date))
    else:
        daily_avg = 0
    
    return {
        "summary": summary,
        "health_score": health_score,
        "daily_average": round(daily_avg, 2),
        "period_days": days
    }

@app.get("/analytics/trends")
def get_spending_trends(
    category: str = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get spending trends over time"""
    from datetime import timedelta
    from collections import defaultdict
    
    ninety_days_ago = datetime.utcnow() - timedelta(days=90)
    query = db.query(models.Transaction).filter(
        models.Transaction.user_id == current_user.user_id,
        models.Transaction.date >= ninety_days_ago
    )
    
    if category:
        query = query.filter(models.Transaction.category == category)
    
    transactions = query.all()
    
    # Group by week
    weekly_data = defaultdict(float)
    for t in transactions:
        if t.date:
            week_key = t.date.strftime('%Y-W%U')
            weekly_data[week_key] += t.amount
    
    trends = [
        {"week": week, "amount": round(amount, 2)}
        for week, amount in sorted(weekly_data.items())
    ]
    
    return {"trends": trends[:13]}  # 13 weeks ~3 months


