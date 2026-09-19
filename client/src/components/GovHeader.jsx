import React, { useState, useEffect } from 'react';
import { Phone, Shield, ExternalLink, Globe, Sparkles, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function GovHeader() {
  const { language, setLanguage, toggleLanguage, t, isHindi, isEnglish } = useLanguage();
  const [fontSize, setFontSize] = useState('normal');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 'gati-shakti',
      badge: isHindi ? 'पीएम गति शक्ति' : 'PM Gati Shakti',
      tag: isHindi ? 'राष्ट्रीय मास्टर प्लान' : 'National Master Plan',
      title: isHindi ? 'दिल्ली-मुंबई एवं 10,000+ किमी उच्च गति एक्सप्रेसवे नेटवर्क' : 'Delhi-Mumbai & 10,000+ km Expressway Corridors',
      desc: isHindi ? 'आधुनिक 8-लेन सड़कें, निर्बाध लॉजिस्टिक्स व विश्वस्तरीय संपर्क' : 'Modern 8-Lane Expressways & Seamless Multimodal Freight',
      image: '/banners/expressway.jpg',
    },
    {
      id: 'ai-surveillance',
      badge: isHindi ? 'एआई दृष्टि सर्विलांस' : 'AI Vision Surveillance',
      tag: isHindi ? 'सड़क गुणवत्ता परीक्षण' : 'Smart Road Scanning',
      title: isHindi ? 'हाईवे लेजर स्कैनिंग एवं स्वचालित गड्ढा पहचान' : 'High-Speed Laser Scanning & Pothole Detection',
      desc: isHindi ? 'YOLOv8 एआई द्वारा त्वरित पहचान और 24-48 घंटे की समय-सीमा' : 'Real-Time YOLOv8 AI Analysis with 24-48h Statutory SLA',
      image: '/banners/ai_surveillance.jpg',
    },
    {
      id: 'bharatmala',
      badge: isHindi ? 'भारतमाला परियोजना' : 'Bharatmala Pariyojana',
      tag: isHindi ? 'आर्थिक गलियारे' : 'Economic Corridors',
      title: isHindi ? '34,800 किमी राष्ट्रीय राजमार्ग एवं सीमावर्ती संपर्क' : '34,800 km World-Class National Highway Grid',
      desc: isHindi ? 'देश के सभी 28 राज्यों और केंद्र शासित प्रदेशों में उन्नत सड़कें' : 'Pan-India Connectivity Connecting Ports, Hubs & Borders',
      image: '/banners/bharatmala.jpg',
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

  const activeSlide = slides[currentSlide];

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

      {/* 3. Official Government Banner with Full Background Slider */}
      <div
        className="gov-main-banner"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Full-width Background Image Slider (Crossfading every 2-3s) */}
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
          {/* Subtle light/protective gradient overlay ensuring 100% typography readability */}
          <div className="gov-banner-overlay"></div>
        </div>

        {/* Foreground Content (Logo, Emblem, Title, Project Showcase) */}
        <div className="gov-container gov-banner-inner">
          {/* Ashoka Lion Capital Emblem & Portal Title Block */}
          <div className="gov-emblem-section">
            <div className="ashoka-emblem" title="State Emblem of India • सत्यमेव जयते">
              {/* High Quality Official Lion Capital of Ashoka Vector Crest */}
              <svg viewBox="0 0 100 120" width="48" height="58" className="emblem-svg">
                {/* Ashoka Pillar Base and Four Lions Stylized Representation */}
                <path d="M50 8 C44 8 40 12 40 18 C40 22 43 25 45 27 C42 29 40 32 40 36 C40 40 44 43 50 43 C56 43 60 40 60 36 C60 32 58 29 55 27 C57 25 60 22 60 18 C60 12 56 8 50 8 Z" fill="#b45309" opacity="0.9" />
                {/* Left Lion Profile */}
                <path d="M36 20 C32 20 28 24 28 29 C28 34 32 37 36 38 C34 40 32 43 33 47 C34 51 38 53 43 53 L44 44 C40 43 38 41 38 38 C38 35 40 33 42 32 Z" fill="#b45309" opacity="0.8" />
                {/* Right Lion Profile */}
                <path d="M64 20 C68 20 72 24 72 29 C72 34 68 37 64 38 C66 40 68 43 67 47 C66 51 62 53 57 53 L56 44 C60 43 62 41 62 38 C62 35 60 33 58 32 Z" fill="#b45309" opacity="0.8" />
                {/* Capital Abacus */}
                <rect x="24" y="55" width="52" height="12" rx="3" fill="#92400e" />
                {/* Ashoka Chakra in Capital Base */}
                <circle cx="50" cy="61" r="5" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                <path d="M50 56 L50 66 M45 61 L55 61 M46.5 57.5 L53.5 64.5 M46.5 64.5 L53.5 57.5" stroke="#ffffff" strokeWidth="1" />
                {/* Galloping Horse (Left) & Humped Bull (Right) Stylized */}
                <circle cx="34" cy="61" r="2.5" fill="#fde68a" />
                <circle cx="66" cy="61" r="2.5" fill="#fde68a" />
                {/* Bell-shaped Inverted Lotus Base */}
                <path d="M30 68 C34 76 66 76 70 68 L74 72 C68 84 32 84 26 72 Z" fill="#b45309" />
                {/* Pedestal plinth */}
                <rect x="22" y="82" width="56" height="5" rx="1.5" fill="#78350f" />
                {/* सत्यमेव जयते Text in Devnagari */}
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

          {/* Right-Hand Minimalist Slide Indicators */}
          <div className="gov-banner-slide-indicator">
            <div className="indicator-pill">
              <span className="pulse-dot"></span>
              <span>{activeSlide.badge}</span>
            </div>
            <div className="slider-dots">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  className={`slider-dot ${currentSlide === idx ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
