import React from 'react';
import { Calculator, CheckCircle, AlertTriangle } from 'lucide-react';

export default function USPMathInspector({ uspCheck, mrpAmount, netQtyValue, netQtyUnit }) {
  if (!uspCheck) return null;

  const {
    declared_usp,
    calculated_usp,
    standard_unit,
    is_match,
    discrepancy_percentage,
    formula_used,
    commentary
  } = uspCheck;

  return (
    <div className="glass-card" style={{
      borderColor: is_match ? 'rgba(56, 189, 248, 0.3)' : 'rgba(244, 63, 94, 0.4)',
      background: is_match ? 'rgba(15, 23, 42, 0.7)' : 'rgba(244, 63, 94, 0.06)'
    }}>
      <div className="flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 12 }}>
        <div className="flex items-center gap-2">
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: is_match ? 'rgba(56, 189, 248, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            color: is_match ? '#38bdf8' : '#fb7185',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calculator style={{ width: 16, height: 16 }} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>
              Rule 6(11) Unit Sale Price (USP) Automated Math Engine
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Legal Metrology 2022 Amendment Verification
            </span>
          </div>
        </div>

        <div>
          {is_match ? (
            <span className="badge badge-pass" style={{ fontSize: '0.7rem' }}>
              <CheckCircle style={{ width: 12, height: 12 }} />
              Verified Match
            </span>
          ) : (
            <span className="badge badge-fail" style={{ fontSize: '0.7rem' }}>
              <AlertTriangle style={{ width: 12, height: 12 }} />
              {discrepancy_percentage}% Discrepancy
            </span>
          )}
        </div>
      </div>

      {/* Interactive Math Equation Visualizer */}
      <div className="grid-3" style={{ margin: '14px 0' }}>
        
        {/* Step 1: Input Variables */}
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: 12 }}>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
            Packaging Inputs
          </span>
          <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="flex justify-between">
              <span style={{ color: '#94a3b8' }}>Declared MRP:</span>
              <span style={{ fontWeight: 600, color: '#ffffff' }}>₹{mrpAmount || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#94a3b8' }}>Net Quantity:</span>
              <span style={{ fontWeight: 600, color: '#ffffff' }}>{netQtyValue} {netQtyUnit}</span>
            </div>
          </div>
        </div>

        {/* Step 2: Formula & Calculation */}
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: 12 }}>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#38bdf8', display: 'block', marginBottom: 6 }}>
            Statutory Formula
          </span>
          <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontFamily: 'var(--font-mono)', color: '#7dd3fc', background: '#090d16', padding: '3px 6px', borderRadius: 4, fontSize: '0.72rem' }}>
              USP = MRP / Net Quantity
            </div>
            <div className="flex justify-between" style={{ marginTop: 2 }}>
              <span style={{ color: '#94a3b8' }}>Calculated Rate:</span>
              <span style={{ fontWeight: 700, color: '#34d399' }}>₹{calculated_usp} {standard_unit}</span>
            </div>
          </div>
        </div>

        {/* Step 3: Declared vs Calculated Verdict */}
        <div style={{
          background: is_match ? 'rgba(15, 23, 42, 0.8)' : 'rgba(244, 63, 94, 0.15)',
          border: '1px solid',
          borderColor: is_match ? 'rgba(255, 255, 255, 0.08)' : 'rgba(244, 63, 94, 0.4)',
          borderRadius: 10,
          padding: 12
        }}>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
            Label Declaration
          </span>
          <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="flex justify-between">
              <span style={{ color: '#94a3b8' }}>Printed USP:</span>
              <span style={{ fontWeight: 600, color: is_match ? '#ffffff' : '#fb7185' }}>
                {declared_usp || 'Not Stated'}
              </span>
            </div>
            <div className="flex justify-between" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 4 }}>
              <span style={{ color: '#94a3b8' }}>Deviation:</span>
              <span style={{ fontWeight: 700, color: is_match ? '#34d399' : '#fb7185' }}>
                {discrepancy_percentage > 0 ? `${discrepancy_percentage}%` : '0.00% (Exact)'}
              </span>
            </div>
          </div>
        </div>

      </div>

      <p style={{
        fontSize: '0.75rem',
        color: '#e2e8f0',
        background: 'rgba(9, 13, 22, 0.6)',
        padding: '8px 12px',
        borderRadius: 8,
        border: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <span style={{ color: '#38bdf8', fontWeight: 600 }}>Audit Finding: </span>
        {commentary}
      </p>
    </div>
  );
}
