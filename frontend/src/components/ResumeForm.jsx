import { useState, useEffect } from 'react';
import './ResumeForm.css';
import { api } from '../services/api.js';
import TemplateSelector from './TemplateSelector';

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
    { id: 'modern', name: 'Modern Professional', description: 'Loading...', atsScore: 9, recommended: true },
    { id: 'classic', name: 'Classic ATS', description: 'Loading...', atsScore: 10, recommended: true },
    { id: 'minimal', name: 'Minimal Sidebar', description: 'Loading...', atsScore: 8, recommended: false },
  ]);

  const [jobDescription, setJobDescription] = useState('');
  const [jdAnalysis, setJdAnalysis] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingJD, setUploadingJD] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
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
    
    // If job description provided, use tailored resume generation
    if (jobDescription.trim()) {
      dataToSend.jobDescription = jobDescription;
      // Call parent with a flag indicating this is tailored
      onGenerate(dataToSend, true);
    } else {
      onGenerate(dataToSend, false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingResume(true);
    try {
      const response = await api.parseResume(file);
      if (response.success) {
        alert('Resume uploaded successfully! Text extracted:\n\n' + response.data.text.substring(0, 200) + '...\n\nYou can now manually fill in the form fields.');
        // Note: In a production app, you'd want to use AI to parse the extracted text into structured data
      }
    } catch (error) {
      alert('Failed to upload resume: ' + error.message);
    } finally {
      setUploadingResume(false);
    }
  };

  const handleJDUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingJD(true);
    try {
      const response = await api.analyzeJobDescription(null, file);
      if (response.success) {
        setJobDescription(response.data.originalText);
        setJdAnalysis(response.data.analysis);
        setShowSuggestions(true);
      }
    } catch (error) {
      alert('Failed to upload job description: ' + error.message);
    } finally {
      setUploadingJD(false);
    }
  };

  const handleAnalyzeJD = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description first');
      return;
    }

    setAnalyzing(true);
    try {
      const response = await api.analyzeJobDescription(jobDescription);
      if (response.success) {
        setJdAnalysis(response.data.analysis);
        setShowSuggestions(true);
      }
    } catch (error) {
      alert('Failed to analyze job description: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCompareWithJD = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description first');
      return;
    }

    setAnalyzing(true);
    try {
      const resumeData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      };
      const response = await api.compareResumeWithJD(resumeData, jobDescription);
      if (response.success) {
        setSuggestions(response.data.suggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      alert('Failed to compare resume: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTemplateSelect = (templateId) => {
    setFormData({ ...formData, template: templateId });
  };

  return (
    <form className="resume-form" onSubmit={handleSubmit}>
      <TemplateSelector 
        templates={templates}
        selectedTemplate={formData.template}
        onSelect={handleTemplateSelect}
      />

      <h2>Upload Existing Resume (Optional)</h2>
      <div className="form-group upload-section">
        <p className="upload-description">
          Upload your existing resume to extract information (PDF, DOCX, or TXT)
        </p>
        <div className="file-upload-wrapper">
          <input
            type="file"
            id="resume-upload"
            accept=".pdf,.docx,.txt"
            onChange={handleResumeUpload}
            disabled={uploadingResume}
            className="file-input"
          />
          <label htmlFor="resume-upload" className="file-upload-button">
            {uploadingResume ? '⏳ Uploading...' : '📄 Upload Resume'}
          </label>
        </div>
      </div>

      <h2>Job Description (Optional for Tailored Resume)</h2>
      <div className="form-group">
        <p className="upload-description">
          Add a job description to create a tailored resume with AI-powered suggestions
        </p>
        <textarea
          name="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows="6"
          placeholder="Paste the job description here..."
          className="job-description-textarea"
        />
        <div className="jd-actions">
          <div className="file-upload-wrapper">
            <input
              type="file"
              id="jd-upload"
              accept=".pdf,.docx,.txt"
              onChange={handleJDUpload}
              disabled={uploadingJD}
              className="file-input"
            />
            <label htmlFor="jd-upload" className="file-upload-button secondary">
              {uploadingJD ? '⏳ Uploading...' : '📎 Upload JD File'}
            </label>
          </div>
          <button
            type="button"
            onClick={handleAnalyzeJD}
            disabled={analyzing || !jobDescription.trim()}
            className="analyze-button"
          >
            {analyzing ? '🔄 Analyzing...' : '🔍 Analyze JD'}
          </button>
          <button
            type="button"
            onClick={handleCompareWithJD}
            disabled={analyzing || !jobDescription.trim()}
            className="analyze-button"
          >
            {analyzing ? '🔄 Comparing...' : '📊 Compare Resume'}
          </button>
        </div>
      </div>

      {showSuggestions && (jdAnalysis || suggestions) && (
        <div className="suggestions-panel">
          <div className="suggestions-header">
            <h3>💡 AI Suggestions</h3>
            <button
              type="button"
              onClick={() => setShowSuggestions(false)}
              className="close-suggestions"
            >
              ✕
            </button>
          </div>
          
          {jdAnalysis && (
            <div className="analysis-section">
              <h4>Job Description Analysis</h4>
              <div className="analysis-grid">
                {jdAnalysis.requiredSkills && jdAnalysis.requiredSkills.length > 0 && (
                  <div className="analysis-item">
                    <strong>Required Skills:</strong>
                    <div className="skill-tags">
                      {jdAnalysis.requiredSkills.map((skill, idx) => (
                        <span key={idx} className="skill-tag required">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
                {jdAnalysis.preferredSkills && jdAnalysis.preferredSkills.length > 0 && (
                  <div className="analysis-item">
                    <strong>Preferred Skills:</strong>
                    <div className="skill-tags">
                      {jdAnalysis.preferredSkills.map((skill, idx) => (
                        <span key={idx} className="skill-tag preferred">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
                {jdAnalysis.keywords && jdAnalysis.keywords.length > 0 && (
                  <div className="analysis-item">
                    <strong>Keywords to Include:</strong>
                    <div className="skill-tags">
                      {jdAnalysis.keywords.map((keyword, idx) => (
                        <span key={idx} className="skill-tag keyword">{keyword}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {suggestions && (
            <div className="suggestions-section">
              <h4>Resume Comparison Results</h4>
              <div className="match-score">
                <span className="score-label">Match Score:</span>
                <span className={`score-value ${suggestions.matchScore >= 70 ? 'good' : suggestions.matchScore >= 50 ? 'medium' : 'low'}`}>
                  {suggestions.matchScore}%
                </span>
              </div>
              
              {suggestions.missingSkills && suggestions.missingSkills.length > 0 && (
                <div className="suggestion-item">
                  <strong>⚠️ Missing Skills:</strong>
                  <div className="skill-tags">
                    {suggestions.missingSkills.map((skill, idx) => (
                      <span key={idx} className="skill-tag missing">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.suggestedSkills && suggestions.suggestedSkills.length > 0 && (
                <div className="suggestion-item">
                  <strong>✨ Suggested Skills to Add:</strong>
                  <div className="skill-tags">
                    {suggestions.suggestedSkills.map((skill, idx) => (
                      <span key={idx} className="skill-tag suggested">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.strengths && suggestions.strengths.length > 0 && (
                <div className="suggestion-item">
                  <strong>✅ Strengths:</strong>
                  <ul className="suggestion-list">
                    {suggestions.strengths.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {suggestions.summaryImprovements && (
                <div className="suggestion-item">
                  <strong>📝 Summary Improvements:</strong>
                  <p className="improvement-text">{suggestions.summaryImprovements}</p>
                </div>
              )}

              {suggestions.overallFeedback && (
                <div className="suggestion-item">
                  <strong>💬 Overall Feedback:</strong>
                  <p className="improvement-text">{suggestions.overallFeedback}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
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
