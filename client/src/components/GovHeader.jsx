import React, { useState, useEffect } from 'react';
import { Phone, Shield, ExternalLink, Globe, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function GovTopBar() {
  const { language, setLanguage, toggleLanguage, t, isHindi, isEnglish } = useLanguage();
  const [fontSize, setFontSize] = useState('normal');

  const handleFontSize = (size) => {
    setFontSize(size);
    if (size === 'small') {
      document.documentElement.style.fontSize = '14px';
    } else if (size === 'large') {
      document.documentElement.style.fontSize = '17px';
    } else {
      document.documentElement.style.fontSize = '15px';
    }
  };

  return (
    <div className="gov-header-wrapper">
      {/* 1. National Tiranga Ribbon */}
      <div className="tiranga-strip" title="National Flag Accent (Saffron, White, Green)">
        <div className="strip-saffron"></div>
        <div className="strip-white">
          <div className="chakra-dot"></div>
        </div>
        <div className="strip-green"></div>
      </div>

      {/* 2. Top GIGW Utility Bar */}
      <div className="gov-top-bar">
        <div className="gov-container gov-top-bar-inner">
          <div className="gov-ministry-tag">
            {isHindi ? (
              <>
                <span className="hindi-text">भारत सरकार</span>
                <span className="divider">|</span>
                <span className="hindi-text">सड़क परिवहन एवं राजमार्ग मंत्रालय (MoRTH)</span>
              </>
            ) : (
              <>
                <span>Government of India</span>
                <span className="divider">|</span>
                <span className="ministry-en">Ministry of Road Transport &amp; Highways (MoRTH)</span>
              </>
            )}
          </div>

          <div className="gov-top-actions">
            {/* National Helplines */}
            <div className="gov-helpline-group">
              <a href="tel:1033" className="helpline-badge nhai-helpline" title="NHAI 24x7 Highway Emergency Helpline">
                <Phone size={12} />
                <span>{isHindi ? 'एनएचएआई 24x7: ' : 'NHAI 24x7: '}<strong>1033</strong></span>
              </a>
              <a href="tel:1800110033" className="helpline-badge morth-helpline" title="MoRTH Grievance Toll-Free Desk">
                <span>{isHindi ? 'टोल-फ्री: ' : 'MoRTH Toll-Free: '}<strong>1800-11-0033</strong></span>
              </a>
            </div>

            {/* Language Switcher */}
            <div className="gov-lang-switcher" title="Select Portal Language / पोर्टल की भाषा चुनें">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`gov-lang-btn ${isEnglish ? 'active' : ''}`}
                aria-label="Switch to English"
              >
                English
              </button>
              <span className="lang-pipe">|</span>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`gov-lang-btn ${isHindi ? 'active' : ''}`}
                aria-label="Switch to Hindi"
              >
                हिन्दी
              </button>
            </div>

            {/* Accessibility Controls */}
            <div className="gov-accessibility">
              <button
                type="button"
                onClick={() => handleFontSize('small')}
                className={`gov-text-btn ${fontSize === 'small' ? 'active' : ''}`}
                title="Decrease Font Size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => handleFontSize('normal')}
                className={`gov-text-btn ${fontSize === 'normal' ? 'active' : ''}`}
                title="Default Font Size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => handleFontSize('large')}
                className={`gov-text-btn ${fontSize === 'large' ? 'active' : ''}`}
                title="Increase Font Size"
              >
                A+
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GovMainBanner() {
  const { t, isHindi } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 'gati-shakti',
      badge: isHindi ? 'पीएम गति शक्ति' : 'PM Gati Shakti',
      tag: isHindi ? 'राष्ट्रीय महामार्ग परियोजना' : 'Expressway Corridor',
      title: isHindi ? 'दिल्ली-मुंबई एवं 10,000+ किमी उच्च गति एक्सप्रेसवे नेटवर्क' : 'Delhi-Mumbai & 10,000+ km High-Speed Expressway Corridors',
      desc: isHindi ? 'आधुनिक 8-लेन सड़कें, निर्बाध लॉजिस्टिक्स व विश्वस्तरीय संपर्क' : 'World-Class 8-Lane Expressways & Seamless Multimodal Freight',
      image: '/banners/gati_shakti_expressway.jpg',
      stat: isHindi ? '10,000+ किमी निर्मित' : '10,000+ km Completed'
    },
    {
      id: 'ai-surveillance',
      badge: isHindi ? 'एआई दृष्टि सर्विलांस' : 'AI Laser Patrol Fleet',
      tag: isHindi ? 'सड़क गुणवत्ता परीक्षण' : 'Real-Time Scanning',
      title: isHindi ? 'हाईवे लेजर स्कैनिंग एवं स्वचालित गड्ढा पहचान' : 'Automated Laser Scanning & Pothole Distress Profiling',
      desc: isHindi ? 'YOLOv8 एआई द्वारा त्वरित पहचान और 24-48 घंटे की समय-सीमा' : 'RoadSense YOLOv8 Mobile Patrol Units with 150ms Detection & Statutory SLA',
      image: '/banners/highway_laser_inspection.jpg',
      stat: isHindi ? '150ms एआई गति' : '150ms AI Latency'
    },
    {
      id: 'bharatmala',
      badge: isHindi ? 'भारतमाला परियोजना' : 'Bharatmala Pariyojana',
      tag: isHindi ? 'आर्थिक गलियारे' : 'National Grid',
      title: isHindi ? '34,800 किमी राष्ट्रीय राजमार्ग एवं सीमावर्ती संपर्क' : '34,800 km Pan-India National Highway Network',
      desc: isHindi ? 'देश के सभी 28 राज्यों और केंद्र शासित प्रदेशों में उन्नत सड़कें' : 'Connecting 28 States, Maritime Ports, Economic Corridors & Border Outposts',
      image: '/banners/bharatmala.jpg',
      stat: isHindi ? '34,800 किमी लक्ष्य' : '34,800 km Target'
    }
  ];

  // Auto-slide every 2.8 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const activeSlide = slides[currentSlide];

  return (
    <div
      className="gov-main-banner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Full-width Background Image Slider (Vibrant, Crystal-Clear with Smooth Transitions) */}
      <div className="gov-banner-bg-slider" aria-hidden="true">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`gov-banner-bg-slide ${currentSlide === idx ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${slide.image})`
            }}
          />
        ))}
        {/* Crisp protective overlay preserving image brightness while ensuring text readability */}
        <div className="gov-banner-overlay"></div>
      </div>

      {/* Foreground Content: Title on Left, Floating Project Card & Dots on Right */}
      <div className="gov-container gov-banner-inner">
        {/* Ashoka Lion Capital Emblem & Portal Title Glass Card */}
        <div className="gov-emblem-section">
          <div className="ashoka-emblem" title="State Emblem of India • सत्यमेव जयते">
            <svg viewBox="0 0 100 120" width="48" height="58" className="emblem-svg">
              <path d="M50 8 C44 8 40 12 40 18 C40 22 43 25 45 27 C42 29 40 32 40 36 C40 40 44 43 50 43 C56 43 60 40 60 36 C60 32 58 29 55 27 C57 25 60 22 60 18 C60 12 56 8 50 8 Z" fill="#b45309" opacity="0.95" />
              <path d="M36 20 C32 20 28 24 28 29 C28 34 32 37 36 38 C34 40 32 43 33 47 C34 51 38 53 43 53 L44 44 C40 43 38 41 38 38 C38 35 40 33 42 32 Z" fill="#b45309" opacity="0.85" />
              <path d="M64 20 C68 20 72 24 72 29 C72 34 68 37 64 38 C66 40 68 43 67 47 C66 51 62 53 57 53 L56 44 C60 43 62 41 62 38 C62 35 60 33 58 32 Z" fill="#b45309" opacity="0.85" />
              <rect x="24" y="55" width="52" height="12" rx="3" fill="#92400e" />
              <circle cx="50" cy="61" r="5" fill="none" stroke="#ffffff" strokeWidth="1.5" />
              <path d="M50 56 L50 66 M45 61 L55 61 M46.5 57.5 L53.5 64.5 M46.5 64.5 L53.5 57.5" stroke="#ffffff" strokeWidth="1" />
              <circle cx="34" cy="61" r="2.5" fill="#fde68a" />
              <circle cx="66" cy="61" r="2.5" fill="#fde68a" />
              <path d="M30 68 C34 76 66 76 70 68 L74 72 C68 84 32 84 26 72 Z" fill="#b45309" />
              <rect x="22" y="82" width="56" height="5" rx="1.5" fill="#78350f" />
              <text x="50" y="97" textAnchor="middle" fontSize="8" fontWeight="800" fill="#0f172a" fontFamily="'Noto Sans Devanagari', 'Segoe UI', serif">
                सत्यमेव जयते
              </text>
              <text x="50" y="107" textAnchor="middle" fontSize="6.5" fontWeight="600" fill="#475569" letterSpacing="1">
                SATYAMEVA JAYATE
              </text>
            </svg>
          </div>

          <div className="gov-title-block">
            <div className="gov-sub-heading">
              <span className="hindi-badge">{t('gov_initiative')}</span>
              <span className="hierarchy-text">{t('morth_header')}</span>
            </div>
            <h1 className="gov-portal-heading">
              {isHindi ? (
                <>
                  मार्ग<span className="en-portal-title">-दृष्टि</span>
                </>
              ) : (
                <>
                  MĀRG<span className="en-portal-title">-DRISHTI</span>
                </>
              )}
            </h1>
            <p className="gov-tagline">
              {t('portal_tagline')}
            </p>
          </div>
        </div>

        {/* Right-Hand Floating Highway Initiative Card with Live Slide Switcher */}
        <div className="gov-banner-showcase-card">
          <div className="showcase-card-header">
            <div className="showcase-badge">
              <span className="pulse-dot"></span>
              <span>{activeSlide.badge}</span>
            </div>
            <span className="showcase-stat-chip">{activeSlide.stat}</span>
          </div>

          <div className="showcase-title-row">
            <h3 className="showcase-main-title">{activeSlide.title}</h3>
            <p className="showcase-desc">{activeSlide.desc}</p>
          </div>

          <div className="showcase-bottom-bar">
            <div className="slider-dots">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  className={`slider-dot ${currentSlide === idx ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  title={s.title}
                />
              ))}
            </div>
            <span className="showcase-timer-hint">Auto-sliding 2.8s</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GovHeader() {
  return (
    <>
      <GovTopBar />
      <GovMainBanner />
    </>
  );
}

