# PowerPoint Theme System

## Overview
The application now supports Microsoft Office design themes in addition to custom color themes.

## Features

### 1. Built-in Microsoft Office Themes
Pre-configured professional themes matching Microsoft PowerPoint:
- **Office Theme** - Classic Microsoft Office design
- **Ion** - Vibrant and modern
- **Facet** - Professional blue
- **Integral** - Warm and bold
- **Slice** - Colorful and energetic
- **Wisp** - Soft and elegant

### 2. Custom Color Themes
Original custom themes with unique color schemes:
- Modern Gradient
- Minimal Dark
- Nature Green
- Corporate Blue
- Sunset Warm
- Elegant Purple
- Tech Cyan
- Monochrome

### 3. Upload Custom Templates (Coming Soon)
Users will be able to upload their own PowerPoint templates (.pptx, .potx files).

## API Endpoints

### Get Available Themes
```
GET /themes
```
Returns list of all available themes (built-in + custom uploaded).

### Upload Custom Theme
```
POST /themes/upload
Content-Type: multipart/form-data

Parameters:
- file: PowerPoint template file (.pptx or .potx)
- theme_name: Name for the theme
```

### Delete Custom Theme
```
DELETE /themes/{theme_id}
```

## Theme Storage
Custom uploaded themes are stored in: `backend/themes/`

## Usage in Frontend
Themes are selected in the CreatePPT component via ThemeSelector.
The selected theme is passed to the backend during presentation generation.

## Technical Details
- Themes use PowerPoint's built-in layouts and master slides
- Color schemes are applied via gradient backgrounds
- Custom templates preserve their original layouts and formatting
