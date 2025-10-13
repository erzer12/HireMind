import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { ApiError } from '../middleware/errorHandler.js';

/**
 * Parse PDF file and extract text content
 * @param {Buffer} fileBuffer - PDF file buffer
 * @returns {Promise<string>} Extracted text
 */
export async function parsePDF(fileBuffer) {
  try {
    const data = await pdf(fileBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new ApiError(400, `Failed to parse PDF file: ${error.message}`);
  }
}

/**
 * Parse DOCX file and extract text content
 * @param {Buffer} fileBuffer - DOCX file buffer
 * @returns {Promise<string>} Extracted text
 */
export async function parseDOCX(fileBuffer) {
  try {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new ApiError(400, `Failed to parse DOCX file: ${error.message}`);
  }
}

/**
 * Parse uploaded file based on its type
 * @param {Object} file - Multer file object
 * @returns {Promise<string>} Extracted text
 */
export async function parseFile(file) {
  if (!file) {
    throw new ApiError(400, 'No file provided');
  }

  const mimeType = file.mimetype.toLowerCase();
  
  if (mimeType === 'application/pdf') {
    return await parsePDF(file.buffer);
  } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return await parseDOCX(file.buffer);
  } else if (mimeType === 'text/plain') {
    return file.buffer.toString('utf-8');
  } else {
    throw new ApiError(400, `Unsupported file type: ${mimeType}. Please upload PDF, DOCX, or TXT files.`);
  }
}
