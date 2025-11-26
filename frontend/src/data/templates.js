export const pptTemplates = [
  {
    id: 'pitch-deck',
    name: 'Pitch Deck',
    description: 'Perfect for startup pitches and investor presentations',
    icon: '🚀',
    color: '#667eea',
    slides: [
      { title: 'Company Overview', description: 'Introduce your company and mission' },
      { title: 'Problem Statement', description: 'Define the problem you\'re solving' },
      { title: 'Solution', description: 'Present your unique solution' },
      { title: 'Market Opportunity', description: 'Show market size and potential' },
      { title: 'Product Demo', description: 'Showcase your product features' },
      { title: 'Business Model', description: 'Explain how you make money' },
      { title: 'Traction & Metrics', description: 'Share growth and achievements' },
      { title: 'Team', description: 'Introduce key team members' },
      { title: 'Competition', description: 'Competitive landscape analysis' },
      { title: 'Financial Projections', description: 'Revenue and growth forecasts' },
      { title: 'Funding Ask', description: 'Investment requirements and use of funds' },
      { title: 'Contact & Next Steps', description: 'How to reach you' }
    ]
  },
  {
    id: 'business-proposal',
    name: 'Business Proposal',
    description: 'Professional proposal for clients and partners',
    icon: '💼',
    color: '#48bb78',
    slides: [
      { title: 'Executive Summary', description: 'Overview of the proposal' },
      { title: 'About Us', description: 'Company background and expertise' },
      { title: 'Understanding Your Needs', description: 'Client requirements analysis' },
      { title: 'Proposed Solution', description: 'Detailed solution overview' },
      { title: 'Methodology', description: 'How we\'ll execute the project' },
      { title: 'Timeline & Milestones', description: 'Project schedule and deliverables' },
      { title: 'Pricing & Investment', description: 'Cost breakdown and payment terms' },
      { title: 'Case Studies', description: 'Success stories and testimonials' },
      { title: 'Terms & Conditions', description: 'Agreement details' },
      { title: 'Next Steps', description: 'How to proceed' }
    ]
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    description: 'Announce and showcase your new product',
    icon: '🎯',
    color: '#ed8936',
    slides: [
      { title: 'Product Introduction', description: 'Unveil your new product' },
      { title: 'Market Context', description: 'Current market landscape' },
      { title: 'Key Features', description: 'Highlight main product features' },
      { title: 'Benefits & Value', description: 'Customer value proposition' },
      { title: 'Target Audience', description: 'Who is this product for' },
      { title: 'Pricing Strategy', description: 'Pricing tiers and options' },
      { title: 'Go-to-Market Plan', description: 'Launch strategy and channels' },
      { title: 'Marketing Campaign', description: 'Promotional activities' },
      { title: 'Success Metrics', description: 'KPIs and goals' },
      { title: 'Call to Action', description: 'Next steps for customers' }
    ]
  },
  {
    id: 'training-workshop',
    name: 'Training & Workshop',
    description: 'Educational content and skill development',
    icon: '📚',
    color: '#4299e1',
    slides: [
      { title: 'Welcome & Objectives', description: 'Session goals and agenda' },
      { title: 'Introduction', description: 'Topic overview and importance' },
      { title: 'Key Concepts', description: 'Fundamental principles' },
      { title: 'Practical Examples', description: 'Real-world applications' },
      { title: 'Hands-on Exercise', description: 'Interactive activity' },
      { title: 'Best Practices', description: 'Tips and recommendations' },
      { title: 'Common Mistakes', description: 'What to avoid' },
      { title: 'Q&A Session', description: 'Questions and discussion' },
      { title: 'Resources', description: 'Additional learning materials' },
      { title: 'Summary & Takeaways', description: 'Key points recap' }
    ]
  },
  {
    id: 'quarterly-review',
    name: 'Quarterly Review',
    description: 'Business performance and progress report',
    icon: '📊',
    color: '#9f7aea',
    slides: [
      { title: 'Executive Summary', description: 'Quarter highlights overview' },
      { title: 'Key Metrics', description: 'Performance indicators' },
      { title: 'Revenue & Growth', description: 'Financial performance' },
      { title: 'Major Achievements', description: 'Wins and milestones' },
      { title: 'Challenges Faced', description: 'Obstacles and solutions' },
      { title: 'Team Performance', description: 'Department updates' },
      { title: 'Customer Insights', description: 'Feedback and satisfaction' },
      { title: 'Market Trends', description: 'Industry developments' },
      { title: 'Next Quarter Goals', description: 'Upcoming objectives' },
      { title: 'Action Items', description: 'Next steps and responsibilities' }
    ]
  },
  {
    id: 'marketing-strategy',
    name: 'Marketing Strategy',
    description: 'Comprehensive marketing plan and campaigns',
    icon: '📱',
    color: '#f56565',
    slides: [
      { title: 'Marketing Overview', description: 'Strategy introduction' },
      { title: 'Market Analysis', description: 'Industry and competitor research' },
      { title: 'Target Audience', description: 'Customer personas and segments' },
      { title: 'Brand Positioning', description: 'Unique value proposition' },
      { title: 'Marketing Channels', description: 'Digital and traditional channels' },
      { title: 'Content Strategy', description: 'Content types and calendar' },
      { title: 'Campaign Ideas', description: 'Creative concepts and themes' },
      { title: 'Budget Allocation', description: 'Resource distribution' },
      { title: 'Success Metrics', description: 'KPIs and measurement' },
      { title: 'Implementation Timeline', description: 'Execution roadmap' }
    ]
  },
  {
    id: 'custom',
    name: 'Start from Scratch',
    description: 'Create your own custom structure',
    icon: '✨',
    color: '#718096',
    slides: []
  }
];

export const docxTemplates = [
  {
    id: 'business-report',
    name: 'Business Report',
    description: 'Comprehensive business analysis document',
    icon: '📄',
    sections: [
      'Executive Summary',
      'Introduction',
      'Methodology',
      'Findings & Analysis',
      'Recommendations',
      'Conclusion'
    ]
  },
  {
    id: 'research-paper',
    name: 'Research Paper',
    description: 'Academic or professional research document',
    icon: '🔬',
    sections: [
      'Abstract',
      'Introduction',
      'Literature Review',
      'Methodology',
      'Results',
      'Discussion',
      'Conclusion',
      'References'
    ]
  },
  {
    id: 'project-proposal',
    name: 'Project Proposal',
    description: 'Detailed project planning document',
    icon: '📋',
    sections: [
      'Project Overview',
      'Objectives & Goals',
      'Scope & Deliverables',
      'Timeline & Milestones',
      'Budget & Resources',
      'Risk Assessment',
      'Success Criteria'
    ]
  },
  {
    id: 'custom',
    name: 'Start from Scratch',
    description: 'Create your own custom structure',
    icon: '✨',
    sections: []
  }
];
