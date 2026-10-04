import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { WorkPage } from '../pages/WorkPage'
import { SitemapPage } from '../pages/SitemapPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { PoliciesPage } from '../pages/PoliciesPage'
import { AdminLayout } from '../components/admin/AdminLayout'
import { DashboardPage } from '../pages/admin/DashboardPage'
import { UsersPage } from '../pages/admin/UsersPage'
import { LeadsPage } from '../pages/admin/LeadsPage'
import { GalleryPage } from '../pages/admin/GalleryPage'
import { ConfigLayout } from '../pages/admin/config/ConfigLayout'
import { BusinessSettingsPage } from '../pages/admin/config/BusinessSettingsPage'
import { FaqSettingsPage } from '../pages/admin/config/FaqSettingsPage'
import { PoliciesSettingsPage } from '../pages/admin/config/PoliciesSettingsPage'
import { FooterSettingsPage } from '../pages/admin/config/FooterSettingsPage'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/work" element={<WorkPage />} />
      <Route path="/sitemap" element={<SitemapPage />} />
      <Route path="/policies" element={<PoliciesPage />} />
      <Route path="/privacy" element={<Navigate to="/policies#privacy" replace />} />
      <Route path="/cookies" element={<Navigate to="/policies#cookies" replace />} />
      <Route path="/terms" element={<Navigate to="/policies#terms" replace />} />
      <Route path="/login" element={<Navigate to="/?login=1" replace />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="config" element={<ConfigLayout />}>
            <Route index element={<Navigate to="business" replace />} />
            <Route path="business" element={<BusinessSettingsPage />} />
            <Route path="faq" element={<FaqSettingsPage />} />
            <Route path="policies" element={<PoliciesSettingsPage />} />
            <Route path="footer" element={<FooterSettingsPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
