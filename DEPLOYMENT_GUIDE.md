# 🚀 Deployment Guide - AI Document Authoring Platform

This guide covers multiple deployment options for your application.

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Local Deployment](#local-deployment)
3. [Cloud Deployment Options](#cloud-deployment-options)
4. [Render.com Deployment (Recommended)](#rendercom-deployment)
5. [Vercel + Railway Deployment](#vercel--railway-deployment)
6. [AWS Deployment](#aws-deployment)
7. [Docker Deployment](#docker-deployment)
8. [Environment Variables](#environment-variables)
9. [Post-Deployment Testing](#post-deployment-testing)

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All API keys are obtained and working
- [ ] `.env` file is configured correctly
- [ ] Application runs locally without errors
- [ ] Database migrations are complete
- [ ] All dependencies are listed in requirements.txt and package.json
- [ ] `.gitignore` is properly configured
- [ ] Sensitive data is not committed to Git

---

## 🏠 Local Deployment

### Quick Start

```bash
# Terminal 1 - Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

Access at: `http://localhost:3000`

---

## ☁️ Cloud Deployment Options

### Option 1: Render.com (Recommended - Free Tier Available)

**Best for:** Full-stack deployment with database

#### Step 1: Prepare Your Repository

1. Push your code to GitHub/GitLab
2. Ensure `.gitignore` excludes:
   ```
   .env
   venv/
   __pycache__/
   node_modules/
   app.db
   ```

#### Step 2: Deploy Backend on Render

1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** `ai-doc-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type:** Free

5. Add Environment Variables:
   ```
   SECRET_KEY=your-secret-key
   GEMINI_API_KEY=your-gemini-key
   GROQ_API_KEY=your-groq-key
   GOOGLE_SEARCH_API_KEY=your-google-key
   GOOGLE_SEARCH_ENGINE_ID=your-search-id
   DATABASE_URL=sqlite:///./app.db
   ```

6. Click "Create Web Service"
7. Note your backend URL: `https://ai-doc-backend.onrender.com`

#### Step 3: Deploy Frontend on Render

1. Click "New +" → "Static Site"
2. Connect your repository
3. Configure:
   - **Name:** `ai-doc-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

4. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://ai-doc-backend.onrender.com
   ```

5. Update `frontend/src/services/api.js`:
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
   ```

6. Click "Create Static Site"

#### Step 4: Update CORS

Update `backend/main.py`:
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

---

### Option 2: Vercel + Railway

**Best for:** Separate frontend and backend hosting

#### Deploy Backend on Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - **Root Directory:** `backend`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

5. Add environment variables (same as Render)
6. Deploy and note your URL

#### Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

5. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://your-railway-backend.up.railway.app
   ```

6. Deploy

---

### Option 3: AWS Deployment

#### Backend on AWS Elastic Beanstalk

1. Install AWS CLI and EB CLI
2. Initialize:
   ```bash
   cd backend
   eb init -p python-3.10 ai-doc-backend
   ```

3. Create environment:
   ```bash
   eb create ai-doc-env
   ```

4. Set environment variables:
   ```bash
   eb setenv SECRET_KEY=xxx GEMINI_API_KEY=xxx ...
   ```

5. Deploy:
   ```bash
   eb deploy
   ```

#### Frontend on AWS S3 + CloudFront

1. Build frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Create S3 bucket and enable static hosting
3. Upload build folder to S3
4. Create CloudFront distribution
5. Update DNS

---

## 🐳 Docker Deployment

### Create Dockerfiles

#### Backend Dockerfile

Create `backend/Dockerfile`:
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Frontend Dockerfile

Create `frontend/Dockerfile`:
```dockerfile
FROM node:16-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

Create `docker-compose.yml` in root:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - SECRET_KEY=${SECRET_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - GROQ_API_KEY=${GROQ_API_KEY}
      - GOOGLE_SEARCH_API_KEY=${GOOGLE_SEARCH_API_KEY}
      - GOOGLE_SEARCH_ENGINE_ID=${GOOGLE_SEARCH_ENGINE_ID}
    volumes:
      - ./backend:/app
      - backend-data:/app/data

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://localhost:8000

volumes:
  backend-data:
```

### Run with Docker

```bash
# Build and start
docker-compose up --build

# Stop
docker-compose down
```

---

## 🔐 Environment Variables

### Production Environment Variables

Create `.env.production` files:

**Backend (.env.production):**
```env
SECRET_KEY=<strong-random-key>
GEMINI_API_KEY=<your-key>
GROQ_API_KEY=<your-key>
GOOGLE_SEARCH_API_KEY=<your-key>
GOOGLE_SEARCH_ENGINE_ID=<your-id>
DATABASE_URL=sqlite:///./app.db
```

**Frontend (.env.production):**
```env
REACT_APP_API_URL=https://your-backend-url.com
```

### Generating Secure SECRET_KEY

```python
import secrets
print(secrets.token_urlsafe(32))
```

---

## 🧪 Post-Deployment Testing

### 1. Health Check

```bash
# Backend health
curl https://your-backend-url.com/

# Should return: {"message": "AI Document Authoring Platform API"}
```

### 2. Test Authentication

```bash
# Register
curl -X POST https://your-backend-url.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Login
curl -X POST https://your-backend-url.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### 3. Test Frontend

1. Open your frontend URL
2. Register a new account
3. Create a project
4. Generate content
5. Export document

### 4. Monitor Logs

**Render:**
- Go to your service → Logs tab

**Railway:**
- Go to your project → Deployments → View Logs

**Vercel:**
- Go to your project → Deployments → View Function Logs

---

## 🔧 Troubleshooting

### Common Issues

**Issue:** CORS errors
```python
# Solution: Update CORS origins in backend/main.py
allow_origins=["https://your-frontend-url.com"]
```

**Issue:** Database not persisting
```bash
# Solution: Use persistent volume or external database
# For Render: Use Render Disk
# For Railway: Use Railway Volume
```

**Issue:** API keys not working
```bash
# Solution: Verify environment variables are set correctly
# Check logs for "API key not found" errors
```

**Issue:** Build fails
```bash
# Solution: Check build logs
# Ensure all dependencies are in requirements.txt/package.json
```

---

## 📊 Deployment Comparison

| Platform | Backend | Frontend | Database | Cost | Difficulty |
|----------|---------|----------|----------|------|------------|
| **Render** | ✅ | ✅ | ✅ | Free tier | Easy |
| **Vercel + Railway** | ✅ | ✅ | ✅ | Free tier | Medium |
| **AWS** | ✅ | ✅ | ✅ | Pay-as-go | Hard |
| **Docker** | ✅ | ✅ | ✅ | Self-hosted | Medium |

---

## 🎯 Recommended Deployment

For this project, I recommend **Render.com** because:

1. ✅ Free tier available
2. ✅ Easy setup (no credit card required)
3. ✅ Automatic HTTPS
4. ✅ Built-in database support
5. ✅ Auto-deploy from Git
6. ✅ Good for demos and portfolios

---

## 📝 Final Checklist

Before going live:

- [ ] Test all features in production
- [ ] Verify API keys work
- [ ] Check CORS configuration
- [ ] Test document export
- [ ] Monitor error logs
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS
- [ ] Add monitoring/analytics
- [ ] Create backup strategy
- [ ] Document deployment process

---

## 🚀 Quick Deploy Commands

### Render (via CLI)

```bash
# Install Render CLI
npm install -g @render/cli

# Login
render login

# Deploy
render deploy
```

### Vercel (via CLI)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel
```

---

## 📞 Support

If you encounter issues:

1. Check the logs
2. Verify environment variables
3. Test locally first
4. Check platform status pages
5. Review documentation

---

**Your application is now ready for deployment! 🎉**

Choose your preferred platform and follow the steps above. Good luck!
