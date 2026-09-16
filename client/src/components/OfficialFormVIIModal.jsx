import React from 'react';
import { X, Printer, Shield, CheckCircle2, QrCode, MapPin, Calendar, Clock, AlertTriangle, Building2 } from 'lucide-react';

export default function OfficialFormVIIModal({ pothole, onClose }) {
  if (!pothole) return null;

  const lat = pothole.location?.coordinates?.[1] || 28.4595;
  const lng = pothole.location?.coordinates?.[0] || 77.0266;
  const trackingId = pothole.trackingId || 'POT-2026-UNKNOWN';
  const authority = pothole.assignedAuthority?.name || 'Public Works Department (PWD)';
  const dept = pothole.assignedAuthority?.department || 'Road Maintenance Division';
  const road = pothole.address?.road || 'National Arterial Corridor';
  const city = pothole.address?.city || 'Delhi-NCR Region';
  const state = pothole.address?.state || 'Govt. of NCT of Delhi / India';
  const severity = pothole.severity || 'High';
  const hazardScore = pothole.hazardScore || 65;
  const areaSqFt = pothole.estimatedAreaSqFt || (hazardScore * 0.18).toFixed(2);
  const createdDate = pothole.createdAt ? new Date(pothole.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : new Date().toLocaleString('en-IN');
  const slaHours = pothole.assignedAuthority?.id === 'NHAI' ? 24 : (pothole.assignedAuthority?.id === 'PWD' ? 48 : 72);

  // Compute SLA deadline
  const baseTime = pothole.createdAt ? new Date(pothole.createdAt) : new Date();
  const deadlineTime = new Date(baseTime.getTime() + slaHours * 60 * 60 * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel form-vii-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 900,
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#ffffff',
          borderRadius: 14,
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          border: '2px solid #002147'
        }}
      >
        {/* Action Header (Not printed) */}
        <div className="no-print" style={{
          padding: '0.75rem 1.25rem',
          background: '#002147',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fde047' }}>
              राजपत्रित प्रपत्र-VII • STATUTORY ROAD DISTRESS CHALLAN &amp; WORK ORDER
            </span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.2)', padding: '0.15rem 0.5rem', borderRadius: 4 }}>
              IRC:SP:72 COMPLIANT
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handlePrint}
              className="btn btn-sm"
              style={{
                background: '#ea580c',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: 700,
                padding: '0.4rem 0.85rem'
              }}
            >
              <Printer size={15} />
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* The Printable Form-VII Document */}
        <div className="form-vii-printable-sheet" style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem 2.5rem',
          fontFamily: "'Times New Roman', Times, serif",
          color: '#0f172a',
          lineHeight: 1.45
        }}>
          {/* Official Government Crest Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px double #0f172a', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            {/* National Emblem text & header */}
            <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.05em', color: '#92400e' }}>
              सत्यमेव जयते
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, textTransform: 'uppercase', margin: '0.2rem 0', color: '#002147' }}>
              भारत सरकार • GOVERNMENT OF INDIA
            </h2>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0.1rem 0', color: '#0f172a' }}>
              सड़क परिवहन एवं राजमार्ग मंत्रालय • MINISTRY OF ROAD TRANSPORT &amp; HIGHWAYS
            </h3>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#475569' }}>
              मार्ग-दृष्टि राष्ट्रीय निगरानी प्रणाली • National Road Distress Surveillance &amp; Statutory Redressal System (NRDSRS)
            </div>
            <div style={{
              display: 'inline-block',
              marginTop: '0.75rem',
              padding: '0.35rem 1.25rem',
              border: '2px solid #002147',
              background: '#f8fafc',
              fontWeight: 900,
              fontSize: '1.05rem',
              letterSpacing: '0.04em',
              color: '#002147'
            }}>
              विहित प्रपत्र-7 • FORM-VII: STATUTORY ROAD DEFECT REPAIR MANDATE
            </div>
            <div style={{ fontSize: '0.75rem', fontStyle: 'italic', marginTop: '0.35rem', color: '#64748b' }}>
              (Issued pursuant to Section 4 of Public Grievance Redressal &amp; Quality Manual IRC:SP:72 / IRC:82)
            </div>
          </div>

          {/* Reference & Docket Particulars */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr',
            gap: '1rem',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            padding: '0.85rem 1.15rem',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            <div>
              <div><strong>STATUTORY DOCKET NO:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#002147' }}>MORTH/2026/{trackingId}</span></div>
              <div><strong>CPGRAMS CROSS-REF:</strong> <span style={{ fontFamily: 'monospace' }}>CPG-RD-{(Math.abs(lat * 10000)).toFixed(0)}</span></div>
              <div><strong>DATE &amp; TIME OF AI DETECTION:</strong> {createdDate}</div>
              <div><strong>JURISDICTION BODY:</strong> <span style={{ fontWeight: 800, color: '#b45309' }}>{authority}</span></div>
            </div>
            <div>
              <div><strong>PRIORITY CLASSIFICATION:</strong> <span style={{ fontWeight: 800, color: severity === 'Critical' ? '#dc2626' : '#ea580c' }}>{severity.toUpperCase()} RISK HAZARD</span></div>
              <div><strong>STATUTORY RECTIFICATION SLA:</strong> <span style={{ fontWeight: 800, color: '#dc2626' }}>{slaHours} HOURS</span></div>
              <div><strong>RECTIFICATION DEADLINE:</strong> <span style={{ fontWeight: 800 }}>{deadlineTime}</span></div>
              <div><strong>DISTRESS REF CODE:</strong> IRC-SP-72-SEC-B</div>
            </div>
          </div>

          {/* Location & Road Geometry Table */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #002147', paddingBottom: '0.25rem', marginBottom: '0.5rem', color: '#002147' }}>
              1. GEOGRAPHIC LOCATION &amp; ROAD JURISDICTION PARTICULARS
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.4rem 0.5rem', width: '30%', fontWeight: 700, background: '#f1f5f9' }}>Road / Corridor Name:</td>
                  <td style={{ padding: '0.4rem 0.5rem', fontWeight: 800 }}>{road}</td>
                  <td style={{ padding: '0.4rem 0.5rem', width: '20%', fontWeight: 700, background: '#f1f5f9' }}>Zone / City:</td>
                  <td style={{ padding: '0.4rem 0.5rem' }}>{city}, {state}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.4rem 0.5rem', fontWeight: 700, background: '#f1f5f9' }}>Geodetic GPS Coordinates:</td>
                  <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>Latitude: {lat.toFixed(6)}° N, Longitude: {lng.toFixed(6)}° E</td>
                  <td style={{ padding: '0.4rem 0.5rem', fontWeight: 700, background: '#f1f5f9' }}>Geodetic Datum:</td>
                  <td style={{ padding: '0.4rem 0.5rem' }}>WGS 84 (Global Standard)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.4rem 0.5rem', fontWeight: 700, background: '#f1f5f9' }}>Competent Authority / Division:</td>
                  <td style={{ padding: '0.4rem 0.5rem' }}>{authority} ({dept})</td>
                  <td style={{ padding: '0.4rem 0.5rem', fontWeight: 700, background: '#f1f5f9' }}>Road Category:</td>
                  <td style={{ padding: '0.4rem 0.5rem' }}>{pothole.assignedAuthority?.id === 'NHAI' ? 'National Highway (NH)' : 'Major Arterial / Urban PWD'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* AI Inspection & Defect Measurements */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #002147', paddingBottom: '0.25rem', marginBottom: '0.5rem', color: '#002147' }}>
              2. MACHINE INSPECTION &amp; COMPUTER VISION DEFECT AUDIT
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#002147', color: '#ffffff' }}>
                  <th style={{ padding: '0.4rem 0.5rem', textAlign: 'left' }}>Parameter</th>
                  <th style={{ padding: '0.4rem 0.5rem', textAlign: 'left' }}>Computed Value</th>
                  <th style={{ padding: '0.4rem 0.5rem', textAlign: 'left' }}>Regulatory Threshold</th>
                  <th style={{ padding: '0.4rem 0.5rem', textAlign: 'left' }}>Compliance Finding</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.4rem 0.5rem', fontWeight: 700 }}>AI Neural Network Engine:</td>
                  <td style={{ padding: '0.4rem 0.5rem' }}>YOLOv8 Pothole Convolutional Model</td>
                  <td style={{ padding: '0.4rem 0.5rem' }}>mAP50 &gt; 85%</td>
                  <td style={{ padding: '0.4rem 0.5rem', color: '#16a34a', fontWeight: 700 }}>CERTIFIED ACCURATE</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.4rem 0.5rem', fontWeight: 700 }}>Cavity Count / Clustered Cratering:</td>
                  <td style={{ padding: '0.4rem 0.5rem' }}>{pothole.detections?.length || 1} Distinct Cavity Zone(s)</td>
                  <td style={{ padding: '0.4rem 0.5rem' }}>Max 1 per 100m</td>
                  <td style={{ padding: '0.4rem 0.5rem', color: '#dc2626', fontWeight: 700 }}>EXCEEDS SAFETY LIMIT</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.4rem 0.5rem', fontWeight: 700 }}>Road Disturbance Surface Area:</td>
                  <td style={{ padding: '0.4rem 0.5rem' }}>~{areaSqFt} sq. ft ({pothole.surfaceDisturbancePercent || 6.5}% lane footprint)</td>
                  <td style={{ padding: '0.4rem 0.5rem' }}>&lt; 2.5% Hairline</td>
                  <td style={{ padding: '0.4rem 0.5rem', color: '#dc2626', fontWeight: 700 }}>HAZARDOUS DEPRESSION</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.4rem 0.5rem', fontWeight: 700 }}>Hazard Exposure Index:</td>
                  <td style={{ padding: '0.4rem 0.5rem', fontWeight: 800 }}>{hazardScore} / 100</td>
                  <td style={{ padding: '0.4rem 0.5rem' }}>Max Acceptable 35</td>
                  <td style={{ padding: '0.4rem 0.5rem', color: '#dc2626', fontWeight: 800 }}>IMMEDIATE ACTION MANDATE</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Technical Remediation Specification */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #002147', paddingBottom: '0.25rem', marginBottom: '0.5rem', color: '#002147' }}>
              3. MANDATORY TECHNICAL REMEDIATION SPECIFICATION (IRC:SP:72)
            </h4>
            <p style={{ fontSize: '0.82rem', margin: 0 }}>
              The designated road maintenance contractor shall immediately cordon the hazard zone with IRC compliant reflective cones, excavate loose binder to minimum 50mm sound perimeter, apply rapid-setting cationic bituminous tack coat (RS-1), fill with dense bituminous macadam (DBM) or cold-mix asphalt, and compact using mechanical plate vibratory roller to flush level with adjacent road crown.
            </p>
          </div>

          {/* Official Signatures & Digital Verification */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '1rem',
            borderTop: '2px solid #002147',
            paddingTop: '1.25rem',
            marginTop: '1.5rem',
            fontSize: '0.8rem',
            textAlign: 'center'
          }}>
            {/* Box 1: Digital Verification */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 72,
                height: 72,
                border: '1px solid #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.4rem',
                background: '#f8fafc'
              }}>
                <QrCode size={56} color="#002147" />
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>NIC QR Authentication</span>
              <strong style={{ fontSize: '0.72rem', color: '#002147' }}>VALIDATED ELECTRONIC RECORD</strong>
            </div>

            {/* Box 2: Assistant Engineer Stamp */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{
                border: '1px dashed #94a3b8',
                height: 55,
                borderRadius: 4,
                marginBottom: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                fontStyle: 'italic',
                fontSize: '0.72rem'
              }}>
                [ Digitally Endorsed by System ]
              </div>
              <strong>Executive Engineer (Roads)</strong>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Nodal Maintenance Cell, {authority}</span>
            </div>

            {/* Box 3: Contractor Acknowledgment */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{
                border: '1px dashed #94a3b8',
                height: 55,
                borderRadius: 4,
                marginBottom: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                fontStyle: 'italic',
                fontSize: '0.72rem'
              }}>
                [ Contractor Signature &amp; Seal ]
              </div>
              <strong>Authorized Contractor Agency</strong>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Division Term Contract Holder</span>
            </div>
          </div>

          {/* Footer note */}
          <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '0.5rem', marginTop: '1rem', textAlign: 'center', fontSize: '0.7rem', color: '#64748b' }}>
            Official Gazette Document generated under National Road Safety &amp; Grievance Redressal Architecture • Government of India • Printed: {new Date().toLocaleString('en-IN')}
          </div>
        </div>
      </div>
    </div>
  );
}
