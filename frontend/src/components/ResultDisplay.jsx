import './ResultDisplay.css';

function ResultDisplay({ title, content, type }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    alert('Copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: type === 'portfolio' ? 'text/html' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.${type === 'portfolio' ? 'html' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="result-display">
      <div className="result-header">
        <h2>{title}</h2>
        <div className="result-actions">
          <button onClick={handleCopy} className="action-button">
            📋 Copy
          </button>
          <button onClick={handleDownload} className="action-button">
            💾 Download
          </button>
        </div>
      </div>
      <div className="result-content">
        {type === 'portfolio' ? (
          <iframe
            srcDoc={content}
            title="Portfolio Preview"
            className="portfolio-preview"
          />
        ) : (
          <pre>{content}</pre>
        )}
      </div>
    </div>
  );
}

export default ResultDisplay;
