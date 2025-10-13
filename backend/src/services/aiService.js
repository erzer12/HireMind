import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { jsonrepair } from 'jsonrepair';
import { ApiError } from '../middleware/errorHandler.js';

// Helper to strip code block formatting from AI responses
function stripCodeBlock(s) {
  if (typeof s !== 'string') return s;
  // Remove triple backticks with optional language (e.g., ```json or ```)
  return s.trim().replace(/^```[a-z]*\n?/i, '').replace(/```$/, '').trim();
}

/**
 * Parse JSON response from AI with robust error handling
 * Logs raw response on error and attempts to repair malformed JSON
 * @param {string} response - The raw AI response text
 * @param {string} context - Context for logging (e.g., 'JD analysis', 'resume comparison')
 * @returns {Object} Parsed JSON object
 * @throws {ApiError} If JSON cannot be parsed even after repair attempts
 */
function parseAIJsonResponse(response, context = 'AI response') {
  // First, strip code blocks
  const cleaned = stripCodeBlock(response);
  
  try {
    // Try direct parsing first (most efficient for valid JSON)
    return JSON.parse(cleaned);
  } catch (firstError) {
    // Log the raw response for debugging
    console.error(`⚠️  JSON parsing failed for ${context}. Raw response:`, response);
    console.error(`First parse error: ${firstError.message}`);
    
    try {
      // Attempt to repair the JSON
      console.log(`🔧 Attempting to repair malformed JSON for ${context}...`);
      const repaired = jsonrepair(cleaned);
      const parsed = JSON.parse(repaired);
      console.log(`✅ Successfully repaired and parsed JSON for ${context}`);
      return parsed;
    } catch (repairError) {
      // Log repair failure with details
      console.error(`❌ JSON repair failed for ${context}:`, repairError.message);
      console.error('Cleaned response:', cleaned);
      throw new ApiError(500, `Failed to parse ${context}: Invalid JSON format from AI provider. Please try again.`);
    }
  }
}

// Initialize OpenAI client if API key is available
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Initialize Gemini client if API key is available
const gemini = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Configure provider priority (default: openai, gemini)
const providerPriority = process.env.AI_PROVIDER_PRIORITY
  ? process.env.AI_PROVIDER_PRIORITY.split(',').map(p => p.trim())
  : ['openai', 'gemini'];

// Check if any AI provider is configured
const hasAnyProvider = openai || gemini;

if (!hasAnyProvider) {
  console.warn('⚠️  No AI provider API keys configured. AI features will not work until you configure at least one AI provider (OPENAI_API_KEY or GEMINI_API_KEY).');
} else {
  const configuredProviders = [];
  if (openai) configuredProviders.push('OpenAI');
  if (gemini) configuredProviders.push('Gemini');
  console.log(`✅ AI providers configured: ${configuredProviders.join(', ')}`);
  console.log(`📋 Provider priority: ${providerPriority.join(' → ')}`);
}

/**
 * Generate text using OpenAI's GPT model
 * @param {string} prompt - The prompt to send to the AI
 * @param {string} systemMessage - System message for context
 * @returns {Promise<string>} Generated text
 */
async function generateTextWithOpenAI(prompt, systemMessage) {
  if (!openai) {
    throw new Error('OpenAI is not configured');
  }

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  return response.choices[0].message.content;
}

/**
 * Generate text using Google Gemini
 * @param {string} prompt - The prompt to send to the AI
 * @param {string} systemMessage - System message for context
 * @returns {Promise<string>} Generated text
 */
async function generateTextWithGemini(prompt, systemMessage) {
  if (!gemini) {
    throw new Error('Gemini is not configured');
  }

  const model = gemini.getGenerativeModel({ 
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    systemInstruction: systemMessage
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

/**
 * Determine if an error is retryable with a different provider
 * @param {Error} error - The error to check
 * @returns {boolean} True if the error suggests trying another provider
 */
function isRetryableError(error) {
  // OpenAI quota exceeded (429) or rate limit errors
  if (error.status === 429) return true;
  
  // OpenAI service unavailable errors
  if (error.status === 503 || error.status === 502) return true;
  
  // Gemini quota errors
  if (error.message && error.message.includes('quota')) return true;
  if (error.message && error.message.includes('RESOURCE_EXHAUSTED')) return true;
  
  // Network or timeout errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') return true;
  
  return false;
}

/**
 * Generate text using AI providers with automatic fallback
 * @param {string} prompt - The prompt to send to the AI
 * @param {string} systemMessage - System message for context
 * @returns {Promise<string>} Generated text
 */
export async function generateText(prompt, systemMessage = 'You are a helpful assistant specialized in professional career documents.') {
  if (!hasAnyProvider) {
    throw new ApiError(500, 'No AI provider is configured. Please set at least one API key (OPENAI_API_KEY or GEMINI_API_KEY).');
  }

  const errors = [];
  
  // Try each provider in order of priority
  for (const provider of providerPriority) {
    try {
      let result;
      
      switch (provider.toLowerCase()) {
        case 'openai':
          if (!openai) {
            console.log('⚠️  OpenAI not configured, skipping...');
            continue;
          }
          console.log('🤖 Attempting generation with OpenAI...');
          result = await generateTextWithOpenAI(prompt, systemMessage);
          console.log('✅ Successfully generated text with OpenAI');
          break;
          
        case 'gemini':
          if (!gemini) {
            console.log('⚠️  Gemini not configured, skipping...');
            continue;
          }
          console.log('🤖 Attempting generation with Gemini...');
          result = await generateTextWithGemini(prompt, systemMessage);
          console.log('✅ Successfully generated text with Gemini');
          break;
          
        default:
          console.warn(`⚠️  Unknown provider: ${provider}`);
          continue;
      }
      
      return result;
      
    } catch (error) {
      const errorMsg = `${provider} failed: ${error.message}`;
      console.error(`❌ ${errorMsg}`);
      errors.push({ provider, error: errorMsg, status: error.status });
      
      // If this is not a retryable error (e.g., auth error), don't try other providers
      if (!isRetryableError(error)) {
        // For auth errors, throw immediately
        if (error.status === 401) {
          throw new ApiError(401, `Invalid ${provider} API key`);
        }
        // For other non-retryable errors, continue to next provider
        console.log(`⚠️  Non-retryable error, trying next provider...`);
      } else {
        console.log(`⚠️  Retryable error (${error.status || error.code}), trying next provider...`);
      }
    }
  }
  
  // All providers failed
  const errorDetails = errors.map(e => `${e.provider}: ${e.error}`).join('; ');
  console.error('❌ All AI providers failed:', errorDetails);
  throw new ApiError(500, `All AI providers failed. ${errors.length > 0 ? 'Last error: ' + errors[errors.length - 1].error : 'No providers available.'}`);
}

/**
 * Generate a professional resume based on user information
 */
export async function generateResume(userInfo) {
  const profileLinks = [];
  if (userInfo.linkedin) profileLinks.push(`LinkedIn: ${userInfo.linkedin}`);
  if (userInfo.github) profileLinks.push(`GitHub: ${userInfo.github}`);
  if (userInfo.portfolio) profileLinks.push(`Portfolio: ${userInfo.portfolio}`);

  const prompt = `Create a professional resume based on the following information:

Name: ${userInfo.name}
Email: ${userInfo.email}
Phone: ${userInfo.phone || 'Not provided'}
Location: ${userInfo.location || 'Not provided'}
${profileLinks.length > 0 ? `\nProfile Links:\n${profileLinks.join('\n')}` : ''}

Professional Summary: ${userInfo.summary || 'Not provided'}

Skills: ${userInfo.skills?.join(', ') || 'Not provided'}

Work Experience:
${userInfo.experience?.map(exp => `
- Position: ${exp.position}
  Company: ${exp.company}
  Duration: ${exp.duration}
  Description: ${exp.description}
`).join('\n') || 'Not provided'}

Education:
${userInfo.education?.map(edu => `
- Degree: ${edu.degree}
  Institution: ${edu.institution}
  Year: ${edu.year}
`).join('\n') || 'Not provided'}

Generate a well-formatted, professional resume in markdown format. Include the profile links in the contact information section if provided.`;

  const systemMessage = 'You are an expert resume writer. Create professional, ATS-friendly resumes that highlight the candidate\'s strengths.';
  
  return await generateText(prompt, systemMessage);
}

/**
 * Generate a tailored cover letter
 */
export async function generateCoverLetter(userInfo, jobInfo) {
  const profileLinks = [];
  if (userInfo.linkedin) profileLinks.push(`LinkedIn: ${userInfo.linkedin}`);
  if (userInfo.github) profileLinks.push(`GitHub: ${userInfo.github}`);
  if (userInfo.portfolio) profileLinks.push(`Portfolio: ${userInfo.portfolio}`);

  const prompt = `Create a professional cover letter for the following:

Applicant Information:
Name: ${userInfo.name}
Email: ${userInfo.email}
${profileLinks.length > 0 ? `Profile Links: ${profileLinks.join(', ')}` : ''}

Target Position: ${jobInfo.position || 'Not specified'}
Company: ${jobInfo.company || 'Not specified'}
Job Description: ${jobInfo.description || 'Not provided'}

Applicant's Background:
${userInfo.summary || 'Not provided'}

Key Skills: ${userInfo.skills?.join(', ') || 'Not provided'}

Generate a compelling cover letter that highlights relevant experience and shows enthusiasm for the position. Include the profile links in the header if provided.`;

  const systemMessage = 'You are an expert cover letter writer. Create personalized, engaging cover letters that connect the candidate\'s experience to the job requirements.';
  
  return await generateText(prompt, systemMessage);
}

/**
 * Generate portfolio webpage content
 */
export async function generatePortfolio(userInfo) {
  const profileLinks = [];
  if (userInfo.linkedin) profileLinks.push(`LinkedIn: ${userInfo.linkedin}`);
  if (userInfo.github) profileLinks.push(`GitHub: ${userInfo.github}`);
  if (userInfo.portfolio) profileLinks.push(`Personal Website: ${userInfo.portfolio}`);

  const prompt = `Create HTML content for a professional portfolio webpage based on:

Name: ${userInfo.name}
Title: ${userInfo.title || 'Professional'}
Bio: ${userInfo.bio || userInfo.summary || 'Not provided'}

Skills: ${userInfo.skills?.join(', ') || 'Not provided'}

${profileLinks.length > 0 ? `Profile Links:\n${profileLinks.join('\n')}\n` : ''}

Projects:
${userInfo.projects?.map(proj => `
- Name: ${proj.name}
  Description: ${proj.description}
  Technologies: ${proj.technologies || 'Not specified'}
  Link: ${proj.link || 'Not provided'}
`).join('\n') || 'Not provided'}

Generate a modern, professional HTML portfolio page with inline CSS styling. Include sections for About, Skills, and Projects. If profile links are provided, include them as clickable icons or buttons in the contact section.`;

  const systemMessage = 'You are a web designer specialized in creating professional portfolio webpages. Generate clean, modern HTML with inline CSS.';
  
  return await generateText(prompt, systemMessage);
}

/**
 * Analyze job description and extract key information
 * @param {string} jobDescription - The job description text
 * @returns {Promise<Object>} Analyzed job information
 */
export async function analyzeJobDescription(jobDescription) {
  const prompt = `Analyze the following job description and extract key information in JSON format:

Job Description:
${jobDescription}

Please provide a JSON response with the following structure:
{
  "requiredSkills": ["skill1", "skill2", ...],
  "preferredSkills": ["skill1", "skill2", ...],
  "keywords": ["keyword1", "keyword2", ...],
  "experienceLevel": "entry/mid/senior",
  "responsibilities": ["responsibility1", "responsibility2", ...],
  "qualifications": ["qualification1", "qualification2", ...]
}

IMPORTANT: Return ONLY valid, minified JSON. No code blocks, no comments, no trailing commas, no additional text.
Focus on technical skills, tools, and relevant keywords that should appear in a resume.`;

  const systemMessage = 'You are an expert at analyzing job descriptions and extracting key requirements. Always respond with valid, minified JSON only, no additional text or code blocks.';
  
  const response = await generateText(prompt, systemMessage);
  
  return parseAIJsonResponse(response, 'job description analysis');
}

/**
 * Compare resume with job description and provide suggestions
 * @param {Object} resumeData - Current resume data
 * @param {string} jobDescription - Job description text
 * @returns {Promise<Object>} Suggestions for improvement
 */
export async function compareResumeWithJD(resumeData, jobDescription) {
  const prompt = `Compare the following resume with the job description and provide improvement suggestions:

Resume:
Name: ${resumeData.name}
Skills: ${resumeData.skills?.join(', ') || 'None listed'}
Experience: ${resumeData.experience?.map(e => `${e.position} at ${e.company}`).join(', ') || 'None listed'}
Summary: ${resumeData.summary || 'No summary'}

Job Description:
${jobDescription}

Provide a JSON response with:
{
  "matchScore": <number 0-100>,
  "missingSkills": ["skill1", "skill2", ...],
  "suggestedSkills": ["skill1", "skill2", ...],
  "summaryImprovements": "Suggested improvements for professional summary",
  "experienceImprovements": ["suggestion1", "suggestion2", ...],
  "keywordsToAdd": ["keyword1", "keyword2", ...],
  "strengths": ["strength1", "strength2", ...],
  "overallFeedback": "Brief overall assessment"
}

IMPORTANT: Return ONLY valid, minified JSON. No code blocks, no comments, no trailing commas, no additional text.`;

  const systemMessage = 'You are an expert resume coach and ATS optimization specialist. Provide actionable, specific suggestions. Always respond with valid, minified JSON only, no code blocks or additional text.';
  
  const response = await generateText(prompt, systemMessage);
  
  return parseAIJsonResponse(response, 'resume comparison');
}

/**
 * Generate tailored resume content based on job description
 * @param {Object} userInfo - User's resume information
 * @param {string} jobDescription - Job description to tailor for
 * @returns {Promise<string>} Tailored resume suggestions
 */
export async function generateTailoredResume(userInfo, jobDescription) {
  const prompt = `Create an optimized resume tailored for the following job description:

Job Description:
${jobDescription}

User's Information:
Name: ${userInfo.name}
Email: ${userInfo.email}
Phone: ${userInfo.phone || 'Not provided'}
Location: ${userInfo.location || 'Not provided'}
Summary: ${userInfo.summary || 'Not provided'}
Skills: ${userInfo.skills?.join(', ') || 'Not provided'}
Experience: ${userInfo.experience?.map(exp => `${exp.position} at ${exp.company} (${exp.duration}): ${exp.description}`).join('\n') || 'Not provided'}
Education: ${userInfo.education?.map(edu => `${edu.degree} from ${edu.institution} (${edu.year})`).join('\n') || 'Not provided'}

Tailor the resume to highlight relevant skills and experience that match the job description. 
Include keywords from the JD naturally throughout the resume.
Provide the complete resume content in markdown format.`;

  const systemMessage = 'You are an expert resume writer specializing in ATS optimization and job-specific tailoring. Create compelling, keyword-rich resumes.';
  
  return await generateText(prompt, systemMessage);
}

/**
 * Parse extracted resume text into structured data
 * @param {string} resumeText - Raw text extracted from resume file
 * @returns {Promise<Object>} Structured resume data
 */
export async function parseResumeText(resumeText) {
  const prompt = `Parse the following resume text and extract structured information in JSON format:

Resume Text:
${resumeText}

Please provide a JSON response with the following structure:
{
  "name": "Full name of the candidate",
  "email": "Email address",
  "phone": "Phone number",
  "location": "Location/address",
  "summary": "Professional summary or objective",
  "skills": ["skill1", "skill2", ...],
  "experience": [
    {
      "position": "Job title",
      "company": "Company name",
      "duration": "Time period (e.g., Jan 2020 - Present)",
      "description": "Job description and achievements"
    }
  ],
  "education": [
    {
      "degree": "Degree name",
      "institution": "School/University name",
      "year": "Graduation year or period"
    }
  ]
}

IMPORTANT: 
- Return ONLY valid, minified JSON. No code blocks, no comments, no trailing commas, no additional text.
- Extract all information available in the resume text.
- If a field is not found, use an empty string for strings or empty array for arrays.
- For skills, extract all technical and professional skills mentioned.
- For experience, include all work history with as much detail as available.`;

  const systemMessage = 'You are an expert at parsing and extracting structured data from resume documents. Always respond with valid, minified JSON only, no additional text or code blocks.';
  
  const response = await generateText(prompt, systemMessage);
  
  return parseAIJsonResponse(response, 'resume parsing');
}