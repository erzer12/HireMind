const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * API client for HireMind backend
 */

/**
 * Helper function to handle fetch errors with better error messages
 */
const handleFetchError = (error) => {
  if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
    throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please ensure the backend is running.`);
  }
  throw error;
};

export const api = {
  /**
   * Get available resume templates
   */
  async getResumeTemplates() {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/templates`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch templates');
      }
      
      return response.json();
    } catch (error) {
      handleFetchError(error);
    }
  },

  /**
   * Generate a resume
   */
  async generateResume(userInfo, template = 'modern') {
    try {
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
    } catch (error) {
      handleFetchError(error);
    }
  },

  /**
   * Generate a cover letter
   */
  async generateCoverLetter(userInfo, jobInfo) {
    try {
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
    } catch (error) {
      handleFetchError(error);
    }
  },

  /**
   * Generate a portfolio webpage
   */
  async generatePortfolio(userInfo) {
    try {
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
    } catch (error) {
      handleFetchError(error);
    }
  },

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Health check failed');
      }
      
      return response.json();
    } catch (error) {
      handleFetchError(error);
    }
  },
};
