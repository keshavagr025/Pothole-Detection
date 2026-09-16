import React from 'react';
import { ShieldCheck, ExternalLink, HelpCircle, FileCheck, PhoneCall, Building2 } from 'lucide-react';

export default function GovFooter() {
  return (
    <footer className="gov-footer-wrapper">
      {/* Upper Footer Links */}
      <div className="gov-footer-top">
        <div className="gov-container gov-footer-grid">
          {/* Column 1: Ministry Particulars */}
          <div className="gov-footer-col">
            <div className="footer-logo-block">
              <span className="footer-emblem-text">सत्यमेव जयते</span>
              <h4 className="footer-dept-title">सड़क परिवहन एवं राजमार्ग मंत्रालय</h4>
              <p className="footer-dept-subtitle">Ministry of Road Transport &amp; Highways, Government of India</p>
            </div>
            <p className="footer-desc">
              मार्ग-दृष्टि (MĀRG-DRISHTI) is an authoritative centralized portal providing artificial intelligence surveillance of road defects, algorithmic jurisdiction routing, and legally enforceable civic repair mandates across India.
            </p>
          </div>

          {/* Column 2: Citizen Charter & SLA */}
          <div className="gov-footer-col">
            <h4 className="footer-col-title">नागरिक अधिकार पत्र • Citizen's Charter</h4>
            <ul className="footer-links-list">
              <li>
                <span className="link-bullet">▸</span>
                <span><strong>NHAI Expressways:</strong> 24-Hour Statutory SLA</span>
              </li>
              <li>
                <span className="link-bullet">▸</span>
                <span><strong>State PWD Corridors:</strong> 48-Hour Enforced SLA</span>
              </li>
              <li>
                <span className="link-bullet">▸</span>
                <span><strong>Nagar Palika / Nigam:</strong> 72-Hour Mandate</span>
              </li>
              <li>
                <span className="link-bullet">▸</span>
                <span><strong>Gram Sadak (PMGSY):</strong> 96-Hour Target</span>
              </li>
              <li>
                <span className="link-bullet">▸</span>
                <span>IRC:SP:72 Guidelines for Pothole Compaction</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Important Government Portals */}
          <div className="gov-footer-col">
            <h4 className="footer-col-title">महत्वपूर्ण लिंक • National Portals</h4>
            <ul className="footer-links-list">
              <li>
                <a href="https://morth.nic.in" target="_blank" rel="noreferrer">
                  MoRTH Central Portal <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a href="https://nhai.gov.in" target="_blank" rel="noreferrer">
                  NHAI Official Website <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a href="https://pgportal.gov.in" target="_blank" rel="noreferrer">
                  CPGRAMS Public Grievance <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a href="https://india.gov.in" target="_blank" rel="noreferrer">
                  National Portal of India (india.gov.in) <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a href="https://digitalindia.gov.in" target="_blank" rel="noreferrer">
                  Digital India Initiative <ExternalLink size={11} />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Helpdesk & Control Room */}
          <div className="gov-footer-col">
            <h4 className="footer-col-title">आपातकालीन संपर्क • 24x7 Control Room</h4>
            <div className="footer-contact-item">
              <PhoneCall size={14} color="#ea580c" />
              <div>
                <span className="contact-label">NHAI National Highway Emergency:</span>
                <a href="tel:1033" className="contact-val">1033 (Toll Free)</a>
              </div>
            </div>
            <div className="footer-contact-item">
              <Building2 size={14} color="#0284c7" />
              <div>
                <span className="contact-label">MoRTH Transport Bhavan Helpline:</span>
                <a href="tel:1800110033" className="contact-val">1800-11-0033</a>
              </div>
            </div>
            <div className="footer-contact-item">
              <FileCheck size={14} color="#16a34a" />
              <div>
                <span className="contact-label">Grievance Escalation:</span>
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
              Designed, Developed and Hosted by <strong>National Informatics Centre (NIC)</strong>
              <br />
              <span className="nic-sub">Ministry of Electronics &amp; Information Technology, Government of India</span>
            </p>
          </div>

          <div className="compliance-meta">
            <div className="compliance-links">
              <span>RTI Act 2005</span>
              <span className="dot">•</span>
              <span>Citizen Charter</span>
              <span className="dot">•</span>
              <span>Terms of Use</span>
              <span className="dot">•</span>
              <span>Privacy Policy</span>
              <span className="dot">•</span>
              <span>Accessibility Statement</span>
            </div>
            <p className="copyright-line">
              © 2026 Ministry of Road Transport and Highways. All rights reserved. Last Updated: September 2026.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
