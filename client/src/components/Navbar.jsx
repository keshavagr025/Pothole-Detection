import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldAlert,
  Map,
  Sparkles,
  ListFilter,
  BarChart3,
  Home,
  Building2,
  CheckCircle2,
  Shield,
  LogIn,
  User,
  LogOut,
  ChevronDown,
  Award,
  BadgeCheck,
  FileText
} from 'lucide-react';
import GovHeader from './GovHeader';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ activeTab, setActiveTab, serverHealth, onOpenDirectory, onFilterMyReports }) {
  const isHealthy = serverHealth?.status === 'healthy';
  const { user, isAuthenticated, isOfficer, logout, openAuthModal } = useAuth();
  const { t, isHindi } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* 1. Official Government Top Header (Tiranga ribbon, Ashoka emblem, Helplines, Lang Toggle) */}
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
                {isHindi ? (
                  <>मार्ग<span style={{ color: '#ea580c' }}>-दृष्टि</span></>
                ) : (
                  <>MĀRG<span style={{ color: '#ea580c' }}>-DRISHTI</span></>
                )}
              </span>
              <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isHindi ? 'सड़क परिवहन एवं राजमार्ग मंत्रालय' : 'MoRTH • NHAI Portal'}
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
            {!isAuthenticated ? (
              /* Public / Guest Navigation for Project Understanding */
              <>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('landing');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
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
                  {t('nav_overview')}
                </button>

                <a
                  href="#tech-architecture"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 6,
                    color: 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Sparkles size={14} color="#ea580c" />
                  {t('nav_ai_tech')}
                </a>

                <a
                  href="#national-impact"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 6,
                    color: 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <BarChart3 size={14} color="#002147" />
                  {t('nav_impact')}
                </a>

                <a
                  href="#portal-faqs"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 6,
                    color: 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <CheckCircle2 size={14} color="#16a34a" />
                  {t('nav_faqs')}
                </a>
              </>
            ) : (
              /* Authenticated Operational Tools Navigation */
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 6,
                    border: 'none',
                    background: activeTab === 'dashboard' ? '#002147' : 'transparent',
                    color: activeTab === 'dashboard' ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: activeTab === 'dashboard' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  <Home size={14} />
                  {t('nav_dashboard')}
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
                  {t('nav_report_pothole')}
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
                  {t('nav_gis_map')}
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
                  {t('nav_grievances')}
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
                  {t('nav_analytics')}
                </button>
              </>
            )}
          </nav>

          {/* Right Status Badge & User Auth & Directory triggers */}
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
                <span className="hide-on-mobile">{t('nav_directory')}</span>
              </button>
            )}

            {/* Authentication Button / User Profile Dropdown */}
            {!isAuthenticated ? (
              <button
                type="button"
                onClick={() => openAuthModal('login', 'citizen')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 6,
                  border: '1px solid #002147',
                  background: '#002147',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 2px 5px rgba(0, 33, 71, 0.2)',
                  transition: 'all 0.15s'
                }}
                title="Citizen &amp; Civic Officer Sign In"
              >
                <LogIn size={13} />
                <span>{t('nav_sign_in')}</span>
              </button>
            ) : (
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.28rem 0.65rem',
                    borderRadius: 20,
                    border: isOfficer ? '1px solid #ea580c' : '1px solid #002147',
                    background: isOfficer ? '#fff7ed' : '#f0f9ff',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  title={`Logged in as ${user.name}`}
                >
                  <div style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: isOfficer ? '#ea580c' : '#002147',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 800
                  }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>

                  <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                    <span style={{
                      display: 'block',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: '#002147',
                      maxWidth: 120,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {user.name}
                    </span>
                    <span style={{
                      display: 'block',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      color: isOfficer ? '#ea580c' : '#0284c7'
                    }}>
                      {isOfficer ? t('nav_civic_officer') : `${t('nav_citizen')} • ${user.reputationPoints || 25} ${t('nav_pts')}`}
                    </span>
                  </div>

                  <ChevronDown size={13} color="#64748b" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    width: 260,
                    background: '#ffffff',
                    borderRadius: 10,
                    boxShadow: '0 10px 25px -5px rgba(0, 33, 71, 0.2), 0 0 0 1px rgba(0, 33, 71, 0.08)',
                    padding: '0.75rem',
                    zIndex: 1001,
                    animation: 'fadeIn 0.15s ease-out'
                  }}>
                    {/* User Header Profile */}
                    <div style={{
                      paddingBottom: '0.65rem',
                      borderBottom: '1px solid #e2e8f0',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          background: isOfficer ? '#ea580c' : '#002147',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.9rem'
                        }}>
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 800, color: '#002147', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user.name}
                          </p>
                          <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {user.department && (
                        <div style={{
                          marginTop: '0.45rem',
                          background: '#f8fafc',
                          padding: '0.3rem 0.5rem',
                          borderRadius: 6,
                          fontSize: '0.68rem',
                          color: '#334155',
                          fontWeight: 600,
                          border: '1px solid #e2e8f0'
                        }}>
                          🏛️ {user.department} {user.badgeNumber ? `(#${user.badgeNumber})` : ''}
                        </div>
                      )}

                      {!isOfficer && (
                        <div style={{
                          marginTop: '0.45rem',
                          background: '#fffbeb',
                          padding: '0.3rem 0.5rem',
                          borderRadius: 6,
                          fontSize: '0.68rem',
                          color: '#92400e',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          border: '1px solid #fef3c7'
                        }}>
                          <Award size={13} color="#b45309" />
                          <span>{t('nav_civic_credits')}: {user.reputationPoints || 25} {t('nav_pts')}</span>
                        </div>
                      )}
                    </div>

                    {/* Menu Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          if (onFilterMyReports) {
                            onFilterMyReports(user._id || user.email);
                          }
                          setActiveTab('list');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.45rem 0.6rem',
                          borderRadius: 6,
                          border: 'none',
                          background: 'transparent',
                          color: '#002147',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <FileText size={14} color="#002147" />
                        <span>{t('nav_my_grievances')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          setActiveTab('wizard');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.45rem 0.6rem',
                          borderRadius: 6,
                          border: 'none',
                          background: 'transparent',
                          color: '#002147',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <Sparkles size={14} color="#ea580c" />
                        <span>{t('nav_report_defect')}</span>
                      </button>

                      <div style={{ height: 1, background: '#e2e8f0', margin: '0.35rem 0' }} />

                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.45rem 0.6rem',
                          borderRadius: 6,
                          border: 'none',
                          background: 'transparent',
                          color: '#dc2626',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <LogOut size={14} color="#dc2626" />
                        <span>{t('nav_sign_out')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* YOLOv8 System Indicator */}
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
                {isHealthy ? t('nav_nic_gateway') : t('nav_connecting')}
              </span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
