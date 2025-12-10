// Main App component for Indus Pulse Warning System

import { useState } from 'react';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Header } from './components/dashboard/Header';
import { Sidebar } from './components/dashboard/Sidebar';
import { GeneralMapPage } from './pages/GeneralMapPage';
import { MonitoringPage } from './pages/MonitoringPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AlertsPage } from './pages/AlertsPage';
import { PopulationPage } from './pages/PopulationPage';
import { EvacuationPage } from './pages/EvacuationPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export type PageType = 'overview' | 'map' | 'analytics' | 'alerts' | 'population' | 'evacuation' | 'admin';

/**
 * Main application component with multi-page layout
 */
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('overview');

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <GeneralMapPage />;
      case 'map':
        return <MonitoringPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'population':
        return <PopulationPage />;
      case 'evacuation':
        return <EvacuationPage />;
      case 'admin':
        return <AdminDashboardPage />;
      default:
        return <GeneralMapPage />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />

          {/* Main Content Area */}
          <main className="flex-1 overflow-hidden">
            {renderPage()}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
