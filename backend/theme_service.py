"""
Theme Service for loading and managing PowerPoint and Word design themes.
Supports importing Microsoft templates (.pptx, .potx, .docx, .dotx)
"""
from pptx import Presentation
from docx import Document
from io import BytesIO
import os
from typing import Optional, Dict, List

class ThemeService:
    """Manage PowerPoint and Word design themes and templates."""
    
    def __init__(self):
        self.themes_dir = "themes"
        self.word_themes_dir = "themes/word"
        self.builtin_ppt_themes = self._load_builtin_ppt_themes()
        self.builtin_word_themes = self._load_builtin_word_themes()
        
        # Create themes directories if they don't exist
        if not os.path.exists(self.themes_dir):
            os.makedirs(self.themes_dir)
        if not os.path.exists(self.word_themes_dir):
            os.makedirs(self.word_themes_dir)
    
    def _load_builtin_ppt_themes(self) -> Dict[str, str]:
        """Define built-in Microsoft PowerPoint themes."""
        return {
            "office": "Office Theme",
            "ion": "Ion",
            "integral": "Integral",
            "facet": "Facet",
            "retrospect": "Retrospect",
            "slice": "Slice",
            "wisp": "Wisp",
            "basis": "Basis",
            "berlin": "Berlin",
            "circuit": "Circuit"
        }
    
    def _load_builtin_word_themes(self) -> Dict[str, str]:
        """Define built-in Microsoft Word themes."""
        return {
            "office": "Office",
            "basic": "Basic (Simple)",
            "black_tie": "Black & White (Elegant)",
            "facet": "Facet",
            "integral": "Integral",
            "ion": "Ion",
            "retrospect": "Retrospect",
            "slice": "Slice",
            "wisp": "Wisp",
            "organic": "Organic",
            "dividend": "Dividend",
            "frame": "Frame"
        }
    
    def get_available_themes(self, document_type: str = 'pptx') -> List[Dict[str, str]]:
        """Get list of available themes for specific document type."""
        themes = []
        
        if document_type == 'pptx':
            # Add built-in PowerPoint themes
            for theme_id, theme_name in self.builtin_ppt_themes.items():
                themes.append({
                    "id": theme_id,
                    "name": theme_name,
                    "type": "builtin",
                    "document_type": "pptx",
                    "preview": self._get_ppt_theme_preview(theme_id)
                })
            
            # Add custom uploaded PowerPoint themes
            if os.path.exists(self.themes_dir):
                for filename in os.listdir(self.themes_dir):
                    if filename.endswith(('.pptx', '.potx')):
                        theme_id = filename.replace('.pptx', '').replace('.potx', '')
                        themes.append({
                            "id": theme_id,
                            "name": theme_id.replace('_', ' ').title(),
                            "type": "custom",
                            "document_type": "pptx",
                            "file": filename
                        })
        
        elif document_type == 'docx':
            # Add built-in Word themes
            for theme_id, theme_name in self.builtin_word_themes.items():
                themes.append({
                    "id": theme_id,
                    "name": theme_name,
                    "type": "builtin",
                    "document_type": "docx",
                    "preview": self._get_word_theme_preview(theme_id)
                })
            
            # Add custom uploaded Word themes
            if os.path.exists(self.word_themes_dir):
                for filename in os.listdir(self.word_themes_dir):
                    if filename.endswith(('.docx', '.dotx')):
                        theme_id = filename.replace('.docx', '').replace('.dotx', '')
                        themes.append({
                            "id": theme_id,
                            "name": theme_id.replace('_', ' ').title(),
                            "type": "custom",
                            "document_type": "docx",
                            "file": filename
                        })
        
        return themes
    
    def _get_ppt_theme_preview(self, theme_id: str) -> Dict[str, str]:
        """Get color preview for a theme."""
        # Microsoft Office theme color schemes
        theme_colors = {
            "office": {
                "primary": "#0078D4",
                "secondary": "#106EBE",
                "accent": "#50E6FF",
                "text": "#FFFFFF"
            },
            "ion": {
                "primary": "#0072C6",
                "secondary": "#68217A",
                "accent": "#00BCF2",
                "text": "#FFFFFF"
            },
            "integral": {
                "primary": "#7F7F7F",
                "secondary": "#D24726",
                "accent": "#F79646",
                "text": "#FFFFFF"
            },
            "facet": {
                "primary": "#1F4E78",
                "secondary": "#0F2B3C",
                "accent": "#7BA4DB",
                "text": "#FFFFFF"
            },
            "retrospect": {
                "primary": "#8B7E66",
                "secondary": "#C9B18A",
                "accent": "#E7DEC8",
                "text": "#FFFFFF"
            },
            "slice": {
                "primary": "#FF6900",
                "secondary": "#FCB900",
                "accent": "#7BDCB5",
                "text": "#FFFFFF"
            },
            "wisp": {
                "primary": "#6B9BC7",
                "secondary": "#92B4D1",
                "accent": "#B8CDDB",
                "text": "#FFFFFF"
            },
            "basis": {
                "primary": "#2E5090",
                "secondary": "#9DC3E6",
                "accent": "#E7E6E6",
                "text": "#FFFFFF"
            },
            "berlin": {
                "primary": "#D13438",
                "secondary": "#F4B183",
                "accent": "#C5E0B4",
                "text": "#FFFFFF"
            },
            "circuit": {
                "primary": "#00B0F0",
                "secondary": "#7030A0",
                "accent": "#FFC000",
                "text": "#FFFFFF"
            }
        }
        
        return theme_colors.get(theme_id, theme_colors["office"])
    
    def _get_word_theme_preview(self, theme_id: str) -> Dict[str, str]:
        """Get color preview for Word themes."""
        word_theme_colors = {
            "office": {
                "primary": "#0078D4",
                "secondary": "#106EBE",
                "accent": "#50E6FF",
                "text": "#000000"
            },
            "basic": {
                "primary": "#4472C4",
                "secondary": "#ED7D31",
                "accent": "#A5A5A5",
                "text": "#000000"
            },
            "black_tie": {
                "primary": "#000000",
                "secondary": "#595959",
                "accent": "#AEAAAA",
                "text": "#000000"
            },
            "facet": {
                "primary": "#1F4E78",
                "secondary": "#0F2B3C",
                "accent": "#7BA4DB",
                "text": "#000000"
            },
            "integral": {
                "primary": "#7F7F7F",
                "secondary": "#D24726",
                "accent": "#F79646",
                "text": "#000000"
            },
            "ion": {
                "primary": "#0072C6",
                "secondary": "#68217A",
                "accent": "#00BCF2",
                "text": "#000000"
            },
            "retrospect": {
                "primary": "#8B7E66",
                "secondary": "#C9B18A",
                "accent": "#E7DEC8",
                "text": "#000000"
            },
            "slice": {
                "primary": "#FF6900",
                "secondary": "#FCB900",
                "accent": "#7BDCB5",
                "text": "#000000"
            },
            "wisp": {
                "primary": "#6B9BC7",
                "secondary": "#92B4D1",
                "accent": "#B8CDDB",
                "text": "#000000"
            },
            "organic": {
                "primary": "#7BA23F",
                "secondary": "#C5D9A4",
                "accent": "#E8F2D7",
                "text": "#000000"
            },
            "dividend": {
                "primary": "#4F81BD",
                "secondary": "#C0504D",
                "accent": "#9BBB59",
                "text": "#000000"
            },
            "frame": {
                "primary": "#C0504D",
                "secondary": "#4F81BD",
                "accent": "#9BBB59",
                "text": "#000000"
            }
        }
        
        return word_theme_colors.get(theme_id, word_theme_colors["office"])
    
    def load_theme_template(self, theme_id: str, document_type: str = 'pptx') -> Optional[any]:
        """Load a template by theme ID and document type."""
        try:
            if document_type == 'pptx':
                # Check if it's a custom PowerPoint theme file
                custom_path = os.path.join(self.themes_dir, f"{theme_id}.pptx")
                if os.path.exists(custom_path):
                    return Presentation(custom_path)
                
                custom_path = os.path.join(self.themes_dir, f"{theme_id}.potx")
                if os.path.exists(custom_path):
                    return Presentation(custom_path)
                
                # For built-in themes, return None (will use default with colors)
                return None
            
            elif document_type == 'docx':
                # Check if it's a custom Word theme file
                custom_path = os.path.join(self.word_themes_dir, f"{theme_id}.docx")
                if os.path.exists(custom_path):
                    return Document(custom_path)
                
                custom_path = os.path.join(self.word_themes_dir, f"{theme_id}.dotx")
                if os.path.exists(custom_path):
                    return Document(custom_path)
                
                # For built-in themes, return None (will use default with colors)
                return None
            
        except Exception as e:
            print(f"Error loading theme {theme_id}: {e}")
            return None
    
    def save_custom_theme(self, file_data: BytesIO, theme_name: str, document_type: str = 'pptx') -> bool:
        """Save a custom template (PowerPoint or Word)."""
        try:
            # Sanitize filename
            safe_name = "".join(c for c in theme_name if c.isalnum() or c in (' ', '-', '_')).strip()
            safe_name = safe_name.replace(' ', '_')
            
            # Determine directory and extension
            if document_type == 'docx':
                directory = self.word_themes_dir
                extension = '.docx'
            else:
                directory = self.themes_dir
                extension = '.pptx'
            
            filepath = os.path.join(directory, f"{safe_name}{extension}")
            
            with open(filepath, 'wb') as f:
                f.write(file_data.read())
            
            print(f"✓ Custom {document_type} theme saved: {safe_name}")
            return True
            
        except Exception as e:
            print(f"✗ Error saving theme: {e}")
            return False
    
    def delete_custom_theme(self, theme_id: str, document_type: str = 'pptx') -> bool:
        """Delete a custom theme."""
        try:
            if document_type == 'docx':
                extensions = ['.docx', '.dotx']
                directory = self.word_themes_dir
            else:
                extensions = ['.pptx', '.potx']
                directory = self.themes_dir
            
            for ext in extensions:
                filepath = os.path.join(directory, f"{theme_id}{ext}")
                if os.path.exists(filepath):
                    os.remove(filepath)
                    print(f"✓ Theme deleted: {theme_id}")
                    return True
            return False
        except Exception as e:
            print(f"✗ Error deleting theme: {e}")
            return False

# Global instance
theme_service = ThemeService()
