from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class SectionCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    order: int

class FeedbackResponse(BaseModel):
    id: int
    feedback_type: str
    comment: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class RefinementResponse(BaseModel):
    id: int
    prompt: str
    previous_content: Optional[str] = None
    new_content: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class SectionResponse(BaseModel):
    id: int
    title: str
    description: str
    content: str
    order: int
    created_at: datetime
    updated_at: datetime
    feedbacks: List[FeedbackResponse] = []
    refinements: List[RefinementResponse] = []
    
    class Config:
        from_attributes = True

class ProjectCreate(BaseModel):
    title: str
    document_type: str  # 'docx' or 'pptx'
    main_topic: str
    sections: List[SectionCreate]
    metadata: Optional[dict] = None  # Theme and style information

class ProjectResponse(BaseModel):
    id: int
    title: str
    document_type: str
    main_topic: str
    metadata_json: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    sections: List[SectionResponse]
    
    class Config:
        from_attributes = True

class ProjectListResponse(BaseModel):
    id: int
    title: str
    document_type: str
    main_topic: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class GenerateContentRequest(BaseModel):
    section_id: Optional[int] = None  # If None, generate all sections

class RefineContentRequest(BaseModel):
    section_id: int
    prompt: str

class FeedbackRequest(BaseModel):
    section_id: int
    feedback_type: str  # 'like' or 'dislike'
    comment: Optional[str] = None

class AITemplateRequest(BaseModel):
    document_type: str
    main_topic: str
    num_sections: Optional[int] = None  # For pptx, number of slides

class SectionTemplate(BaseModel):
    title: str
    description: Optional[str] = None  # Brief description for slides

class AITemplateResponse(BaseModel):
    sections: List[SectionTemplate]  # List of section/slide templates
