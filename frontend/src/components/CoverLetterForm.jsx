import { useState } from 'react';
import './CoverLetterForm.css';

function CoverLetterForm({ onGenerate, loading }) {
  const [formData, setFormData] = useState({
    userInfo: {
      name: '',
      email: '',
      summary: '',
      skills: '',
    },
    jobInfo: {
      position: '',
      company: '',
      description: '',
    },
  });

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
