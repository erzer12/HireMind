import { generateResume, analyzeJobDescription, compareResumeWithJD, generateTailoredResume, parseResumeText } from '../services/aiService.js';
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

    if (!extractedText || extractedText.trim().length === 0) {
      throw new ApiError(400, 'Failed to extract text from resume. The file may be empty or corrupted.');
    }

    // Parse the extracted text into structured data using AI
    console.log('📄 Parsing resume text into structured data...');
    const structuredData = await parseResumeText(extractedText);

    // Validate that we got meaningful data
    if (!structuredData.name && !structuredData.email && 
        (!structuredData.skills || structuredData.skills.length === 0) &&
        (!structuredData.experience || structuredData.experience.length === 0)) {
      console.warn('⚠️  Resume parsing returned minimal data');
      throw new ApiError(400, 'Could not extract meaningful information from the resume. Please ensure the file contains valid resume content.');
    }

    // Store structured data in session for later use
    req.session.resumeData = {
      ...structuredData,
      filename: req.file.originalname,
      uploadedAt: new Date().toISOString(),
      rawText: extractedText
    };

    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('✅ Resume parsed and stored in session');

    res.json({
      success: true,
      data: {
        ...structuredData,
        filename: req.file.originalname,
        extractedAt: new Date().toISOString(),
        message: 'Resume uploaded and parsed successfully! Data is ready for comparison.'
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
    let { resumeData, jobDescription } = req.body;

    // If resumeData not provided in body, try to use session data
    if (!resumeData && req.session.resumeData) {
      console.log('📋 Using uploaded resume data from session');
      resumeData = req.session.resumeData;
    }

    if (!resumeData) {
      throw new ApiError(400, 'Resume data is required. Please upload a resume or fill in the form fields.');
    }

    if (!jobDescription) {
      throw new ApiError(400, 'Job description is required');
    }

    const suggestions = await compareResumeWithJD(resumeData, jobDescription);

    res.json({
      success: true,
      data: {
        suggestions,
        comparedAt: new Date().toISOString(),
        usedUploadedResume: !!req.session.resumeData && !req.body.resumeData
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

/**
 * Get uploaded resume data from session
 */
export const getSessionResume = async (req, res, next) => {
  try {
    if (!req.session.resumeData) {
      res.json({
        success: true,
        data: {
          hasResume: false,
          message: 'No resume data in session'
        }
      });
      return;
    }

    const { rawText, ...resumeData } = req.session.resumeData;
    
    res.json({
      success: true,
      data: {
        hasResume: true,
        resumeData
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear uploaded resume data from session
 */
export const clearSessionResume = async (req, res, next) => {
  try {
    if (req.session.resumeData) {
      delete req.session.resumeData;
      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      console.log('🗑️  Session resume data cleared');
    }

    res.json({
      success: true,
      data: {
        message: 'Session resume data cleared successfully'
      }
    });
  } catch (error) {
    next(error);
  }
};
