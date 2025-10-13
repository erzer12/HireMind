const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * API client for HireMind backend
 */

/**
 * Helper function to handle fetch errors with better error messages
 * @param {Error} error - The error to handle
 * @throws {Error} Always throws either a new error or re-throws the original
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

  /**
   * Parse uploaded resume file
   */
  async parseResume(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/resume/parse`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to parse resume');
      }

      return response.json();
    } catch (error) {
      handleFetchError(error);
    }
  },

  /**
   * Analyze job description
   */
  async analyzeJobDescription(jobDescription, file = null) {
    try {
      let response;

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        
        response = await fetch(`${API_BASE_URL}/resume/analyze-jd`, {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch(`${API_BASE_URL}/resume/analyze-jd`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jobDescription }),
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to analyze job description');
      }

      return response.json();
    } catch (error) {
      handleFetchError(error);
    }
  },

  /**
   * Compare resume with job description
   */
  async compareResumeWithJD(resumeData, jobDescription) {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/compare`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeData, jobDescription }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to compare resume');
      }

      return response.json();
    } catch (error) {
      handleFetchError(error);
    }
  },

  /**
   * Get session resume data
   */
  async getSessionResume() {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/session`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get session resume');
      }

      return response.json();
    } catch (error) {
      handleFetchError(error);
    }
  },

  /**
   * Clear session resume data
   */
  async clearSessionResume() {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/session`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to clear session resume');
      }

      return response.json();
    } catch (error) {
      handleFetchError(error);
    }
  },

  /**
   * Generate tailored resume based on job description
   */
  async generateTailoredResume(userInfo, jobDescription, template = 'modern') {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/tailored`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...userInfo, jobDescription, template }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate tailored resume');
      }

      return response.json();
    } catch (error) {
      handleFetchError(error);
    }
  },
};
