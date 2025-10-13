import { generatePortfolio } from '../services/aiService.js';
import { ApiError } from '../middleware/errorHandler.js';

/**
 * Controller for generating a portfolio webpage
 */
export const createPortfolio = async (req, res, next) => {
  try {
    const userInfo = req.body;

    // Validate required fields
    if (!userInfo.name) {
      throw new ApiError(400, 'Name is required');
    }

    const portfolio = await generatePortfolio(userInfo);

    res.json({
      success: true,
      data: {
        portfolio,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};
