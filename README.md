# FinMate - AI-Powered Financial Companion

Your intelligent personal finance manager powered by Google Gemini AI.

## 🎯 Overview

FinMate is a full-stack web application that transforms how users manage their personal finances. Combining intelligent transaction tracking, AI-powered financial insights, and gamified engagement, FinMate empowers users to make smarter financial decisions and achieve their money goals.

**Core Features:**

- **Smart Transaction Tracking** - Track spending through multiple sources: manual entry, bulk CSV import, or receipt scanning with OCR. Automatic category suggestions learn from your patterns.

- **AI-Powered Insights** - Powered by Google Gemini, the system detects unusual spending patterns, generates weekly spending digests via email, provides budget optimization recommendations, and analyzes 13-week spending trends with forecasts.

- **Smart Shopping Comparison** - Compare product prices across 7 Indian e-commerce platforms (Amazon, Flipkart, Blinkit, BigBasket, JioMart, Snapdeal, IndiaMART) with AI-powered debate analysis explaining the best value option. Includes pricing, trust scores, and delivery times.

- **Financial Health Score** - A composite metric combining savings rate, budget adherence, transaction frequency, and goal progress. Track your financial wellness in real-time.

- **AI Chat Advisor** - Get personalized financial guidance by chatting with an AI advisor trained on your transaction history and spending patterns.

- **Email Notifications** - Receive configurable alerts for budget overages, achievement unlocks, anomalies, and weekly spending digests.

- **Real-Time Analytics** - Interactive dashboards with 13-week spending trends, category breakdowns, monthly comparisons, and health score progression.

## 🏗️ Tech Stack

**Backend:** FastAPI + SQLAlchemy + Google Gemini API  
**Frontend:** React 19 + TypeScript + Tailwind CSS  
**Database:** SQLite (dev) / PostgreSQL (prod)  
**Deployment:** Docker-ready, supports Heroku/Railway/Render

## 📦 Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file and add:
# GEMINI_API_KEY=your_key_here
# DATABASE_URL=sqlite:///./finmate.db
# SMTP_SERVER, SMTP_USER, SMTP_PASSWORD (optional)

uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

API docs available at: http://localhost:8000/docs

## 📚 Key Features

| Feature         | Status | Details                                                   |
| --------------- | ------ | --------------------------------------------------------- |
| User Auth       | ✅     | JWT + bcrypt, email-based currency detection              |
| Transactions    | ✅     | Manual, CSV import, receipt scanning, auto-categorization |
| Budget Goals    | ✅     | Create savings/debt goals with progress tracking          |
| AI Insights     | ✅     | Anomaly detection, weekly emails, budget optimization     |
| Gamification    | ✅     | XP system, 10+ achievements, streaks, leaderboards        |
| Debate Purchase | ✅     | Price comparison (Amazon, Flipkart, Blinkit, etc.)        |
| Chat Advisor    | ✅     | AI-powered financial guidance                             |
| Health Score    | ✅     | Real-time financial health metric                         |

## 🛠️ Development

### Project Structure

```
FinMate/
├── backend/
│   ├── main.py              # FastAPI routes
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── ai_insights.py       # Gemini integration
│   ├── gamification.py      # XP & achievements
│   ├── debate.py            # Price comparison logic
│   ├── email_service.py     # Email notifications
│   └── providers/           # Web scrapers
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── AuthContext.tsx  # Auth state
│   │   └── App.tsx          # Main router
│   └── package.json
└── README.md
```

### Running Tests

```bash
# Backend
cd backend
pytest test_main.py -v

# Frontend
cd frontend
npm test
```

### Linting

```bash
# Python
cd backend
black . && flake8 .

# TypeScript
cd frontend
npm run lint
```

## 📡 API Endpoints (Key)

```
POST   /signup              # Create account
POST   /login               # Authenticate
POST   /transactions        # Add transaction
GET    /transactions        # List transactions
POST   /import-csv          # Bulk import
POST   /goals               # Create goal
GET    /analytics/enhanced  # Health score + trends
GET    /insights/anomalies  # Spending anomalies
GET    /stats               # XP & achievements
POST   /debate/run          # Price comparison
POST   /chat                # Chat with AI
```

Full API docs: http://localhost:8000/docs

## 🚀 Deployment

### Docker

```bash
docker build -t finmate .
docker run -p 8000:8000 --env-file .env finmate
```

### Frontend Build

```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel, Netlify, or any static host
```

### Database Migration

Update `DATABASE_URL` to use PostgreSQL:

```
postgresql://user:password@localhost/finmate
```

## 🎨 Features Showcase

**Dashboard** - Real-time transaction list, budget progress, health score  
**Insights Page** - 13-week spending trends, category breakdown, anomalies  
**Debate Purchase** - Compare prices with AI recommendations and product images  
**Achievements** - Visual badges, XP counter, streak tracking, leaderboard  
**Chat Interface** - Ask financial questions, get personalized advice

## 🛑 Common Issues

**Backend won't start?**

- Verify venv is activated: `source venv/bin/activate`
- Check dependencies: `pip list`
- Install missing: `pip install -r requirements.txt`

**CORS errors?**

- Set `FRONTEND_URL` in `.env`
- Update allowed origins in `main.py`

**Auth failures?**

- Verify `GEMINI_API_KEY` is set
- Check password strength (8+ chars, uppercase, digit)

**Database issues?**

- Delete `test.db` and restart for fresh migration

## 📄 License

MIT License - See LICENSE file for details

---

**Version:** 1.0 | **Last Updated:** March 14, 2026  
**Status:** Production-Ready MVP
