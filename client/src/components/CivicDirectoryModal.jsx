import React from 'react';
import { Building2, Phone, Mail, Clock, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';

export default function CivicDirectoryModal({ authorities = {}, potholes = [] }) {
  // Count active incidents per authority
  const counts = {};
  potholes.forEach(p => {
    const authId = p.assignedAuthority?.id;
    if (authId) {
      counts[authId] = (counts[authId] || 0) + 1;
    }
  });

  const list = Object.values(authorities);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building2 size={22} color="var(--accent-cyan)" />
          Civic Authority Directory &amp; Jurisdiction Routing
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
          RoadMantri automatically analyzes road classification (Highways &rarr; NHAI, Major Arterials &gt; 60ft &rarr; PWD, Colony Streets &rarr; Nagar Palika / MCD) to direct emergency alerts to the exact maintenance jurisdiction.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
        gap: '1rem'
      }}>
        {list.map((auth) => {
          const activeCount = counts[auth.id] || 0;
          return (
            <div
              key={auth.id}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                borderLeft: `4px solid ${
                  auth.id === 'NHAI' ? '#0284c7' : (auth.id === 'PWD' ? '#7c3aed' : (auth.id === 'NDMC' ? '#0f766e' : '#ea580c'))
                }`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    {auth.name}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {auth.department}
                  </p>
                </div>
                <span className="badge badge-nhai">
                  {activeCount} Tickets
                </span>
              </div>

              <div style={{
                background: '#f8fafc',
                borderRadius: 8,
                padding: '0.65rem 0.85rem',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.4,
                border: '1px solid var(--border-subtle)'
              }}>
                <strong style={{ color: '#0f172a' }}>Road Responsibilities:</strong>
                <br />
                {auth.roadTypes?.join(', ') || 'Corridor streets'}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem', marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                  <Mail size={14} color="var(--accent-cyan)" />
                  <span>Email: <strong style={{ color: '#0f172a' }}>{auth.email}</strong></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                  <Phone size={14} color="var(--accent-green)" />
                  <span>Helpline: <strong style={{ color: '#0f172a' }}>{auth.helpline}</strong></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                  <Clock size={14} color="var(--accent-orange)" />
                  <span>SLA: <strong style={{ color: '#ea580c' }}>{auth.escalationSLA}</strong></span>
                </div>
              </div>

              {auth.website && (
                <a
                  href={auth.website}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.75rem' }}
                >
                  Official Grievance Portal
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
