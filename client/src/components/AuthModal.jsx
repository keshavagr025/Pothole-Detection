import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  User,
  Building2,
  Lock,
  Mail,
  Phone,
  BadgeCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  FileCheck2,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { fetchDemoAccounts } from '../services/api';

export default function AuthModal({ isOpen, onClose, initialTab = 'login', initialRole = 'citizen' }) {
  const { login, register } = useAuth();

  const [mode, setMode] = useState(initialTab); // 'login' | 'register'
  const [role, setRole] = useState(initialRole); // 'citizen' | 'officer'
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('National Highways Authority of India (NHAI)');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [jurisdiction, setJurisdiction] = useState('North Corridor Division');

  const [demoAccounts, setDemoAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sync props on opening
  useEffect(() => {
    if (isOpen) {
      setMode(initialTab || 'login');
      setRole(initialRole || 'citizen');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen, initialTab, initialRole]);

  // Load demo accounts list
  useEffect(() => {
    async function loadDemos() {
      try {
        const res = await fetchDemoAccounts();
        if (res.success && res.demoAccounts) {
          setDemoAccounts(res.demoAccounts);
        }
      } catch (err) {
        // Fallback local demos
        setDemoAccounts([
          {
            label: 'Citizen Sentinel',
            role: 'citizen',
            email: 'citizen@example.com',
            password: 'password123',
            badge: 'Citizen Reporter'
          },
          {
            label: 'NHAI Chief Engineer',
            role: 'officer',
            email: 'officer@nhai.gov.in',
            password: 'password123',
            badge: 'NHAI Nodal Officer'
          },
          {
            label: 'Delhi PWD Executive',
            role: 'officer',
            email: 'officer@pwd.delhi.gov.in',
            password: 'password123',
            badge: 'PWD Exec. Eng.'
          }
        ]);
      }
    }
    loadDemos();
  }, []);

  if (!isOpen) return null;

  const handleQuickFillDemo = async (demo) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setRole(demo.role);
    setMode('login');
    setErrorMsg('');

    // Auto-login with demo for instant frictionless experience
    setLoading(true);
    try {
      await login(demo.email, demo.password);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Demo sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Please provide your registered email and password.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
        onClose();
      } else {
        if (!name) {
          setErrorMsg('Please enter your full name.');
          setLoading(false);
          return;
        }

        const userData = {
          name,
          email,
          password,
          role,
          phone,
          department: role === 'officer' ? department : '',
          badgeNumber: role === 'officer' ? badgeNumber : '',
          jurisdiction: role === 'officer' ? jurisdiction : ''
        };

        await register(userData);
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
        setSuccessMsg('Account created successfully! Welcome to MĀRG-DRISHTI.');
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 33, 71, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 14,
          maxWidth: 540,
          width: '100%',
          boxShadow: '0 20px 40px -15px rgba(0, 33, 71, 0.35), 0 0 0 1px rgba(0, 33, 71, 0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Official Header with Tiranga Stripe */}
        <div style={{
          background: 'linear-gradient(135deg, #002147 0%, #0a2540 100%)',
          color: '#ffffff',
          padding: '1.25rem 1.5rem',
          position: 'relative',
          borderBottom: '3px solid #ea580c'
        }}>
          {/* Top National Ribbon */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            display: 'flex'
          }}>
            <div style={{ flex: 1, backgroundColor: '#FF9933' }} />
            <div style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
            <div style={{ flex: 1, backgroundColor: '#138808' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield size={24} color="#ff9933" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
                  {mode === 'login' ? 'Portal Sign In' : 'Citizen & Officer Registration'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                  मार्ग-दृष्टि • National Road Distress Surveillance Portal
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#ffffff',
                borderRadius: 6,
                padding: '0.35rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s'
              }}
              title="Close Dialog"
            >
              <X size={18} />
            </button>
          </div>

          {/* Role Segmented Selector */}
          <div style={{
            marginTop: '1.1rem',
            background: 'rgba(0, 0, 0, 0.25)',
            borderRadius: 8,
            padding: '0.25rem',
            display: 'flex',
            gap: '0.35rem'
          }}>
            <button
              type="button"
              onClick={() => setRole('citizen')}
              style={{
                flex: 1,
                padding: '0.45rem 0.75rem',
                borderRadius: 6,
                border: 'none',
                background: role === 'citizen' ? '#ffffff' : 'transparent',
                color: role === 'citizen' ? '#002147' : '#cbd5e1',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                transition: 'all 0.2s'
              }}
            >
              <User size={15} color={role === 'citizen' ? '#ea580c' : 'currentColor'} />
              नागरिक • Citizen Reporter
            </button>

            <button
              type="button"
              onClick={() => setRole('officer')}
              style={{
                flex: 1,
                padding: '0.45rem 0.75rem',
                borderRadius: 6,
                border: 'none',
                background: role === 'officer' ? '#ea580c' : 'transparent',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                transition: 'all 0.2s'
              }}
            >
              <Building2 size={15} />
              प्राधिकारी • Civic Authority
            </button>
          </div>
        </div>

        {/* Quick Demo Logins Bar */}
        <div style={{
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.75rem 1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <KeyRound size={12} color="#002147" /> 1-Click Instant Demo Profiles
            </span>
            <span style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: 700 }}>
              ● Ready for Evaluation
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {demoAccounts.map((demo, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickFillDemo(demo)}
                disabled={loading}
                style={{
                  padding: '0.3rem 0.6rem',
                  borderRadius: 6,
                  border: demo.role === 'officer' ? '1px solid #fed7aa' : '1px solid #cbd5e1',
                  background: demo.role === 'officer' ? '#fff7ed' : '#ffffff',
                  color: demo.role === 'officer' ? '#9a3412' : '#002147',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.15s'
                }}
                title={`Sign in instantly as ${demo.label} (${demo.email})`}
              >
                {demo.role === 'officer' ? <Building2 size={11} /> : <User size={11} />}
                {demo.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1 }}>
          {errorMsg && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '0.65rem 0.85rem',
              borderRadius: 8,
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#166534',
              padding: '0.65rem 0.85rem',
              borderRadius: 8,
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {/* Full Name for Registration */}
            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.3rem' }}>
                  Full Name / Official Designation *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#64748b" style={{ position: 'absolute', left: 10, top: 11 }} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={role === 'officer' ? 'Er. Vikram Malhotra (Assistant Engineer)' : 'Keshav Agrawal'}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem 0.55rem 2.2rem',
                      borderRadius: 7,
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.3rem' }}>
                {role === 'officer' ? 'Official / Department Email *' : 'Email Address *'}
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#64748b" style={{ position: 'absolute', left: 10, top: 11 }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={role === 'officer' ? 'officer@nhai.gov.in' : 'citizen@example.com'}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem 0.55rem 2.2rem',
                    borderRadius: 7,
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e293b' }}>
                  Security Password *
                </label>
                {mode === 'login' && (
                  <span style={{ fontSize: '0.7rem', color: '#ea580c', fontWeight: 600, cursor: 'pointer' }} onClick={() => setErrorMsg('For demo accounts, use password: password123')}>
                    Forgot password?
                  </span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#64748b" style={{ position: 'absolute', left: 10, top: 11 }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem 0.55rem 2.2rem',
                    borderRadius: 7,
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Additional fields for Registration */}
            {mode === 'register' && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.3rem' }}>
                    Mobile Number (For SMS Status Updates)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} color="#64748b" style={{ position: 'absolute', left: 10, top: 11 }} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem 0.55rem 2.2rem',
                        borderRadius: 7,
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {role === 'officer' && (
                  <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                        Civic Department / Authority *
                      </label>
                      <select
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.6rem',
                          borderRadius: 6,
                          border: '1px solid #cbd5e1',
                          fontSize: '0.8rem',
                          background: '#ffffff'
                        }}
                      >
                        <option value="National Highways Authority of India (NHAI)">National Highways Authority of India (NHAI)</option>
                        <option value="Public Works Department (Delhi PWD)">Public Works Department (Delhi PWD)</option>
                        <option value="Municipal Corporation of Delhi (MCD)">Municipal Corporation of Delhi (MCD)</option>
                        <option value="New Delhi Municipal Council (NDMC)">New Delhi Municipal Council (NDMC)</option>
                        <option value="State Highway Development Corp">State Highway Development Corp</option>
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                          Nodal Badge / ID
                        </label>
                        <input
                          type="text"
                          value={badgeNumber}
                          onChange={e => setBadgeNumber(e.target.value)}
                          placeholder="e.g. NHAI-NZ-4091"
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.6rem',
                            borderRadius: 6,
                            border: '1px solid #cbd5e1',
                            fontSize: '0.8rem',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                          Jurisdiction Zone
                        </label>
                        <input
                          type="text"
                          value={jurisdiction}
                          onChange={e => setJurisdiction(e.target.value)}
                          placeholder="e.g. Ring Road Division"
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.6rem',
                            borderRadius: 6,
                            border: '1px solid #cbd5e1',
                            fontSize: '0.8rem',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Citizen Benefits Badge */}
            {role === 'citizen' && mode === 'register' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.65rem 0.85rem',
                background: '#fffbeb',
                borderRadius: 8,
                border: '1px solid #fde68a'
              }}>
                <Award size={20} color="#b45309" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.74rem', color: '#92400e', fontWeight: 600 }}>
                  Join as Citizen Reporter: Receive +25 Civic Reputation credits and instant SMS tracking for reported road defects.
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.5rem',
                background: role === 'officer' ? '#ea580c' : '#002147',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                padding: '0.75rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: loading ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: role === 'officer' ? '0 4px 12px rgba(234, 88, 12, 0.3)' : '0 4px 12px rgba(0, 33, 71, 0.25)',
                transition: 'all 0.15s',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? (
                <span>Authenticating Secure Gateway...</span>
              ) : mode === 'login' ? (
                <>
                  <span>Sign In to MĀRG-DRISHTI</span>
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <span>Complete Account Registration</span>
                  <Sparkles size={16} />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div style={{
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e2e8f0',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: '#64748b'
          }}>
            {mode === 'login' ? (
              <span>
                Don't have a registered account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#002147',
                    fontWeight: 800,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Create Citizen / Officer Account
                </button>
              </span>
            ) : (
              <span>
                Already registered with the portal?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#002147',
                    fontWeight: 800,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Sign In to Existing Account
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Security / SSL Footer */}
        <div style={{
          background: '#f1f5f9',
          borderTop: '1px solid #e2e8f0',
          padding: '0.5rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.68rem',
          color: '#64748b'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <BadgeCheck size={13} color="#16a34a" /> 256-bit Encrypted NIC SSL Gateway
          </span>
          <span>Ministry of Road Transport &amp; Highways</span>
        </div>
      </div>
    </div>
  );
}
