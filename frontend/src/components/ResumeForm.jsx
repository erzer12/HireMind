import { useState, useEffect } from 'react';
import './ResumeForm.css';
import { api } from '../services/api.js';

function ResumeForm({ onGenerate, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    skills: '',
    experience: [{ position: '', company: '', duration: '', description: '' }],
    education: [{ degree: '', institution: '', year: '' }],
    template: 'modern',
  });
  
  const [templates, setTemplates] = useState([
    { id: 'modern', name: 'Modern Professional', description: 'Loading...' },
    { id: 'classic', name: 'Classic ATS', description: 'Loading...' },
    { id: 'minimal', name: 'Minimal Sidebar', description: 'Loading...' },
  ]);
  
  useEffect(() => {
    // Fetch available templates
    api.getResumeTemplates()
      .then(response => {
        if (response.success && response.data.templates) {
          setTemplates(response.data.templates);
        }
      })
      .catch(err => {
        console.error('Failed to fetch templates:', err);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...formData.experience];
    newExperience[index][field] = value;
    setFormData({ ...formData, experience: newExperience });
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...formData.education];
    newEducation[index][field] = value;
    setFormData({ ...formData, education: newEducation });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { position: '', company: '', duration: '', description: '' }],
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { degree: '', institution: '', year: '' }],
    });
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
    <form className="resume-form" onSubmit={handleSubmit}>
      <h2>Select Template</h2>
      <div className="form-group">
        <label>Resume Template *</label>
        <select
          name="template"
          value={formData.template}
          onChange={handleInputChange}
          required
        >
          {templates.map(template => (
            <option key={template.id} value={template.id}>
              {template.name} {template.recommended ? '⭐' : ''} - {template.description}
            </option>
          ))}
        </select>
        <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
          ⭐ = Recommended for ATS compatibility
        </small>
      </div>
      
      <h2>Personal Information</h2>
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
        <label>Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>Professional Summary</label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleInputChange}
          rows="4"
          placeholder="Brief summary of your professional background and goals..."
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

      <h2>Work Experience</h2>
      {formData.experience.map((exp, index) => (
        <div key={index} className="experience-item">
          <h3>Experience {index + 1}</h3>
          <div className="form-group">
            <label>Position</label>
            <input
              type="text"
              value={exp.position}
              onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Company</label>
            <input
              type="text"
              value={exp.company}
              onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Duration</label>
            <input
              type="text"
              value={exp.duration}
              onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
              placeholder="e.g., Jan 2020 - Present"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={exp.description}
              onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
              rows="3"
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={addExperience} className="add-button">
        + Add Experience
      </button>

      <h2>Education</h2>
      {formData.education.map((edu, index) => (
        <div key={index} className="education-item">
          <h3>Education {index + 1}</h3>
          <div className="form-group">
            <label>Degree</label>
            <input
              type="text"
              value={edu.degree}
              onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Institution</label>
            <input
              type="text"
              value={edu.institution}
              onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Year</label>
            <input
              type="text"
              value={edu.year}
              onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
              placeholder="e.g., 2020"
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={addEducation} className="add-button">
        + Add Education
      </button>

      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? 'Generating...' : 'Generate Resume'}
      </button>
    </form>
  );
}

export default ResumeForm;
