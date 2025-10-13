import { useState, useEffect } from 'react';
import './CoverLetterForm.css';
import { api } from '../services/api.js';

function CoverLetterForm({ onGenerate, loading }) {
  const [formData, setFormData] = useState({
    userInfo: {
      name: '',
      email: '',
      summary: '',
      skills: '',
      linkedin: '',
      github: '',
      portfolio: '',
    },
    jobInfo: {
      position: '',
      company: '',
      description: '',
    },
  });

  const [parsedResumeData, setParsedResumeData] = useState(null);

  useEffect(() => {
    // Check if there's an uploaded resume in session
    api.getSessionResume()
      .then(response => {
        if (response.success && response.data.hasResume) {
          setParsedResumeData(response.data.resumeData);
        }
      })
      .catch(err => {
        console.error('Failed to check session resume:', err);
      });
  }, []);

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      userInfo: { ...formData.userInfo, [name]: value },
    });
  };

  const handleJobInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      jobInfo: { ...formData.jobInfo, [name]: value },
    });
  };

  const handleAutofillFromResume = () => {
    if (parsedResumeData) {
      setFormData({
        ...formData,
        userInfo: {
          ...formData.userInfo,
          name: parsedResumeData.name || formData.userInfo.name,
          email: parsedResumeData.email || formData.userInfo.email,
          summary: parsedResumeData.summary || formData.userInfo.summary,
          skills: parsedResumeData.skills ? parsedResumeData.skills.join(', ') : formData.userInfo.skills,
        }
      });
      alert('✅ Form populated with resume data!');
    } else {
      alert('No resume data available. Please upload a resume in the Resume section first.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      userInfo: {
        ...formData.userInfo,
        skills: formData.userInfo.skills.split(',').map(s => s.trim()).filter(s => s),
      },
      jobInfo: formData.jobInfo,
    };
    onGenerate(dataToSend.userInfo, dataToSend.jobInfo);
  };

  return (
    <form className="cover-letter-form" onSubmit={handleSubmit}>
      <h2>Your Information</h2>
      {parsedResumeData && (
        <div className="autofill-section">
          <button
            type="button"
            onClick={handleAutofillFromResume}
            className="autofill-button"
          >
            ⚡ Autofill from Uploaded Resume
          </button>
        </div>
      )}
      <div className="form-group">
        <label>Name *</label>
        <input
          type="text"
          name="name"
          value={formData.userInfo.name}
          onChange={handleUserInfoChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Email *</label>
        <input
          type="email"
          name="email"
          value={formData.userInfo.email}
          onChange={handleUserInfoChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Background Summary</label>
        <textarea
          name="summary"
          value={formData.userInfo.summary}
          onChange={handleUserInfoChange}
          rows="4"
          placeholder="Brief summary of your professional background..."
        />
      </div>

      <div className="form-group">
        <label>Key Skills (comma-separated)</label>
        <input
          type="text"
          name="skills"
          value={formData.userInfo.skills}
          onChange={handleUserInfoChange}
          placeholder="JavaScript, React, Node.js, etc."
        />
      </div>

      <h2>Profile Links</h2>
      <div className="form-group">
        <label>LinkedIn Profile</label>
        <input
          type="url"
          name="linkedin"
          value={formData.userInfo.linkedin}
          onChange={handleUserInfoChange}
          placeholder="https://linkedin.com/in/yourprofile"
        />
      </div>

      <div className="form-group">
        <label>GitHub Profile</label>
        <input
          type="url"
          name="github"
          value={formData.userInfo.github}
          onChange={handleUserInfoChange}
          placeholder="https://github.com/yourusername"
        />
      </div>

      <div className="form-group">
        <label>Portfolio Website</label>
        <input
          type="url"
          name="portfolio"
          value={formData.userInfo.portfolio}
          onChange={handleUserInfoChange}
          placeholder="https://yourportfolio.com"
        />
      </div>

      <h2>Job Information</h2>
      <div className="form-group">
        <label>Position *</label>
        <input
          type="text"
          name="position"
          value={formData.jobInfo.position}
          onChange={handleJobInfoChange}
          required
          placeholder="e.g., Senior Software Engineer"
        />
      </div>

      <div className="form-group">
        <label>Company *</label>
        <input
          type="text"
          name="company"
          value={formData.jobInfo.company}
          onChange={handleJobInfoChange}
          required
          placeholder="e.g., Tech Corp"
        />
      </div>

      <div className="form-group">
        <label>Job Description</label>
        <textarea
          name="description"
          value={formData.jobInfo.description}
          onChange={handleJobInfoChange}
          rows="6"
          placeholder="Paste the job description here..."
        />
      </div>

      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? 'Generating...' : 'Generate Cover Letter'}
      </button>
    </form>
  );
}

export default CoverLetterForm;
