import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import StatsBar from './components/StatsBar';
import MapView from './components/MapView';
import ReportWizard from './components/ReportWizard';
import TicketList from './components/TicketList';
import TicketDetailModal from './components/TicketDetailModal';
import CivicDirectoryModal from './components/CivicDirectoryModal';
import AnalyticsView from './components/AnalyticsView';
import GovFooter from './components/GovFooter';

import {
  fetchPotholes,
  fetchPotholeStats,
  fetchAuthorities,
  checkServerHealth
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing'); // Default to clean, proper First Page
  const [reportMode, setReportMode] = useState('photo'); // 'photo' | 'video'
  const [potholes, setPotholes] = useState([]);
  const [stats, setStats] = useState(null);
  const [authorities, setAuthorities] = useState({});
  const [serverHealth, setServerHealth] = useState(null);
  const [selectedPothole, setSelectedPothole] = useState(null);

  // Global filters for Map and Ticket List
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAuthority, setFilterAuthority] = useState('all');

  const loadData = async () => {
    try {
      const [potholesData, statsData, authData, healthData] = await Promise.all([
        fetchPotholes(),
        fetchPotholeStats(),  
        fetchAuthorities(),
        checkServerHealth()
      ]);

      setPotholes(potholesData || []);
      setStats(statsData || null);
      setAuthorities(authData || {});
      setServerHealth(healthData || null);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectModeFromLanding = (mode) => {
    setReportMode(mode);
    setActiveTab('wizard');
  };

  const handlePotholeCreated = (newPothole) => {
    setPotholes(prev => [newPothole, ...prev]);
    loadData();
  };

  const handlePotholeUpdated = (updated) => {
    setPotholes(prev => prev.map(p => ((p._id || p.trackingId) === (updated._id || updated.trackingId) ? updated : p)));
    setSelectedPothole(updated);
    loadData();
  };

  const handleJumpToMap = (pothole) => {
    setSelectedPothole(pothole);
    setActiveTab('map');
  };

  return (
    <div className="app-container">
      {/* Official Government of India Header & Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        serverHealth={serverHealth}
        onOpenDirectory={() => setActiveTab('authorities')}
      />

      {/* Main Content Viewport */}
      <main className="main-content">
        {/* FIRST PAGE: Clean Landing Page */}
        {activeTab === 'landing' && (
          <LandingPage
            onSelectMode={handleSelectModeFromLanding}
            onViewMap={() => setActiveTab('map')}
            stats={stats}
          />
        )}

        {/* TAB 1: AI Detection Studio (Photo or Video Mode with Area Selector) */}
        {activeTab === 'wizard' && (
          <ReportWizard
            initialMode={reportMode}
            onPotholeCreated={handlePotholeCreated}
            onViewOnMap={handleJumpToMap}
            onBackHome={() => setActiveTab('landing')}
          />
        )}

        {/* TAB 2: Interactive Real Civic Map */}
        {activeTab === 'map' && (
          <MapView
            potholes={potholes}
            selectedPothole={selectedPothole}
            onSelectPothole={(p) => setSelectedPothole(p)}
            filterSeverity={filterSeverity}
            setFilterSeverity={setFilterSeverity}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterAuthority={filterAuthority}
            setFilterAuthority={setFilterAuthority}
            authorities={authorities}
          />
        )}

        {/* TAB 3: Incidents Directory */}
        {activeTab === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <StatsBar stats={stats} />
            <TicketList
              potholes={potholes}
              onSelectPothole={(p) => setSelectedPothole(p)}
              onUpdateStatus={handlePotholeUpdated}
              filterSeverity={filterSeverity}
              setFilterSeverity={setFilterSeverity}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterAuthority={filterAuthority}
              setFilterAuthority={setFilterAuthority}
            />
          </div>
        )}

        {/* TAB 4: Civic Authorities Directory */}
        {activeTab === 'authorities' && (
          <CivicDirectoryModal
            authorities={authorities}
            potholes={potholes}
          />
        )}

        {/* TAB 5: Nagar Palika Analytics */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <StatsBar stats={stats} />
            <AnalyticsView
              stats={stats}
              potholes={potholes}
            />
          </div>
        )}
      </main>

      {/* Full Ticket Detail Inspection Modal */}
      {selectedPothole && (
        <TicketDetailModal
          pothole={selectedPothole}
          onClose={() => setSelectedPothole(null)}
          onUpdated={handlePotholeUpdated}
        />
      )}

      {/* Official Government of India Web Footer (GIGW) */}
      <GovFooter />
    </div>
  );
}
