# 🚀 AI-Assisted Document Authoring Platform

An intelligent, full-stack web application that leverages AI to help users create, refine, and export professional Microsoft Word documents and PowerPoint presentations.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Core Features
- 🔐 **User Authentication** - Secure JWT-based registration and login
- 📊 **Project Management** - Create, view, and delete document projects
- 📝 **Document Configuration** - Define structure for Word docs and PowerPoint slides
- 🤖 **AI Content Generation** - Powered by Google Gemini and Groq APIs
- ✏️ **Interactive Refinement** - Edit content with AI assistance
- 💾 **Document Export** - Download as .docx or .pptx files
- 📈 **Feedback System** - Like/dislike and comment on generated content
- 📜 **Refinement History** - Track all changes with before/after comparison

### Advanced Features
- 🎨 **Theme System** - 20+ built-in themes + custom theme upload
- 👁️ **Live Preview** - See documents before exporting
- 🌓 **Dark Mode** - Complete dark theme support
- 🖼️ **Image Integration** - Automatic image search and insertion
- 🎯 **Drag & Drop** - Reorder sections intuitively
- 📱 **Responsive Design** - Works on all devices
- 🔔 **Toast Notifications** - Modern feedback UI

---

## 🛠️ Tech Stack

### Backend
- **Framework:** FastAPI (Python 3.10+)
- **Database:** SQLite with SQLAlchemy ORM
- **Authentication:** JWT tokens
- **AI APIs:** Google Gemini API, Groq API
- **Document Generation:** python-docx, python-pptx
- **Image Search:** Google Custom Search API

### Frontend
- **Framework:** React 18
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Styling:** CSS3 with custom themes

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.10 or higher**
- **Node.js 16 or higher**
- **npm or yarn**
- **Git**

### API Keys Required

You'll need to obtain the following API keys:

1. **Google Gemini API Key**
   - Visit: https://makersuite.google.com/app/apikey
   - Create a new API key

2. **Groq API Key**
   - Visit: https://console.groq.com/
   - Sign up and get your API key

3. **Google Custom Search API** (for images)
   - Visit: https://developers.google.com/custom-search/v1/overview
   - Create a project and enable Custom Search API
   - Get API key and Search Engine ID

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-document-platform
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

---

## 🔑 Environment Variables

### Backend (.env file)

Create a `.env` file in the `backend` directory:

```env
# Security
SECRET_KEY=your-secret-key-change-this-in-production

# AI APIs
GEMINI_API_KEY=your-gemini-api-key-here
GROQ_API_KEY=your-groq-api-key-here

# Google Custom Search (for images)
GOOGLE_SEARCH_API_KEY=your-google-search-api-key
GOOGLE_SEARCH_ENGINE_ID=your-search-engine-id

# Database
DATABASE_URL=sqlite:///./app.db
```

### Environment Variable Descriptions

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `SECRET_KEY` | JWT token encryption key | Yes | `your-secret-key-123` |
| `GEMINI_API_KEY` | Google Gemini API key | Yes | `AIzaSy...` |
| `GROQ_API_KEY` | Groq API key | Yes | `gsk_...` |
| `GOOGLE_SEARCH_API_KEY` | Google Custom Search API key | Yes | `AIzaSy...` |
| `GOOGLE_SEARCH_ENGINE_ID` | Custom Search Engine ID | Yes | `e12544f...` |
| `DATABASE_URL` | Database connection string | No | `sqlite:///./app.db` |

---

## ▶️ Running the Application

### Start Backend Server

```bash
# From backend directory
cd backend

# Activate virtual environment (if not already activated)
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

### Start Frontend Development Server

```bash
# From frontend directory (in a new terminal)
cd frontend

# Start the development server
npm start
```

Frontend will be available at: `http://localhost:3000`

---

## 📖 Usage Guide

### 1. User Registration & Login

1. Navigate to `http://localhost:3000`
2. Click "Register" to create a new account
3. Enter email and password
4. Login with your credentials

### 2. Creating a Word Document

1. Click "✨ Create New Document"
2. Select "Word Document"
3. Enter document title and main topic
4. Choose a theme and text style
5. Define sections:
   - Add/remove sections
   - Drag to reorder
   - Add optional descriptions
   - Or use "✨ AI-Suggest Outline"
6. Click "Create Project"
7. Click "🚀 Generate All Content"
8. Review and refine content
9. Click "📥 Download DOCX"

### 3. Creating a PowerPoint Presentation

1. Click "✨ Create New Document"
2. Select "PowerPoint Presentation"
3. Enter presentation title and main topic
4. Choose a theme and text style
5. Define slides:
   - Specify number of slides
   - Add titles for each slide
   - Add optional descriptions
   - Or use "✨ AI-Suggest Outline"
6. Click "Create Project"
7. Click "🚀 Generate All Content"
8. Review and refine content
9. Click "📥 Download PPTX"

### 4. Refining Content

For each section/slide, you can:

- **AI Refinement:** Enter a prompt like "Make this more formal" or "Add bullet points"
- **Feedback:** Click 👍 Like or 👎 Dislike
- **Comments:** Click 💬 Comment to add notes

All refinements are saved and can be viewed in the "Document Activity" panel.

### 5. Viewing Document Preview

- Click "👁️ Show Preview" to see how your document will look
- Preview shows actual layout with images and styling
- Works for both Word and PowerPoint

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Project Endpoints

#### Get All Projects
```http
GET /projects
Authorization: Bearer <token>
```

#### Create Project
```http
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Market Analysis",
  "document_type": "docx",
  "main_topic": "Electric Vehicle Industry",
  "sections": [
    {"title": "Introduction", "description": "Overview", "order": 0},
    {"title": "Analysis", "description": "Market data", "order": 1}
  ],
  "metadata": {
    "theme": {"id": "office", "preview": {...}},
    "textStyle": {"fontFamily": "arial", "fontSize": 12, ...}
  }
}
```

#### Get Project by ID
```http
GET /projects/{project_id}
Authorization: Bearer <token>
```

#### Delete Project
```http
DELETE /projects/{project_id}
Authorization: Bearer <token>
```

### Content Generation Endpoints

#### Generate All Content
```http
POST /projects/{project_id}/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "section_id": null
}
```

#### Refine Content
```http
POST /projects/{project_id}/refine
Authorization: Bearer <token>
Content-Type: application/json

{
  "section_id": 1,
  "prompt": "Make this more formal"
}
```

#### Submit Feedback
```http
POST /projects/{project_id}/feedback
Authorization: Bearer <token>
Content-Type: application/json

{
  "section_id": 1,
  "feedback_type": "like",
  "comment": "Great content!"
}
```

### Export Endpoint

#### Export Document
```http
GET /projects/{project_id}/export
Authorization: Bearer <token>
```

Returns: Binary file (.docx or .pptx)

### AI Template Endpoint

#### Generate Template
```http
POST /ai/generate-template
Authorization: Bearer <token>
Content-Type: application/json

{
  "document_type": "docx",
  "main_topic": "AI in Healthcare",
  "num_sections": 5
}
```

### Theme Endpoints

#### Get Themes
```http
GET /themes?document_type=docx
Authorization: Bearer <token>
```

#### Upload Custom Theme
```http
POST /themes/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <template.docx>
theme_name: "My Custom Theme"
document_type: "docx"
```

---

## 📁 Project Structure

```
ai-document-platform/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── auth.py                 # Authentication logic
│   ├── models.py               # Database models
│   ├── schemas.py              # Pydantic schemas
│   ├── database.py             # Database configuration
│   ├── gemini_service.py       # AI service (Gemini & Groq)
│   ├── document_service_v2.py  # Document generation
│   ├── image_service.py        # Image search service
│   ├── theme_service.py        # Theme management
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment variables
│   └── app.db                  # SQLite database
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── CreateProject.js
│   │   │   ├── CreatePPT.js
│   │   │   ├── ProjectEditor.js
│   │   │   ├── ThemeSelector.js
│   │   │   ├── WordStyleSelector.js
│   │   │   ├── TextStyleSelector.js
│   │   │   ├── WordPreview.js
│   │   │   ├── PPTPreview.js
│   │   │   ├── FeedbackHistory.js
│   │   │   ├── Toast.js
│   │   │   └── CommentModal.js
│   │   ├── services/
│   │   │   └── api.js          # API service layer
│   │   ├── data/
│   │   │   ├── pptThemes.js
│   │   │   └── wordThemes.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── themes.css
│   ├── package.json
│   └── .env
├── README.md
└── IMPLEMENTATION_CHECKLIST.md
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError: No module named 'fastapi'`
```bash
# Solution: Install dependencies
pip install -r requirements.txt
```

**Problem:** `Error: Unable to generate content. Please check your API keys.`
```bash
# Solution: Verify API keys in .env file
# Make sure GEMINI_API_KEY and GROQ_API_KEY are set correctly
```

**Problem:** Database errors
```bash
# Solution: Delete and recreate database
rm app.db
# Restart the server - it will create a new database
```

### Frontend Issues

**Problem:** `Cannot connect to backend`
```bash
# Solution: Ensure backend is running on port 8000
# Check CORS settings in backend/main.py
```

**Problem:** `npm start` fails
```bash
# Solution: Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Common Issues

**Problem:** Images not appearing in documents
```bash
# Solution: Verify Google Custom Search API credentials
# Check GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_ENGINE_ID
```

**Problem:** Exported documents won't open
```bash
# Solution: Ensure you have Microsoft Office or compatible software
# Try opening with LibreOffice or Google Docs
```

---

## 🎯 Key Features Demonstration

### AI-Powered Content Generation
- Uses Google Gemini and Groq APIs
- Context-aware generation
- Section-specific content
- Automatic fallback between providers

### Interactive Refinement
- Natural language prompts
- Real-time content updates
- Refinement history tracking
- Before/after comparison

### Professional Document Export
- Well-formatted .docx files
- Professional .pptx presentations
- Theme colors applied
- Images included
- Custom fonts and styling

### User Experience
- Intuitive interface
- Drag-and-drop functionality
- Live preview
- Dark mode support
- Toast notifications
- Responsive design

---

## 📝 License

This project is created for educational purposes as part of an assignment.

---

## 👥 Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [API Documentation](#api-documentation)
3. Check the console for error messages

---

## 🎉 Acknowledgments

- Google Gemini API for AI content generation
- Groq for fast LLM inference
- FastAPI for the excellent backend framework
- React for the frontend framework
- python-docx and python-pptx for document generation

---

**Built with ❤️ using AI and modern web technologies**
