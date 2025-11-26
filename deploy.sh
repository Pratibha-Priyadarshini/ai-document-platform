#!/bin/bash

# AI Document Authoring Platform - Deployment Script

echo "🚀 Starting deployment process..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: AI Document Authoring Platform"
fi

# Check for uncommitted changes
if [[ `git status --porcelain` ]]; then
    echo "📝 Committing changes..."
    git add .
    git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"
fi

echo "✅ Repository is ready for deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Push to GitHub:"
echo "   git remote add origin <your-repo-url>"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "2. Deploy on Render.com:"
echo "   - Go to https://render.com"
echo "   - Create new Web Service for backend"
echo "   - Create new Static Site for frontend"
echo "   - Add environment variables"
echo ""
echo "3. Or use Vercel + Railway:"
echo "   - Deploy backend on Railway"
echo "   - Deploy frontend on Vercel"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
