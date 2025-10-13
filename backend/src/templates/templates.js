export const TEMPLATES = {
  modern: {
    id: 'modern',
    name: 'Modern Professional',
    description: 'A modern resume with gradient header and clean layout, perfect for tech and creative roles',
    preview: 'Modern design with purple gradient header, elegant typography',
    atsScore: 9,
    recommended: true,
  },
  classic: {
    id: 'classic',
    name: 'Classic ATS',
    description: 'Traditional black and white design optimized for Applicant Tracking Systems',
    preview: 'Professional black and white layout with clear sections',
    atsScore: 10,
    recommended: true,
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal Sidebar',
    description: 'Clean two-column layout with sidebar, great for highlighting key information',
    preview: 'Two-column design with dark sidebar for contact and skills',
    atsScore: 8,
    recommended: false,
  },
};

export const DEFAULT_TEMPLATE = 'modern';
