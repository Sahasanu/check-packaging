import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, ChevronDown, ChevronUp, Scale, AlertOctagon } from 'lucide-react';

export default function StatutoryChecklist({ ruleResults }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [filter, setFilter] = useState('ALL');

  if (!ruleResults || ruleResults.length === 0) return null;

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const filteredRules = ruleResults.filter(rule => {
    if (filter === 'VIOLATIONS') return rule.status === 'FAIL' || rule.status === 'WARNING';
    if (filter === 'PASSED') return rule.status === 'PASS';
    return true;
  });

  return (
    <div className="glass-card">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 16, marginBottom: 16 }}>
        <div className="flex items-center gap-2">
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Scale style={{ width: 16, height: 16 }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
              Legal Metrology (PCR 2011) Statutory Audit Checklist
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Clause-by-clause verification under Legal Metrology Act, 2009
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1" style={{ background: '#090d16', padding: 4, borderRadius: 8, border: '1px solid #1e293b' }}>
          <button
            onClick={() => setFilter('ALL')}
            className={`btn btn-sm ${filter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '4px 10px', fontSize: '0.72rem' }}
          >
            All ({ruleResults.length})
          </button>
          <button
            onClick={() => setFilter('VIOLATIONS')}
            className={`btn btn-sm ${filter === 'VIOLATIONS' ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              padding: '4px 10px',
              fontSize: '0.72rem',
              backgroundColor: filter === 'VIOLATIONS' ? '#e11d48' : undefined
            }}
          >
            Violations ({ruleResults.filter(r => r.status === 'FAIL' || r.status === 'WARNING').length})
          </button>
          <button
            onClick={() => setFilter('PASSED')}
            className={`btn btn-sm ${filter === 'PASSED' ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              padding: '4px 10px',
              fontSize: '0.72rem',
              backgroundColor: filter === 'PASSED' ? '#059669' : undefined
            }}
          >
            Passed ({ruleResults.filter(r => r.status === 'PASS').length})
          </button>
        </div>
      </div>

      {/* Rules Item List */}
      <div>
        {filteredRules.map((rule, idx) => {
          const isExpanded = expandedIndex === idx;
          
          let statusBadge = "badge-pass";
          let StatusIcon = CheckCircle2;
          let itemClass = "";

          if (rule.status === "FAIL") {
            statusBadge = "badge-fail";
            StatusIcon = XCircle;
            itemClass = "fail";
          } else if (rule.status === "WARNING") {
            statusBadge = "badge-warning";
            StatusIcon = AlertTriangle;
            itemClass = "warning";
          } else if (rule.status === "INFO") {
            statusBadge = "badge-info";
            StatusIcon = Info;
          }

          return (
            <div
              key={rule.rule_id || idx}
              className={`checklist-item ${itemClass}`}
            >
              {/* Header */}
              <div
                onClick={() => toggleExpand(idx)}
                className="checklist-header"
              >
                <div className="flex items-center gap-3" style={{ minWidth: 0 }}>
                  <StatusIcon style={{
                    width: 18,
                    height: 18,
                    color: rule.status === 'PASS' ? '#34d399' : rule.status === 'FAIL' ? '#fb7185' : '#fbbf24',
                    flexShrink: 0
                  }} />
                  <div style={{ minWidth: 0 }}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>
                        {rule.rule_name}
                      </h4>
                      <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#38bdf8', background: 'rgba(2, 132, 199, 0.15)', padding: '2px 6px', borderRadius: 4 }}>
                        {rule.legal_reference}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>
                      {rule.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
                  <span className={`badge ${statusBadge}`} style={{ fontSize: '0.65rem' }}>
                    {rule.status === 'FAIL' ? 'Violation' : rule.status}
                  </span>
                  <div style={{ color: '#94a3b8' }}>
                    {isExpanded ? <ChevronUp style={{ width: 16, height: 16 }} /> : <ChevronDown style={{ width: 16, height: 16 }} />}
                  </div>
                </div>
              </div>

              {/* Expandable Details Drawer */}
              {isExpanded && (
                <div className="checklist-body">
                  <div className="grid-2">
                    
                    {/* Declared on Label */}
                    <div style={{ background: '#0f172a', borderRadius: 8, padding: 10, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 4 }}>
                        Declared on Packaging
                      </span>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#f1f5f9' }}>
                        {rule.declared_value || "None / Not Detected"}
                      </p>
                    </div>

                    {/* Prescribed Standard */}
                    <div style={{ background: '#0f172a', borderRadius: 8, padding: 10, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#38bdf8', display: 'block', marginBottom: 4 }}>
                        Prescribed Legal Standard (PCR 2011)
                      </span>
                      <p style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                        {rule.expected_standard}
                      </p>
                    </div>

                  </div>

                  {/* Remediation Action If Failed */}
                  {rule.status !== 'PASS' && (
                    <div style={{
                      background: 'rgba(244, 63, 94, 0.12)',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      borderRadius: 8,
                      padding: 10,
                      display: 'flex',
                      gap: 10,
                      alignItems: 'flex-start'
                    }}>
                      <AlertOctagon style={{ width: 16, height: 16, color: '#fb7185', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fda4af', display: 'block', marginBottom: 2 }}>
                          Enforcement Action Required:
                        </span>
                        <p style={{ fontSize: '0.75rem', color: '#fecdd3', lineHeight: 1.4 }}>
                          {rule.remediation_guidance}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
