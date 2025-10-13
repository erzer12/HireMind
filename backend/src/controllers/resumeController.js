import { generateResume } from '../services/aiService.js';
import { ApiError } from '../middleware/errorHandler.js';

/**
 * Controller for generating a resume
 */
export const createResume = async (req, res, next) => {
  try {
    const userInfo = req.body;

    // Validate required fields
    if (!userInfo.name || !userInfo.email) {
      throw new ApiError(400, 'Name and email are required fields');
    }

    const resume = await generateResume(userInfo);

    res.json({
      success: true,
      data: {
        resume,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};
