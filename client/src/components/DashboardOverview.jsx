import React from 'react';
import {
  Sparkles,
  Map,
  ListFilter,
  BarChart3,
  Building2,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
  PlusCircle,
  FileText,
  User,
  CheckCircle2,
  Award,
  Zap,
  Activity,
  Eye,
  Camera,
  Video
} from 'lucide-react';
// import StatsBar from './StatsBar';
import { useAuth } from '../context/AuthContext';
import { getMediaUrl, FALLBACK_ROAD_IMAGE } from '../services/api';

export default function DashboardOverview({
  stats,
  potholes = [],
  onNavigateTab,
  onSelectPothole,
  onSelectReportMode
}) {
  const { user, isOfficer } = useAuth();

  const myPotholes = potholes.filter(p => 
    user && (p.reportedBy?.id === user._id || p.reportedBy?.email === user.email || p.reportedBy?.id === user.email)
  );

  const criticalPotholes = potholes.filter(p => 
    (p.severity === 'Critical' || p.severity === 'High') && p.status !== 'Resolved'
  ).slice(0, 4);

  const recentPotholes = potholes.slice(0, 5);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
      {/* 1. Real-Time National KPI Stats Bar */}
      {/* <StatsBar stats={stats} /> */}

      {/* 2. Government Ground Action & Fleet Surveillance (Floating Photographic Showcase) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#002147', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Building2 size={19} color="#ea580c" />
            Government Road Enforcement Fleet &amp; Ground Action
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
            Live NHAI, State PWD &amp; Municipal Response Units
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '1.15rem'
        }}>
          {/* Action Card 1: Rapid Road Patching Unit */}
          <div
            onClick={() => onNavigateTab('list')}
            style={{
              position: 'relative',
              borderRadius: 14,
              overflow: 'hidden',
              background: '#0f172a',
              boxShadow: '0 4px 14px rgba(0, 33, 71, 0.08)',
              border: '1px solid #cbd5e1',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 24px rgba(0, 33, 71, 0.18)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 33, 71, 0.08)';
            }}
          >
            <div style={{ height: 155, position: 'relative', overflow: 'hidden' }}>
              <img
                src="/banners/road_repair_action.jpg"
                alt="Government Rapid Road Repair Patching Squad"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: 10,
                left: 10,
                background: 'rgba(234, 88, 12, 0.94)',
                color: '#ffffff',
                padding: '0.2rem 0.6rem',
                borderRadius: 20,
                fontSize: '0.7rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#ffffff', animation: 'pulseDot 1.5s infinite' }}></span>
                <span>Squad #14 Active</span>
              </div>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 50,
                background: 'linear-gradient(to top, rgba(0,33,71,0.9), transparent)'
              }}></div>
            </div>

            <div style={{ padding: '0.85rem 1rem', background: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase' }}>
                  NHAI &amp; PWD Patching
                </span>
                <span style={{ fontSize: '0.65rem', background: '#f0fdf4', color: '#16a34a', padding: '0.1rem 0.35rem', borderRadius: 4, fontWeight: 700, border: '1px solid #bbf7d0' }}>
                  IRC:SP:72
                </span>
              </div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#002147', margin: '0 0 0.25rem' }}>
                Hot-Mix Bitumen Compaction
              </h4>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 0.65rem', lineHeight: 1.35 }}>
                Rapid municipal asphalt squads deployed to clear critical high-hazard road cavities.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 800, color: '#ea580c', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                <span>Work Orders ({potholes.length})</span>
                <ArrowRight size={13} />
              </div>
            </div>
          </div>

          {/* Action Card 2: AI Mobile Laser Patrol Van */}
          <div
            onClick={() => onNavigateTab('wizard')}
            style={{
              position: 'relative',
              borderRadius: 14,
              overflow: 'hidden',
              background: '#0f172a',
              boxShadow: '0 4px 14px rgba(0, 33, 71, 0.08)',
              border: '1px solid #cbd5e1',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 24px rgba(0, 33, 71, 0.18)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 33, 71, 0.08)';
            }}
          >
            <div style={{ height: 155, position: 'relative', overflow: 'hidden' }}>
              <img
                src="/banners/highway_laser_inspection.jpg"
                alt="AI Highway Laser Road Quality Van"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: 10,
                left: 10,
                background: 'rgba(2, 132, 199, 0.94)',
                color: '#ffffff',
                padding: '0.2rem 0.6rem',
                borderRadius: 20,
                fontSize: '0.7rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#38bdf8', animation: 'pulseDot 1.5s infinite' }}></span>
                <span>Laser Patrol RSV-41</span>
              </div>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 50,
                background: 'linear-gradient(to top, rgba(0,33,71,0.9), transparent)'
              }}></div>
            </div>

            <div style={{ padding: '0.85rem 1rem', background: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
                  Computer Vision Suite
                </span>
                <span style={{ fontSize: '0.65rem', background: '#eff6ff', color: '#0284c7', padding: '0.1rem 0.35rem', borderRadius: 4, fontWeight: 700, border: '1px solid #bfdbfe' }}>
                  YOLOv8 150ms
                </span>
              </div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#002147', margin: '0 0 0.25rem' }}>
                Laser HUD Cavity Profiling
              </h4>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 0.65rem', lineHeight: 1.35 }}>
                Real-time mobile pavement depth scanner analyzing highway distress under 150ms latency.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 800, color: '#0284c7', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                <span>Launch AI Studio</span>
                <ArrowRight size={13} />
              </div>
            </div>
          </div>

          {/* Action Card 3: Form-VII Statutory Proof */}
          <div
            onClick={() => onNavigateTab('map')}
            style={{
              position: 'relative',
              borderRadius: 14,
              overflow: 'hidden',
              background: '#0f172a',
              boxShadow: '0 4px 14px rgba(0, 33, 71, 0.08)',
              border: '1px solid #cbd5e1',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 24px rgba(0, 33, 71, 0.18)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 33, 71, 0.08)';
            }}
          >
            <div style={{ height: 155, position: 'relative', overflow: 'hidden' }}>
              <img
                src="/banners/pothole_repaired_after.jpg"
                alt="Form-VII Verified Repaired Road Section"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: 10,
                left: 10,
                background: 'rgba(22, 163, 74, 0.94)',
                color: '#ffffff',
                padding: '0.2rem 0.6rem',
                borderRadius: 20,
                fontSize: '0.7rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}>
                <CheckCircle2 size={13} />
                <span>Form-VII Verified</span>
              </div>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 50,
                background: 'linear-gradient(to top, rgba(0,33,71,0.9), transparent)'
              }}></div>
            </div>

            <div style={{ padding: '0.85rem 1rem', background: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase' }}>
                  Statutory Clearance
                </span>
                <span style={{ fontSize: '0.65rem', background: '#f0fdf4', color: '#16a34a', padding: '0.1rem 0.35rem', borderRadius: 4, fontWeight: 700, border: '1px solid #bbf7d0' }}>
                  Audit Passed
                </span>
              </div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#002147', margin: '0 0 0.25rem' }}>
                Repaired Pavement Proof
              </h4>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 0.65rem', lineHeight: 1.35 }}>
                Statutory resolution with photographic proof and citizen reputation point disbursement.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 800, color: '#16a34a', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                <span>Explore Live GIS Map</span>
                <ArrowRight size={13} />
              </div>
            </div>
          </div>

          {/* Action Card 4: Gati Shakti Expressway Grid */}
          <div
            onClick={() => onNavigateTab('analytics')}
            style={{
              position: 'relative',
              borderRadius: 14,
              overflow: 'hidden',
              background: '#0f172a',
              boxShadow: '0 4px 14px rgba(0, 33, 71, 0.08)',
              border: '1px solid #cbd5e1',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 24px rgba(0, 33, 71, 0.18)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 33, 71, 0.08)';
            }}
          >
            <div style={{ height: 155, position: 'relative', overflow: 'hidden' }}>
              <img
                src="/banners/gati_shakti_expressway.jpg"
                alt="PM Gati Shakti High Speed Expressway Corridor"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: 10,
                left: 10,
                background: 'rgba(147, 51, 234, 0.94)',
                color: '#ffffff',
                padding: '0.2rem 0.6rem',
                borderRadius: 20,
                fontSize: '0.7rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}>
                <Sparkles size={12} />
                <span>Gati Shakti Masterplan</span>
              </div>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 50,
                background: 'linear-gradient(to top, rgba(0,33,71,0.9), transparent)'
              }}></div>
            </div>

            <div style={{ padding: '0.85rem 1rem', background: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#9333ea', textTransform: 'uppercase' }}>
                  National Infrastructure
                </span>
                <span style={{ fontSize: '0.65rem', background: '#faf5ff', color: '#9333ea', padding: '0.1rem 0.35rem', borderRadius: 4, fontWeight: 700, border: '1px solid #e9d5ff' }}>
                  10,000+ km Grid
                </span>
              </div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#002147', margin: '0 0 0.25rem' }}>
                High-Speed Corridors
              </h4>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 0.65rem', lineHeight: 1.35 }}>
                National road health benchmarking with zero-pothole corridors across 28 States.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 800, color: '#9333ea', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                <span>Inspect KPIs</span>
                <ArrowRight size={13} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Feature Suite Operational Launchpad (All 4 Interactive Modules) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#002147', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Zap size={18} color="#ea580c" />
            Operational Tools &amp; Feature Modules
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
            Click any module to launch tool
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem'
        }}>
          {/* Card 1: AI Detection Studio */}
          <div
            className="feature-card"
            onClick={() => onNavigateTab('wizard')}
            style={{
              background: '#ffffff',
              borderRadius: 12,
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: '#fff7ed',
                border: '1px solid #fed7aa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ea580c',
                marginBottom: '0.85rem'
              }}>
                <Sparkles size={22} />
              </div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem' }}>
                AI Detection Studio
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Run deep learning computer vision on dashcam photos or videos with manual damage area selector.
              </p>
            </div>

            <div style={{
              marginTop: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#ea580c'
            }}>
              <span>Launch Studio</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Card 2: Interactive GIS Map */}
          <div
            className="feature-card"
            onClick={() => onNavigateTab('map')}
            style={{
              background: '#ffffff',
              borderRadius: 12,
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0284c7',
                marginBottom: '0.85rem'
              }}>
                <Map size={22} />
              </div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem' }}>
                Live National GIS Map
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Explore real road coordinates across India with pulsing hazard pins, heatmaps, and authority filters.
              </p>
            </div>

            <div style={{
              marginTop: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#0284c7'
            }}>
              <span>Open Map View</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Card 3: Grievances & Work Orders Directory */}
          <div
            className="feature-card"
            onClick={() => onNavigateTab('list')}
            style={{
              background: '#ffffff',
              borderRadius: 12,
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16a34a',
                marginBottom: '0.85rem'
              }}>
                <ListFilter size={22} />
              </div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem' }}>
                Grievances &amp; Tickets
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Track statutory resolution lifecycles, print Form-VII mandates, and upload repair proof photos.
              </p>
            </div>

            <div style={{
              marginTop: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#16a34a'
            }}>
              <span>View {potholes.length} Incidents</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Card 4: Nagar Palika Analytics */}
          <div
            className="feature-card"
            onClick={() => onNavigateTab('analytics')}
            style={{
              background: '#ffffff',
              borderRadius: 12,
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: '#faf5ff',
                border: '1px solid #e9d5ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9333ea',
                marginBottom: '0.85rem'
              }}>
                <BarChart3 size={22} />
              </div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem' }}>
                National Progress KPIs
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Municipal performance benchmarks, repair turnaround compliance, and statutory dispatch logs.
              </p>
            </div>

            <div style={{
              marginTop: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#9333ea'
            }}>
              <span>Inspect Analytics</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Split Section: High-Priority Active Hazards & My Activity */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
        gap: '1.25rem'
      }}>
        {/* Left: High-Priority Road Hazards */}
        <div style={{
          background: '#ffffff',
          borderRadius: 14,
          padding: '1.25rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <AlertTriangle size={18} color="#dc2626" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Critical Active Road Hazards
              </h4>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('list')}
              style={{ background: 'none', border: 'none', color: '#ea580c', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              View All &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {criticalPotholes.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '1rem 0', textAlign: 'center' }}>
                No active critical hazards flagged.
              </p>
            ) : (
              criticalPotholes.map(p => (
                <div
                  key={p._id || p.trackingId}
                  onClick={() => onSelectPothole(p)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 8,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 44, height: 34, borderRadius: 6, overflow: 'hidden', background: '#cbd5e1', flexShrink: 0 }}>
                      <img
                        src={getMediaUrl(p.images?.annotatedUrl || p.images?.originalUrl)}
                        alt="Hazard"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          if (e.target.src !== FALLBACK_ROAD_IMAGE && !e.target.src.endsWith(FALLBACK_ROAD_IMAGE)) {
                            e.target.src = FALLBACK_ROAD_IMAGE;
                          }
                        }}
                      />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                        {p.address?.road || p.title}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        #{p.trackingId} • {p.assignedAuthority?.name || 'Assigned Authority'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                    <span className={`badge ${getSeverityBadgeClass(p.severity)}`}>
                      {p.severity}
                    </span>
                    <span className={`badge ${getStatusBadgeClass(p.status)}`} style={{ fontSize: '0.65rem' }}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: User Submissions & Quick Help */}
        <div style={{
          background: '#ffffff',
          borderRadius: 14,
          padding: '1.25rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Award size={18} color="#002147" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {isOfficer ? 'Nodal Department Status' : 'My Reported Road Defects'}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('list')}
              style={{ background: 'none', border: 'none', color: '#002147', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Open Ticket List &rarr;
            </button>
          </div>

          {!isOfficer && myPotholes.length === 0 ? (
            <div style={{
              padding: '1.5rem 1rem',
              textAlign: 'center',
              background: '#f8fafc',
              borderRadius: 8,
              border: '1px dashed #cbd5e1'
            }}>
              <Camera size={28} color="#94a3b8" style={{ margin: '0 auto 0.5rem' }} />
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', margin: '0 0 0.25rem' }}>
                You haven't reported any road defects yet
              </p>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 0.85rem' }}>
                Spot a pothole while driving? Take a photo or upload video to earn +15 civic points.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (onSelectReportMode) onSelectReportMode('photo');
                  onNavigateTab('wizard');
                }}
                className="btn btn-primary btn-sm"
              >
                <PlusCircle size={13} />
                Report First Pothole
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {(isOfficer ? recentPotholes : myPotholes.slice(0, 4)).map(p => (
                <div
                  key={p._id || p.trackingId}
                  onClick={() => onSelectPothole(p)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 8,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div>
                    <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                      {p.address?.road || p.title}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      #{p.trackingId} • Reported {new Date(p.reportedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <span className={`badge ${getStatusBadgeClass(p.status)}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
