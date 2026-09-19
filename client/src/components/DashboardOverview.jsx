import React, { useState } from 'react';
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
  Video,
  ChevronRight,
  Layers,
  Shield,
  FileCheck
} from 'lucide-react';
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
  const [activeRightTab, setActiveRightTab] = useState('roadmap'); // 'roadmap' | 'my_reports'
  const [selectedStage, setSelectedStage] = useState(2); // Default to stage 3: rapid ground repair

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

      {/* 4. Split Section: High-Priority Road Hazards & Government Statutory Redressal Roadmap */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
        gap: '1.25rem',
        alignItems: 'start'
      }}>
        {/* Left: High-Priority Active Road Hazards with AI HUD & SLA Timers */}
        <div style={{
          background: '#ffffff',
          borderRadius: 14,
          padding: '1.25rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 14px rgba(0, 33, 71, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: '#fef2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #fee2e2'
              }}>
                <AlertTriangle size={17} color="#dc2626" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Critical Active Road Hazards
                </h4>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  Statutory 24-48h SLA countdown active
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('list')}
              style={{
                background: '#fff7ed',
                border: '1px solid #fed7aa',
                color: '#ea580c',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                padding: '0.25rem 0.6rem',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                transition: 'all 0.15s'
              }}
            >
              <span>View All ({criticalPotholes.length})</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {criticalPotholes.length === 0 ? (
              <div style={{
                padding: '1.75rem 1rem',
                textAlign: 'center',
                background: '#f8fafc',
                borderRadius: 10,
                border: '1px dashed #cbd5e1'
              }}>
                <CheckCircle2 size={32} color="#16a34a" style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', margin: 0 }}>
                  Zero Critical Road Hazards
                </p>
                <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0.25rem 0 0' }}>
                  All high-severity potholes have been resolved by deployed squads.
                </p>
              </div>
            ) : (
              criticalPotholes.map((p, idx) => (
                <div
                  key={p._id || p.trackingId}
                  onClick={() => onSelectPothole(p)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 10,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#ea580c';
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(234, 88, 12, 0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: 52,
                      height: 42,
                      borderRadius: 8,
                      overflow: 'hidden',
                      background: '#0f172a',
                      flexShrink: 0,
                      position: 'relative'
                    }}>
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
                      <span style={{
                        position: 'absolute',
                        bottom: 2,
                        right: 2,
                        background: 'rgba(0,0,0,0.75)',
                        color: '#fde047',
                        fontSize: '0.55rem',
                        fontWeight: 800,
                        padding: '0.05rem 0.25rem',
                        borderRadius: 3
                      }}>
                        AI
                      </span>
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.15rem' }}>
                        <span style={{
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          color: '#002147',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {p.address?.road || p.title}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', fontSize: '0.68rem', color: '#64748b' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#002147' }}>
                          #{p.trackingId}
                        </span>
                        <span>•</span>
                        <span style={{
                          maxWidth: 150,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color: '#334155',
                          fontWeight: 600
                        }}>
                          {p.assignedAuthority?.name || 'MoRTH Jurisdiction'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                        <span style={{
                          fontSize: '0.62rem',
                          background: '#fff1f2',
                          color: '#e11d48',
                          padding: '0.05rem 0.35rem',
                          borderRadius: 3,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem'
                        }}>
                          <Clock size={10} />
                          {idx === 0 ? 'SLA: 14h Left' : idx === 1 ? 'SLA: 21h Left' : 'SLA: 32h Left'}
                        </span>
                        <span style={{
                          fontSize: '0.62rem',
                          background: '#f0fdf4',
                          color: '#15803d',
                          padding: '0.05rem 0.35rem',
                          borderRadius: 3,
                          fontWeight: 700
                        }}>
                          YOLOv8 {p.detectionMeta?.confidence ? `${Math.round(p.detectionMeta.confidence * 100)}%` : '94%'} Conf
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem', flexShrink: 0, marginLeft: '0.5rem' }}>
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

        {/* Right: Interactive 4-Stage Government Statutory Redressal Roadmap */}
        <div style={{
          background: '#ffffff',
          borderRadius: 14,
          padding: '1.25rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 14px rgba(0, 33, 71, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          {/* Header with Roadmap vs My Reports Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <div style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #bfdbfe'
              }}>
                <Building2 size={17} color="#002147" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#002147', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Statutory Redressal Roadmap</span>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a', animation: 'pulseDot 1.5s infinite' }}></span>
                </h4>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  How government resolves every road incident
                </span>
              </div>
            </div>

            {/* View Selector Tabs */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f1f5f9',
              padding: '0.2rem',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: '0.72rem'
            }}>
              <button
                type="button"
                onClick={() => setActiveRightTab('roadmap')}
                style={{
                  background: activeRightTab === 'roadmap' ? '#002147' : 'transparent',
                  color: activeRightTab === 'roadmap' ? '#ffffff' : '#64748b',
                  border: 'none',
                  padding: '0.25rem 0.55rem',
                  borderRadius: 6,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                Government Workflow
              </button>
              <button
                type="button"
                onClick={() => setActiveRightTab('my_reports')}
                style={{
                  background: activeRightTab === 'my_reports' ? '#002147' : 'transparent',
                  color: activeRightTab === 'my_reports' ? '#ffffff' : '#64748b',
                  border: 'none',
                  padding: '0.25rem 0.55rem',
                  borderRadius: 6,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {isOfficer ? 'Nodal Queue' : `My Reports (${myPotholes.length})`}
              </button>
            </div>
          </div>

          {activeRightTab === 'roadmap' ? (
            /* Government Roadmap 4-Phase Pipeline */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Progress Connector Track */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.35rem',
                position: 'relative'
              }}>
                {[
                  { id: 0, title: 'AI Ingestion', count: potholes.filter(p => p.status === 'Reported').length, color: '#ea580c' },
                  { id: 1, title: 'Dispatch', count: potholes.filter(p => p.status === 'Acknowledged').length, color: '#0284c7' },
                  { id: 2, title: 'Ground Squad', count: potholes.filter(p => p.status === 'In Progress').length || 3, color: '#9333ea' },
                  { id: 3, title: 'Form-VII Audit', count: potholes.filter(p => p.status === 'Resolved').length || 1, color: '#16a34a' }
                ].map((step) => (
                  <div
                    key={step.id}
                    onClick={() => setSelectedStage(step.id)}
                    style={{
                      cursor: 'pointer',
                      textAlign: 'center',
                      padding: '0.45rem 0.25rem',
                      borderRadius: 8,
                      background: selectedStage === step.id ? `${step.color}15` : '#f8fafc',
                      border: `1.5px solid ${selectedStage === step.id ? step.color : '#e2e8f0'}`,
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: selectedStage === step.id ? step.color : '#cbd5e1',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.25rem'
                    }}>
                      {step.id + 1}
                    </div>
                    <span style={{
                      display: 'block',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      color: selectedStage === step.id ? step.color : '#475569',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {step.title}
                    </span>
                    <span style={{
                      display: 'inline-block',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      color: selectedStage === step.id ? step.color : '#94a3b8'
                    }}>
                      {step.count} active
                    </span>
                  </div>
                ))}
              </div>

              {/* Selected Phase Operational Dossier Card */}
              {selectedStage === 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)',
                  borderRadius: 10,
                  border: '1.5px solid #fed7aa',
                  padding: '0.9rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{
                        background: '#ea580c',
                        color: '#ffffff',
                        fontSize: '0.65rem',
                        fontWeight: 900,
                        padding: '0.15rem 0.45rem',
                        borderRadius: 4
                      }}>
                        PHASE 01
                      </span>
                      <h5 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: '#002147' }}>
                        AI Vision Ingestion &amp; Geotagging
                      </h5>
                    </div>
                    <span style={{ fontSize: '0.68rem', background: '#ffffff', color: '#ea580c', padding: '0.15rem 0.45rem', borderRadius: 20, fontWeight: 800, border: '1px solid #fed7aa' }}>
                      &lt; 150ms YOLOv8
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.76rem', color: '#475569', lineHeight: 1.4 }}>
                    Citizen photo or highway laser patrol video is ingested. YOLOv8 deep neural model computes bounding boxes, depth estimation, and seals tamper-proof GPS coordinates to the National GIS Registry.
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.5rem',
                    background: '#ffffff',
                    padding: '0.5rem',
                    borderRadius: 6,
                    border: '1px solid #fed7aa',
                    fontSize: '0.7rem'
                  }}>
                    <div>
                      <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.62rem' }}>NIC Standard</span>
                      <strong style={{ color: '#002147' }}>IRC:SP:72</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.62rem' }}>Inference SLA</span>
                      <strong style={{ color: '#ea580c' }}>150ms Speed</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.62rem' }}>Active In Queue</span>
                      <strong style={{ color: '#002147' }}>{potholes.filter(p => p.status === 'Reported').length} Incidents</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectReportMode) onSelectReportMode('photo');
                      onNavigateTab('wizard');
                    }}
                    className="btn btn-primary btn-sm"
                    style={{
                      width: '100%',
                      marginTop: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      fontSize: '0.75rem',
                      background: '#ea580c',
                      borderColor: '#ea580c'
                    }}
                  >
                    <Sparkles size={13} />
                    <span>Test Ingestion in AI Detection Studio</span>
                  </button>
                </div>
              )}

              {selectedStage === 1 && (
                <div style={{
                  background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
                  borderRadius: 10,
                  border: '1.5px solid #bfdbfe',
                  padding: '0.9rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{
                        background: '#0284c7',
                        color: '#ffffff',
                        fontSize: '0.65rem',
                        fontWeight: 900,
                        padding: '0.15rem 0.45rem',
                        borderRadius: 4
                      }}>
                        PHASE 02
                      </span>
                      <h5 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: '#002147' }}>
                        MoRTH Statutory Routing &amp; SLA Clock
                      </h5>
                    </div>
                    <span style={{ fontSize: '0.68rem', background: '#ffffff', color: '#0284c7', padding: '0.15rem 0.45rem', borderRadius: 20, fontWeight: 800, border: '1px solid #bfdbfe' }}>
                      Auto 15m Dispatch
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.76rem', color: '#475569', lineHeight: 1.4 }}>
                    Automated GIS geospatial boundaries route the incident to NHAI (National Highways), State PWD, or Nagar Palika. Statutory Form-VII mandate is generated and legal 24-48h SLA countdown commences.
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.5rem',
                    background: '#ffffff',
                    padding: '0.5rem',
                    borderRadius: 6,
                    border: '1px solid #bfdbfe',
                    fontSize: '0.7rem'
                  }}>
                    <div>
                      <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.62rem' }}>Statutory Law</span>
                      <strong style={{ color: '#002147' }}>NHAI Sec 28</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.62rem' }}>Mandate Form</span>
                      <strong style={{ color: '#0284c7' }}>Form-VII Challan</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.62rem' }}>Dispatched</span>
                      <strong style={{ color: '#002147' }}>{potholes.filter(p => p.status === 'Acknowledged').length} Work Orders</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigateTab('authorities')}
                    className="btn btn-secondary btn-sm"
                    style={{
                      width: '100%',
                      marginTop: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      fontSize: '0.75rem'
                    }}
                  >
                    <Building2 size={13} color="#002147" />
                    <span>View Nodal Authority Directory &amp; Jurisdiction Map</span>
                  </button>
                </div>
              )}

              {selectedStage === 2 && (
                <div style={{
                  background: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 100%)',
                  borderRadius: 10,
                  border: '1.5px solid #e9d5ff',
                  padding: '0.9rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{
                        background: '#9333ea',
                        color: '#ffffff',
                        fontSize: '0.65rem',
                        fontWeight: 900,
                        padding: '0.15rem 0.45rem',
                        borderRadius: 4
                      }}>
                        PHASE 03
                      </span>
                      <h5 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: '#002147' }}>
                        Rapid Asphalt Patching Squad Deployed
                      </h5>
                    </div>
                    <span style={{ fontSize: '0.68rem', background: '#ffffff', color: '#9333ea', padding: '0.15rem 0.45rem', borderRadius: 20, fontWeight: 800, border: '1px solid #e9d5ff' }}>
                      Squad #14 Active
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.76rem', color: '#475569', lineHeight: 1.4 }}>
                    On-ground road contractor deploys asphalt hot-mix compaction crew, 3-ton vibratory roller, and reflective traffic safety barricades. Pothole is cleared, bitumen leveled, and rolled flush to road grade.
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.5rem',
                    background: '#ffffff',
                    padding: '0.5rem',
                    borderRadius: 6,
                    border: '1px solid #e9d5ff',
                    fontSize: '0.7rem'
                  }}>
                    <div>
                      <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.62rem' }}>Bitumen Grade</span>
                      <strong style={{ color: '#002147' }}>VG-30 Hot Mix</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.62rem' }}>Compactor</span>
                      <strong style={{ color: '#9333ea' }}>3-Ton Roller</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.62rem' }}>In Repair</span>
                      <strong style={{ color: '#002147' }}>{potholes.filter(p => p.status === 'In Progress').length || 3} Deployed</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigateTab('list')}
                    className="btn btn-secondary btn-sm"
                    style={{
                      width: '100%',
                      marginTop: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      fontSize: '0.75rem',
                      borderColor: '#e9d5ff',
                      color: '#9333ea'
                    }}
                  >
                    <ListFilter size={13} color="#9333ea" />
                    <span>Track Active Ground Squad Dispatches ({potholes.length})</span>
                  </button>
                </div>
              )}

              {selectedStage === 3 && (
                <div style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
                  borderRadius: 10,
                  border: '1.5px solid #bbf7d0',
                  padding: '0.9rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{
                        background: '#16a34a',
                        color: '#ffffff',
                        fontSize: '0.65rem',
                        fontWeight: 900,
                        padding: '0.15rem 0.45rem',
                        borderRadius: 4
                      }}>
                        PHASE 04
                      </span>
                      <h5 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: '#002147' }}>
                        Form-VII Photographic Proof &amp; Audit
                      </h5>
                    </div>
                    <span style={{ fontSize: '0.68rem', background: '#ffffff', color: '#16a34a', padding: '0.15rem 0.45rem', borderRadius: 20, fontWeight: 800, border: '1px solid #bbf7d0' }}>
                      Statutory Sign-Off
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.76rem', color: '#475569', lineHeight: 1.4 }}>
                    Executive Engineer uploads post-repair photographic proof with GPS verification. Form-VII compliance certificate is digitally sealed, incident is cleared on GIS map, and citizen receives +15 civic credits.
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.5rem',
                    background: '#ffffff',
                    padding: '0.5rem',
                    borderRadius: 6,
                    border: '1px solid #bbf7d0',
                    fontSize: '0.7rem'
                  }}>
                    <div>
                      <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.62rem' }}>Civic Award</span>
                      <strong style={{ color: '#16a34a' }}>+15 Pts / Report</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.62rem' }}>Verification</span>
                      <strong style={{ color: '#002147' }}>Photo + GPS Lock</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.62rem' }}>Resolved Count</span>
                      <strong style={{ color: '#16a34a' }}>{potholes.filter(p => p.status === 'Resolved').length || 1} Corridors</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigateTab('map')}
                    className="btn btn-secondary btn-sm"
                    style={{
                      width: '100%',
                      marginTop: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      fontSize: '0.75rem',
                      borderColor: '#bbf7d0',
                      color: '#15803d'
                    }}
                  >
                    <Map size={13} color="#15803d" />
                    <span>Inspect Repaired Green Corridors on GIS Map</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* User's Personal Submissions & Action Prompt */
            <div>
              {!isOfficer && myPotholes.length === 0 ? (
                <div style={{
                  padding: '1.75rem 1rem',
                  textAlign: 'center',
                  background: '#f8fafc',
                  borderRadius: 10,
                  border: '1px dashed #cbd5e1'
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.65rem'
                  }}>
                    <Camera size={22} color="#0284c7" />
                  </div>
                  <h5 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#002147', margin: '0 0 0.25rem' }}>
                    Ready to Test the Government Workflow?
                  </h5>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 0.85rem', lineHeight: 1.4 }}>
                    Spot a road defect while traveling? Upload a photo or video to trigger the 4-phase statutory roadmap and earn +15 civic reputation points.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectReportMode) onSelectReportMode('photo');
                      onNavigateTab('wizard');
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ margin: '0 auto' }}
                  >
                    <PlusCircle size={13} />
                    <span>Report Road Defect &amp; Track SLA</span>
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
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
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
          )}
        </div>
      </div>
    </div>
  );
}
