# FinMate Deployment Guide

Deploy FinMate for **free** to impress the judges!

## Option 1: Free Tier Deployment (Recommended)

### Backend: Render.com or Railway.app

#### Using Render.com (FREE)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend**

   ```bash
   # Push your code to GitHub
   git push origin main
   ```

   - Click "New +" → "Web Service"
   - Connect GitHub repo
   - Configure:
     - **Runtime**: Python 3.9
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 8000`
   - Set environment variables:
     ```
     DATABASE_URL = postgresql://...
     GEMINI_API_KEY = your_key
     SECRET_KEY = your_secret
     FRONTEND_URL = your_deployed_frontend_url
     ```

3. **Get your backend URL**
   - Example: `https://finmate-backend.onrender.com`

### Database: Supabase (PostgreSQL, FREE)

1. Go to [supabase.com](https://supabase.com)
2. Create new project (free tier)
3. Get connection string
4. Update `DATABASE_URL` in Render env vars

### Frontend: Vercel (FREE)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your frontend repo
4. Configure environment:
   ```
   VITE_API_URL = https://finmate-backend.onrender.com
   ```
5. Deploy!

**Total Cost**: FREE (within free tier limits)
**Time**: 15-20 minutes

---

## Option 2: Alternative Free Platforms

### Backend Alternatives

**Railway.app** (more generous free tier)

- Connect GitHub repo
- Auto-deploys on push
- Includes free PostgreSQL

**Heroku** (free tier deprecated, use paid)

**Replit** (simple deployment)

- Create new .repl from GitHub repo
- Run `uvicorn main:app --reload`

### Frontend Alternatives

**Netlify** (free with auto-deploy)

- Connect GitHub
- Build command: `npm run build`
- Publish directory: `dist`

**GitHub Pages** (free, static only)

- Limited for SPAs, use Vercel/Netlify instead

---

## 🚀 Pre-Deployment Checklist

### Backend

- [ ] All env variables in `.env`
- [ ] Database migrations run
- [ ] CORS configured for production domain
- [ ] API docs accessible at `/docs`
- [ ] Error handling for missing API keys
- [ ] Rate limiting enabled
- [ ] Tests passing

```bash
# Final validation
pytest test_main.py -v
curl -X GET http://localhost:8000/health
```

### Frontend

- [ ] Update API URL from localhost to production
- [ ] Remove console.log statements
- [ ] Build succeeds without errors
- [ ] Environment variables set

```bash
npm run build
npm run lint
npm run test
```

### General

- [ ] No hardcoded secrets
- [ ] Latest code pushed to main branch
- [ ] README updated with deployed URLs
- [ ] All features tested on production domain

---

## 📋 Environment Variables Setup

### Backend (.env on Render)

```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
GEMINI_API_KEY=AIzaSyA...
SECRET_KEY=generated_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=https://finmate-frontend.vercel.app
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=app_specific_password
SENDER_EMAIL=noreply@finmate.app
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_MINUTES=1
```

### Frontend (.env.local on Vercel)

```
VITE_API_URL=https://finmate-backend.onrender.com
```

---

## 🔐 Security in Production

1. **Download SSL Certificate**
   - Automatically handled by Render/Vercel

2. **Update CORS**

   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://your-frontend.vercel.app"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

3. **Use Strong Secrets**

   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

4. **Rate Limiting**
   - Already enabled: 100 req/min default

5. **Database Security**
   - Use Supabase with built-in security
   - Enable auth Row Level Security if needed
   - Backup enabled automatically

---

## 🧪 Testing Deployed App

### Check Backend Health

```bash
curl https://finmate-backend.onrender.com/health
# Should return: {"status":"ok"}
```

### Check API Docs

```
https://finmate-backend.onrender.com/docs
```

### Test Authentication

```bash
curl -X POST https://finmate-backend.onrender.com/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "full_name": "Test User"
  }'
```

### Test Frontend

- Visit `https://your-frontend.vercel.app`
- Sign up with test account
- Add transaction
- View dashboard
- Check all tabs work

---

## 📊 Monitoring & Debugging

### Render Logs

- Your app dashboard → Logs tab
- Real-time error monitoring
- Useful for debugging

### Vercel Logs

- Your project → Deployments
- View logs for builds & runtime errors

### Add Error Tracking (Optional)

**Sentry** (Free tier available)

```bash
# Install
pip install sentry-sdk

# Add to main.py
import sentry_sdk
sentry_sdk.init("your_sentry_dsn")
```

---

## 💰 Cost Estimation

| Service         | Free Tier                | Price/Month |
| --------------- | ------------------------ | ----------- |
| Render Backend  | Yes (0.5 CPU, 0.5GB RAM) | $7+         |
| Vercel Frontend | Yes                      | $20+        |
| Supabase DB     | Yes (500MB)              | $25+        |
| **Total**       | **FREE**                 | **$52+**    |

**For Hackathon**: Everything stays free! 🎉

---

## 🚨 Common Deployment Issues

### "ModuleNotFoundError"

**Fix**: Add `requirements.txt` to root, ensure all packages listed

### "Database Connection Error"

**Fix**: Check `DATABASE_URL` env var, ensure DB is created

### "CORS Error on Frontend"

**Fix**: Update `allow_origins` in main.py with your frontend URL

### "Gemini API Error"

**Fix**: Verify `GEMINI_API_KEY` is valid and set in env vars

### "Static Assets 404"

**Fix**: Ensure `npm run build` completes, `dist` folder exists

### "Timeout on Large Operations"

**Fix**: Break into smaller operations, add caching

---

## 🎉 You're Live!

Once deployed:

1. Share the URL with friends
2. Gather feedback
3. Fix bugs if any
4. Share your success on social media!

**Example Deployed URLs**:

- Frontend: `https://finmate-frontend.vercel.app`
- Backend: `https://finmate-backend.onrender.com`
- API Docs: `https://finmate-backend.onrender.com/docs`

**Total deployment time**: 20-30 minutes
**Total cost**: $0 (within free tiers)
**Hackathon wow factor**: 📈 HUGE

---

## Next Steps for Scaling

1. Upgrade to paid tiers if metrics exceed free limits
2. Add CI/CD pipeline (GitHub Actions)
3. Set up automated backups
4. Add monitoring with DataDog/New Relic
5. Optimize database queries
6. Add caching layer (Redis on Railway)
7. Scale frontend with CDN (Cloudflare for free)

Good luck with your deployment! 🚀
