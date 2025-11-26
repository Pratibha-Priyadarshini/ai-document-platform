from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta
from io import BytesIO

from database import get_db, engine
from models import Base, User, Project, Section, Refinement, Feedback
from schemas import (
    UserCreate, UserLogin, Token, ProjectCreate, ProjectResponse,
    ProjectListResponse, GenerateContentRequest, RefineContentRequest,
    FeedbackRequest, AITemplateRequest, AITemplateResponse
)
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
)
from gemini_service import gemini_service
from document_service_v2 import DocumentServiceV2

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Document Authoring Platform")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://ai-document-platform-two.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication endpoints
@app.post("/auth/register", response_model=Token)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(email=user_data.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": new_user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# Project endpoints
@app.get("/projects", response_model=List[ProjectListResponse])
def get_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    projects = db.query(Project).filter(Project.user_id == current_user.id).all()
    return projects

@app.post("/projects", response_model=ProjectResponse)
def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate document type
    if project_data.document_type not in ["docx", "pptx"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document type must be 'docx' or 'pptx'"
        )
    
    # Create project
    import json
    new_project = Project(
        user_id=current_user.id,
        title=project_data.title,
        document_type=project_data.document_type,
        main_topic=project_data.main_topic,
        metadata_json=json.dumps(project_data.metadata) if project_data.metadata else None
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    # Create sections
    for section_data in project_data.sections:
        new_section = Section(
            project_id=new_project.id,
            title=section_data.title,
            description=section_data.description or "",
            order=section_data.order
        )
        db.add(new_section)
    
    db.commit()
    db.refresh(new_project)
    
    return new_project

@app.get("/projects/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from sqlalchemy.orm import joinedload
    
    project = db.query(Project).options(
        joinedload(Project.sections).joinedload(Section.feedbacks),
        joinedload(Project.sections).joinedload(Section.refinements)
    ).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return project

@app.delete("/projects/{project_id}")
def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    db.delete(project)
    db.commit()
    
    return {"message": "Project deleted successfully"}

# Content generation endpoints
@app.post("/projects/{project_id}/generate")
def generate_content(
    project_id: int,
    request: GenerateContentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Generate content for specific section or all sections
    if request.section_id:
        sections = db.query(Section).filter(Section.id == request.section_id).all()
    else:
        sections = db.query(Section).filter(Section.project_id == project_id).all()
    
    for section in sections:
        # Assume slides will have images by default
        has_image = True
        content = gemini_service.generate_content(
            section.title,
            project.main_topic,
            project.document_type,
            has_image
        )
        section.content = content
    
    db.commit()
    
    return {"message": "Content generated successfully"}

@app.post("/projects/{project_id}/refine")
def refine_content(
    project_id: int,
    request: RefineContentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    section = db.query(Section).filter(Section.id == request.section_id).first()
    
    if not section or section.project_id != project_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Section not found"
        )
    
    # Store refinement history
    refinement = Refinement(
        section_id=section.id,
        prompt=request.prompt,
        previous_content=section.content
    )
    
    # Refine content
    new_content = gemini_service.refine_content(
        section.content,
        request.prompt,
        project.document_type
    )
    
    refinement.new_content = new_content
    section.content = new_content
    
    db.add(refinement)
    db.commit()
    
    return {"message": "Content refined successfully", "new_content": new_content}

@app.post("/projects/{project_id}/feedback")
def submit_feedback(
    project_id: int,
    request: FeedbackRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    section = db.query(Section).filter(Section.id == request.section_id).first()
    
    if not section or section.project_id != project_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Section not found"
        )
    
    feedback = Feedback(
        section_id=section.id,
        feedback_type=request.feedback_type,
        comment=request.comment
    )
    
    db.add(feedback)
    db.commit()
    
    return {"message": "Feedback submitted successfully"}

# Export endpoint
@app.get("/projects/{project_id}/export")
def export_document(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    sections = db.query(Section).filter(Section.project_id == project_id).all()
    
    # Parse metadata
    import json
    metadata = None
    if project.metadata_json:
        try:
            metadata = json.loads(project.metadata_json)
        except:
            metadata = None
    
    if project.document_type == "docx":
        file_stream = DocumentServiceV2.create_docx(project, sections, metadata)
        filename = f"{project.title}.docx"
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    else:
        file_stream = DocumentServiceV2.create_professional_pptx(project, sections, metadata)
        filename = f"{project.title}.pptx"
        media_type = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    
    return StreamingResponse(
        file_stream,
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# AI Template generation (Bonus feature)
@app.post("/ai/generate-template", response_model=AITemplateResponse)
def generate_template(
    request: AITemplateRequest,
    current_user: User = Depends(get_current_user)
):
    titles = gemini_service.generate_template(
        request.main_topic,
        request.document_type,
        request.num_sections
    )
    
    return {"sections": titles}

@app.get("/")
def root():
    return {"message": "AI Document Authoring Platform API"}

# Statistics endpoint
@app.get("/stats")
def get_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user statistics for dashboard."""
    # Count total projects
    total_projects = db.query(Project).filter(Project.user_id == current_user.id).count()
    
    # Count by document type
    docx_count = db.query(Project).filter(
        Project.user_id == current_user.id,
        Project.document_type == 'docx'
    ).count()
    
    pptx_count = db.query(Project).filter(
        Project.user_id == current_user.id,
        Project.document_type == 'pptx'
    ).count()
    
    # Count sections with content (generated sections)
    generated_sections = db.query(Section).join(Project).filter(
        Project.user_id == current_user.id,
        Section.content != "",
        Section.content.isnot(None)
    ).count()
    
    # Count total refinements
    total_refinements = db.query(Refinement).join(Section).join(Project).filter(
        Project.user_id == current_user.id
    ).count()
    
    # Count total feedback
    total_feedback = db.query(Feedback).join(Section).join(Project).filter(
        Project.user_id == current_user.id
    ).count()
    
    return {
        "total_projects": total_projects,
        "docx_count": docx_count,
        "pptx_count": pptx_count,
        "generated_sections": generated_sections,
        "total_refinements": total_refinements,
        "total_feedback": total_feedback
    }


# Theme Management Endpoints
@app.get("/themes")
def get_themes(
    document_type: str = 'pptx',
    current_user: User = Depends(get_current_user)
):
    """Get all available themes for PowerPoint or Word."""
    from theme_service import theme_service
    themes = theme_service.get_available_themes(document_type)
    return {"themes": themes, "document_type": document_type}

@app.post("/themes/upload")
async def upload_theme(
    file: UploadFile = File(...),
    theme_name: str = Form(...),
    document_type: str = Form('pptx'),
    current_user: User = Depends(get_current_user)
):
    """Upload a custom template (.pptx, .potx, .docx, or .dotx)."""
    from theme_service import theme_service
    
    # Validate file type
    valid_extensions = {
        'pptx': ('.pptx', '.potx'),
        'docx': ('.docx', '.dotx')
    }
    
    if document_type not in valid_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid document type"
        )
    
    if not file.filename.endswith(valid_extensions[document_type]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only {', '.join(valid_extensions[document_type])} files are supported for {document_type}"
        )
    
    # Read file data
    file_data = BytesIO(await file.read())
    
    # Save theme
    success = theme_service.save_custom_theme(file_data, theme_name, document_type)
    
    if success:
        return {"message": "Theme uploaded successfully", "theme_name": theme_name}
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save theme"
        )

@app.delete("/themes/{theme_id}")
def delete_theme(
    theme_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a custom theme."""
    from theme_service import theme_service
    
    success = theme_service.delete_custom_theme(theme_id)
    
    if success:
        return {"message": "Theme deleted successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Theme not found"
        )
