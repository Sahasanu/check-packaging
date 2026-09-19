import React, { useState, useEffect } from 'react';
import { X, Search, FileText, Download, ShieldCheck, ShieldAlert, ShieldX, RefreshCw } from 'lucide-react';

export default function AuditHistoryModal({ isOpen, onClose, onSelectScanId }) {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = history.filter(item => 
    item.product_name?.toLowerCase().includes(search.toLowerCase()) ||
    item.brand_name?.toLowerCase().includes(search.toLowerCase()) ||
    item.scan_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText style={{ width: 20, height: 20, color: '#38bdf8' }} />
              Packaging Compliance Audit Log
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Search and review previously audited commodities</p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: 6, borderRadius: 8 }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2" style={{ padding: '12px 24px', background: '#090d16', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div className="flex items-center flex-1" style={{ position: 'relative' }}>
            <Search style={{ width: 14, height: 14, color: '#64748b', position: 'absolute', left: 10 }} />
            <input
              type="text"
              placeholder="Search by brand, commodity name, or scan ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 32px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: 8,
                color: '#ffffff',
                fontSize: '0.78rem',
                outline: 'none'
              }}
            />
          </div>
          <button
            onClick={fetchHistory}
            className="btn btn-secondary btn-sm"
            title="Refresh History"
          >
            <RefreshCw style={{ width: 14, height: 14 }} className={isLoading ? 'spin' : ''} />
          </button>
        </div>

        {/* History List */}
        <div className="modal-body">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: '#94a3b8', fontSize: '0.82rem' }}>
              {isLoading ? "Loading audit records..." : "No scan records found."}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((item) => {
                let badgeClass = "badge-pass";
                let StatusIcon = ShieldCheck;
                if (item.overall_status === "NON_COMPLIANT") {
                  badgeClass = "badge-fail";
                  StatusIcon = ShieldX;
                } else if (item.overall_status === "FLAGGED_FOR_REVIEW") {
                  badgeClass = "badge-warning";
                  StatusIcon = ShieldAlert;
                }

                return (
                  <div
                    key={item.scan_id}
                    className="flex flex-wrap items-center justify-between gap-3"
                    style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 12,
                      padding: '12px 16px'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: '#090d16',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <StatusIcon style={{
                          width: 18,
                          height: 18,
                          color: item.overall_status === 'COMPLIANT' ? '#34d399' : '#fb7185'
                        }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                            {item.product_name || item.brand_name}
                          </h4>
                          <span className={`badge ${badgeClass}`} style={{ fontSize: '0.62rem' }}>
                            {item.compliance_score}%
                          </span>
                        </div>
                        <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>
                          {item.timestamp} • Scan ID: {item.scan_id.slice(0, 8)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onSelectScanId(item.scan_id);
                          onClose();
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        View Report
                      </button>
                      <a
                        href={`/api/export-pdf/${item.scan_id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary btn-sm"
                      >
                        <Download style={{ width: 12, height: 12 }} />
                        PDF
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
