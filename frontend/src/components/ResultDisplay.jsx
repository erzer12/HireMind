import './ResultDisplay.css';

function ResultDisplay({ title, content, type, format }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    alert('Copied to clipboard!');
  };

  const handleDownload = () => {
    let fileType, extension;
    if (type === 'portfolio' || format === 'html') {
      fileType = 'text/html';
      extension = 'html';
    } else {
      fileType = 'text/plain';
      extension = 'txt';
    }
    
    const blob = new Blob([content], { type: fileType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(content);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
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
          {(type === 'portfolio' || format === 'html') && (
            <button onClick={handlePrint} className="action-button">
              🖨️ Print/PDF
            </button>
          )}
        </div>
      </div>
      <div className="result-content">
        {type === 'portfolio' || format === 'html' ? (
          <iframe
            srcDoc={content}
            title={type === 'portfolio' ? 'Portfolio Preview' : 'Resume Preview'}
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
