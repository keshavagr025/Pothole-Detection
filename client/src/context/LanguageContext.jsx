import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Top Bar & Branding
    gov_of_india: 'Government of India',
    morth_full: 'Ministry of Road Transport & Highways (MoRTH)',
    gov_initiative: 'Govt. of India Initiative',
    morth_header: 'Ministry of Road Transport & Highways • MoRTH',
    portal_name_prefix: 'MĀRG',
    portal_name_suffix: 'DRISHTI',
    portal_name_full: 'MĀRG-DRISHTI',
    portal_tagline: 'National AI Road Distress Surveillance & Statutory Pothole Redressal Portal',
    portal_motto: 'Truth Alone Triumphs',
    satyameva_jayate: 'SATYAMEVA JAYATE',
    
    // Helplines & Utility
    nhai_helpline: 'NHAI 24x7: 1033',
    morth_tollfree: 'MoRTH Toll-Free: 1800-11-0033',
    decrease_font: 'Decrease Font Size',
    normal_font: 'Default Font Size',
    increase_font: 'Increase Font Size',
    switch_to_hindi: 'हिन्दी',
    switch_to_english: 'English',
    language_label: 'Language',

    // Navigation Tabs (Public)
    nav_overview: 'Overview',
    nav_ai_tech: 'YOLOv8 Tech',
    nav_impact: 'National Impact',
    nav_faqs: 'FAQs',

    // Navigation Tabs (Auth)
    nav_dashboard: 'Dashboard',
    nav_report_pothole: 'Report Pothole',
    nav_gis_map: 'GIS Map',
    nav_grievances: 'Grievance Registry',
    nav_analytics: 'National KPIs',
    nav_directory: 'Directory',
    nav_sign_in: 'Sign In',
    nav_sign_out: 'Sign Out',
    nav_my_grievances: 'My Grievances',
    nav_report_defect: 'Report Defect',
    nav_civic_officer: 'Civic Officer',
    nav_citizen: 'Citizen',
    nav_pts: 'pts',
    nav_nic_gateway: 'NIC Gateway Active',
    nav_connecting: 'Connecting...',

    // Footer
    footer_charter_title: "Citizen's Charter & SLA",
    footer_portals_title: 'National Portals',
    footer_contact_title: '24x7 Control Room & Helpline',
    footer_nhai_emergency: 'NHAI Highway Emergency:',
    footer_toll_free: '1033 (Toll Free)',
    footer_morth_desk: 'MoRTH Grievance Desk:',
    footer_escalation: 'Escalation Desk:',
    footer_desc: 'MĀRG-DRISHTI is an authoritative centralized portal providing artificial intelligence surveillance of road defects, algorithmic jurisdiction routing, and legally enforceable civic repair mandates across India.',
    footer_nic: 'Designed, Developed & Hosted by National Informatics Centre (NIC)',
    footer_meity: 'Ministry of Electronics & Information Technology, Government of India',
    footer_copyright: '© 2026 Ministry of Road Transport and Highways. All rights reserved. Last Updated: September 2026.',
    footer_sla_expressways: 'NHAI Expressways: 24-Hour SLA',
    footer_sla_pwd: 'State PWD Roads: 48-Hour SLA',
    footer_sla_mcd: 'Municipal Corridors: 72-Hour SLA',
    footer_sla_pmgsy: 'Rural Roads (PMGSY): 96-Hour SLA',
    footer_irc_standard: 'IRC:SP:72 Standard Compaction',
  },
  hi: {
    // Top Bar & Branding
    gov_of_india: 'भारत सरकार',
    morth_full: 'सड़क परिवहन एवं राजमार्ग मंत्रालय (MoRTH)',
    gov_initiative: 'भारत सरकार का उपक्रम',
    morth_header: 'सड़क परिवहन और राजमार्ग मंत्रालय • MoRTH',
    portal_name_prefix: 'मार्ग',
    portal_name_suffix: '-दृष्टि',
    portal_name_full: 'मार्ग-दृष्टि',
    portal_tagline: 'राष्ट्रीय सड़क दोष पहचान, जीआईएस निगरानी एवं नागरिक शिकायत निवारण प्रणाली',
    portal_motto: 'सत्यमेव जयते',
    satyameva_jayate: 'सत्यमेव जयते',
    
    // Helplines & Utility
    nhai_helpline: 'एनएचएआई 24x7: 1033',
    morth_tollfree: 'सड़क परिवहन टोल-फ्री: 1800-11-0033',
    decrease_font: 'फ़ॉन्ट आकार छोटा करें',
    normal_font: 'सामान्य फ़ॉन्ट',
    increase_font: 'फ़ॉन्ट आकार बड़ा करें',
    switch_to_hindi: 'हिन्दी',
    switch_to_english: 'English',
    language_label: 'भाषा',

    // Navigation Tabs (Public)
    nav_overview: 'पोर्टल परिचय',
    nav_ai_tech: 'एआई तकनीक',
    nav_impact: 'राष्ट्रीय प्रभाव',
    nav_faqs: 'सामान्य प्रश्न',

    // Navigation Tabs (Auth)
    nav_dashboard: 'मुख्य डैशबोर्ड',
    nav_report_pothole: 'सड़क दोष रिपोर्ट',
    nav_gis_map: 'जीआईएस मानचित्र',
    nav_grievances: 'शिकायत पंजिका',
    nav_analytics: 'राष्ट्रीय प्रगति',
    nav_directory: 'निर्देशिका',
    nav_sign_in: 'प्रवेश',
    nav_sign_out: 'लॉगआउट',
    nav_my_grievances: 'मेरी शिकायतें',
    nav_report_defect: 'सड़क दोष दर्ज करें',
    nav_civic_officer: 'नागरिक अधिकारी',
    nav_citizen: 'नागरिक',
    nav_pts: 'अंक',
    nav_nic_gateway: 'एनआईसी गेटवे सक्रिय',
    nav_connecting: 'कनेक्ट हो रहा है...',

    // Footer
    footer_charter_title: 'नागरिक अधिकार पत्र एवं समय-सीमा',
    footer_portals_title: 'महत्वपूर्ण राष्ट्रीय पोर्टल',
    footer_contact_title: '24x7 नियंत्रण कक्ष एवं हेल्पलाइन',
    footer_nhai_emergency: 'एनएचएआई राष्ट्रीय राजमार्ग आपातकाल:',
    footer_toll_free: '1033 (टोल फ्री)',
    footer_morth_desk: 'सड़क परिवहन शिकायत केंद्र:',
    footer_escalation: 'अधिकारी निवारण डेस्क:',
    footer_desc: 'मार्ग-दृष्टि (MĀRG-DRISHTI) एक अधिकृत केंद्रीय प्रणाली है जो एआई दृष्टि तकनीक द्वारा सड़क दोषों की पहचान, स्वचालित अधिकार क्षेत्र आवंटन एवं समयबद्ध सड़क मरम्मत सुनिश्चित करती है।',
    footer_nic: 'राष्ट्रीय सूचना विज्ञान केंद्र (एनआईसी) द्वारा डिजाइन, विकसित और होस्ट किया गया',
    footer_meity: 'इलेक्ट्रॉनिक्स और सूचना प्रौद्योगिकी मंत्रालय, भारत सरकार',
    footer_copyright: '© 2026 सड़क परिवहन एवं राजमार्ग मंत्रालय। सर्वाधिकार सुरक्षित। अंतिम अद्यतन: सितंबर 2026.',
    footer_sla_expressways: 'एनएचएआई एक्सप्रेसवे: 24 घंटे की समय-सीमा',
    footer_sla_pwd: 'राज्य पीडब्ल्यूडी मार्ग: 48 घंटे की समय-सीमा',
    footer_sla_mcd: 'नगर निगम क्षेत्र: 72 घंटे की समय-सीमा',
    footer_sla_pmgsy: 'ग्रामीण सड़क (PMGSY): 96 घंटे का लक्ष्य',
    footer_irc_standard: 'आईसीआर:एसपी:72 मानक मरम्मत दिशानिर्देश',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('mrg_portal_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('mrg_portal_lang', language);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key, fallback = '') => {
    return translations[language]?.[key] || translations['en']?.[key] || fallback || key;
  };

  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isHindi,
        isEnglish
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
