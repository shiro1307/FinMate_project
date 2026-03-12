# FinMate Data Flow & Architecture

## How the App Works

### 1. **Real vs. Mock Data**

**Real Data (From Backend):**
- When you import transactions or add them manually, they're stored in the backend database
- The Dashboard fetches real data via the `/analytics` API endpoint
- Shows actual spending patterns, categories, and trends

**Mock/Sample Data (For UI Demo):**
- Used in Analytics, Goals, and Insights sections to demonstrate features
- Clearly labeled with "📊 Note: These visualizations use sample data"
- Helps you understand what the app will show once you have real transactions

### 2. **Transaction Tracking Flow**

```
User Action → Backend Processing → Database Storage → Dashboard Display
```

**Step 1: Data Entry**
- Manual Transaction Form: Add transactions directly
- Data Import: Upload CSV/bank statements
- Receipt Scanning: Snap photos (AI extracts details)

**Step 2: Backend Processing**
- Validates transaction data
- Categorizes spending (Food, Transport, etc.)
- Calculates analytics (totals, averages, trends)

**Step 3: Database Storage**
- Transactions stored in SQLite/PostgreSQL
- Associated with user account
- Persists across sessions

**Step 4: Dashboard Display**
- Overview: Shows total spending, recent transactions
- Analytics: Visualizes spending patterns
- Insights: AI-powered recommendations

### 3. **Data Status Indicator**

The blue info box at the top of Overview shows:
- ✅ "Real data from your transactions" - You have imported/added transactions
- ⚠️ "No transactions yet" - Import data or add transactions manually

### 4. **Why You See Different Data in Different Places**

**Overview Section:**
- Shows REAL data from your backend
- Total spending, recent transactions, pie chart
- Updates when you import or add transactions

**Analytics Section:**
- Shows SAMPLE data (bar chart race, heatmap, comparison)
- Labeled as "sample data" to avoid confusion
- Demonstrates what analytics will look like with real data

**Goals & Insights Sections:**
- Mix of real (if you've set goals) and sample data
- Challenges and recommendations are examples
- Will populate with real data as you use the app

### 5. **The Heatmap Calendar Explained**

**What it shows:**
- GitHub-style spending intensity for the last 365 days
- Green squares = days with spending
- Darker green = higher spending that day
- Empty squares = no spending

**Why it's sample data:**
- You just created your account
- No historical transaction data yet
- Once you import transactions, it will show your real spending patterns

**How to populate it:**
1. Go to Overview → Data Import
2. Upload your bank statement or transaction history
3. The heatmap will update with your real data

### 6. **Understanding the Dashboard Layout**

**Overview (Default View):**
- Hero Metric: Your total spending this month
- Health Score: Financial wellness rating
- Quick Stats: Average daily spending, budget usage
- Pie Chart: Spending by category
- Recent Transactions: Last 4 transactions
- Data Import: Upload your transaction history

**Analytics:**
- Bar Chart Race: Category spending over time (sample)
- Comparison View: You vs. average user (sample)
- Heatmap Calendar: Spending intensity (sample until you import data)

**Goals:**
- Active Challenges: Compete with others
- Budget Goals: Set and track savings targets
- Achievements: Unlock badges and milestones

**Insights:**
- Predictions: AI forecasts overspending
- Recommendations: Smart money-saving tips
- Receipt Gallery: Scanned receipts
- Detailed Analysis: Full spending breakdown

### 7. **Why Some Cards Are Empty**

**Reason 1: No Data Imported Yet**
- Solution: Go to Overview → Data Import → Upload CSV

**Reason 2: Feature Requires Backend Connection**
- Some features need the backend API running
- Check that `http://127.0.0.1:8000` is accessible
- Backend should have `/analytics` endpoint

**Reason 3: Feature Is Sample/Demo**
- Clearly labeled with 📊 icon
- Shows what the feature will look like with real data
- Not meant to be functional until you add real transactions

### 8. **Data Privacy & Security**

- All data is stored locally in your backend database
- Encrypted transmission between frontend and backend
- No data shared with third parties
- You control what data you import

### 9. **Getting Started**

1. **Sign Up** → Create your account
2. **Import Data** → Upload your transaction history (CSV format)
3. **View Analytics** → See your spending patterns
4. **Set Goals** → Create savings targets
5. **Get Insights** → Receive AI recommendations

### 10. **Troubleshooting**

**Q: Why is my spending showing as $0?**
A: You haven't imported any transactions yet. Go to Overview → Data Import.

**Q: Why are the charts empty?**
A: Same reason - no transaction data. Import your bank statement.

**Q: Why do some sections show sample data?**
A: To demonstrate features before you have real data. Look for the 📊 label.

**Q: How do I know if data is real or sample?**
A: Check the info box at the top of each section. Real data shows your actual transactions. Sample data is labeled clearly.

---

**Summary:** The app works with REAL data once you import transactions. Until then, you see sample data to understand what features do. The blue info boxes tell you exactly what's real vs. sample.
