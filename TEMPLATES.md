# Resume Templates Guide

This document explains how to use, customize, and add new resume templates to HireMind.

## Overview

HireMind uses HTML/CSS-based resume templates that are dynamically populated with user data. The templates are designed to be:
- **ATS-friendly**: Optimized for Applicant Tracking Systems
- **Print-ready**: Formatted for professional printing and PDF export
- **Responsive**: Mobile-friendly and adaptable to different screen sizes
- **Customizable**: Easy to modify and extend

## Available Templates

### 1. Modern Professional (`modern`)
- **Description**: A modern resume with gradient header and clean layout
- **Best For**: Tech roles, creative industries, startups
- **ATS Score**: 9/10
- **Features**:
  - Purple gradient header
  - Card-based layout
  - Skill tags with badges
  - Color-coded sections
  
### 2. Classic ATS (`classic`)
- **Description**: Traditional black and white design optimized for ATS
- **Best For**: Corporate roles, traditional industries, maximum ATS compatibility
- **ATS Score**: 10/10
- **Features**:
  - Black and white color scheme
  - Clear section headers
  - Simple, scannable layout
  - Minimal styling

### 3. Minimal Sidebar (`minimal`)
- **Description**: Clean two-column layout with dark sidebar
- **Best For**: Highlighting specific information, portfolio-style resumes
- **ATS Score**: 8/10
- **Features**:
  - Two-column layout
  - Dark sidebar for contact and skills
  - Spacious main content area
  - Modern typography

## Using Templates

### From the Frontend

1. Open the Resume Generator tab
2. Select your preferred template from the "Resume Template" dropdown
3. Fill in your information
4. Click "Generate Resume"
5. Preview the result and download as HTML or print to PDF

### Via API

```bash
curl -X POST http://localhost:3001/api/resume \
  -H "Content-Type: application/json" \
  -d '{
    "template": "modern",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "location": "New York, NY",
    "summary": "Experienced software developer...",
    "skills": ["JavaScript", "React", "Node.js"],
    "experience": [
      {
        "position": "Senior Developer",
        "company": "Tech Corp",
        "duration": "2020-Present",
        "description": "Led development of..."
      }
    ],
    "education": [
      {
        "degree": "BS Computer Science",
        "institution": "University Name",
        "year": "2019"
      }
    ]
  }'
```

## Template Structure

Each template is an HTML file with:
1. **CSS Styling**: Embedded in `<style>` tags for portability
2. **Template Variables**: Using `{{variable}}` syntax
3. **Conditional Blocks**: Using `{{#if condition}}...{{/if}}`
4. **Loops**: Using `{{#each array}}...{{/each}}`

### Template Syntax

#### Simple Variables
```html
<h1>{{name}}</h1>
<p>{{email}}</p>
```

#### Conditionals
```html
{{#if summary}}
  <div class="summary">{{summary}}</div>
{{/if}}
```

#### Arrays
```html
{{#each skills}}
  <span class="skill">{{this}}</span>
{{/each}}
```

#### Object Arrays
```html
{{#each experience}}
  <div class="job">
    <h3>{{position}}</h3>
    <p>{{company}} - {{duration}}</p>
    <p>{{description}}</p>
  </div>
{{/each}}
```

## Adding a New Template

### Step 1: Create the HTML Template

1. Create a new HTML file in `/backend/src/templates/` (e.g., `elegant.html`)
2. Include all CSS inline within `<style>` tags
3. Use the template syntax for dynamic content
4. Test for print and mobile responsiveness

Example structure:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{name}} - Resume</title>
    <style>
        /* Your CSS here */
    </style>
</head>
<body>
    <!-- Your template structure here -->
</body>
</html>
```

### Step 2: Register the Template

Add your template to `/backend/src/templates/templates.js`:

```javascript
export const TEMPLATES = {
  // ... existing templates
  elegant: {
    id: 'elegant',
    name: 'Elegant Professional',
    description: 'A sophisticated design with serif fonts',
    preview: 'Elegant layout with serif typography',
    atsScore: 9,
    recommended: false,
  },
};
```

### Step 3: Test the Template

1. Restart the backend server
2. The template will automatically appear in the frontend dropdown
3. Test with sample data to ensure proper rendering
4. Test print/PDF export functionality

## Template Guidelines

### Design Principles

1. **Keep it Simple**: ATS systems prefer simple, clean layouts
2. **Use Standard Fonts**: Stick to web-safe fonts like Arial, Helvetica, Times New Roman
3. **Avoid Complex Layouts**: Tables and multi-column layouts can confuse ATS
4. **Clear Hierarchy**: Use proper heading levels (h1, h2, h3)
5. **Print-Friendly**: Test with print preview before finalizing

### Technical Requirements

1. **Self-Contained**: All CSS must be inline (no external stylesheets)
2. **No External Resources**: Don't link to external images or fonts
3. **Responsive**: Use media queries for mobile compatibility
4. **Print Styles**: Include `@media print` styles for PDF export
5. **Semantic HTML**: Use proper HTML5 semantic elements

### ATS Optimization

1. **Standard Section Names**: Use "Work Experience", "Education", "Skills"
2. **Text Over Graphics**: Don't use images for text
3. **Simple Formatting**: Avoid excessive colors or decorative elements
4. **Linear Layout**: Keep content in a logical top-to-bottom flow
5. **Standard Fonts**: Use common fonts that ATS can parse

## Testing Templates

### Manual Testing Checklist

- [ ] Renders correctly in Chrome, Firefox, Safari
- [ ] Displays properly on mobile devices
- [ ] Prints correctly (File > Print)
- [ ] PDF export maintains formatting
- [ ] All template variables are replaced
- [ ] Conditional sections show/hide correctly
- [ ] Array loops render all items
- [ ] No console errors
- [ ] Responsive at different screen sizes

### Test Data

Use the following test data to verify template rendering:

```javascript
{
  name: "Jane Smith",
  email: "jane.smith@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  summary: "Experienced software engineer with 5+ years of full-stack development experience...",
  skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker"],
  experience: [
    {
      position: "Senior Software Engineer",
      company: "Tech Corp",
      duration: "Jan 2021 - Present",
      description: "Led development of microservices architecture serving 1M+ users..."
    },
    {
      position: "Software Engineer",
      company: "StartupXYZ",
      duration: "Jun 2018 - Dec 2020",
      description: "Built RESTful APIs and responsive frontend applications..."
    }
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "University of California",
      year: "2018"
    }
  ]
}
```

## Troubleshooting

### Template Not Showing in Dropdown

1. Check that the template file exists in `/backend/src/templates/`
2. Verify the template is registered in `templates.js`
3. Restart the backend server
4. Check browser console for errors

### Styling Issues

1. Verify all CSS is inline in `<style>` tags
2. Check for typos in CSS properties
3. Test with different browsers
4. Use browser dev tools to inspect elements

### Variables Not Replacing

1. Check template syntax (double curly braces: `{{variable}}`)
2. Verify variable names match user data properties
3. Check for typos in variable names
4. Review conditionals and loops for proper syntax

## Template Attribution

All templates in HireMind are custom-designed for this project and released under the MIT License. They are inspired by best practices from:

- **JSON Resume** (MIT License): https://jsonresume.org/
- **Professional resume design principles**
- **ATS optimization guidelines**

You are free to:
- Use these templates in your projects
- Modify and customize them
- Create derivative works
- Use them commercially

Attribution is appreciated but not required.

## Contributing Templates

We welcome contributions of new templates! To contribute:

1. Fork the repository
2. Create your template following the guidelines above
3. Test thoroughly with various data
4. Submit a pull request with:
   - Template HTML file
   - Template registration in templates.js
   - Screenshots/examples
   - Description of design choices

## Support

For questions or issues with templates:
- Open an issue on GitHub
- Check existing documentation
- Review example templates for reference
