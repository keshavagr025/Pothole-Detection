import React from 'react';
import { ShieldAlert, Map, Sparkles, ListFilter, BarChart3, Home, Building2, CheckCircle2, Shield } from 'lucide-react';
import GovHeader from './GovHeader';

export default function Navbar({ activeTab, setActiveTab, serverHealth, onOpenDirectory }) {
  const isHealthy = serverHealth?.status === 'healthy';

  return (
    <>
      {/* 1. Official Government Top Header (Tiranga ribbon, Ashoka emblem, Helplines) */}
      <GovHeader />

      {/* 2. Primary Navigation Bar */}
      <header style={{
        minHeight: 58,
        borderBottom: '1px solid #cbd5e1',
        background: '#ffffff',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        padding: '0.4rem 1rem',
        boxShadow: '0 2px 4px rgba(0, 33, 71, 0.05)'
      }}>
        <div style={{
          maxWidth: 1680,
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          flexWrap: 'nowrap'
        }}>
          {/* Brand Identity / Quick Home */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', flexShrink: 0 }}
            onClick={() => setActiveTab('landing')}
            title="MĀRG-DRISHTI • National Road Distress Surveillance Portal"
          >
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #002147 0%, #0a2540 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 33, 71, 0.25)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <Shield size={20} color="#ff9933" />
            </div>
            <div>
              <span style={{ fontSize: '1.05rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#002147' }}>
                मार्ग<span style={{ color: '#ea580c' }}>-दृष्टि</span>
              </span>
              <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                MoRTH • NHAI Portal
              </span>
            </div>
          </div>

          {/* Center Government Navigation Tabs */}
          <nav
            className="nav-scroll-container"
            style={{
              background: '#f1f5f9',
              padding: '0.2rem',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              maxWidth: '100%'
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('landing')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 6,
                border: 'none',
                background: activeTab === 'landing' ? '#ffffff' : 'transparent',
                color: activeTab === 'landing' ? '#002147' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: activeTab === 'landing' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              <Home size={14} />
              गृह • Portal Home
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('wizard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.95rem',
                borderRadius: 6,
                border: 'none',
                background: activeTab === 'wizard' ? '#ea580c' : 'transparent',
                color: activeTab === 'wizard' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: activeTab === 'wizard' ? '0 2px 6px rgba(234, 88, 12, 0.3)' : 'none'
              }}
            >
              <Sparkles size={14} />
              सड़क दोष रिपोर्ट • Report Pothole
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('map')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 6,
                border: 'none',
                background: activeTab === 'map' ? '#002147' : 'transparent',
                color: activeTab === 'map' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: activeTab === 'map' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              <Map size={14} />
              जीआईएस मानचित्र • GIS Map
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('list')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 6,
                border: 'none',
                background: activeTab === 'list' ? '#002147' : 'transparent',
                color: activeTab === 'list' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: activeTab === 'list' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              <ListFilter size={14} />
              शिकायत पंजिका • Grievances
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 6,
                border: 'none',
                background: activeTab === 'analytics' ? '#002147' : 'transparent',
                color: activeTab === 'analytics' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: activeTab === 'analytics' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              <BarChart3 size={14} />
              राष्ट्रीय प्रगति • National KPIs
            </button>
          </nav>

          {/* Right Status Badge & Directory trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            {onOpenDirectory && (
              <button
                type="button"
                onClick={onOpenDirectory}
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  borderColor: '#cbd5e1'
                }}
                title="View NHAI, PWD, Municipal Directory &amp; Nodal Officers"
              >
                <Building2 size={13} color="#002147" />
                <span className="hide-on-mobile">नोडल निर्देशिका • Directory</span>
              </button>
            )}

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.6rem',
              borderRadius: 6,
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)'
            }} title="YOLOv8 AI Vision Engine Active">
              <span style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#0284c7'
              }} />
              <span style={{ color: '#002147', fontWeight: 800 }}>
                YOLOv8
              </span>
            </div>

            <div
              className="hide-on-mobile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.25rem 0.6rem',
                borderRadius: 6,
                background: isHealthy ? '#f0fdf4' : '#fffbeb',
                border: `1px solid ${isHealthy ? '#bbf7d0' : '#fde68a'}`,
                fontSize: '0.7rem'
              }}
              title={isHealthy ? 'National NIC GIS Gateway Online' : 'Connecting to Gateway'}
            >
              <span style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: isHealthy ? '#16a34a' : '#d97706'
              }} />
              <span style={{ color: isHealthy ? '#15803d' : '#b45309', fontWeight: 700 }}>
                {isHealthy ? 'NIC Gateway Active' : 'Connecting'}
              </span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
