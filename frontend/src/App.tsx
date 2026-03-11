import { ThemeProvider } from './context/ThemeContext'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Studio from './pages/Studio'
import Packages from './pages/Packages'
import PackageDetail from './pages/PackageDetail'
import Impact from './pages/Impact'
import Governance from './pages/Governance'
import SettingsPage from './pages/SettingsPage'
import Sidebar from './components/layout/Sidebar'
import ApiKeyBanner from './components/ApiKeyBanner'
import { ApiKeyProvider } from './lib/apiKeyContext'
import { SettingsProvider } from './lib/settingsContext'

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-60 min-h-screen overflow-auto">
        <ApiKeyBanner />
        <div className="p-6 max-w-screen-xl">
          {children}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider><ApiKeyProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard"         element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/studio"            element={<AppLayout><Studio /></AppLayout>} />
            <Route path="/packages"          element={<AppLayout><Packages /></AppLayout>} />
            <Route path="/packages/:id"      element={<AppLayout><PackageDetail /></AppLayout>} />
            <Route path="/impact"            element={<AppLayout><Impact /></AppLayout>} />
            <Route path="/governance"        element={<AppLayout><Governance /></AppLayout>} />
            <Route path="/settings"          element={<AppLayout><SettingsPage /></AppLayout>} />
            <Route path="*"                  element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </ApiKeyProvider></ThemeProvider>
  )
}
