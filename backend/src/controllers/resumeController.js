import { generateResume } from '../services/aiService.js';
import { renderResume, getAvailableTemplates } from '../services/templateService.js';
import { ApiError } from '../middleware/errorHandler.js';

/**
 * Controller for generating a resume
 */
export const createResume = async (req, res, next) => {
  try {
    const { template, ...userInfo } = req.body;

    // Validate required fields
    if (!userInfo.name || !userInfo.email) {
      throw new ApiError(400, 'Name and email are required fields');
    }

    // Generate resume using template if specified, otherwise use AI
    let resume, format;
    if (template && template !== 'ai') {
      const result = await renderResume(userInfo, template);
      resume = result.html;
      format = 'html';
    } else {
      resume = await generateResume(userInfo);
      format = 'markdown';
    }

    res.json({
      success: true,
      data: {
        resume,
        format,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get available resume templates
 */
export const getTemplates = async (req, res, next) => {
  try {
    const templates = getAvailableTemplates();
    
    res.json({
      success: true,
      data: {
        templates
      }
    });
  } catch (error) {
    next(error);
  }
};
