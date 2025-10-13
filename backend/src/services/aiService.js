import OpenAI from 'openai';
import { ApiError } from '../middleware/errorHandler.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate text using OpenAI's GPT model
 * @param {string} prompt - The prompt to send to the AI
 * @param {string} systemMessage - System message for context
 * @returns {Promise<string>} Generated text
 */
export async function generateText(prompt, systemMessage = 'You are a helpful assistant specialized in professional career documents.') {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new ApiError(500, 'OpenAI API key is not configured');
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
