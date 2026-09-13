import React from 'react';
import { AlertOctagon, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function StatsBar({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      title: 'Total Detected',
      value: stats.total || 0,
      icon: AlertOctagon,
      color: 'var(--accent-cyan)',
      bgColor: 'rgba(14, 165, 233, 0.12)',
      subtext: 'GPS Tagged Incidents'
    },
    {
      title: 'Critical & High Risk',
      value: stats.highRiskActive || 0,
      icon: AlertTriangle,
      color: 'var(--accent-red)',
      bgColor: 'rgba(239, 68, 68, 0.12)',
      subtext: 'Immediate Hazard to Traffic'
    },
    {
      title: 'In Progress / Actioned',
      value: (stats.byStatus?.['In Progress'] || 0) + (stats.byStatus?.['Acknowledged'] || 0),
      icon: Clock,
      color: 'var(--accent-yellow)',
      bgColor: 'rgba(245, 158, 11, 0.12)',
      subtext: 'Repair Squads Deployed'
    },
    {
      title: 'Repaired & Resolved',
      value: stats.byStatus?.Resolved || 0,
      icon: CheckCircle2,
      color: 'var(--accent-green)',
      bgColor: 'rgba(16, 185, 129, 0.12)',
      subtext: `${stats.resolutionRate || 0}% Municipal Resolution Rate`
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
      gap: '1rem'
    }}>
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="glass-panel"
            style={{
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}
          >
            <div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {c.title}
              </p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {c.value}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                {c.subtext}
              </p>
            </div>
            <div style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: c.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Icon size={24} color={c.color} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
