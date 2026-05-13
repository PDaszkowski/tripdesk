import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../features/auth/context/AuthProvider'
import { AppShell } from './layout/AppShell'
import { ClientLayout } from './layout/ClientLayout'
import { HomePage } from '../pages/HomePage'
import { DashboardPage } from '../pages/client/DashboardPage'
import { DocumentsPage } from '../pages/client/DocumentsPage'
import { TripsPage } from '../pages/client/TripsPage'
import { DestinationsPage } from '../pages/client/DestinationsPage'
import { WeatherPage } from '../pages/client/WeatherPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { QueryProvider } from './providers/QueryProvider'
import { RequireAuth } from './router/RequireAuth'
import { RequireRole } from './router/RequireRole'

export default function App() {
  return (
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <Routes>
            {/* Public routes - top Navbar via AppShell */}
            <Route element={<AppShell />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* Client panel - sidebar via ClientLayout */}
            <Route element={<RequireAuth />}>
              <Route element={<RequireRole role="CLIENT" />}>
                <Route element={<ClientLayout />}>
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="documents" element={<DocumentsPage />} />
                  <Route path="trips" element={<TripsPage />} />
                  <Route path="destinations" element={<DestinationsPage />} />
                  <Route path="weather" element={<WeatherPage />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  )
}
