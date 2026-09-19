import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Sparkles } from 'lucide-react';

export default function SamplePicker({ onSelectSample, activeSampleId, isScanning }) {
  const samples = [
    {
      id: "sample1",
      title: "Kurkure Masala Munch",
      subtitle: "85g Snack Packet",
      verdictType: "pass",
      verdictLabel: "100% Compliant",
      description: "All mandatory Rule 6 declarations, USP & tax clauses present.",
      icon: CheckCircle2
    },
    {
      id: "sample2",
      title: "Lay's Magic Masala",
      subtitle: "50g Potato Chips",
      verdictType: "fail",
      verdictLabel: "Rule 6(1)(e) Violation",
      description: "MRP declares ₹20.00 but omits mandatory '(incl. of all taxes)'.",
      icon: XCircle
    },
    {
      id: "sample3",
      title: "Parle-G Glucose",
      subtitle: "130g Biscuit Pack",
      verdictType: "fail",
      verdictLabel: "USP Math Error",
      description: "Declared USP (₹0.15/g) deviates from computed rate (₹0.08/g) + Missing Email.",
      icon: AlertTriangle
    },
    {
      id: "sample4",
      title: "Maggi 2-Min Noodles",
      subtitle: "70g Instant Noodles",
      verdictType: "critical",
      verdictLabel: "Critical Non-Compliance",
      description: "Missing manufacturing factory address & consumer redressal cell.",
      icon: XCircle
    }
  ];

  return (
    <div className="sample-picker-section">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles style={{ width: 16, height: 16, color: '#38bdf8' }} />
          <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#cbd5e1' }}>
            Quick Test Samples (Instant 1-Click Verification)
          </h3>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Preset statutory test cases</span>
      </div>

      <div className="grid-4">
        {samples.map((s) => {
          const Icon = s.icon;
          const isSelected = activeSampleId === s.id;
          
          let badgeClass = "badge-pass";
          if (s.verdictType === "fail" || s.verdictType === "critical") {
            badgeClass = "badge-fail";
          } else if (s.verdictType === "warning") {
            badgeClass = "badge-warning";
          }

          return (
            <div
              key={s.id}
              onClick={() => !isScanning && onSelectSample(s.id)}
              className={`sample-card ${isSelected ? 'active' : ''}`}
              style={{ opacity: isScanning ? 0.6 : 1 }}
            >
              <div>
                <div style={{ marginBottom: 8 }}>
                  <span className={`badge ${badgeClass}`} style={{ fontSize: '0.65rem' }}>
                    <Icon style={{ width: 12, height: 12 }} />
                    {s.verdictLabel}
                  </span>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>{s.title}</h4>
                <p style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 500, marginTop: 2 }}>{s.subtitle}</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 6, lineHeight: 1.4 }}>
                  {s.description}
                </p>
              </div>

              <div className="flex items-center justify-between" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 8, fontSize: '0.72rem', color: '#64748b' }}>
                <span>Click to Audit</span>
                <span style={{ color: '#38bdf8', fontWeight: 600 }}>Test Sample →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
