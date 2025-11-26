# 🚀 GitHub Setup & Deployment Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `ai-document-platform` (or any name you prefer)
3. Description: "AI-powered document authoring platform with Word and PowerPoint generation"
4. Choose: **Public** (for portfolio) or **Private**
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

## Step 2: Push Your Code to GitHub

After creating the repository, GitHub will show you commands. Use these:

### If you see your repository URL like: `https://github.com/Pratibha-Priyadarshini/ai-document-platform`

Run these commands in PowerShell (in your project directory):

```powershell
# Add the remote (replace with YOUR actual URL)
git remote add origin https://github.com/Pratibha-Priyadarshini/ai-document-platform.git

# Verify remote was added
git remote -v

# Push to GitHub
git push -u origin main
```

### If you get an error about branch name:

```powershell
# Rename branch to main if needed
git branch -M main

# Then push
git push -u origin main
```

## Step 3: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files uploaded
3. Check that `.env` file is NOT uploaded (it should be in .gitignore)

## Step 4: Deploy on Render.com

### Backend Deployment

1. Go to https://render.com and sign up/login
2. Click "New +" → "Web Service"
3. Click "Connect GitHub" and authorize Render
4. Select your repository: `ai-document-platform`
5. Configure:
   - **Name:** `ai-doc-backend`
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type:** `Free`

6. Click "Advanced" and add Environment Variables:
   ```
   SECRET_KEY = your-secret-key-here
   GEMINI_API_KEY = your-gemini-api-key
   GROQ_API_KEY = your-groq-api-key
   GOOGLE_SEARCH_API_KEY = your-google-search-key
   GOOGLE_SEARCH_ENGINE_ID = your-search-engine-id
   DATABASE_URL = sqlite:///./app.db
   ```

7. Click "Create Web Service"
8. Wait for deployment (5-10 minutes)
9. Copy your backend URL: `https://ai-doc-backend.onrender.com`

### Frontend Deployment

1. In Render dashboard, click "New +" → "Static Site"
2. Select your repository: `ai-document-platform`
3. Configure:
   - **Name:** `ai-doc-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

4. Add Environment Variable:
   ```
   REACT_APP_API_URL = https://ai-doc-backend.onrender.com
   ```
   (Use your actual backend URL from step 8 above)

5. Click "Create Static Site"
6. Wait for deployment (5-10 minutes)
7. Your frontend URL: `https://ai-doc-frontend.onrender.com`

## Step 5: Update CORS in Backend

After frontend is deployed, you need to update CORS:

1. In your local project, open `backend/main.py`
2. Find the CORS middleware section
3. Update it:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://ai-doc-frontend.onrender.com"  # Add your frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

4. Commit and push:
```powershell
git add .
git commit -m "Update CORS for production"
git push
```

5. Render will automatically redeploy your backend

## Step 6: Test Your Deployment

1. Open your frontend URL: `https://ai-doc-frontend.onrender.com`
2. Register a new account
3. Create a Word document
4. Generate content
5. Export document
6. Test all features

## Troubleshooting

### Issue: "Failed to fetch" or CORS errors
**Solution:** Make sure you updated CORS in backend/main.py with your frontend URL

### Issue: Backend not starting
**Solution:** Check logs in Render dashboard → Your service → Logs tab

### Issue: Environment variables not working
**Solution:** Verify all environment variables are set correctly in Render dashboard

### Issue: Database not persisting
**Solution:** Render free tier resets database on restart. For production, use Render Disk or external database.

## Alternative: Deploy Frontend on Vercel

If you prefer Vercel for frontend:

1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure:
   - **Framework:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
4. Add environment variable:
   ```
   REACT_APP_API_URL = https://ai-doc-backend.onrender.com
   ```
5. Deploy

## Quick Reference

### Your URLs (after deployment):
- **Frontend:** https://ai-doc-frontend.onrender.com
- **Backend:** https://ai-doc-backend.onrender.com
- **GitHub:** https://github.com/Pratibha-Priyadarshini/ai-document-platform

### Useful Commands:
```powershell
# Check git status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push

# View remote URL
git remote -v
```

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy backend on Render
3. ✅ Deploy frontend on Render
4. ✅ Update CORS
5. ✅ Test deployment
6. 📹 Record demo video
7. 📧 Submit project

---

**Need Help?**
- Check Render logs for errors
- Verify environment variables
- Test locally first
- Review DEPLOYMENT_GUIDE.md for more details

Good luck! 🚀
