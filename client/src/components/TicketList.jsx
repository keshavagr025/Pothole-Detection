import React, { useState } from 'react';
import { Search, Eye, Filter, ArrowUpDown, Clock, MapPin, CheckCircle, ExternalLink, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMediaUrl, FALLBACK_ROAD_IMAGE } from '../services/api';

export default function TicketList({
  potholes = [],
  onSelectPothole,
  onUpdateStatus,
  filterSeverity,
  setFilterSeverity,
  filterStatus,
  setFilterStatus,
  filterAuthority,
  setFilterAuthority,
  filterMyReportsOnly = false,
  setFilterMyReportsOnly = () => {}
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const { user, isAuthenticated } = useAuth();

  const filtered = potholes.filter(p => {
    if (filterSeverity !== 'all' && p.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (filterAuthority !== 'all' && p.assignedAuthority?.id !== filterAuthority) return false;

    if (filterMyReportsOnly && user) {
      const isMine = p.reportedBy?.id === user._id || p.reportedBy?.email === user.email || p.reportedBy?.id === user.email;
      if (!isMine) return false;
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTrack = p.trackingId?.toLowerCase().includes(q);
      const matchRoad = p.address?.road?.toLowerCase().includes(q);
      const matchCity = p.address?.city?.toLowerCase().includes(q);
      const matchAuth = p.assignedAuthority?.name?.toLowerCase().includes(q);
      const matchReporter = p.reportedBy?.name?.toLowerCase().includes(q);
      return matchTrack || matchRoad || matchCity || matchAuth || matchReporter;
    }
    return true;
  });

  const getSeverityBadgeClass = (sev) => {
    if (sev === 'Critical') return 'badge-critical';
    if (sev === 'High') return 'badge-high';
    if (sev === 'Medium') return 'badge-medium';
    return 'badge-low';
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'Resolved') return 'badge-status-resolved';
    if (status === 'In Progress') return 'badge-status-in-progress';
    if (status === 'Acknowledged') return 'badge-status-acknowledged';
    return 'badge-status-reported';
  };

  const getAuthorityBadgeClass = (authId) => {
    if (authId === 'NHAI') return 'badge-nhai';
    if (authId === 'PWD') return 'badge-pwd';
    if (authId === 'NDMC') return 'badge-ndmc';
    return 'badge-mcd';
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Top Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 260px', width: '100%' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by Tracking ID, Road, Reporter, or Authority..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-control"
              style={{ paddingLeft: '2.2rem' }}
            />
          </div>
        </div>

        {/* Filter dropdowns */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', width: 'auto' }}>
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => setFilterMyReportsOnly(!filterMyReportsOnly)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.75rem',
                borderRadius: 6,
                border: filterMyReportsOnly ? '1px solid #ea580c' : '1px solid #cbd5e1',
                background: filterMyReportsOnly ? '#fff7ed' : '#ffffff',
                color: filterMyReportsOnly ? '#ea580c' : '#002147',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <User size={13} />
              <span>{filterMyReportsOnly ? 'Showing My Reports (Filtered)' : 'My Reports Only'}</span>
            </button>
          )}

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="input-control"
            style={{ width: 'auto', fontSize: '0.8rem', padding: '0.45rem 0.65rem' }}
          >
            <option value="all">All Severities</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-control"
            style={{ width: 'auto', fontSize: '0.8rem', padding: '0.45rem 0.65rem' }}
          >
            <option value="all">All Statuses</option>
            <option value="Reported">Reported</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={filterAuthority}
            onChange={(e) => setFilterAuthority(e.target.value)}
            className="input-control"
            style={{ width: 'auto', fontSize: '0.8rem', padding: '0.45rem 0.65rem' }}
          >
            <option value="all">All Authorities</option>
            <option value="NHAI">NHAI</option>
            <option value="PWD">PWD</option>
            <option value="MCD_SOUTH">MCD South</option>
            <option value="MCD_NORTH">MCD North</option>
            <option value="NDMC">NDMC</option>
          </select>
        </div>
      </div>

      {/* Incident List Table / Cards */}
      {filtered.length === 0 ? (
        <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No road incidents match current filters.</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.35rem' }}>
            {filterMyReportsOnly ? 'You have not submitted any reports under this account yet.' : 'Try clearing filters or run a scan in the Detection Studio.'}
          </p>
        </div>
      ) : (
        <div>
          <div className="mobile-swipe-hint">
            &larr; Swipe table horizontally to view full ticket record &rarr;
          </div>
          <div className="table-responsive-wrapper">
            <table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Tracking ID</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Preview</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Corridor / Location</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Severity</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Assigned Civic Body</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Reporter</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Reported</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
            <tbody>
              {filtered.map((p) => {
                const lat = p.location?.coordinates?.[1]?.toFixed(4);
                const lng = p.location?.coordinates?.[0]?.toFixed(4);
                const reportedDate = new Date(p.reportedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <tr
                    key={p._id || p.trackingId}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background 0.15s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    onClick={() => onSelectPothole(p)}
                  >
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      #{p.trackingId}
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ width: 56, height: 42, borderRadius: 6, overflow: 'hidden', background: '#e2e8f0' }}>
                        <img
                          src={getMediaUrl(p.images?.annotatedUrl || p.images?.originalUrl)}
                          alt="Thumbnail"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            if (e.target.src !== FALLBACK_ROAD_IMAGE && !e.target.src.endsWith(FALLBACK_ROAD_IMAGE)) {
                              e.target.src = FALLBACK_ROAD_IMAGE;
                            }
                          }}
                        />
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {p.address?.road || p.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {p.address?.suburb ? `${p.address.suburb}, ` : ''}{p.address?.city || 'Delhi'} ({lat}, {lng})
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge ${getSeverityBadgeClass(p.severity)}`}>
                        {p.severity} ({p.hazardScore || 50}/100)
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge ${getAuthorityBadgeClass(p.assignedAuthority?.id)}`}>
                        {p.assignedAuthority?.name || p.assignedAuthority?.id || 'Civic Authority'}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
                          {p.reportedBy?.name || 'Citizen Reporter'}
                        </span>
                        {user && (p.reportedBy?.id === user._id || p.reportedBy?.email === user.email) && (
                          <span style={{
                            fontSize: '0.62rem',
                            padding: '0.1rem 0.35rem',
                            borderRadius: 4,
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            fontWeight: 800,
                            border: '1px solid #bfdbfe'
                          }}>
                            YOU
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                        {p.reportedBy?.role === 'officer' ? 'Official Patrol' : 'Citizen App'}
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge ${getStatusBadgeClass(p.status)}`}>
                        {p.status}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {reportedDate}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPothole(p);
                        }}
                      >
                        <Eye size={13} />
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
