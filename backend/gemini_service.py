import google.generativeai as genai
import os
from dotenv import load_dotenv
import requests
from pathlib import Path

# Load .env from backend directory
env_path = Path(__file__).parent / '.env'
load_dotenv(env_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Configure Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

class GeminiService:
    def __init__(self):
        # Initialize Gemini with correct model name
        self.gemini_model = None
        if GEMINI_API_KEY:
            try:
                # Try different model names
                model_names = ['gemini-2.0-flash-exp', 'gemini-1.5-flash', 'gemini-pro']
                for model_name in model_names:
                    try:
                        self.gemini_model = genai.GenerativeModel(model_name)
                        print(f"✓ Gemini model initialized: {model_name}")
                        break
                    except:
                        continue
                if not self.gemini_model:
                    print("✗ Warning: Could not initialize any Gemini model")
            except Exception as e:
                print(f"✗ Warning: Could not initialize Gemini model: {e}")
        
        self.groq_api_key = GROQ_API_KEY
        self.groq_url = "https://api.groq.com/openai/v1/chat/completions"
        # Try Groq first (faster), fallback to Gemini
        self.primary_provider = "groq" if GROQ_API_KEY else "gemini"
        print(f"Primary AI provider: {self.primary_provider}")
    
    def _call_groq(self, prompt: str) -> str:
        """Call Groq API"""
        if not self.groq_api_key:
            print("✗ Groq API key not found")
            return None
        try:
            headers = {
                "Authorization": f"Bearer {self.groq_api_key}",
                "Content-Type": "application/json"
            }
            data = {
                "model": "llama-3.1-8b-instant",  # Faster, more reliable
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7,
                "max_tokens": 2000
            }
            response = requests.post(self.groq_url, headers=headers, json=data, timeout=30)
            response.raise_for_status()
            result = response.json()["choices"][0]["message"]["content"]
            print(f"✓ Groq API success ({len(result)} chars)")
            return result
        except Exception as e:
            print(f"✗ Groq API error: {str(e)}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"  Response: {e.response.text}")
            return None
    
    def _call_gemini(self, prompt: str) -> str:
        """Call Gemini API"""
        try:
            if not self.gemini_model:
                print("✗ Gemini model not initialized")
                return None
            response = self.gemini_model.generate_content(prompt)
            result = response.text
            print(f"✓ Gemini API success ({len(result)} chars)")
            return result
        except Exception as e:
            print(f"✗ Gemini API error: {str(e)}")
            import traceback
            traceback.print_exc()
            return None
    
    def _generate_with_fallback(self, prompt: str) -> str:
        """Try primary provider first, fallback to secondary"""
        if self.primary_provider == "groq":
            result = self._call_groq(prompt)
            if result:
                return result
            # Fallback to Gemini
            result = self._call_gemini(prompt)
            if result:
                return result
        else:
            result = self._call_gemini(prompt)
            if result:
                return result
            # Fallback to Groq
            result = self._call_groq(prompt)
            if result:
                return result
        
        return "Error: Unable to generate content. Please check your API keys."
    
    def generate_content(self, section_title: str, main_topic: str, document_type: str, has_image: bool = True) -> str:
        """Generate content for a specific section or slide with strict word limits."""
        if document_type == "pptx":
            # Strict word limits based on image presence
            if has_image:
                word_limit = "60-80 words total"
                bullet_count = "4-5 bullet points"
                words_per_bullet = "12-16 words per point"
            else:
                word_limit = "100-120 words total"
                bullet_count = "6-7 bullet points"
                words_per_bullet = "15-18 words per point"
            
            prompt = f"""Generate content for a PowerPoint slide about "{section_title}" in the context of "{main_topic}".

CRITICAL REQUIREMENTS:
- Total content: {word_limit}
- Number of points: {bullet_count}
- Length per point: {words_per_bullet}
- Each bullet point must be ONE sentence only
- Use simple, clear language
- NO markdown formatting (no **, *, etc.)
- NO headers like "Slide Title:" or "Key Points:"
- Start each line with a simple dash (-)

Format example:
- First key point in one clear sentence
- Second important point briefly stated
- Third relevant detail concisely

Generate ONLY the bullet points, nothing else."""
        else:
            prompt = f"""Generate detailed content for a Word document section with the following details:
Main Topic: {main_topic}
Section Title: {section_title}

CRITICAL REQUIREMENTS:
- DO NOT repeat the section title in the content
- Start directly with the content paragraphs
- Provide well-structured, professional content with 2-3 paragraphs
- Make it informative and business-appropriate
- NO headers or titles in the content
- Just the body text

Generate ONLY the content paragraphs, nothing else."""
        
        return self._generate_with_fallback(prompt)
    
    def refine_content(self, current_content: str, refinement_prompt: str, document_type: str) -> str:
        """Refine existing content based on user prompt."""
        prompt = f"""Current content:
{current_content}

User refinement request: {refinement_prompt}

Please modify the content according to the user's request. 
Maintain the same format and style ({'bullet points for slides' if document_type == 'pptx' else 'paragraphs for document'})."""
        
        return self._generate_with_fallback(prompt)
    
    def generate_template(self, main_topic: str, document_type: str, num_sections: int = None) -> list:
        """Generate section titles or slide titles based on main topic."""
        if document_type == "pptx":
            num = num_sections or 8
            prompt = f"""Create {num} PowerPoint slide titles with descriptions for: {main_topic}

Use this exact format for each slide (no extra text):

TITLE: Introduction to AI
DESC: Overview of artificial intelligence and its impact on modern business

TITLE: Current Applications
DESC: Real-world examples of AI in various industries

Now create {num} slides following this format exactly. Start immediately with "TITLE:" - no introduction or explanation."""
        else:
            num = num_sections or 5
            prompt = f"""Create {num} Word document section headings with descriptions for: {main_topic}

Use this exact format for each section (no extra text):

TITLE: Introduction
DESC: Background information and overview of the main topic

TITLE: Methodology
DESC: Research approach and data collection methods

Now create {num} sections following this format exactly. Start immediately with "TITLE:" - no introduction or explanation."""
        
        result = self._generate_with_fallback(prompt)
        
        if result and not result.startswith("Error"):
            # Parse title and description format for both pptx and docx
            sections = []
            lines = result.strip().split('\n')
            current_title = None
            current_desc = None
            
            # Skip any introductory text before first TITLE:
            found_first_title = False
            
            for line in lines:
                line = line.strip()
                
                # Skip lines until we find the first TITLE:
                if not found_first_title and not line.startswith('TITLE:'):
                    continue
                
                if line.startswith('TITLE:'):
                    found_first_title = True
                    if current_title:
                        sections.append({"title": current_title, "description": current_desc or ""})
                    current_title = line.replace('TITLE:', '').strip()
                    current_desc = None
                elif line.startswith('DESC:'):
                    current_desc = line.replace('DESC:', '').strip()
            
            # Add the last one
            if current_title:
                sections.append({"title": current_title, "description": current_desc or ""})
            
            # If parsing failed, fallback to simple titles
            if not sections:
                titles = [line.strip() for line in lines if line.strip() and not line.startswith(('TITLE:', 'DESC:', 'Here', 'Generate', 'Create'))]
                sections = [{"title": title, "description": ""} for title in titles[:num]]
            
            return sections[:num]
        
        # Fallback
        return [{"title": f"Section {i+1}", "description": ""} for i in range(num)]

gemini_service = GeminiService()
