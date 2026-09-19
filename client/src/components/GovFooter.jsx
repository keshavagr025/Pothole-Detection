import React from 'react';
import { ShieldCheck, ExternalLink, HelpCircle, FileCheck, PhoneCall, Building2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function GovFooter() {
  const { t, isHindi } = useLanguage();

  return (
    <footer className="gov-footer-wrapper">
      {/* Upper Footer Links */}
      <div className="gov-footer-top">
        <div className="gov-container gov-footer-grid">
          {/* Column 1: Ministry Particulars */}
          <div className="gov-footer-col">
            <div className="footer-logo-block">
              <span className="footer-emblem-text">सत्यमेव जयते</span>
              <h4 className="footer-dept-title">
                {isHindi ? 'सड़क परिवहन एवं राजमार्ग मंत्रालय' : 'Ministry of Road Transport & Highways'}
              </h4>
              <p className="footer-dept-subtitle">
                {isHindi ? 'भारत सरकार • Government of India' : 'Government of India'}
              </p>
            </div>
            <p className="footer-desc">
              {t('footer_desc')}
            </p>
          </div>

          {/* Column 2: Citizen Charter & SLA */}
          <div className="gov-footer-col">
            <h4 className="footer-col-title">{t('footer_charter_title')}</h4>
            <ul className="footer-links-list">
              <li>
                <span className="link-bullet">▸</span>
                <span><strong>{t('footer_sla_expressways')}</strong></span>
              </li>
              <li>
                <span className="link-bullet">▸</span>
                <span><strong>{t('footer_sla_pwd')}</strong></span>
              </li>
              <li>
                <span className="link-bullet">▸</span>
                <span><strong>{t('footer_sla_mcd')}</strong></span>
              </li>
              <li>
                <span className="link-bullet">▸</span>
                <span><strong>{t('footer_sla_pmgsy')}</strong></span>
              </li>
              <li>
                <span className="link-bullet">▸</span>
                <span>{t('footer_irc_standard')}</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Important Government Portals */}
          <div className="gov-footer-col">
            <h4 className="footer-col-title">{t('footer_portals_title')}</h4>
            <ul className="footer-links-list">
              <li>
                <a href="https://morth.nic.in" target="_blank" rel="noreferrer">
                  {isHindi ? 'MoRTH केंद्रीय पोर्टल' : 'MoRTH Central Portal'} <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a href="https://nhai.gov.in" target="_blank" rel="noreferrer">
                  {isHindi ? 'एनएचएआई आधिकारिक वेबसाइट' : 'NHAI Official Website'} <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a href="https://pgportal.gov.in" target="_blank" rel="noreferrer">
                  {isHindi ? 'सीपीजीआरएएमएस जन शिकायत' : 'CPGRAMS Public Grievance'} <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a href="https://india.gov.in" target="_blank" rel="noreferrer">
                  {isHindi ? 'भारत का राष्ट्रीय पोर्टल' : 'National Portal of India'} (india.gov.in) <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a href="https://digitalindia.gov.in" target="_blank" rel="noreferrer">
                  {isHindi ? 'डिजिटल इंडिया पहल' : 'Digital India Initiative'} <ExternalLink size={11} />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Helpdesk & Control Room */}
          <div className="gov-footer-col">
            <h4 className="footer-col-title">{t('footer_contact_title')}</h4>
            <div className="footer-contact-item">
              <PhoneCall size={14} color="#ea580c" />
              <div>
                <span className="contact-label">{t('footer_nhai_emergency')}</span>
                <a href="tel:1033" className="contact-val">{t('footer_toll_free')}</a>
              </div>
            </div>
            <div className="footer-contact-item">
              <Building2 size={14} color="#0284c7" />
              <div>
                <span className="contact-label">{t('footer_morth_desk')}</span>
                <a href="tel:1800110033" className="contact-val">1800-11-0033</a>
              </div>
            </div>
            <div className="footer-contact-item">
              <FileCheck size={14} color="#16a34a" />
              <div>
                <span className="contact-label">{t('footer_escalation')}</span>
                <span className="contact-val">nodal-officer@morth.gov.in</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower GIGW Compliance & NIC Attribution Bar */}
      <div className="gov-footer-bottom">
        <div className="gov-container footer-bottom-inner">
          <div className="nic-attribution">
            <div className="nic-badge">NIC</div>
            <p>
              {t('footer_nic')}
              <br />
              <span className="nic-sub">{t('footer_meity')}</span>
            </p>
          </div>

          <div className="compliance-meta">
            <div className="compliance-links">
              <span>RTI Act 2005</span>
              <span className="dot">•</span>
              <span>{isHindi ? 'नागरिक चार्टर' : "Citizen's Charter"}</span>
              <span className="dot">•</span>
              <span>{isHindi ? 'उपयोग की शर्तें' : 'Terms of Use'}</span>
              <span className="dot">•</span>
              <span>{isHindi ? 'गोपनीयता नीति' : 'Privacy Policy'}</span>
              <span className="dot">•</span>
              <span>{isHindi ? 'सुलभता विवरण' : 'Accessibility Statement'}</span>
            </div>
            <p className="copyright-line">
              {t('footer_copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
