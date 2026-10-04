import { BrowserRouter } from 'react-router-dom'
import { CookieNotice } from '../components/legal/CookieNotice'
import { AuthProvider } from '../providers/AuthProvider'
import { SiteConfigProvider } from '../providers/SiteConfigProvider'
import { AppRoutes } from './routes'
import { ScrollManager } from './ScrollManager'

export function AppRouter() {
  return (
    <BrowserRouter>
      <SiteConfigProvider>
        <AuthProvider>
          <ScrollManager />
          <AppRoutes />
          <CookieNotice />
        </AuthProvider>
      </SiteConfigProvider>
    </BrowserRouter>
  )
}
