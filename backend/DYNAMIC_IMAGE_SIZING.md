# Dynamic Image Sizing System

## Overview
Images are now automatically sized based on the actual text content to prevent overlapping.

## How It Works

### 1. Text Content Analysis
- Counts the number of text lines in the slide
- Calculates space needed: `0.5 + (num_lines × 0.35)` inches
- Each line requires approximately 0.35 inches (16pt font + 4pt spacing)

### 2. Layout-Specific Sizing

#### Side Layouts (Left/Right)
- Uses PowerPoint's built-in two-column layout
- Image and text are in separate placeholders
- No overlap possible - fixed dimensions
- Image: ~4.2 inches wide × 5.8 inches tall

#### Top Layout
```
┌─────────────────────────┐
│       TITLE (1.2")      │
├─────────────────────────┤
│                         │
│    IMAGE (dynamic)      │  ← Sized based on remaining space
│                         │     after text calculation
├─────────────────────────┤
│   Text Content          │  ← Space reserved: 0.5 + (lines × 0.35)"
│   • Line 1              │
│   • Line 2              │
│   • Line 3              │
└─────────────────────────┘
```

**Calculation:**
- Title height: 1.2 inches
- Text space: 0.5 + (num_lines × 0.35) inches
- Bottom margin: 0.5 inches
- Image height: `slide_height - title - text_space - margin`
- Max image height: 3.5 inches
- Min image height: 1.5 inches

#### Bottom Layout
```
┌─────────────────────────┐
│       TITLE (1.2")      │
├─────────────────────────┤
│   Text Content          │  ← Space: 0.5 + (lines × 0.35)"
│   • Line 1              │
│   • Line 2              │
│   • Line 3              │
├─────────────────────────┤
│                         │
│    IMAGE (dynamic)      │  ← Fills remaining space
│                         │
└─────────────────────────┘
```

**Calculation:**
- Title height: 1.2 inches
- Text space: 0.5 + (num_lines × 0.35) inches
- Gap: 0.3 inches
- Image top: `title + text_space + gap`
- Image height: `slide_height - image_top - 0.4`
- Max image height: 3 inches
- Min image height: 1.5 inches

### 3. Content Limits
To ensure proper sizing:
- **With side images**: Max 5 lines, 16 words per line
- **With top/bottom images**: Max 6 lines, 18 words per line

### 4. Safety Margins
- Top margin: 1.2 inches (title)
- Bottom margin: 0.3-0.5 inches
- Gap between text and image: 0.2-0.3 inches
- Side margins: 1.5 inches (left), 1.5 inches (right)

## Benefits
1. **No Overlapping**: Images never overlap with text
2. **Optimal Space Usage**: More text = smaller image, less text = larger image
3. **Consistent Layout**: Professional appearance across all slides
4. **Responsive Design**: Adapts to content automatically

## Example Scenarios

### Scenario 1: Short Text (3 lines)
- Text space: 0.5 + (3 × 0.35) = 1.55 inches
- Available for image: ~4 inches
- Result: Large, prominent image

### Scenario 2: Medium Text (5 lines)
- Text space: 0.5 + (5 × 0.35) = 2.25 inches
- Available for image: ~3 inches
- Result: Balanced text and image

### Scenario 3: Long Text (6 lines)
- Text space: 0.5 + (6 × 0.35) = 2.6 inches
- Available for image: ~2.5 inches
- Result: Text-focused with supporting image

## Technical Implementation
See `_calculate_image_dimensions()` method in `document_service_v2.py`
