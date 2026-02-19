import { useState, useEffect } from 'react'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Footer from './components/Footer'


// Page imports
import DashboardPage from './pages/DashboardPage'
import IssuesPage from './pages/IssuesPage'
import ProcessPage from './pages/ProcessPage'
import BreweriesPage from './pages/BreweriesPage'
import DocumentationPage from './pages/DocumentationPage'
import SLAPage from './pages/SLAPage'
import TrainingPage from './pages/TrainingPage'
import EscalationPage from './pages/EscalationPage'
import { PageType } from './types'



// Main App component with role-based routing
function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>('issues')


  // Wrapper function to handle page changes
  const handlePageChange = (page: string) => {
    setCurrentPage(page as PageType)
  }

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />
      case 'issues':
        return <IssuesPage />
      case 'process':
        return <ProcessPage />
      case 'breweries':
        return <BreweriesPage />
      case 'sla':
        return <SLAPage />
      case 'documentation':
        return <DocumentationPage />
      case 'training':
        return <TrainingPage />
      case 'escalation':
        return <EscalationPage />
      default:
        return <IssuesPage />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Navigation currentPage={currentPage} setCurrentPage={handlePageChange} />
      <main className="flex-grow w-full">
        <div className="fade-in">
          {renderPage()}
        </div>
      </main>
      <Footer />
    </div>
  )
}

// Main App component
function App() {
  return <AppContent />
}

export default App

