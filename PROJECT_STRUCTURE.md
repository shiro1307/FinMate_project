# FinMate — Project Structure

This document gives a quick overview of how the repo is organized and where to look when you want to change something.

## Repository layout

```text
FinMate_project/
  backend/                     # FastAPI backend (Python)
  frontend/                    # React + TypeScript (Vite)
  finmate.db                   # Local SQLite DB (root copy)
  test.db                      # Local SQLite DB used for tests/dev
  GETTING_STARTED.md           # Setup + run instructions
  RESTART_INSTRUCTIONS.md      # Troubleshooting / restart steps
  restart_backend.bat          # Convenience script to restart backend on Windows
  test_*.html                  # Local debug pages (CORS/goal tests, etc.)
  test_transactions.csv        # Sample CSV for import testing
```

## Backend (`backend/`)

**Purpose:** API + business logic + persistence.

**Key files**

- **`main.py`**: FastAPI app entrypoint (routes, middleware, startup wiring).
- **`models.py`**: Database models (SQLAlchemy).
- **`schemas.py`**: Request/response schemas (Pydantic).
- **`database.py`**: DB engine/session setup.
- **`auth.py`**: Authentication (JWT/password hashing and helpers).
- **`utils.py`**: Shared backend helpers/validation/formatting utilities.
- **`ai_insights.py`**: AI/insights-related functionality.
- **`email_service.py`**: Email notification support.
- **`gamification.py`**: XP/streaks/achievements/notifications logic.
- **`requirements.txt`**: Python dependencies.

**Notes**

- **`backend/.env`** contains local secrets/config. Use **`backend/.env.example`** as the template (don’t commit secrets).
- **`backend/venv/`** is the local virtual environment (machine-specific; typically not committed).

## Frontend (`frontend/`)

**Purpose:** Web UI that talks to the backend API.

**Key folders/files**

- **`src/`**: Application source code
  - **`App.tsx`**: Main app shell/router-ish composition.
  - **`main.tsx`**: React app bootstrap.
  - **`AuthContext.tsx`**: Auth state + token handling.
  - **`apiConfig.ts`**: Backend base URL / API configuration.
  - **`components/`**: UI components grouped by feature
    - **Top-level pages/components**: `Dashboard.tsx`, `ChatInterface.tsx`, `BudgetGoals.tsx`, `Insights.tsx`, `Gamification.tsx`, `DataImport.tsx`, etc.
    - **Feature folders**: `onboarding/`, `dashboard/`, `insights/`, `visualizations/`, `common/`, etc.
  - **`styles/`**: Shared styles/theme assets.
- **`public/`**: Static assets served as-is
  - **`public/tutorial/`**: Tutorial images used by onboarding (`1.png`–`4.png`).
- **`package.json`**: JS dependencies + scripts.
- **`vite.config.ts`**: Vite dev/build configuration.
- **`dist/`**: Production build output (generated).

## Common workflows (where to change what)

- **Add/modify an API endpoint**: `backend/main.py` (and update `schemas.py` / `models.py` as needed).
- **Change DB schema/models**: `backend/models.py` (and any migration/util scripts like `migrate_currency.py`).
- **Frontend API URL/config**: `frontend/src/apiConfig.ts`.
- **Add a new UI screen**: `frontend/src/components/` (and wire it from `App.tsx` / `Dashboard.tsx` depending on navigation).
- **Onboarding/tutorial UI**: `frontend/src/components/onboarding/` and images in `frontend/public/tutorial/`.

## Related docs

- **Setup & running**: `GETTING_STARTED.md`
- **Restart / quick fixes**: `RESTART_INSTRUCTIONS.md`

