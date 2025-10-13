import { generateCoverLetter } from '../services/aiService.js';
import { ApiError } from '../middleware/errorHandler.js';

/**
 * Controller for generating a cover letter
 */
export const createCoverLetter = async (req, res, next) => {
  try {
    const { userInfo, jobInfo } = req.body;

    // Validate required fields
    if (!userInfo?.name || !userInfo?.email) {
      throw new ApiError(400, 'User name and email are required');
    }
    if (!jobInfo?.position || !jobInfo?.company) {
      throw new ApiError(400, 'Job position and company are required');
    }

    const coverLetter = await generateCoverLetter(userInfo, jobInfo);

    res.json({
      success: true,
      data: {
        coverLetter,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};
