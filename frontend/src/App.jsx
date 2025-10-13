import { useState } from 'react';
import './App.css';
import ResumeForm from './components/ResumeForm';
import CoverLetterForm from './components/CoverLetterForm';
import PortfolioForm from './components/PortfolioForm';
import ResultDisplay from './components/ResultDisplay';
import { api } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('resume');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerateResume = async (userInfo) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await api.generateResume(userInfo, userInfo.template);
      setResult({ 
        type: 'resume', 
        content: response.data.resume,
        format: response.data.format || 'markdown'
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCoverLetter = async (userInfo, jobInfo) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await api.generateCoverLetter(userInfo, jobInfo);
      setResult({ type: 'coverLetter', content: response.data.coverLetter });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePortfolio = async (userInfo) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await api.generatePortfolio(userInfo);
      setResult({ type: 'portfolio', content: response.data.portfolio });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🧠 HireMind</h1>
        <p>AI-Powered Resume & Portfolio Builder</p>
      </header>

      <nav className="app-nav">
        <button
          className={`tab-button ${activeTab === 'resume' ? 'active' : ''}`}
          onClick={() => setActiveTab('resume')}
        >
          Resume
        </button>
        <button
          className={`tab-button ${activeTab === 'coverLetter' ? 'active' : ''}`}
          onClick={() => setActiveTab('coverLetter')}
        >
          Cover Letter
        </button>
        <button
          className={`tab-button ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          Portfolio
        </button>
      </nav>

      <main className="app-main">
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {activeTab === 'resume' && (
          <ResumeForm onGenerate={handleGenerateResume} loading={loading} />
        )}
        {activeTab === 'coverLetter' && (
          <CoverLetterForm onGenerate={handleGenerateCoverLetter} loading={loading} />
        )}
        {activeTab === 'portfolio' && (
          <PortfolioForm onGenerate={handleGeneratePortfolio} loading={loading} />
        )}

        {result && (
          <ResultDisplay
            title={
              result.type === 'resume'
                ? 'Generated Resume'
                : result.type === 'coverLetter'
                ? 'Generated Cover Letter'
                : 'Generated Portfolio'
            }
            content={result.content}
            type={result.type}
            format={result.format}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by OpenAI | Built with React & Node.js</p>
        <div className="footer-links">
          <a href="https://github.com/erzer12/HireMind" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://github.com/erzer12/HireMind#readme" target="_blank" rel="noopener noreferrer">Documentation</a>
          <a href="mailto:contact@hiremind.app">Contact</a>
        </div>
        <div className="footer-social">
          <a href="https://github.com/erzer12/HireMind" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <span style={{ fontSize: '1.2em' }}>⭐</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;

