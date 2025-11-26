import requests
from io import BytesIO
from PIL import Image
import os
import random
import hashlib
from dotenv import load_dotenv
import google.generativeai as genai
import base64

load_dotenv()

class ImageService:
    def __init__(self):
        self.unsplash_access_key = os.getenv("UNSPLASH_ACCESS_KEY", "")
        self.gemini_api_key = os.getenv("GEMINI_API_KEY", "")
        self.google_search_api_key = os.getenv("GOOGLE_SEARCH_API_KEY", "")
        self.google_search_engine_id = os.getenv("GOOGLE_SEARCH_ENGINE_ID", "")
        self.used_images = set()  # Track used image URLs to avoid duplicates
        
        # Initialize Gemini for image generation if API key is available
        if self.gemini_api_key:
            try:
                genai.configure(api_key=self.gemini_api_key)
                # Use Imagen model for image generation
                self.imagen_model = genai.GenerativeModel('gemini-1.5-flash')
                print("✓ Gemini image generation initialized")
            except Exception as e:
                print(f"Gemini image init failed: {str(e)}")
                self.imagen_model = None
        else:
            self.imagen_model = None
        
        # Check if Google Search is configured
        if self.google_search_api_key and self.google_search_engine_id:
            print("✓ Google Image Search enabled")
        else:
            print("ℹ Google Image Search not configured (optional)")
        
    def generate_slide_image(self, slide_title: str, main_topic: str) -> BytesIO:
        """
        Generate or fetch a relevant image for a slide.
        Uses Unsplash API for free stock photos.
        """
        try:
            # Create search query from slide title and topic
            query = f"{slide_title} {main_topic}".replace(':', '').replace('?', '')
            
            # Try Unsplash first (free, no API key needed for basic use)
            image_data = self._fetch_unsplash_image(query)
            
            if image_data:
                return image_data
            
            # Fallback: Create a simple colored placeholder
            return self._create_placeholder_image(slide_title)
            
        except Exception as e:
            print(f"Image generation error: {str(e)}")
            return self._create_placeholder_image(slide_title)
    
    def _fetch_unsplash_image(self, query: str) -> BytesIO:
        """Fetch unique image using multiple sources - prioritize relevance and speed"""
        try:
            # Try multiple sources in order - prioritize Google for relevance
            sources = [
                ('Google Search', self._fetch_from_google_search),
                ('Pexels', self._fetch_from_pexels),
                ('Picsum', self._fetch_from_picsum),
            ]
            
            for source_name, source_func in sources:
                try:
                    print(f"\n📸 Trying {source_name} for '{query}'...")
                    image_data = source_func(query)
                    if image_data:
                        print(f"✓ Successfully fetched image from {source_name} for '{query}'")
                        return image_data
                    else:
                        print(f"✗ {source_name} returned no image")
                except Exception as e:
                    print(f"✗ {source_name} failed: {str(e)}")
                    continue
            
            print(f"✗ All image sources failed for '{query}'")
            return None
        except Exception as e:
            print(f"✗ All image sources failed: {str(e)}")
            return None
    
    def _fetch_from_google_search(self, query: str) -> BytesIO:
        """Fetch most relevant image from Google Custom Search API"""
        if not self.google_search_api_key or not self.google_search_engine_id:
            return None
        
        try:
            # Extract key terms for better search
            keywords = query.lower().split()
            stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'plus', 'minus', 'as', 'of', 'with'}
            keywords = [w for w in keywords if w not in stop_words and len(w) > 2]
            
            # Use first 3-4 most relevant keywords
            search_query = ' '.join(keywords[:4]) if keywords else query
            
            # Google Custom Search API endpoint
            url = "https://www.googleapis.com/customsearch/v1"
            params = {
                'key': self.google_search_api_key,
                'cx': self.google_search_engine_id,
                'q': search_query,
                'searchType': 'image',
                'num': 3,  # Get top 3 results
                'imgSize': 'large',
                'imgType': 'photo',
                'safe': 'active',
                'fileType': 'jpg,png'
            }
            
            print(f"🔍 Searching Google Images for '{search_query}'...")
            print(f"   API Key: {self.google_search_api_key[:10]}... Engine ID: {self.google_search_engine_id}")
            
            response = requests.get(url, params=params, timeout=10)
            
            # Debug: Print response status and any errors
            if response.status_code != 200:
                error_data = response.json() if response.content else {}
                print(f"✗ Google API Error {response.status_code}: {error_data.get('error', {}).get('message', 'Unknown error')}")
                return None
            
            data = response.json()
            
            if 'items' in data and len(data['items']) > 0:
                # Try to download the first few images until one works
                for item in data['items'][:3]:
                    try:
                        image_url = item['link']
                        
                        # Skip if we've used this image before
                        if image_url in self.used_images:
                            print(f"  Skipping duplicate: {image_url[:50]}...")
                            continue
                        
                        print(f"  Trying to download: {image_url[:50]}...")
                        
                        # Download the image
                        img_response = requests.get(image_url, timeout=8, headers={
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        })
                        
                        if img_response.status_code == 200 and len(img_response.content) > 1000:
                            self.used_images.add(image_url)
                            
                            image_data = BytesIO(img_response.content)
                            img = Image.open(image_data)
                            
                            # Convert to RGB if needed
                            if img.mode in ('RGBA', 'LA', 'P'):
                                img = img.convert('RGB')
                            
                            # Resize to standard size
                            img = img.resize((800, 600), Image.Resampling.LANCZOS)
                            
                            output = BytesIO()
                            img.save(output, format='JPEG', quality=85)
                            output.seek(0)
                            
                            print(f"✓ Google Image downloaded successfully for '{search_query}'")
                            return output
                        else:
                            print(f"  Image download failed: status={img_response.status_code}, size={len(img_response.content)}")
                    except Exception as e:
                        print(f"  Failed to process image: {str(e)}")
                        continue
                
                print(f"✗ All Google images failed to download for '{search_query}'")
            else:
                print(f"✗ No images found in Google results for '{search_query}'")
            
            return None
            
        except Exception as e:
            print(f"✗ Google Image Search failed: {str(e)}")
            return None
    
    def _fetch_from_pexels(self, query: str) -> BytesIO:
        """Fetch relevant images from Pexels (free, no API key needed)"""
        try:
            # Extract key terms for better search
            keywords = query.lower().split()
            stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'plus', 'minus', 'as', 'of'}
            keywords = [w for w in keywords if w not in stop_words and len(w) > 2]
            
            # Use first 2-3 most relevant keywords
            search_query = ' '.join(keywords[:3]) if keywords else 'business presentation'
            
            # Use Pexels free image service
            encoded_query = requests.utils.quote(search_query)
            # Generate unique page number based on query
            page = (abs(hash(query)) % 50) + 1
            
            url = f"https://images.pexels.com/photos/{1000 + page}/pexels-photo-{1000 + page}.jpeg?auto=compress&cs=tinysrgb&w=800&h=600"
            
            print(f"Trying Pexels for '{query}' with search: {search_query}")
            
            response = requests.get(url, timeout=8)
            if response.status_code == 200 and len(response.content) > 1000:
                image_data = BytesIO(response.content)
                img = Image.open(image_data)
                img = img.resize((800, 600), Image.Resampling.LANCZOS)
                
                output = BytesIO()
                img.save(output, format='PNG')
                output.seek(0)
                return output
            
            return None
            
        except Exception as e:
            print(f"Pexels fetch failed: {str(e)}")
            return None
    
    def _generate_with_ai(self, query: str) -> BytesIO:
        """Generate image using AI - only as fallback due to speed"""
        try:
            # Extract key terms for better image generation
            keywords = query.lower().split()
            stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'plus', 'minus', 'as', 'of'}
            keywords = [w for w in keywords if w not in stop_words and len(w) > 2]
            
            # Create a descriptive prompt with main keywords
            clean_query = ' '.join(keywords[:4]) if keywords else query
            prompt = f"{clean_query} professional illustration"
            
            # Use Pollinations.ai with shorter timeout
            encoded_prompt = requests.utils.quote(prompt)
            seed = abs(hash(query)) % 10000
            url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=800&height=600&seed={seed}&nologo=true"
            
            print(f"Generating AI image for '{query}'...")
            
            response = requests.get(url, timeout=15)  # Reduced timeout
            if response.status_code == 200 and len(response.content) > 1000:
                image_data = BytesIO(response.content)
                img = Image.open(image_data)
                img = img.resize((800, 600), Image.Resampling.LANCZOS)
                
                output = BytesIO()
                img.save(output, format='PNG')
                output.seek(0)
                print(f"✓ AI image generated")
                return output
            
            return None
            
        except Exception as e:
            print(f"AI generation skipped: {str(e)}")
            return None
    
    def _fetch_from_picsum(self, query: str) -> BytesIO:
        """Fetch from Picsum Photos (Lorem Picsum) - reliable and free"""
        # Generate unique ID based on query to get different images
        query_hash = int(hashlib.md5(query.encode()).hexdigest()[:8], 16)
        image_id = (query_hash % 900) + 100  # IDs from 100-999
        
        url = f"https://picsum.photos/id/{image_id}/800/600"
        print(f"Trying Picsum with ID {image_id} for '{query}'")
        
        response = requests.get(url, timeout=3)
        if response.status_code == 200:
            image_data = BytesIO(response.content)
            img = Image.open(image_data)
            img = img.resize((800, 600), Image.Resampling.LANCZOS)
            
            output = BytesIO()
            img.save(output, format='PNG')
            output.seek(0)
            return output
        return None
    

    
    def _create_placeholder_image(self, text: str) -> BytesIO:
        """Create a unique colored placeholder image based on text"""
        try:
            # Generate color based on text hash for consistency but uniqueness
            text_hash = hashlib.md5(text.encode()).hexdigest()
            r = int(text_hash[0:2], 16)
            g = int(text_hash[2:4], 16)
            b = int(text_hash[4:6], 16)
            
            # Ensure colors are not too dark
            r = max(r, 80)
            g = max(g, 80)
            b = max(b, 80)
            
            # Create a gradient image
            img = Image.new('RGB', (800, 600), color=(r, g, b))
            
            # Save to BytesIO
            output = BytesIO()
            img.save(output, format='PNG')
            output.seek(0)
            return output
        except Exception as e:
            print(f"Placeholder creation error: {str(e)}")
            return None

image_service = ImageService()
