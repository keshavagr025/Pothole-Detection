import React, { useState } from 'react';
import {
  Camera,
  Video,
  ShieldCheck,
  AlertTriangle,
  Building2,
  ArrowRight,
  MapPin,
  CheckCircle2,
  FileText,
  Clock,
  Car,
  ChevronRight,
  Cpu,
  Server,
  Layers,
  Globe,
  Database,
  Code2,
  TrendingDown,
  Activity,
  Award,
  Zap,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

export default function LandingPage({ onSelectMode, onViewMap, stats }) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const techStack = [
    {
      category: 'Computer Vision & Deep Learning',
      icon: Cpu,
      color: '#ea580c',
      bgColor: '#fff7ed',
      techs: ['Ultralytics YOLOv8', 'PyTorch 2.x', 'OpenCV 4.x', 'Pothole Segmentation Weights'],
      description: 'Convolutional neural networks trained on thousands of road distress images to detect cavity boundaries, depth spalls, and lane area disturbance percentage in under 150ms.'
    },
    {
      category: 'Microservices & API Gateway',
      icon: Server,
      color: '#0284c7',
      bgColor: '#eff6ff',
      techs: ['Python FastAPI', 'Node.js & Express', 'Uvicorn ASGI', 'Multer Streaming'],
      description: 'Dual microservice architecture: high-throughput Python inference worker coupled with an Express.js civic dispatch and notification gateway.'
    },
    {
      category: 'Geospatial Intelligence & GIS',
      icon: Globe,
      color: '#7c3aed',
      bgColor: '#f5f3ff',
      techs: ['Leaflet & React-Leaflet', 'OpenStreetMap Nominatim', 'GeoJSON 2dsphere', 'Reverse Geocoding'],
      description: 'Automated administrative boundary resolver mapping exact GPS coordinates to NHAI (Expressways), State PWD (Arterials), and Nagar Palika (Urban Wards).'
    },
    {
      category: 'Frontend & Interactive Canvas',
      icon: Layers,
      color: '#16a34a',
      bgColor: '#f0fdf4',
      techs: ['React 18', 'Vite', 'HTML5 Canvas', 'Modern Civic Light Theme'],
      description: 'High-contrast accessible user interface featuring interactive drag-and-drop damage area bounding, dashcam frame scrubbing, and instant grievance notices.'
    }
  ];

  const eraImpacts = [
    {
      stat: '3,500+',
      label: 'Fatalities Annually',
      desc: 'Government transport data reports thousands of preventable fatal crashes every year directly attributed to road craters and sudden swerving.',
      icon: AlertTriangle,
      color: '#dc2626',
      bg: '#fef2f2'
    },
    {
      stat: '72%',
      label: 'Two-Wheeler Risk',
      desc: 'Two-wheelers and cyclists represent the vast majority of severe casualties due to unspotted cavities during monsoons and nighttime commutes.',
      icon: TrendingDown,
      color: '#ea580c',
      bg: '#fff7ed'
    },
    {
      stat: '₹10,000+ Cr',
      label: 'Vehicle Damage Costs',
      desc: 'Premature suspension wear, blown tires, broken alloy rims, and fuel wastage cost vehicle owners and logistics fleets immense losses.',
      icon: Activity,
      color: '#ca8a04',
      bg: '#fefce8'
    },
    {
      stat: '24-48 Hrs',
      label: 'Enforced Repair SLA',
      desc: 'Replaces months of bureaucratic delays with automated statutory work orders holding municipal authorities accountable to repair deadlines.',
      icon: Clock,
      color: '#16a34a',
      bg: '#f0fdf4'
    }
  ];

  const comparisonRows = [
    {
      feature: 'Detection Method',
      traditional: 'Slow citizen paper complaints or sporadic visual audits by road inspectors once every few months.',
      aiSentinel: 'Real-time AI computer vision scanning from citizen mobile cameras, dashcams, and municipal patrol feeds.'
    },
    {
      feature: 'Defect Measurement',
      traditional: 'Subjective descriptions like "bad road" without precise depth, square footage, or lane hazard scoring.',
      aiSentinel: 'Exact YOLOv8 bounding boxes, crater surface percentage, depth classification, and accident risk score (0-100).'
    },
    {
      feature: 'Authority Ownership',
      traditional: 'Bureaucratic ping-pong: citizens do not know whether the road belongs to Nagar Palika, PWD, or NHAI.',
      aiSentinel: 'Algorithmic geo-resolution instantly routes the defect to the correct nodal office and executive engineer.'
    },
    {
      feature: 'Accountability & Tracking',
      traditional: 'Complaints get lost in municipal registers with no public status visibility or statutory deadline.',
      aiSentinel: 'Unique tracking ID (e.g. #POT-2026-XXXXXX), official dispatch memorandum, and public live map audit trail.'
    }
  ];

  const faqs = [
    {
      q: 'Why is automated AI road detection needed in today\'s world?',
      a: 'Manual road surveys cannot keep up with thousands of kilometers of urban and rural asphalt. Potholes form and expand exponentially within days after rain. Traditional citizen complaints often take weeks to reach the correct department because people don\'t know whether a street is managed by Nagar Palika, PWD, or NHAI. Automated AI detection bridges this gap by identifying defects immediately, calculating accident risk, and generating statutory repair orders.'
    },
    {
      q: 'How does the YOLOv8 model detect potholes accurately?',
      a: 'We use a deep convolutional neural network (YOLOv8) specifically trained on real-world road asphalt cavities. Rather than relying on generic object detection, the model isolates road distress morphology, analyzes cavity luminance contrast against surrounding asphalt, and draws accurate bounding boxes with confidence scores.'
    },
    {
      q: 'What is the role of Nagar Palika and Municipal Authorities in this portal?',
      a: 'When an incident is reported, our geo-resolution engine checks the road class and municipal ward. If the road falls under urban municipal jurisdiction, an official re-verification and repair mandate is dispatched directly to the Nagar Palika / Nagar Nigam with GPS coordinates, Google Maps navigation links, photo proof, and a statutory 24 to 48 hour SLA.'
    },
    {
      q: 'Can dashcam video footage be uploaded directly?',
      a: 'Yes! The portal features a dedicated Video / Dashcam mode. You can upload an MP4 or WEBM video clip, scrub through the playback to the exact moment of road damage, and extract the keyframe for instant AI defect analysis.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '3.5rem' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 20,
        padding: 'clamp(1.75rem, 5vw, 3.5rem) clamp(1rem, 4vw, 2.5rem)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Civic Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.35rem 0.85rem',
          borderRadius: 30,
          background: '#eff6ff',
          color: '#0284c7',
          border: '1px solid #bfdbfe',
          fontSize: '0.74rem',
          fontWeight: 800,
          marginBottom: '1.25rem',
          fontFamily: 'var(--font-mono)',
          textAlign: 'center',
          maxWidth: '100%'
        }}>
          <ShieldCheck size={16} style={{ flexShrink: 0 }} />
          <span>NEXT-GEN CIVIC INFRASTRUCTURE &amp; ACCIDENT PREVENTIVE AI</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(1.75rem, 6vw, 2.85rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          color: '#0f172a',
          maxWidth: 900
        }}>
          Intelligent Road Safety &amp; <span style={{ color: '#ea580c' }}>Nagar Palika</span> Repair Gateway
        </h1>

        <p style={{
          fontSize: 'clamp(0.92rem, 2.5vw, 1.08rem)',
          color: 'var(--text-secondary)',
          maxWidth: 740,
          marginTop: '1.1rem',
          lineHeight: 1.65
        }}>
          Transforming road safety in today&apos;s era. Powered by state-of-the-art computer vision to detect potholes, interactively tag damaged surfaces, and dispatch legally binding repair work orders to municipal authorities.
        </p>

        {/* Two Entry Mode Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '1.5rem',
          width: '100%',
          maxWidth: 960,
          marginTop: '2.5rem'
        }}>
          {/* Card 1: Photo Mode */}
          <div
            className="mode-card"
            onClick={() => onSelectMode('photo')}
          >
            <div style={{
              width: 54,
              height: 54,
              borderRadius: 14,
              background: '#fff7ed',
              border: '1px solid #fed7aa',
              color: '#ea580c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Camera size={28} />
            </div>

            <span style={{
              background: '#fff7ed',
              color: '#c2410c',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.2rem 0.6rem',
              borderRadius: 6,
              marginBottom: '0.5rem',
              fontFamily: 'var(--font-mono)'
            }}>
              MODE 01 • CITIZEN MOBILE SNAP
            </span>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
              Photo Evidence &amp; Area Tagging
            </h3>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.55 }}>
              Upload or snap a road photo. Use the interactive tool to drag and select the exact damaged asphalt perimeter, run YOLOv8, and dispatch to Nagar Palika.
            </p>

            <button
              type="button"
              className="btn btn-accent"
              style={{ marginTop: '1.5rem', width: '100%', padding: '0.8rem' }}
            >
              Report via Photo
              <ArrowRight size={17} />
            </button>
          </div>

          {/* Card 2: Video Mode */}
          <div
            className="mode-card mode-card-cyan"
            onClick={() => onSelectMode('video')}
          >
            <div style={{
              width: 54,
              height: 54,
              borderRadius: 14,
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Video size={28} />
            </div>

            <span style={{
              background: '#eff6ff',
              color: '#0369a1',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.2rem 0.6rem',
              borderRadius: 6,
              marginBottom: '0.5rem',
              fontFamily: 'var(--font-mono)'
            }}>
              MODE 02 • DASHCAM &amp; PATROL VIDEO
            </span>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
              Video &amp; Dashcam Stream
            </h3>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.55 }}>
              Upload dashcam or corridor video footage. Scrub through frames to identify hazardous potholes, capture keyframes, and map road safety risks.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: '1.5rem', width: '100%', padding: '0.8rem' }}
            >
              Report via Video
              <ArrowRight size={17} />
            </button>
          </div>
        </div>

        {/* Live Map Link */}
        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Looking for existing hazard incidents?</span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onViewMap}
            style={{ fontWeight: 700, color: '#0284c7' }}
          >
            <MapPin size={14} />
            Explore Live Citizen Hazard Map
            <ChevronRight size={14} />
          </button>
        </div>
      </section>

      {/* WHY IN TODAY'S ERA: The Real-World Urgency */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Why This Solution Matters in Today&apos;s World
          </span>
          <h2 style={{ fontSize: 'clamp(1.4rem, 4.5vw, 2rem)', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
            The Urgent Challenge of Road Safety &amp; Urban Governance
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: 680, margin: '0.5rem auto 0', lineHeight: 1.6 }}>
            Rapid urbanization and heavy monsoon seasons degrade asphalt faster than municipal inspectors can manually survey. Here is why automated civic AI is indispensable today.
          </p>
        </div>

        {/* 4 Impact Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
          gap: '1.25rem'
        }}>
          {eraImpacts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  padding: 'clamp(1.25rem, 3vw, 1.75rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  borderTop: `4px solid ${item.color}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.85rem', fontWeight: 800, color: item.color }}>
                    {item.stat}
                  </span>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={item.color} />
                  </div>
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  {item.label}
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* TECH STACK & ARCHITECTURE SECTION */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Under The Hood
          </span>
          <h2 style={{ fontSize: 'clamp(1.4rem, 4.5vw, 2rem)', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
            Enterprise Technology Stack &amp; Architecture
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: 680, margin: '0.5rem auto 0', lineHeight: 1.6 }}>
            Built using modern, battle-tested technologies designed for low latency, sub-second deep learning inference, and high-precision spatial resolution.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '1.5rem'
        }}>
          {techStack.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  padding: 'clamp(1.25rem, 3.5vw, 2rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: t.bgColor,
                    color: t.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                      {t.category}
                    </h4>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {t.techs.map((badge, bIdx) => (
                    <span
                      key={bIdx}
                      style={{
                        background: '#f1f5f9',
                        color: '#334155',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        padding: '0.25rem 0.65rem',
                        borderRadius: 6,
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {t.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* COMPARISON: Manual vs. AI Sentinel System */}
      <section className="glass-panel" style={{ padding: 'clamp(1.25rem, 4vw, 2.5rem)', background: '#ffffff' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Transforming Civic Efficiency
          </span>
          <h2 style={{ fontSize: 'clamp(1.35rem, 4vw, 1.85rem)', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
            Traditional Municipal Surveys vs. AI Pothole Sentinel
          </h2>
        </div>

        <div className="mobile-swipe-hint">
          &larr; Swipe table horizontally to compare &rarr;
        </div>

        <div className="table-responsive-wrapper">
          <table style={{ width: '100%', minWidth: 540, borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-medium)', background: '#f8fafc' }}>
                <th style={{ padding: '0.9rem 0.75rem', width: '22%', fontWeight: 800, color: '#0f172a' }}>Dimension</th>
                <th style={{ padding: '0.9rem 0.75rem', width: '39%', fontWeight: 800, color: '#dc2626' }}>Traditional Manual Process</th>
                <th style={{ padding: '0.9rem 0.75rem', width: '39%', fontWeight: 800, color: '#16a34a' }}>RoadMantri AI Sentinel</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, rIdx) => (
                <tr key={rIdx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1rem 0.75rem', fontWeight: 700, color: '#0f172a' }}>
                    {row.feature}
                  </td>
                  <td style={{ padding: '1rem 0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <span style={{ color: '#dc2626', fontWeight: 800 }}>&times;</span>
                      <span>{row.traditional}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0.75rem', color: '#0f172a', fontWeight: 600, lineHeight: 1.5, background: '#f0fdf4' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <CheckCircle2 size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{row.aiSentinel}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CONNECTED CIVIC BODIES */}
      <section className="glass-panel" style={{ padding: 'clamp(1.25rem, 3.5vw, 2.25rem) clamp(1rem, 3.5vw, 2.5rem)', background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Multi-Tier Civic Jurisdiction Integration:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.65rem', flexWrap: 'wrap' }}>
              <span className="badge badge-nhai">NHAI (Expressways)</span>
              <span className="badge badge-pwd">State PWD (Arterials &gt; 60ft)</span>
              <span className="badge badge-mcd">MCD (Metropolitan Wards)</span>
              <span className="badge badge-ndmc">Nagar Palika (Town Civic)</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Public Incidents:</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                {stats?.total || 18}+ Logged
              </div>
            </div>
            <div style={{ width: 1, height: 35, background: 'var(--border-subtle)' }} />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Actioned Rate:</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#16a34a' }}>
                {stats?.resolutionRate || 85}% Resolved
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Got Questions?
          </span>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 880, margin: '0 auto', width: '100%' }}>
          {faqs.map((faq, fIdx) => (
            <div
              key={fIdx}
              className="glass-panel"
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
                background: '#ffffff'
              }}
            >
              <button
                type="button"
                onClick={() => toggleFaq(fIdx)}
                style={{
                  width: '100%',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: openFaq === fIdx ? '#f8fafc' : '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  transition: 'background 0.15s ease'
                }}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  color="#64748b"
                  style={{
                    transform: openFaq === fIdx ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    flexShrink: 0
                  }}
                />
              </button>

              {openFaq === fIdx && (
                <div style={{
                  padding: '1rem 1.5rem 1.5rem',
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  borderTop: '1px solid var(--border-subtle)',
                  background: '#ffffff'
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
        borderRadius: 16,
        padding: 'clamp(1.75rem, 5vw, 3rem) clamp(1rem, 4vw, 2.5rem)',
        color: '#ffffff',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <h3 style={{ fontSize: 'clamp(1.4rem, 4.5vw, 1.85rem)', fontWeight: 800 }}>
          Make Your Local Roads Safer Today
        </h3>
        <p style={{ fontSize: '0.92rem', opacity: 0.9, maxWidth: 600, lineHeight: 1.55 }}>
          Join citizens and civic authorities in saving lives, protecting vehicles, and ensuring rapid asphalt maintenance across Indian towns and highways.
        </p>

        <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 520 }}>
          <button
            type="button"
            className="btn btn-accent"
            style={{ padding: '0.85rem 1.5rem', fontSize: '0.92rem', flex: '1 1 220px' }}
            onClick={() => onSelectMode('photo')}
          >
            <Camera size={18} />
            Launch Photo Inspection
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            style={{ padding: '0.85rem 1.5rem', fontSize: '0.92rem', background: '#ffffff', color: '#0f172a', flex: '1 1 220px' }}
            onClick={() => onSelectMode('video')}
          >
            <Video size={18} />
            Launch Video Dashcam Mode
          </button>
        </div>
      </section>
    </div>
  );
}
