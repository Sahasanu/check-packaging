import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import UploadZone from './components/UploadZone.jsx';
import SamplePicker from './components/SamplePicker.jsx';
import ComplianceScorecard from './components/ComplianceScorecard.jsx';
import USPMathInspector from './components/USPMathInspector.jsx';
import StatutoryChecklist from './components/StatutoryChecklist.jsx';
import ExtractedDataGrid from './components/ExtractedDataGrid.jsx';
import AuditHistoryModal from './components/AuditHistoryModal.jsx';
import AnalyticsModal from './components/AnalyticsModal.jsx';
import ApiKeyModal from './components/ApiKeyModal.jsx';

import { ArrowLeft, AlertCircle, Scale, FileText, Download } from 'lucide-react';

export default function App() {
  const [activeReport, setActiveReport] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeSampleId, setActiveSampleId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [backendStatus, setBackendStatus] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('LMPC_GEMINI_API_KEY') || '');
  const [errorMsg, setErrorMsg] = useState(null);

  // Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);

  // Check backend health on mount
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'healthy') {
          setBackendStatus(true);
        }
      })
      .catch(() => setBackendStatus(false));
  }, []);

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('LMPC_GEMINI_API_KEY', key);
    } else {
      localStorage.removeItem('LMPC_GEMINI_API_KEY');
    }
  };

  const handleScanFile = async (file) => {
    setIsScanning(true);
    setErrorMsg(null);
    setActiveSampleId(null);

    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const headers = {};
      if (apiKey) {
        headers['X-Gemini-Api-Key'] = apiKey;
      }

      const res = await fetch('/api/scan', {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || `Server returned error status ${res.status}`);
      }

      const data = await res.json();
      setActiveReport(data);
      if (data.image_url) {
        setPreviewImage(data.image_url);
      }

      // Print details to browser console
      console.log("%c📦 LEGAL METROLOGY (PCR 2011) COMPLIANCE AUDIT", "color: #38bdf8; font-size: 14px; font-weight: bold;");
      console.log("Product:", data.product_name);
      console.log("Status:", data.overall_status, `(Score: ${data.compliance_score}%)`);
      console.log("Extracted Label Declarations:", data.extracted_data);
      console.log("Rule Evaluation Results:", data.rule_results);
      if (data.usp_check) {
        console.log("USP Math Engine Check:", data.usp_check);
      }
      console.table(data.rule_results.map(r => ({
        Rule: r.rule_name,
        Clause: r.legal_reference,
        Status: r.status,
        Declared: r.declared_value,
        Standard: r.expected_standard
      })));
    } catch (err) {
      console.error("Scan error:", err);
      setErrorMsg(err.message || "Failed to complete packaging audit scan.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectSample = async (sampleId) => {
    setIsScanning(true);
    setErrorMsg(null);
    setActiveSampleId(sampleId);

    try {
      const formData = new FormData();
      formData.append('sample_id', sampleId);

      const headers = {};
      if (apiKey) {
        headers['X-Gemini-Api-Key'] = apiKey;
      }

      const res = await fetch('/api/scan', {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || `Server returned error status ${res.status}`);
      }

      const data = await res.json();
      setActiveReport(data);
      if (data.image_url) {
        setPreviewImage(data.image_url);
      }

      // Print details to browser console
      console.log("%c📦 LEGAL METROLOGY (PCR 2011) SAMPLE AUDIT", "color: #38bdf8; font-size: 14px; font-weight: bold;");
      console.log("Product:", data.product_name);
      console.log("Status:", data.overall_status, `(Score: ${data.compliance_score}%)`);
      console.log("Extracted Label Declarations:", data.extracted_data);
      console.log("Rule Evaluation Results:", data.rule_results);
      if (data.usp_check) {
        console.log("USP Math Engine Check:", data.usp_check);
      }
      console.table(data.rule_results.map(r => ({
        Rule: r.rule_name,
        Clause: r.legal_reference,
        Status: r.status,
        Declared: r.declared_value,
        Standard: r.expected_standard
      })));
      if (data.image_url) {
        setPreviewImage(data.image_url);
      }
    } catch (err) {
      console.error("Sample scan error:", err);
      setErrorMsg(err.message || "Failed to load sample audit.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectScanId = async (scanId) => {
    try {
      const res = await fetch(`/api/scan/${scanId}`);
      if (res.ok) {
        const data = await res.json();
        setActiveReport(data);
        if (data.image_url) {
          setPreviewImage(data.image_url);
        }
      }
    } catch (err) {
      console.error("Failed to load scan:", err);
    }
  };

  const handleExportPdf = () => {
    if (activeReport?.scan_id) {
      window.open(`/api/export-pdf/${activeReport.scan_id}`, '_blank');
    }
  };

  const handleResetScan = () => {
    setActiveReport(null);
    setPreviewImage(null);
    setActiveSampleId(null);
    setErrorMsg(null);
  };

  return (
    <div className="app-layout">
      
      {/* Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenApiKey={() => setIsApiKeyOpen(true)}
        hasApiKey={Boolean(apiKey)}
        backendStatus={backendStatus}
      />

      {/* Main Container */}
      <main className="main-container">
        
        {/* Error Notification Alert */}
        {errorMsg && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            color: '#fecdd3',
            padding: '16px 20px',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
            fontSize: '0.82rem'
          }} className="fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle style={{ width: 22, height: 22, color: '#fb7185', flexShrink: 0, marginTop: 2 }} />
              <div>
                <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.92rem', display: 'block', marginBottom: 2 }}>
                  Extraction / Processing Error
                </span>
                <p style={{ lineHeight: 1.5, color: '#fecdd3' }}>{errorMsg}</p>
                {errorMsg.toLowerCase().includes('api key') && (
                  <button
                    onClick={() => setIsApiKeyOpen(true)}
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: 10 }}
                  >
                    Configure Gemini API Key Now
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="btn btn-secondary btn-sm"
              style={{ flexShrink: 0 }}
            >
              Dismiss
            </button>
          </div>
        )}

        {!activeReport ? (
          /* SCANNING HOME STATE */
          <div className="flex flex-col gap-6 fade-in">
            
            {/* Hero Banner */}
            <div className="hero-section">
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: 20,
                background: 'rgba(2, 132, 199, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                <Scale style={{ width: 14, height: 14 }} />
                <span>Statutory Compliance under Legal Metrology Act, 2009</span>
              </div>

              <h2 className="hero-title">
                Automated Packaging Compliance & Declaration Inspector
              </h2>

              <p className="hero-subtitle">
                Upload or photograph any packaged commodity label to instantly verify mandatory declarations under Rule 6, arithmetic accuracy of Unit Sale Price (USP) under Rule 6(11), and download official PDF notices.
              </p>
            </div>

            {/* Upload Zone */}
            <UploadZone
              onScanFile={handleScanFile}
              isScanning={isScanning}
              previewUrl={previewImage}
              onClearScan={handleResetScan}
            />

            {/* 1-Click Quick Samples */}
            <div style={{ marginTop: 8 }}>
              <SamplePicker
                onSelectSample={handleSelectSample}
                activeSampleId={activeSampleId}
                isScanning={isScanning}
              />
            </div>

            {/* Regulatory Rule Pillars */}
            <div className="grid-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 20 }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: 16 }}>
                <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>1. Rule 6 Mandate</span>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Verifies manufacturer factory address, metric net quantity, packaging dates, and exact MRP phrasing with taxes.
                </p>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: 16 }}>
                <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>2. Rule 6(11) USP Engine</span>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Automated arithmetic cross-checker comparing declared Unit Sale Price against formula (MRP / Net Quantity).
                </p>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: 16 }}>
                <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>3. Digital Notice (PDF)</span>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Instant 1-click generation of official Department of Consumer Affairs Legal Metrology Inspection Notice in PDF format.
                </p>
              </div>
            </div>

          </div>
        ) : (
          /* ACTIVE AUDIT REPORT STATE */
          <div className="flex flex-col gap-5 fade-in">
            
            {/* Top Back & Action Bar */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleResetScan}
                className="btn btn-secondary btn-sm"
              >
                <ArrowLeft style={{ width: 14, height: 14 }} />
                Scan Another Package
              </button>

              <button
                onClick={handleExportPdf}
                className="btn btn-primary btn-sm"
              >
                <Download style={{ width: 14, height: 14 }} />
                Download PDF Notice
              </button>
            </div>

            {/* Scorecard Hero */}
            <ComplianceScorecard
              report={activeReport}
              onExportPdf={handleExportPdf}
            />

            {/* Main Inspection Grid */}
            <div className="split-layout">
              
              {/* Left Column: Image Evidence & USP Math */}
              <div className="flex flex-col gap-4">
                
                {/* Image Evidence Card */}
                <div className="glass-card" style={{ padding: 16 }}>
                  <div className="flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FileText style={{ width: 14, height: 14, color: '#38bdf8' }} />
                      Audited Commodity Label
                    </span>
                    <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>Evidence Captured</span>
                  </div>

                  {previewImage ? (
                    <div style={{
                      borderRadius: 12,
                      overflow: 'hidden',
                      background: '#000000',
                      border: '1px solid #334155',
                      maxHeight: 420,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img
                        src={previewImage}
                        alt="Audited Label"
                        style={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: 420 }}
                      />
                    </div>
                  ) : (
                    <div style={{ height: 200, background: '#0f172a', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.8rem' }}>
                      No Image Preview
                    </div>
                  )}

                  <div style={{ background: '#090d16', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 8, padding: '8px 12px', marginTop: 10, fontSize: '0.72rem', color: '#94a3b8' }}>
                    <span>File: <code style={{ color: '#e2e8f0' }}>{activeReport.image_filename}</code></span>
                  </div>
                </div>

                {/* USP Math Calculator */}
                <USPMathInspector
                  uspCheck={activeReport.usp_check}
                  mrpAmount={activeReport.extracted_data?.mrp_amount}
                  netQtyValue={activeReport.extracted_data?.net_quantity_value}
                  netQtyUnit={activeReport.extracted_data?.net_quantity_unit}
                />

              </div>

              {/* Right Column: Statutory Checklist & Extracted Grid */}
              <div className="flex flex-col gap-4">
                
                {/* Statutory Checklist */}
                <StatutoryChecklist
                  ruleResults={activeReport.rule_results}
                />

                {/* Extracted Data Grid */}
                <ExtractedDataGrid
                  extractedData={activeReport.extracted_data}
                />

              </div>

            </div>

          </div>
        )}

      </main>

      {/* Modals */}
      <AuditHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectScanId={handleSelectScanId}
      />

      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />

      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(9, 13, 22, 0.95)',
        padding: '16px 20px',
        fontSize: '0.75rem',
        color: '#64748b',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8
        }}>
          <span>Legal Metrology (Packaged Commodities) Rules, 2011 Automated Inspection Prototype</span>
          <span>Department of Consumer Affairs (DoCA) • Ministry of Consumer Affairs, Food & Public Distribution</span>
        </div>
      </footer>

    </div>
  );
}
