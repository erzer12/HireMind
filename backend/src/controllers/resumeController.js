import { generateResume, analyzeJobDescription, compareResumeWithJD, generateTailoredResume } from '../services/aiService.js';
import { renderResume, getAvailableTemplates } from '../services/templateService.js';
import { parseFile } from '../services/fileParserService.js';
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

/**
 * Parse uploaded resume file
 */
export const parseResume = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, 'No file uploaded');
    }

    const extractedText = await parseFile(req.file);

    res.json({
      success: true,
      data: {
        text: extractedText,
        filename: req.file.originalname,
        extractedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Analyze job description and extract key information
 */
export const analyzeJD = async (req, res, next) => {
  try {
    let jobDescription = req.body.jobDescription;

    // If file uploaded, parse it
    if (req.file) {
      jobDescription = await parseFile(req.file);
    }

    if (!jobDescription) {
      throw new ApiError(400, 'Job description is required (either as text or file upload)');
    }

    const analysis = await analyzeJobDescription(jobDescription);

    res.json({
      success: true,
      data: {
        analysis,
        originalText: jobDescription,
        analyzedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Compare resume with job description
 */
export const compareWithJD = async (req, res, next) => {
  try {
    const { resumeData, jobDescription } = req.body;

    if (!resumeData) {
      throw new ApiError(400, 'Resume data is required');
    }

    if (!jobDescription) {
      throw new ApiError(400, 'Job description is required');
    }

    const suggestions = await compareResumeWithJD(resumeData, jobDescription);

    res.json({
      success: true,
      data: {
        suggestions,
        comparedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate tailored resume based on job description
 */
export const createTailoredResume = async (req, res, next) => {
  try {
    const { template, jobDescription, ...userInfo } = req.body;

    // Validate required fields
    if (!userInfo.name || !userInfo.email) {
      throw new ApiError(400, 'Name and email are required fields');
    }

    if (!jobDescription) {
      throw new ApiError(400, 'Job description is required for tailored resume');
    }

    // Generate tailored resume content
    let resume, format;
    if (template && template !== 'ai') {
      // For template-based resumes, first get AI suggestions and merge with user data
      const tailoredContent = await generateTailoredResume(userInfo, jobDescription);
      
      // Render with template
      const result = await renderResume(userInfo, template);
      resume = result.html;
      format = 'html';
      
      // Also include the tailored suggestions
      res.json({
        success: true,
        data: {
          resume,
          format,
          tailoredSuggestions: tailoredContent,
          generatedAt: new Date().toISOString()
        }
      });
    } else {
      resume = await generateTailoredResume(userInfo, jobDescription);
      format = 'markdown';
      
      res.json({
        success: true,
        data: {
          resume,
          format,
          generatedAt: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    next(error);
  }
};
