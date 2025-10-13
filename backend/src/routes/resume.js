import express from 'express';
import multer from 'multer';
import { createResume, getTemplates, parseResume, analyzeJD, compareWithJD, createTailoredResume, getSessionResume, clearSessionResume } from '../controllers/resumeController.js';

const router = express.Router();

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and TXT files are allowed.'));
    }
  }
});

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

/**
 * POST /api/resume/tailored
 * Generate a tailored resume based on job description
 */
router.post('/tailored', createTailoredResume);

/**
 * POST /api/resume/parse
 * Parse uploaded resume file (PDF, DOCX, or TXT)
 */
router.post('/parse', upload.single('file'), parseResume);

/**
 * POST /api/resume/analyze-jd
 * Analyze job description and extract key information
 * Accepts either jobDescription in body or file upload
 */
router.post('/analyze-jd', upload.single('file'), analyzeJD);

/**
 * POST /api/resume/compare
 * Compare resume data with job description
 */
router.post('/compare', compareWithJD);

/**
 * GET /api/resume/session
 * Get uploaded resume data from session
 */
router.get('/session', getSessionResume);

/**
 * DELETE /api/resume/session
 * Clear uploaded resume data from session
 */
router.delete('/session', clearSessionResume);

export default router;
