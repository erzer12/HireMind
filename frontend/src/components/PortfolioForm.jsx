import { useState, useEffect } from 'react';
import './PortfolioForm.css';
import { api } from '../services/api.js';

function PortfolioForm({ onGenerate, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    skills: '',
    linkedin: '',
    github: '',
    portfolio: '',
    projects: [{ name: '', description: '', technologies: '', link: '' }],
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...formData.projects];
    newProjects[index][field] = value;
    setFormData({ ...formData, projects: newProjects });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: '', description: '', technologies: '', link: '' }],
    });
  };

  const handleAutofillFromResume = () => {
    if (parsedResumeData) {
      setFormData({
        ...formData,
        name: parsedResumeData.name || formData.name,
        bio: parsedResumeData.summary || formData.bio,
        skills: parsedResumeData.skills ? parsedResumeData.skills.join(', ') : formData.skills,
      });
      alert('✅ Form populated with resume data!');
    } else {
      alert('No resume data available. Please upload a resume in the Resume section first.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
    };
    onGenerate(dataToSend);
  };

  return (
    <form className="portfolio-form" onSubmit={handleSubmit}>
      <h2>Personal Information</h2>
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
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Professional Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="e.g., Full Stack Developer"
        />
      </div>

      <div className="form-group">
        <label>Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          rows="4"
          placeholder="Tell us about yourself..."
        />
      </div>

      <div className="form-group">
        <label>Skills (comma-separated)</label>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleInputChange}
          placeholder="JavaScript, React, Node.js, etc."
        />
      </div>

      <h2>Profile Links</h2>
      <div className="form-group">
        <label>LinkedIn Profile</label>
        <input
          type="url"
          name="linkedin"
          value={formData.linkedin}
          onChange={handleInputChange}
          placeholder="https://linkedin.com/in/yourprofile"
        />
      </div>

      <div className="form-group">
        <label>GitHub Profile</label>
        <input
          type="url"
          name="github"
          value={formData.github}
          onChange={handleInputChange}
          placeholder="https://github.com/yourusername"
        />
      </div>

      <div className="form-group">
        <label>Portfolio Website</label>
        <input
          type="url"
          name="portfolio"
          value={formData.portfolio}
          onChange={handleInputChange}
          placeholder="https://yourportfolio.com"
        />
      </div>

      <h2>Projects</h2>
      {formData.projects.map((project, index) => (
        <div key={index} className="project-item">
          <h3>Project {index + 1}</h3>
          <div className="form-group">
            <label>Project Name</label>
            <input
              type="text"
              value={project.name}
              onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={project.description}
              onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Technologies Used</label>
            <input
              type="text"
              value={project.technologies}
              onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
              placeholder="e.g., React, Node.js, MongoDB"
            />
          </div>
          <div className="form-group">
            <label>Project Link</label>
            <input
              type="url"
              value={project.link}
              onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
              placeholder="https://github.com/username/project"
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={addProject} className="add-button">
        + Add Project
      </button>

      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? 'Generating...' : 'Generate Portfolio'}
      </button>
    </form>
  );
}

export default PortfolioForm;
