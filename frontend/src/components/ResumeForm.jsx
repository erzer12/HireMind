import { useState } from 'react';
import './ResumeForm.css';

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
  });

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
