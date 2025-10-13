import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { TEMPLATES, DEFAULT_TEMPLATE } from '../templates/templates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES_DIR = path.join(__dirname, '../templates');

/**
 * Simple template rendering using regex replacement
 * Supports {{variable}}, {{#if variable}}, {{#each array}}
 */
function renderTemplate(template, data) {
  let result = template;
  
  // Handle arrays first: {{#each array}}...{{/each}}
  result = result.replace(/\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, key, itemTemplate) => {
    const array = data[key.trim()];
    if (!Array.isArray(array) || array.length === 0) return '';
    
    return array.map(item => {
      let itemResult = itemTemplate;
      
      // Replace {{this}} for simple values (e.g., skills array)
      if (typeof item !== 'object' || item === null || Array.isArray(item)) {
        itemResult = itemResult.replace(/\{\{this\}\}/g, String(item));
        return itemResult;
      }
      
      // Handle nested conditionals in each loop first
      itemResult = itemResult.replace(/\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (m, prop, content) => {
        const value = item[prop.trim()];
        return value ? content : '';
      });
      
      // Replace {{property}} for object properties
      itemResult = itemResult.replace(/\{\{([^#\/\s}]+)\}\}/g, (m, prop) => {
        const value = item[prop.trim()];
        return value !== undefined && value !== null ? String(value) : '';
      });
      
      return itemResult;
    }).join('');
  });
  
  // Handle conditionals: {{#if variable}}...{{/if}}
  result = result.replace(/\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, key, content) => {
    const value = data[key.trim()];
    return value && (Array.isArray(value) ? value.length > 0 : true) ? content : '';
  });
  
  // Handle simple variables: {{variable}} (last to avoid conflicts)
  result = result.replace(/\{\{([^#\/\s}]+)\}\}/g, (match, key) => {
    const value = data[key.trim()];
    return value !== undefined && value !== null ? String(value) : '';
  });
  
  return result;
}

/**
 * Get list of available templates
 */
export function getAvailableTemplates() {
  return Object.values(TEMPLATES).map(template => ({
    id: template.id,
    name: template.name,
    description: template.description,
    preview: template.preview,
    atsScore: template.atsScore,
    recommended: template.recommended,
  }));
}

/**
 * Render resume with selected template
 */
export async function renderResume(userData, templateId = DEFAULT_TEMPLATE) {
  // Validate template
  if (!TEMPLATES[templateId]) {
    throw new Error(`Template "${templateId}" not found. Available templates: ${Object.keys(TEMPLATES).join(', ')}`);
  }
  
  // Load template file
  const templatePath = path.join(TEMPLATES_DIR, `${templateId}.html`);
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  
  // Render template with user data
  const renderedHtml = renderTemplate(templateContent, userData);
  
  return {
    html: renderedHtml,
    template: TEMPLATES[templateId],
  };
}

/**
 * Get template metadata
 */
export function getTemplateMetadata(templateId) {
  return TEMPLATES[templateId] || null;
}
