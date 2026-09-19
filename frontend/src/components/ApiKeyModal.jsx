import React, { useState } from 'react';
import { X, Key, ShieldCheck, ExternalLink, Check } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, apiKey, onSaveApiKey }) {
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(keyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setKeyInput('');
    onSaveApiKey('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 520 }}>
        
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Key style={{ width: 16, height: 16 }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                Configure Gemini Vision AI
              </h3>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Multimodal label extraction for arbitrary packaging photos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: 6, borderRadius: 8 }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Form Body */}
        <div className="modal-body">
          <div style={{ background: 'rgba(2, 132, 199, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 10, padding: 12, fontSize: '0.78rem', color: '#cbd5e1' }}>
            <span style={{ color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <ShieldCheck style={{ width: 14, height: 14 }} />
              How Gemini is used:
            </span>
            <p style={{ lineHeight: 1.5 }}>
              Gemini Vision (<code>gemini-2.5-flash</code>) reads complex packaging labels (shiny foils, curved bottles, Devanagari script, stamps) and outputs structured data directly into our Legal Metrology PCR 2011 rule engine.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#cbd5e1' }}>
              Google Gemini API Key
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: '#090d16',
                border: '1px solid #334155',
                borderRadius: 8,
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            />
            <div className="flex justify-between" style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>
              <span>Saved locally in browser storage</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
              >
                Get a free API Key <ExternalLink style={{ width: 12, height: 12 }} />
              </a>
            </div>
          </div>

          {savedSuccess && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', padding: '8px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem' }}>
              <Check style={{ width: 16, height: 16 }} />
              <span>Gemini API Key configured and active!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            type="button"
            onClick={handleClear}
            className="btn btn-secondary btn-sm"
            style={{ color: '#fb7185', marginRight: 'auto' }}
          >
            Clear Key
          </button>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn btn-primary btn-sm"
          >
            Save & Activate
          </button>
        </div>

      </div>
    </div>
  );
}
