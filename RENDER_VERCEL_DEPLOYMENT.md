# 🚀 Deploy Backend on Render + Frontend on Vercel

## Part 1: Deploy Backend on Render.com

### Step 1: Sign Up / Login to Render

1. Go to https://render.com
2. Click "Get Started" or "Sign In"
3. Sign up with GitHub (recommended) or email

### Step 2: Create New Web Service

1. Click "New +" button (top right)
2. Select "Web Service"
3. Click "Connect GitHub" if not already connected
4. Authorize Render to access your GitHub repositories

### Step 3: Select Your Repository

1. Find and select: `ai-document-platform`
2. Click "Connect"

### Step 4: Configure Backend Service

Fill in the following settings:

**Basic Settings:**
- **Name:** `ai-doc-backend` (or any name you prefer)
- **Region:** Choose closest to you (e.g., Oregon, Frankfurt, Singapore)
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Python 3`

**Build & Deploy:**
- **Build Command:** 
  ```
  pip install -r requirements.txt
  ```

- **Start Command:**
  ```
  uvicorn main:app --host 0.0.0.0 --port $PORT
  ```

**Instance Type:**
- Select: **Free** (for testing/demo)
- Or **Starter** ($7/month for better performance)

### Step 5: Add Environment Variables

Click "Advanced" → "Add Environment Variable"

Add these variables (use your actual values from `backend/.env`):

```
SECRET_KEY = your-actual-secret-key-here
GEMINI_API_KEY = your-actual-gemini-api-key
GROQ_API_KEY = your-actual-groq-api-key
GOOGLE_SEARCH_API_KEY = your-actual-google-search-key
GOOGLE_SEARCH_ENGINE_ID = your-actual-search-engine-id
DATABASE_URL = sqlite:///./app.db
```

**Important:** Use your REAL API keys, not the placeholder values!

### Step 6: Create Web Service

1. Review all settings
2. Click "Create Web Service"
3. Wait for deployment (5-10 minutes)
4. Watch the logs for any errors

### Step 7: Get Your Backend URL

Once deployed, you'll see:
- **Status:** "Live" (green)
- **URL:** Something like `https://ai-doc-backend.onrender.com`

**COPY THIS URL** - you'll need it for the frontend!

### Step 8: Test Backend

Open your backend URL in browser:
```
https://ai-doc-backend.onrender.com
```

You should see:
```json
{"message": "AI Document Authoring Platform API"}
```

---

## Part 2: Deploy Frontend on Vercel

### Step 1: Sign Up / Login to Vercel

1. Go to https://vercel.com
2. Click "Sign Up" or "Login"
3. Sign up with GitHub (recommended)

### Step 2: Import Project

1. Click "Add New..." → "Project"
2. Click "Import Git Repository"
3. Find and select: `ai-document-platform`
4. Click "Import"

### Step 3: Configure Project

**Framework Preset:**
- Vercel should auto-detect: "Create React App"
- If not, select it manually

**Root Directory:**
- Click "Edit" next to Root Directory
- Enter: `frontend`
- Click "Continue"

**Build Settings:**
- **Build Command:** `npm run build` (auto-filled)
- **Output Directory:** `build` (auto-filled)
- **Install Command:** `npm install` (auto-filled)

### Step 4: Add Environment Variable

Click "Environment Variables" section

Add this variable:
- **Name:** `REACT_APP_API_URL`
- **Value:** `https://ai-doc-backend.onrender.com` (your backend URL from Part 1, Step 7)
- **Environment:** All (Production, Preview, Development)

Click "Add"

### Step 5: Deploy

1. Click "Deploy"
2. Wait for deployment (3-5 minutes)
3. Watch the build logs

### Step 6: Get Your Frontend URL

Once deployed, you'll see:
- **Status:** "Ready"
- **URL:** Something like `https://ai-document-platform.vercel.app`

Click "Visit" to open your app!

---

## Part 3: Update CORS in Backend

Now that frontend is deployed, you need to allow it in backend CORS.

### Step 1: Update main.py Locally

Open `backend/main.py` and find the CORS middleware section (around line 30):

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://ai-document-platform.vercel.app"  # ADD YOUR VERCEL URL HERE
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Replace `https://ai-document-platform.vercel.app` with YOUR actual Vercel URL!

### Step 2: Commit and Push

```powershell
git add backend/main.py
git commit -m "Update CORS for Vercel frontend"
git push
```

### Step 3: Wait for Auto-Deploy

Render will automatically detect the push and redeploy your backend (2-3 minutes).

---

## Part 4: Test Your Deployment

### 1. Open Your Frontend

Go to your Vercel URL: `https://ai-document-platform.vercel.app`

### 2. Test Registration

1. Click "Register"
2. Enter email and password
3. Click "Register"
4. Should redirect to login

### 3. Test Login

1. Enter your credentials
2. Click "Login"
3. Should see Dashboard

### 4. Test Document Creation

1. Click "✨ Create New Document"
2. Select "Word Document"
3. Enter title and topic
4. Choose theme
5. Add sections
6. Click "Create Project"

### 5. Test Content Generation

1. Click "🚀 Generate All Content"
2. Wait for generation (30-60 seconds)
3. Content should appear

### 6. Test Export

1. Click "📥 Download DOCX"
2. File should download
3. Open in Microsoft Word

---

## 🎯 Quick Reference

### Your Deployment URLs:

**Backend (Render):**
```
https://ai-doc-backend.onrender.com
```

**Frontend (Vercel):**
```
https://ai-document-platform.vercel.app
```

**GitHub Repository:**
```
https://github.com/Pratibha-Priyadarshini/ai-document-platform
```

---

## 🔧 Troubleshooting

### Issue: "Failed to fetch" or Network Error

**Cause:** CORS not configured or wrong backend URL

**Solution:**
1. Check `backend/main.py` has correct Vercel URL in `allow_origins`
2. Verify `REACT_APP_API_URL` in Vercel matches your Render backend URL
3. Push changes to GitHub
4. Wait for Render to redeploy

### Issue: Backend shows "Application failed to respond"

**Cause:** Environment variables not set or wrong start command

**Solution:**
1. Go to Render dashboard → Your service → Environment
2. Verify all environment variables are set
3. Check Start Command is: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Check logs for errors

### Issue: Frontend shows blank page

**Cause:** Build failed or wrong environment variable

**Solution:**
1. Go to Vercel dashboard → Your project → Deployments
2. Click on latest deployment → View Function Logs
3. Check for build errors
4. Verify `REACT_APP_API_URL` is set correctly
5. Redeploy if needed

### Issue: "API key not found" errors

**Cause:** Environment variables not set in Render

**Solution:**
1. Go to Render dashboard → Your service → Environment
2. Add missing API keys
3. Service will auto-redeploy

### Issue: Database resets on Render restart

**Cause:** Render free tier doesn't persist files

**Solution:**
- For demo: This is okay, just recreate test data
- For production: Use Render Disk (paid) or external database

---

## 📊 Deployment Checklist

### Backend (Render):
- [x] Repository connected
- [x] Root directory set to `backend`
- [x] Build command: `pip install -r requirements.txt`
- [x] Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [x] All environment variables added
- [x] Service deployed successfully
- [x] Backend URL copied

### Frontend (Vercel):
- [x] Repository connected
- [x] Root directory set to `frontend`
- [x] Framework preset: Create React App
- [x] Environment variable `REACT_APP_API_URL` added
- [x] Project deployed successfully
- [x] Frontend URL copied

### Final Steps:
- [x] CORS updated in `backend/main.py`
- [x] Changes pushed to GitHub
- [x] Backend redeployed
- [x] Tested registration
- [x] Tested login
- [x] Tested document creation
- [x] Tested content generation
- [x] Tested export

---

## 🎬 Ready for Demo Video!

Your application is now live and ready to demo:

1. **Registration & Login** - Show user authentication
2. **Word Document** - Create and generate content
3. **PowerPoint** - Create and generate slides
4. **Refinement** - Use AI to refine content
5. **Feedback** - Like/dislike and comments
6. **Export** - Download documents
7. **Bonus Features** - Themes, preview, dark mode

---

## 🚀 Updating Your Deployment

### To update backend:
```powershell
# Make changes to backend code
git add .
git commit -m "Update backend"
git push
# Render auto-deploys in 2-3 minutes
```

### To update frontend:
```powershell
# Make changes to frontend code
git add .
git commit -m "Update frontend"
git push
# Vercel auto-deploys in 1-2 minutes
```

---

## 💡 Pro Tips

1. **Free Tier Limitations:**
   - Render: Spins down after 15 min of inactivity (first request takes 30-60 sec)
   - Vercel: Unlimited bandwidth for personal projects

2. **Custom Domain:**
   - Render: Add custom domain in Settings
   - Vercel: Add custom domain in Project Settings

3. **Monitoring:**
   - Render: Check logs in dashboard
   - Vercel: Check function logs in deployments

4. **Environment Variables:**
   - Never commit `.env` file
   - Always use environment variables in deployment platforms
   - Keep API keys secure

---

## ✅ Success!

Your AI Document Authoring Platform is now live! 🎉

**Share your links:**
- Frontend: https://ai-document-platform.vercel.app
- Backend API: https://ai-doc-backend.onrender.com
- GitHub: https://github.com/Pratibha-Priyadarshini/ai-document-platform

**Next:** Record your demo video and submit! 🎬
