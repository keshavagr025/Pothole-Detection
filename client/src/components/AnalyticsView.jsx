import React, { useEffect, useState } from 'react';
import { BarChart3, PieChart, ShieldAlert, CheckCircle, Send, AlertTriangle } from 'lucide-react';
import { fetchRecentDispatches } from '../services/api';

export default function AnalyticsView({ stats, potholes = [] }) {
  const [dispatches, setDispatches] = useState([]);

  useEffect(() => {
    fetchRecentDispatches().then(data => setDispatches(data || [])).catch(() => {});
  }, []);

  if (!stats) return null;

  const total = stats.total || 1;
  const severities = [
    { label: 'Critical', count: stats.bySeverity?.Critical || 0, color: '#ef4444' },
    { label: 'High', count: stats.bySeverity?.High || 0, color: '#f97316' },
    { label: 'Medium', count: stats.bySeverity?.Medium || 0, color: '#f59e0b' },
    { label: 'Low', count: stats.bySeverity?.Low || 0, color: '#10b981' }
  ];

  const authorities = Object.entries(stats.byAuthority || {}).map(([key, count]) => ({
    name: key,
    count,
    pct: Math.round((count / total) * 100)
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Title */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={22} color="var(--accent-cyan)" />
          Civic Road Hazard Analytics &amp; Municipal Performance
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
          Real-time metrics tracking road defect density, severity exposure, and municipal response turnaround across Delhi-NCR.
        </p>
      </div>

      {/* Grid of Chart Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
        {/* Severity Distribution Card */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} color="var(--accent-red)" />
            Hazard Severity Exposure
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {severities.map((s) => {
              const pct = Math.round((s.count / total) * 100);
              return (
                <div key={s.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{s.label} Severity</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{s.count} ({pct}%)</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: '#e2e8f0', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: s.color, borderRadius: 4, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Authority Workload Card */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={18} color="var(--accent-cyan)" />
            Authority Incident Workload
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {authorities.map((a) => (
              <div key={a.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{a.name}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{a.count} tickets ({a.pct}%)</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: '#e2e8f0', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${a.pct}%`, background: 'var(--accent-cyan)', borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Dispatches Audit Table */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Send size={18} color="var(--accent-orange)" />
          Live Civic Dispatch Log &amp; Automated Webhook Transmissions
        </h3>

        {dispatches.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            No recent external dispatches logged. Run a scan in the Detection Studio to generate a live dispatch event!
          </p>
        ) : (
          <div className="table-responsive-wrapper">
            <table style={{ width: '100%', minWidth: 600, borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.6rem 0.85rem' }}>Tracking Ticket</th>
                  <th style={{ padding: '0.6rem 0.85rem' }}>Dispatched To</th>
                  <th style={{ padding: '0.6rem 0.85rem' }}>Official Email</th>
                  <th style={{ padding: '0.6rem 0.85rem' }}>SLA Target</th>
                  <th style={{ padding: '0.6rem 0.85rem' }}>Dispatched At</th>
                  <th style={{ padding: '0.6rem 0.85rem' }}>Transmission Channel</th>
                </tr>
              </thead>
              <tbody>
                {dispatches.slice(0, 8).map((d, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.6rem 0.85rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      #{d.ticketId}
                    </td>
                    <td style={{ padding: '0.6rem 0.85rem', fontWeight: 600, color: '#0f172a' }}>
                      {d.sentTo?.authorityName}
                    </td>
                    <td style={{ padding: '0.6rem 0.85rem', color: '#0284c7' }}>
                      {d.sentTo?.officialEmail}
                    </td>
                    <td style={{ padding: '0.6rem 0.85rem', color: '#b45309', fontWeight: 700 }}>
                      {d.slaTarget}
                    </td>
                    <td style={{ padding: '0.6rem 0.85rem', color: 'var(--text-secondary)' }}>
                      {new Date(d.dispatchedAt).toLocaleTimeString()}
                    </td>
                    <td style={{ padding: '0.6rem 0.85rem' }}>
                      <span className="badge badge-safe">
                        Delivered
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
