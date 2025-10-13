import express from 'express';
import { createResume } from '../controllers/resumeController.js';

const router = express.Router();

/**
 * POST /api/resume
 * Generate a resume based on user information
 */
router.post('/', createResume);

export default router;
