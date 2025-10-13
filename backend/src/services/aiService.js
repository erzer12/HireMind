import OpenAI from 'openai';
import { ApiError } from '../middleware/errorHandler.js';

// Initialize OpenAI client if API key is available
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

if (!openai) {
  console.warn('⚠️  OPENAI_API_KEY environment variable not set. AI features will not work until you configure your OpenAI API key.');
}

/**
 * Generate text using OpenAI's GPT model
 * @param {string} prompt - The prompt to send to the AI
 * @param {string} systemMessage - System message for context
 * @returns {Promise<string>} Generated text
 */
export async function generateText(prompt, systemMessage = 'You are a helpful assistant specialized in professional career documents.') {
  try {
    if (!openai) {
      throw new ApiError(500, 'OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.');
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
  } catch (error) {
    console.error('OpenAI API Error:', error);
    if (error.status === 401) {
      throw new ApiError(401, 'Invalid OpenAI API key');
    }
    throw new ApiError(500, `AI generation failed: ${error.message}`);
  }
}

/**
 * Generate a professional resume based on user information
 */
export async function generateResume(userInfo) {
  const prompt = `Create a professional resume based on the following information:

Name: ${userInfo.name}
Email: ${userInfo.email}
Phone: ${userInfo.phone || 'Not provided'}
Location: ${userInfo.location || 'Not provided'}

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

Generate a well-formatted, professional resume in markdown format.`;

  const systemMessage = 'You are an expert resume writer. Create professional, ATS-friendly resumes that highlight the candidate\'s strengths.';
  
  return await generateText(prompt, systemMessage);
}

/**
 * Generate a tailored cover letter
 */
export async function generateCoverLetter(userInfo, jobInfo) {
  const prompt = `Create a professional cover letter for the following:

Applicant Information:
Name: ${userInfo.name}
Email: ${userInfo.email}

Target Position: ${jobInfo.position || 'Not specified'}
Company: ${jobInfo.company || 'Not specified'}
Job Description: ${jobInfo.description || 'Not provided'}

Applicant's Background:
${userInfo.summary || 'Not provided'}

Key Skills: ${userInfo.skills?.join(', ') || 'Not provided'}

Generate a compelling cover letter that highlights relevant experience and shows enthusiasm for the position.`;

  const systemMessage = 'You are an expert cover letter writer. Create personalized, engaging cover letters that connect the candidate\'s experience to the job requirements.';
  
  return await generateText(prompt, systemMessage);
}

/**
 * Generate portfolio webpage content
 */
export async function generatePortfolio(userInfo) {
  const prompt = `Create HTML content for a professional portfolio webpage based on:

Name: ${userInfo.name}
Title: ${userInfo.title || 'Professional'}
Bio: ${userInfo.bio || userInfo.summary || 'Not provided'}

Skills: ${userInfo.skills?.join(', ') || 'Not provided'}

Projects:
${userInfo.projects?.map(proj => `
- Name: ${proj.name}
  Description: ${proj.description}
  Technologies: ${proj.technologies || 'Not specified'}
  Link: ${proj.link || 'Not provided'}
`).join('\n') || 'Not provided'}

Generate a modern, professional HTML portfolio page with inline CSS styling. Include sections for About, Skills, and Projects.`;

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

Focus on technical skills, tools, and relevant keywords that should appear in a resume.`;

  const systemMessage = 'You are an expert at analyzing job descriptions and extracting key requirements. Always respond with valid JSON only, no additional text.';
  
  const response = await generateText(prompt, systemMessage);
  
  try {
    return JSON.parse(response);
  } catch (error) {
    console.error('Failed to parse JD analysis response:', error);
    throw new ApiError(500, 'Failed to parse job description analysis');
  }
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
}`;

  const systemMessage = 'You are an expert resume coach and ATS optimization specialist. Provide actionable, specific suggestions. Always respond with valid JSON only.';
  
  const response = await generateText(prompt, systemMessage);
  
  try {
    return JSON.parse(response);
  } catch (error) {
    console.error('Failed to parse resume comparison response:', error);
    throw new ApiError(500, 'Failed to analyze resume comparison');
  }
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
