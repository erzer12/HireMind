import express from 'express';
import { createResume, getTemplates } from '../controllers/resumeController.js';

const router = express.Router();

/**
 * GET /api/resume/templates
 * Get available resume templates
 */
router.get('/templates', getTemplates);

/**
 * POST /api/resume
 * Generate a resume based on user information
 */
router.post('/', createResume);

export default router;
