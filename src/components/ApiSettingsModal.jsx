import { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ApiSettingsModal({ isOpen, onClose, apiKey, setApiKey, model, setModel }) {
  const [tempKey, setTempKey] = useState(apiKey || '');
  const [tempModel, setTempModel] = useState(model || 'gpt-4o-mini');
  const [showKey, setShowKey] = useState(false);
  const [testingStatus, setTestingStatus] = useState(null); // 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  // Close modal on Escape press for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(tempKey);
    setModel(tempModel);
    onClose();
  };

  const handleTestConnection = async () => {
    if (!tempKey.trim()) {
      setTestingStatus('error');
      setErrorMessage('Please enter an API key first.');
      return;
    }

    if (!tempKey.trim().startsWith('sk-')) {
      setTestingStatus('error');
      setErrorMessage('Invalid key format. OpenAI API keys must begin with "sk-".');
      return;
    }

    setTestingStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempKey}`
        },
        body: JSON.stringify({
          model: tempModel,
          messages: [{ role: 'user', content: 'Connection test. Respond with OK.' }],
          max_tokens: 5
        })
      });

      if (response.ok) {
        setTestingStatus('success');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      setTestingStatus('error');
      setErrorMessage(error.message || 'Failed to connect. Check your internet connection or key.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(15, 23, 25, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      animation: 'fadeIn var(--transition-fast) forwards'
    }}>
      <div 
        className="card glass glow-border" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title" 
        aria-describedby="privacy-desc"
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '2rem',
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: 'var(--shadow-lg), 0 0 50px rgba(99, 102, 241, 0.1)',
          animation: 'slideUp var(--transition-normal) forwards'
        }}
      >
        {/* Header */}
        <div className="flex-between" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={20} color="var(--indigo)" aria-hidden="true" />
            <h2 id="modal-title" style={{ fontSize: '1.25rem', margin: 0 }}>API & Wellness Settings</h2>
          </div>
          <button 
            onClick={onClose} 
            className="btn btn-secondary" 
            aria-label="Close settings modal"
            style={{ padding: '0.25rem', borderRadius: '50%' }}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Info Box */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: 'var(--border-radius-sm)',
          padding: '0.75rem 1rem',
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '1.25rem'
        }}>
          <ShieldCheck size={20} color="var(--color-energetic)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
          <p id="privacy-desc" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'left' }}>
            <strong>Privacy Guard</strong>: Your API key is saved locally in your own browser cache. No remote backend storage is used. OpenAI is billed directly from your token budget.
          </p>
        </div>

        {/* Key Input */}
        <div style={{ marginBottom: '1.25rem', position: 'relative' }}>
          <label htmlFor="api-key-input" className="label">OpenAI API Key (Optional)</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              id="api-key-input"
              type={showKey ? "text" : "password"}
              className="input"
              placeholder="sk-proj-..."
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              style={{ paddingRight: '2.5rem' }}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              aria-label={showKey ? "Hide API key" : "Show API key"}
              style={{
                position: 'absolute',
                right: '0.75rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              {showKey ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'left', marginTop: '0.35rem' }}>
            Leave empty to run the <strong>Zenith Mock AI Failsafe Engine</strong>. The app remains 100% interactive.
          </p>
        </div>

        {/* Model dropdown */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="api-model-select" className="label">AI Model</label>
          <select 
            id="api-model-select"
            className="select" 
            value={tempModel} 
            onChange={(e) => setTempModel(e.target.value)}
          >
            <option value="gpt-4o-mini">GPT-4o Mini (Recommended - Fast & Cheap)</option>
            <option value="gpt-4o">GPT-4o (Deep Analysis & Detailed Responses)</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Legacy support)</option>
          </select>
        </div>

        {/* Connection Test Output */}
        {testingStatus === 'loading' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--indigo)' }}>
            <div className="indicator animate-breathe" style={{ background: 'var(--indigo)' }} aria-hidden="true" />
            <span style={{ fontSize: '0.85rem' }}>Testing API credentials...</span>
          </div>
        )}
        {testingStatus === 'success' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-energetic)' }}>
            <CheckCircle2 size={16} aria-hidden="true" />
            <span style={{ fontSize: '0.85rem' }}>Connection successful! Key is active and responding.</span>
          </div>
        )}
        {testingStatus === 'error' && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--border-radius-sm)',
            padding: '0.75rem',
            marginBottom: '1rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-anxious)', marginBottom: '0.25rem' }}>
              <AlertCircle size={16} aria-hidden="true" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Connection Failed</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{errorMessage}</p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <button className="btn btn-secondary" onClick={handleTestConnection} disabled={testingStatus === 'loading'}>
            Test Connection
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={testingStatus === 'loading'}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
