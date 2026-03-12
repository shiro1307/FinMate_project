# FinMate: Your AI-Powered Financial Companion 🚀

A hackathon-winning fintech application that combines AI-powered insights, gamification, and cutting-edge financial tracking to revolutionize how users manage their money.

## 🌟 Key Features

### 💰 Core Financial Tracking

- **Manual Transaction Entry**: Add spending with auto-categorization
- **CSV Import**: Bulk import transactions from bank exports with flexible column mapping
- **Receipt Scanning**: AI-powered receipt recognition using Google Gemini vision
- **Health Score**: Real-time financial health calculation with personalized insights

### 🤖 AI Intelligence

- **Conversational AI**: Chat with FinMate in normal or "roast mode" for financial advice
- **Spending Anomaly Detection**: AI identifies unusual expenses and patterns
- **Budget Optimization**: Personalized suggestions based on your spending habits
- **Weekly Digest**: Automated AI-generated financial summaries
- **Smart Email Templates**: AI drafts subscription cancellations and bill negotiations

### 🏆 Gamification (WOW Factor!)

- **XP System**: Earn points for healthy financial habits
- **Streaks**: Track consecutive days under budget with visual indicators
- **Achievements**: Unlock badges for milestones (First Transaction, Week Warrior, Budget Crusher, etc.)
- **Leaderboard**: Anonymous comparison with other users' savings rates
- **Notifications**: Real-time alerts for achievements and budget alerts

### 🎯 Advanced Features

- **Budget Goals**: Create and track savings, debt repayment, and investment goals
- **Spending Trends**: Visualize 13-week spending patterns by category
- **Enhanced Analytics**: Detailed breakdowns with daily averages and health metrics
- **Receipt Confirmation**: Preview AI-extracted data before creating transactions
- **Error Handling**: Graceful error handling with user-friendly messages
- **Rate Limiting**: Protected API endpoints to prevent abuse

## 🛠️ Tech Stack

### Backend

- **Framework**: FastAPI (Python)
- **Database**: SQLAlchemy ORM with SQLite/PostgreSQL support
- **AI**: Google Gemini 2.5 Flash for vision and language
- **Authentication**: JWT with bcrypt password hashing
- **Email**: SMTP with async support
- **Rate Limiting**: slowapi for API protection

### Frontend

- **Framework**: React 19 with TypeScript
- **Build**: Vite with hot module reload
- **UI/UX**: Tailwind CSS + framer-motion
- **Charts**: Recharts for data visualization
- **HTTP**: Axios with automatic token management
- **Testing**: Vitest + React Testing Library

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Google Gemini API key (free tier available)
- (Optional) SMTP credentials for email notifications

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Copy environment file and update with your keys
cp .env.example .env
# Edit .env and add:
# - GEMINI_API_KEY from https://makersuite.google.com/app/apikey
# - SMTP credentials (Gmail app-specific password)
# - SECRET_KEY (generate with: python -c "import secrets; print(secrets.token_urlsafe(32))")

# Install dependencies
pip install -r requirements.txt

# Run database migrations (creates tables)
python -c "from database import engine; from models import Base; Base.metadata.create_all(bind=engine)"

# Start server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**API Documentation**: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

**App URL**: `http://localhost:5173`

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest test_main.py -v          # Run all tests
pytest test_main.py::TestAuth -v # Run specific test class
```

**Coverage**: Tests cover authentication, transactions, budget goals, and error handling.

### Frontend Tests

```bash
cd frontend
npm run test              # Run all tests
npm run test:ui          # Run with interactive UI
```

## 📊 API Endpoints

### Authentication

- `POST /signup` - Register new user
- `POST /login` - Get JWT token
- `GET /me` - Get current user

### Transactions

- `POST /transactions` - Create transaction
- `GET /analytics` - Get spending overview
- `GET /analytics/enhanced` - Enhanced analytics with trends
- `GET /analytics/trends` - 13-week spending trends
- `POST /upload-csv` - Bulk import from CSV

### Receipts

- `POST /receipts/scan-and-confirm` - Scan and preview receipt
- `POST /receipts/{id}/confirm` - Confirm extracted data

### Budget Goals

- `POST /goals` - Create budget goal
- `GET /goals` - List goals
- `PUT /goals/{id}` - Update goal
- `DELETE /goals/{id}` - Delete goal

### Gamification

- `GET /stats` - Get user stats (XP, streaks, etc.)
- `GET /achievements` - List unlocked achievements
- `GET /notifications` - Get notifications
- `PUT /notifications/{id}/read` - Mark notification as read

### AI Insights

- `GET /insights/anomalies` - Get unusual spending analysis
- `GET /insights/weekly-digest` - Get AI summary
- `GET /insights/budget-optimization` - Get optimization suggestions

### Social

- `GET /leaderboard/savings-rate` - Top savers leaderboard

## 🎨 UI/UX Highlights

- **Glassmorphic Design**: Modern frosted-glass cards with gradients
- **Smooth Animations**: Framer Motion micro-interactions for delight
- **Dark Theme**: Eye-friendly color scheme optimized for finance apps
- **Responsive**: Mobile-first design, works beautifully on all screens
- **Loading States**: Skeleton screens and spinners for smooth UX
- **Toast Notifications**: Success/error feedback

## 🔐 Security Features

✅ Password Requirements:

- Minimum 8 characters
- At least one uppercase letter
- At least one digit

✅ Input Validation:

- Amount validation (positive, reasonable max)
- Email format validation
- Category regex validation
- Transaction description length limits

✅ API Security:

- JWT token authentication
- Rate limiting (100 req/min by default)
- CORS configured for localhost
- Password hashing with bcrypt
- SQL injection prevention via ORM

⚠️ Production Checklist:

- [ ] Change `SECRET_KEY` in .env
- [ ] Use PostgreSQL instead of SQLite
- [ ] Set `allow_origins` to actual domain
- [ ] Configure email SMTP properly
- [ ] Enable HTTPS
- [ ] Set up error logging (Sentry)
- [ ] Add database backups
- [ ] Monitor API rate limiting

## 📈 Growth Potential

Future features for scaling:

- Plaid/Open Banking integration for real bank connections
- Mobile app (React Native)
- Machine learning for spending prediction
- Crypto transaction tracking
- Family account sharing
- AI savings goals automation
- Subscription management
- Investment portfolio tracking

## 🎓 Learning Opportunities

This project demonstrates:

- Full-stack development with FastAPI + React
- Database design and relationships
- AI/LLM integration (Gemini Vision & Language)
- JWT authentication flow
- Async/await patterns
- Responsive UI design
- Component-based architecture
- Unit & integration testing
- API design best practices

## 🐛 Troubleshooting

### API Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:8000
```

**Solution**: Ensure backend is running on port 8000

```bash
cd backend && uvicorn main:app --reload
```

### Gemini API Error

```
APIError: Expected 'api_key' to be a non-empty string
```

**Solution**: Add valid API key to `.env`

```bash
GEMINI_API_KEY=AIzaS...your_key...
```

### Database Locked

**Solution**: Delete `finmate.db` and restart

```bash
rm backend/finmate.db
```

### CORS Error

**Solution**: Ensure frontend URL matches `allow_origins` in main.py

## 📝 Development Workflow

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Make changes and test locally
3. Run tests: `pytest` (backend), `npm test` (frontend)
4. Commit with clear messages: `git commit -m "feat: description"`
5. Push and create pull request

## 📄 License

MIT License - Feel free to use for hackathons!

## 🙌 Credits

Built with ❤️ for the hackathon. Special thanks to Google Gemini for powering our AI features.

---

**Ready to win the hackathon?** 🏆

Deploy this, add your own twist, and impress the judges with:

- Flawless UI/UX
- Smart AI integration
- Addictive gamification
- Comprehensive testing
- Professional documentation

Good luck! 🚀
