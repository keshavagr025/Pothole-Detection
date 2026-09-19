import React, { useState } from 'react';
import { Phone, Shield, ExternalLink, Globe, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function GovHeader() {
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

      {/* 3. Official Government Banner */}
      <div className="gov-main-banner">
        <div className="gov-container gov-banner-inner">
          {/* Ashoka Lion Capital Emblem */}
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

          {/* Official Government Badges */}
          <div className="gov-mission-badges">
            <div className="gov-pill-badge gati-shakti" title="PM Gati Shakti National Master Plan Integration">
              <div className="badge-bullet"></div>
              <div>
                <span className="pill-title">PM Gati Shakti</span>
                <span className="pill-sub">{isHindi ? 'राष्ट्रीय मास्टर प्लान' : 'National Master Plan'}</span>
              </div>
            </div>

            <div className="gov-pill-badge digital-india" title="Digital India Mission">
              <div className="badge-bullet green"></div>
              <div>
                <span className="pill-title">Digital India</span>
                <span className="pill-sub">{isHindi ? 'नागरिक तकनीक मंच' : 'Civic Tech Platform'}</span>
              </div>
            </div>

            <div className="gov-pill-badge nhai-badge" title="National Highways Authority of India & State PWDs">
              <div className="badge-bullet blue"></div>
              <div>
                <span className="pill-title">NHAI &amp; PWD</span>
                <span className="pill-sub">{isHindi ? 'आईआरसी:एसपी:72 मानक' : 'IRC:SP:72 Standard'}</span>
              </div>
            </div>

            <div className="gov-pill-badge cpgrams-badge" title="CPGRAMS Public Grievance Interoperable">
              <Shield size={14} color="#0284c7" />
              <div>
                <span className="pill-title">CPGRAMS</span>
                <span className="pill-sub">{isHindi ? 'समय-सीमा बाध्य' : 'SLA Enforced'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
