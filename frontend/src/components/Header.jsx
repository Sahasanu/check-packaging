import React from 'react';
import { ShieldCheck, History, BarChart3, Key } from 'lucide-react';

export default function Header({ onOpenHistory, onOpenAnalytics, onOpenApiKey, hasApiKey, backendStatus }) {
  return (
    <header className="header-nav">
      <div className="header-inner">
        
        {/* Brand & Gov Emblem */}
        <div className="flex items-center gap-3">
          <div className="brand-icon">
            <ShieldCheck style={{ width: 24, height: 24, color: '#ffffff' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="brand-tag">DoCA / PCR 2011 Engine</span>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>SIH Problem #26034</span>
            </div>
            <h1 className="brand-title">
              Legal Metrology Compliance Inspector
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Health indicator */}
          <div className="flex items-center gap-2" style={{ background: '#0f172a', border: '1px solid #1e293b', padding: '6px 12px', borderRadius: 8, fontSize: '0.75rem' }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: backendStatus ? '#10b981' : '#f43f5e',
              display: 'inline-block'
            }}></span>
            <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{backendStatus ? 'Rule Engine Active' : 'Connecting...'}</span>
          </div>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKey}
            className="btn btn-secondary btn-sm"
            style={{
              borderColor: hasApiKey ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)',
              color: hasApiKey ? '#34d399' : '#fbbf24'
            }}
            title="Configure Gemini Vision API Key"
          >
            <Key style={{ width: 14, height: 14 }} />
            <span>{hasApiKey ? 'Gemini AI Active' : 'Configure API Key'}</span>
          </button>

          {/* Analytics Button */}
          <button
            onClick={onOpenAnalytics}
            className="btn btn-secondary btn-sm"
          >
            <BarChart3 style={{ width: 14, height: 14, color: '#38bdf8' }} />
            <span>Analytics</span>
          </button>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="btn btn-secondary btn-sm"
          >
            <History style={{ width: 14, height: 14, color: '#38bdf8' }} />
            <span>Scan History</span>
          </button>

        </div>

      </div>
    </header>
  );
}
