import './TemplateSelector.css';

function TemplateSelector({ templates, selectedTemplate, onSelect }) {
  return (
    <div className="template-selector">
      <h2>Select Resume Template</h2>
      <p className="template-subtitle">Choose a template that best fits your style and career level</p>
      
      <div className="template-grid">
        {templates.map(template => (
          <div
            key={template.id}
            className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
            onClick={() => onSelect(template.id)}
          >
            <div className="template-preview">
              <div className={`preview-content ${template.id}`}>
                <div className="preview-header">
                  {template.id === 'modern' && (
                    <div className="modern-preview">
                      <div className="preview-gradient-bar"></div>
                      <div className="preview-name">John Doe</div>
                      <div className="preview-text">Software Engineer</div>
                    </div>
                  )}
                  {template.id === 'classic' && (
                    <div className="classic-preview">
                      <div className="preview-name-classic">JOHN DOE</div>
                      <div className="preview-divider"></div>
                      <div className="preview-text-small">Software Engineer</div>
                    </div>
                  )}
                  {template.id === 'minimal' && (
                    <div className="minimal-preview">
                      <div className="preview-sidebar">
                        <div className="preview-avatar"></div>
                        <div className="preview-sidebar-text"></div>
                        <div className="preview-sidebar-text"></div>
                      </div>
                      <div className="preview-main">
                        <div className="preview-name-minimal">John Doe</div>
                        <div className="preview-text-lines">
                          <div className="preview-line"></div>
                          <div className="preview-line"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="template-info">
              <div className="template-header">
                <h3>{template.name}</h3>
                {template.recommended && (
                  <span className="recommended-badge" title="Recommended for ATS compatibility">
                    ⭐ ATS
                  </span>
                )}
              </div>
              <p className="template-description">{template.description}</p>
              <div className="template-footer">
                <span className="ats-score">
                  ATS Score: <strong>{template.atsScore}/10</strong>
                </span>
                {selectedTemplate === template.id && (
                  <span className="selected-indicator">✓ Selected</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TemplateSelector;
