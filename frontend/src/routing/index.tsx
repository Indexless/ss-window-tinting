import { BrowserRouter } from 'react-router-dom'
import { CookieNotice } from '../components/legal/CookieNotice'
import { AuthProvider } from '../providers/AuthProvider'
import { SiteConfigProvider } from '../providers/SiteConfigProvider'
import { AppRoutes } from './routes'

export function AppRouter() {
  return (
    <BrowserRouter>
      <SiteConfigProvider>
        <AuthProvider>
          <AppRoutes />
          <CookieNotice />
        </AuthProvider>
      </SiteConfigProvider>
    </BrowserRouter>
  )
}
