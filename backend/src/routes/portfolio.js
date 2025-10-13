import express from 'express';
import { createPortfolio } from '../controllers/portfolioController.js';

const router = express.Router();

/**
 * POST /api/portfolio
 * Generate a portfolio webpage based on user information
 */
router.post('/', createPortfolio);

export default router;
