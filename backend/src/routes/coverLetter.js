import express from 'express';
import { createCoverLetter } from '../controllers/coverLetterController.js';

const router = express.Router();

/**
 * POST /api/cover-letter
 * Generate a cover letter based on user and job information
 */
router.post('/', createCoverLetter);

export default router;
