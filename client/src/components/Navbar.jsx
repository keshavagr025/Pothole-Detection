import React from 'react';
import { ShieldAlert, Map, Sparkles, ListFilter, BarChart3, Home } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, serverHealth }) {
  const isHealthy = serverHealth?.status === 'healthy';

  return (
    <header style={{
      minHeight: 64,
      borderBottom: '1px solid #e2e8f0',
      background: '#ffffff',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      padding: '0.5rem 1rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
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
        {/* Brand & Logo */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', flexShrink: 0 }}
          onClick={() => setActiveTab('landing')}
        >
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: '#ea580c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(234, 88, 12, 0.3)'
          }}>
            <ShieldAlert size={19} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>
              Road<span style={{ color: '#ea580c' }}>Safe</span>
            </span>
          </div>
        </div>

        {/* Center Nav Tabs (Scrollable on mobile) */}
        <nav
          className="nav-scroll-container"
          style={{
            background: '#f8fafc',
            padding: '0.2rem',
            borderRadius: 9,
            border: '1px solid #e2e8f0',
            maxWidth: '100%'
          }}
        >
          <button
            onClick={() => setActiveTab('landing')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.75rem',
              borderRadius: 7,
              border: 'none',
              background: activeTab === 'landing' ? '#ffffff' : 'transparent',
              color: activeTab === 'landing' ? '#0f172a' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === 'landing' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <Home size={14} />
            Home
          </button>

          <button
            onClick={() => setActiveTab('wizard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.85rem',
              borderRadius: 7,
              border: 'none',
              background: activeTab === 'wizard' ? '#ea580c' : 'transparent',
              color: activeTab === 'wizard' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === 'wizard' ? '0 2px 6px rgba(234, 88, 12, 0.25)' : 'none'
            }}
          >
            <Sparkles size={14} />
            Report
          </button>

          <button
            onClick={() => setActiveTab('map')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.75rem',
              borderRadius: 7,
              border: 'none',
              background: activeTab === 'map' ? '#ffffff' : 'transparent',
              color: activeTab === 'map' ? '#0284c7' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === 'map' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <Map size={14} />
            Map
          </button>

          <button
            onClick={() => setActiveTab('list')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.75rem',
              borderRadius: 7,
              border: 'none',
              background: activeTab === 'list' ? '#ffffff' : 'transparent',
              color: activeTab === 'list' ? '#0284c7' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === 'list' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <ListFilter size={14} />
            Tickets
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.75rem',
              borderRadius: 7,
              border: 'none',
              background: activeTab === 'analytics' ? '#ffffff' : 'transparent',
              color: activeTab === 'analytics' ? '#0284c7' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === 'analytics' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <BarChart3 size={14} />
            Analytics
          </button>
        </nav>

        {/* Right Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.6rem',
            borderRadius: 16,
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)'
          }}>
            <span style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: '#0284c7'
            }} />
            <span style={{ color: '#0284c7', fontWeight: 700 }}>
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
              borderRadius: 16,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              fontSize: '0.7rem'
            }}
          >
            <span style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: isHealthy ? '#16a34a' : '#d97706'
            }} />
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
              {isHealthy ? 'Online' : 'Connecting'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
