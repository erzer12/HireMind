const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * API client for HireMind backend
 */

export const api = {
  /**
   * Get available resume templates
   */
  async getResumeTemplates() {
    const response = await fetch(`${API_BASE_URL}/resume/templates`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch templates');
    }
    
    return response.json();
  },

  /**
   * Generate a resume
   */
  async generateResume(userInfo, template = 'modern') {
    const response = await fetch(`${API_BASE_URL}/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...userInfo, template }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate resume');
    }

    return response.json();
  },

  /**
   * Generate a cover letter
   */
  async generateCoverLetter(userInfo, jobInfo) {
    const response = await fetch(`${API_BASE_URL}/cover-letter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInfo, jobInfo }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate cover letter');
    }

    return response.json();
  },

  /**
   * Generate a portfolio webpage
   */
  async generatePortfolio(userInfo) {
    const response = await fetch(`${API_BASE_URL}/portfolio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate portfolio');
    }

    return response.json();
  },

  /**
   * Health check
   */
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },
};
