export const pptDesignThemes = [
  // Microsoft Office Themes
  {
    id: 'office',
    name: 'Office Theme',
    description: 'Classic Microsoft Office design',
    preview: {
      primary: '#0078D4',
      secondary: '#106EBE',
      accent: '#50E6FF',
      background: '#ffffff',
      text: '#FFFFFF'
    },
    gradient: 'linear-gradient(135deg, #0078D4 0%, #106EBE 100%)',
    style: 'professional',
    layout: 'traditional',
    type: 'microsoft'
  },
  {
    id: 'ion',
    name: 'Ion',
    description: 'Microsoft Ion theme - vibrant and modern',
    preview: {
      primary: '#0072C6',
      secondary: '#68217A',
      accent: '#00BCF2',
      background: '#ffffff',
      text: '#FFFFFF'
    },
    gradient: 'linear-gradient(135deg, #0072C6 0%, #68217A 100%)',
    style: 'modern',
    layout: 'centered',
    type: 'microsoft'
  },
  {
    id: 'facet',
    name: 'Facet',
    description: 'Microsoft Facet theme - professional blue',
    preview: {
      primary: '#1F4E78',
      secondary: '#0F2B3C',
      accent: '#7BA4DB',
      background: '#ffffff',
      text: '#FFFFFF'
    },
    gradient: 'linear-gradient(135deg, #1F4E78 0%, #0F2B3C 100%)',
    style: 'professional',
    layout: 'grid',
    type: 'microsoft'
  },
  {
    id: 'integral',
    name: 'Integral',
    description: 'Microsoft Integral theme - warm and bold',
    preview: {
      primary: '#7F7F7F',
      secondary: '#D24726',
      accent: '#F79646',
      background: '#ffffff',
      text: '#FFFFFF'
    },
    gradient: 'linear-gradient(135deg, #7F7F7F 0%, #D24726 100%)',
    style: 'vibrant',
    layout: 'asymmetric',
    type: 'microsoft'
  },
  {
    id: 'slice',
    name: 'Slice',
    description: 'Microsoft Slice theme - colorful and energetic',
    preview: {
      primary: '#FF6900',
      secondary: '#FCB900',
      accent: '#7BDCB5',
      background: '#ffffff',
      text: '#FFFFFF'
    },
    gradient: 'linear-gradient(135deg, #FF6900 0%, #FCB900 100%)',
    style: 'vibrant',
    layout: 'split',
    type: 'microsoft'
  },
  {
    id: 'wisp',
    name: 'Wisp',
    description: 'Microsoft Wisp theme - soft and elegant',
    preview: {
      primary: '#6B9BC7',
      secondary: '#92B4D1',
      accent: '#B8CDDB',
      background: '#ffffff',
      text: '#FFFFFF'
    },
    gradient: 'linear-gradient(135deg, #6B9BC7 0%, #92B4D1 100%)',
    style: 'elegant',
    layout: 'centered',
    type: 'microsoft'
  },
  
  // Custom Themes
  {
    id: 'modern-gradient',
    name: 'Modern Gradient',
    description: 'Bold gradients with clean typography',
    preview: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb',
      background: '#ffffff',
      text: '#1a202c'
    },
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    style: 'modern',
    layout: 'centered',
    type: 'custom'
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    description: 'Sleek dark theme with subtle accents',
    preview: {
      primary: '#1a202c',
      secondary: '#2d3748',
      accent: '#4fd1c5',
      background: '#0f1419',
      text: '#ffffff'
    },
    gradient: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
    style: 'minimal',
    layout: 'left-aligned',
    type: 'custom'
  },
  {
    id: 'nature-green',
    name: 'Nature Green',
    description: 'Fresh and organic earth tones',
    preview: {
      primary: '#48bb78',
      secondary: '#38a169',
      accent: '#9ae6b4',
      background: '#f0fff4',
      text: '#22543d'
    },
    gradient: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    style: 'organic',
    layout: 'centered',
    type: 'custom'
  },
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    description: 'Professional and trustworthy',
    preview: {
      primary: '#3182ce',
      secondary: '#2c5282',
      accent: '#63b3ed',
      background: '#ffffff',
      text: '#1a365d'
    },
    gradient: 'linear-gradient(135deg, #3182ce 0%, #2c5282 100%)',
    style: 'professional',
    layout: 'grid',
    type: 'custom'
  },
  {
    id: 'sunset-warm',
    name: 'Sunset Warm',
    description: 'Vibrant and energetic colors',
    preview: {
      primary: '#ed8936',
      secondary: '#dd6b20',
      accent: '#fbd38d',
      background: '#fffaf0',
      text: '#7c2d12'
    },
    gradient: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
    style: 'vibrant',
    layout: 'asymmetric',
    type: 'custom'
  },
  {
    id: 'elegant-purple',
    name: 'Elegant Purple',
    description: 'Sophisticated and creative',
    preview: {
      primary: '#805ad5',
      secondary: '#6b46c1',
      accent: '#d6bcfa',
      background: '#faf5ff',
      text: '#44337a'
    },
    gradient: 'linear-gradient(135deg, #805ad5 0%, #6b46c1 100%)',
    style: 'elegant',
    layout: 'centered',
    type: 'custom'
  },
  {
    id: 'tech-cyan',
    name: 'Tech Cyan',
    description: 'Modern tech and innovation',
    preview: {
      primary: '#0891b2',
      secondary: '#0e7490',
      accent: '#67e8f9',
      background: '#ecfeff',
      text: '#164e63'
    },
    gradient: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
    style: 'tech',
    layout: 'split',
    type: 'custom'
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Timeless black and white',
    preview: {
      primary: '#000000',
      secondary: '#4a5568',
      accent: '#cbd5e0',
      background: '#ffffff',
      text: '#1a202c'
    },
    gradient: 'linear-gradient(135deg, #000000 0%, #4a5568 100%)',
    style: 'classic',
    layout: 'traditional',
    type: 'custom'
  }
];

export const layoutStyles = {
  'centered': {
    name: 'Centered',
    description: 'Content centered with balanced spacing',
    icon: '⊡'
  },
  'left-aligned': {
    name: 'Left Aligned',
    description: 'Content aligned to the left for easy reading',
    icon: '⊟'
  },
  'grid': {
    name: 'Grid Layout',
    description: 'Organized grid for data and charts',
    icon: '⊞'
  },
  'asymmetric': {
    name: 'Asymmetric',
    description: 'Dynamic and modern layout',
    icon: '⊠'
  },
  'split': {
    name: 'Split Screen',
    description: 'Half content, half visual',
    icon: '⊡'
  },
  'traditional': {
    name: 'Traditional',
    description: 'Classic presentation layout',
    icon: '▭'
  }
};
