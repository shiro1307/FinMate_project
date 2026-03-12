"""
Utility functions and middleware
"""
from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    """Custom handler for rate limit exceeded"""
    return JSONResponse(
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        content={"detail": "Too many requests. Please try again later."}
    )

class ValidationError(HTTPException):
    """Custom validation error"""
    def __init__(self, message: str):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=message
        )

class BusinessLogicError(HTTPException):
    """Custom business logic error"""
    def __init__(self, message: str):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )

def log_action(action: str, user_id: int, details: str = "", status_code: int = 200):
    """Log user actions for debugging and auditing"""
    timestamp = datetime.utcnow().isoformat()
    logger.info(f"[{timestamp}] User {user_id}: {action} - {details} (Status: {status_code})")

def validate_amount(amount: float, max_amount: float = 999999.99) -> None:
    """Validate transaction amount"""
    if amount <= 0:
        raise ValidationError("Amount must be positive")
    if amount > max_amount:
        raise ValidationError(f"Amount cannot exceed ${max_amount}")
    if '.' in str(amount) and len(str(amount).split('.')[-1]) > 2:
        raise ValidationError("Amount can only have up to 2 decimal places")

def validate_category(category: str, allowed_categories: list = None) -> None:
    """Validate transaction category"""
    if not category:
        raise ValidationError("Category is required")
    if not isinstance(category, str) or len(category.strip()) == 0:
        raise ValidationError("Category must be a non-empty string")

def safe_json_load(json_string: str, default: dict = None) -> dict:
    """Safely load JSON with fallback"""
    import json
    try:
        return json.loads(json_string)
    except:
        return default or {}

def calculate_health_score(total_spent: float, monthly_income: float = None) -> dict:
    """
    Calculate financial health score
    Returns dict with score, label, and color
    """
    # Default scoring if no income
    if not monthly_income:
        if total_spent == 0:
            return {"score": 75, "label": "Good", "color": "#00d4aa"}
        if total_spent < 500:
            return {"score": 90, "label": "Excellent", "color": "#00d4aa"}
        if total_spent < 1500:
            return {"score": 72, "label": "Good", "color": "#4f8fe8"}
        if total_spent < 3000:
            return {"score": 55, "label": "Fair", "color": "#f59e0b"}
        if total_spent < 5000:
            return {"score": 38, "label": "Needs Work", "color": "#f97316"}
        return {"score": 20, "label": "Critical", "color": "#ff4d6d"}
    
    # Income-based scoring
    spending_ratio = total_spent / monthly_income
    
    if spending_ratio <= 0.2:
        return {"score": 95, "label": "Excellent", "color": "#00d4aa"}
    elif spending_ratio <= 0.4:
        return {"score": 85, "label": "Good", "color": "#4f8fe8"}
    elif spending_ratio <= 0.6:
        return {"score": 70, "label": "Fair", "color": "#f59e0b"}
    elif spending_ratio <= 0.8:
        return {"score": 50, "label": "Needs Work", "color": "#f97316"}
    else:
        return {"score": 30, "label": "Critical", "color": "#ff4d6d"}

def suggest_category(description: str) -> str:
    """
    Simple category suggestion based on keywords
    Can be enhanced with ML later
    """
    description_lower = description.lower()
    
    keywords = {
        "food": ["grocery", "restaurant", "cafe", "coffee", "pizza", "burger", "pizza", "food", "restaurant", "lunch", "dinner", "breakfast", "market", "store"],
        "transportation": ["gas", "fuel", "parking", "uber", "lyft", "taxi", "bus", "train", "metro", "car", "vehicle", "tolls", "transit"],
        "entertainment": ["movie", "cinema", "concert", "game", "spotify", "netflix", "gaming", "show", "entertainment", "ticket"],
        "utilities": ["electricity", "water", "internet", "phone", "utility", "bill", "wifi"],
        "healthcare": ["pharmacy", "doctor", "hospital", "medicine", "health", "dental", "gym", "medical"],
        "shopping": ["amazon", "clothing", "clothes", "apparel", "mall", "store", "shop", "purchase"],
        "other": []
    }
    
    for category, words in keywords.items():
        if any(word in description_lower for word in words):
            return category
    
    return "other"

def generate_spending_summary(transactions: list) -> dict:
    """Generate summary statistics from transactions"""
    if not transactions:
        return {
            "total": 0,
            "count": 0,
            "average": 0,
            "by_category": {},
            "highest_transaction": None
        }
    
    from collections import defaultdict
    total = sum(t.amount for t in transactions)
    by_category = defaultdict(float)
    
    for t in transactions:
        by_category[t.category] += t.amount
    
    highest = max(transactions, key=lambda x: x.amount)
    
    return {
        "total": round(total, 2),
        "count": len(transactions),
        "average": round(total / len(transactions), 2),
        "by_category": {cat: round(amount, 2) for cat, amount in by_category.items()},
        "highest_transaction": {
            "amount": highest.amount,
            "category": highest.category,
            "description": highest.description,
            "date": highest.date.isoformat() if highest.date else None
        }
    }
