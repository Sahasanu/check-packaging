import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, Download, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

export default function ComplianceScorecard({ report, onExportPdf }) {
  if (!report) return null;

  const {
    overall_status,
    compliance_score,
    summary,
    passed_count,
    failed_count,
    warning_count,
    scan_id,
    timestamp,
    product_name
  } = report;

  let statusBadge = "badge-pass";
  let statusIcon = ShieldCheck;
  let statusText = "FULLY COMPLIANT";
  let cardStatusClass = "compliant";
  let scoreColor = "#34d399";
  let ringColor = "#10b981";

  if (overall_status === "NON_COMPLIANT") {
    statusBadge = "badge-fail";
    statusIcon = ShieldX;
    statusText = "STATUTORY NON-COMPLIANCE";
    cardStatusClass = "non-compliant";
    scoreColor = "#fb7185";
    ringColor = "#f43f5e";
  } else if (overall_status === "FLAGGED_FOR_REVIEW") {
    statusBadge = "badge-warning";
    statusIcon = ShieldAlert;
    statusText = "FLAGGED FOR REVIEW";
    cardStatusClass = "flagged";
    scoreColor = "#fbbf24";
    ringColor = "#f59e0b";
  }

  const StatusIconComponent = statusIcon;
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // ~251.3
  const strokeDashoffset = circumference - (circumference * compliance_score) / 100;

  return (
    <div className={`glass-card scorecard-hero ${cardStatusClass}`}>
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 16 }}>
        <div>
          <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
            <span className={`badge ${statusBadge}`}>
              <StatusIconComponent style={{ width: 14, height: 14 }} />
              {statusText}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: LMPC-{scan_id?.slice(0, 8).toUpperCase()}</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff' }}>
            {product_name || "Audited Product"}
          </h2>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 2 }}>
            Inspected on {timestamp} • Under Legal Metrology (Packaged Commodities) Rules, 2011
          </p>
        </div>

        {/* Action Button: Download PDF Notice */}
        <button
          onClick={onExportPdf}
          className="btn btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.82rem' }}
        >
          <Download style={{ width: 16, height: 16 }} />
          Download Official PDF Notice
        </button>
      </div>

      {/* Main Score & Metric Section */}
      <div className="scorecard-grid">
        
        {/* Radial Score Gauge Container */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <div className="gauge-box">
            <svg className="gauge-svg" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="8"
              />
              {/* Progress ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={ringColor}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>
            <div className="gauge-content">
              <span className="gauge-score-number" style={{ color: scoreColor }}>
                {compliance_score}%
              </span>
              <span className="gauge-label">Compliance</span>
            </div>
          </div>

          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 8, fontWeight: 500 }}>
            {compliance_score >= 90 ? "Standard Adherence: High" : compliance_score >= 70 ? "Actionable Violations" : "Critical Offences"}
          </p>
        </div>

        {/* Summary & Counters */}
        <div className="flex flex-col gap-3">
          
          {/* Summary Finding Box */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
            padding: '14px 16px',
            fontSize: '0.82rem',
            color: '#e2e8f0',
            lineHeight: 1.6
          }}>
            <span style={{ color: '#38bdf8', fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Inspector's Statutory Finding:
            </span>
            {summary}
          </div>

          {/* Counts Bar */}
          <div className="grid-3" style={{ marginTop: 2 }}>
            
            <div className="stat-box" style={{ background: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
              <div className="stat-box-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                <CheckCircle2 style={{ width: 20, height: 20 }} />
              </div>
              <div>
                <span className="stat-box-number" style={{ color: '#6ee7b7' }}>{passed_count}</span>
                <span className="stat-box-label" style={{ color: '#34d399', display: 'block' }}>Passed Rules</span>
              </div>
            </div>

            <div className="stat-box" style={{ background: 'rgba(244, 63, 94, 0.08)', borderColor: 'rgba(244, 63, 94, 0.25)' }}>
              <div className="stat-box-icon" style={{ background: 'rgba(244, 63, 94, 0.2)', color: '#fb7185' }}>
                <AlertCircle style={{ width: 20, height: 20 }} />
              </div>
              <div>
                <span className="stat-box-number" style={{ color: '#fda4af' }}>{failed_count}</span>
                <span className="stat-box-label" style={{ color: '#fb7185', display: 'block' }}>Violations</span>
              </div>
            </div>

            <div className="stat-box" style={{ background: 'rgba(245, 158, 11, 0.08)', borderColor: 'rgba(245, 158, 11, 0.25)' }}>
              <div className="stat-box-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
                <AlertTriangle style={{ width: 20, height: 20 }} />
              </div>
              <div>
                <span className="stat-box-number" style={{ color: '#fde68a' }}>{warning_count}</span>
                <span className="stat-box-label" style={{ color: '#fbbf24', display: 'block' }}>Advisories</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
