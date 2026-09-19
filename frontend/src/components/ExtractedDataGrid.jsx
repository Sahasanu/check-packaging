import React from 'react';
import { Tag, Building2, DollarSign, Calendar, PhoneCall, Globe } from 'lucide-react';

export default function ExtractedDataGrid({ extractedData }) {
  if (!extractedData) return null;

  const {
    brand_name,
    generic_name,
    commodity_category,
    manufacturer_name,
    manufacturer_address,
    country_of_origin,
    net_quantity_raw,
    net_quantity_value,
    net_quantity_unit,
    mrp_raw,
    mrp_amount,
    mrp_has_inclusive_phrase,
    unit_sale_price_raw,
    mfg_date_raw,
    exp_date_raw,
    batch_or_lot_no,
    consumer_care_name_desig,
    consumer_care_phone,
    consumer_care_email,
    fssai_lic_no,
    veg_nonveg_status,
    detected_languages
  } = extractedData;

  return (
    <div className="glass-card">
      <div className="flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 12, marginBottom: 16 }}>
        <div className="flex items-center gap-2">
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tag style={{ width: 16, height: 16 }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
              AI-Extracted Declarations
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Structured data parsed from packaging panel</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {detected_languages?.map((lang) => (
            <span key={lang} className="badge badge-info" style={{ fontSize: '0.65rem' }}>
              {lang}
            </span>
          ))}
        </div>
      </div>

      <div className="grid-3" style={{ gap: 14 }}>
        
        {/* Card 1: Product & Identity */}
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: 14 }}>
          <div className="flex items-center gap-2" style={{ color: '#38bdf8', fontWeight: 600, fontSize: '0.82rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 6, marginBottom: 8 }}>
            <Tag style={{ width: 14, height: 14 }} />
            <span>Commodity Identity</span>
          </div>
          <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', display: 'block' }}>Brand Name:</span>
              <span style={{ fontWeight: 600, color: '#ffffff' }}>{brand_name || 'N/A'}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', display: 'block' }}>Generic Name:</span>
              <span style={{ color: '#cbd5e1' }}>{generic_name || 'Not Declared'}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', display: 'block' }}>Category:</span>
              <span style={{ color: '#cbd5e1' }}>{commodity_category}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Pricing & Net Quantity */}
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: 14 }}>
          <div className="flex items-center gap-2" style={{ color: '#34d399', fontWeight: 600, fontSize: '0.82rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 6, marginBottom: 8 }}>
            <DollarSign style={{ width: 14, height: 14 }} />
            <span>Pricing & Measurement</span>
          </div>
          <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', display: 'block' }}>MRP:</span>
              <span style={{ fontWeight: 600, color: '#ffffff' }}>{mrp_raw || `₹${mrp_amount}`}</span>
              <span style={{ marginLeft: 6, fontSize: '0.68rem', fontWeight: 700, color: mrp_has_inclusive_phrase ? '#34d399' : '#fb7185' }}>
                {mrp_has_inclusive_phrase ? '✓ Taxes Included' : '✗ Missing Tax Phrase'}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', display: 'block' }}>Net Quantity:</span>
              <span style={{ color: '#cbd5e1' }}>{net_quantity_raw || `${net_quantity_value} ${net_quantity_unit}`}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', display: 'block' }}>Declared USP:</span>
              <span style={{ color: '#cbd5e1' }}>{unit_sale_price_raw || 'Not Stated'}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Manufacturer & Origin */}
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: 14 }}>
          <div className="flex items-center gap-2" style={{ color: '#fbbf24', fontWeight: 600, fontSize: '0.82rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 6, marginBottom: 8 }}>
            <Building2 style={{ width: 14, height: 14 }} />
            <span>Manufacturer & Origin</span>
          </div>
          <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', display: 'block' }}>Manufacturer:</span>
              <span style={{ fontWeight: 600, color: '#ffffff' }}>{manufacturer_name || 'Not Found'}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', display: 'block' }}>Premises Address:</span>
              <span style={{ color: '#cbd5e1' }}>{manufacturer_address || 'Missing'}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', display: 'block' }}>Country of Origin:</span>
              <span style={{ color: '#cbd5e1' }}>{country_of_origin}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Dates & Batch */}
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: 14 }}>
          <div className="flex items-center gap-2" style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.82rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 6, marginBottom: 8 }}>
            <Calendar style={{ width: 14, height: 14 }} />
            <span>Dates & Batch Coding</span>
          </div>
          <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', display: 'block' }}>Mfg / Pkd Date:</span>
              <span style={{ fontWeight: 600, color: '#ffffff' }}>{mfg_date_raw || 'Not Found'}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', display: 'block' }}>Expiry / Best Before:</span>
              <span style={{ color: '#cbd5e1' }}>{exp_date_raw || 'N/A'}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', display: 'block' }}>Batch Number:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#cbd5e1' }}>{batch_or_lot_no || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Card 5: Consumer Grievance Cell */}
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: 14 }}>
          <div className="flex items-center gap-2" style={{ color: '#fb7185', fontWeight: 600, fontSize: '0.82rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 6, marginBottom: 8 }}>
            <PhoneCall style={{ width: 14, height: 14 }} />
            <span>Consumer Care (Rule 6(1)(n))</span>
          </div>
          <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', display: 'block' }}>Phone / Toll-Free:</span>
              <span style={{ color: '#cbd5e1' }}>{consumer_care_phone || 'Missing'}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', display: 'block' }}>Email ID:</span>
              <span style={{ color: consumer_care_email ? '#cbd5e1' : '#fb7185', fontWeight: consumer_care_email ? 400 : 700 }}>
                {consumer_care_email || 'Missing Mandatory Email'}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', display: 'block' }}>Contact Person:</span>
              <span style={{ color: '#cbd5e1' }}>{consumer_care_name_desig || 'Manager'}</span>
            </div>
          </div>
        </div>

        {/* Card 6: Allied FSSAI */}
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: 14 }}>
          <div className="flex items-center gap-2" style={{ color: '#38bdf8', fontWeight: 600, fontSize: '0.82rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 6, marginBottom: 8 }}>
            <Globe style={{ width: 14, height: 14 }} />
            <span>Allied Safety Standards</span>
          </div>
          <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', display: 'block' }}>FSSAI Lic No:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#ffffff' }}>{fssai_lic_no || 'Not Detected'}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', display: 'block' }}>Dietary Indicator:</span>
              <span style={{ color: '#cbd5e1' }}>{veg_nonveg_status || 'None'}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', display: 'block' }}>Contrast & Legibility:</span>
              <span style={{ color: '#34d399', fontWeight: 600 }}>Standard Readability</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
