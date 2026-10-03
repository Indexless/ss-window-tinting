import { apiRequest } from './client'

/** Editable business settings sourced from the Go/MySQL backend. */
export type SiteConfig = {
  businessName: string
  tagline: string
  establishedYear: number
  whatsappNumber: string
  phone: string
  email: string
  instagramHandle: string
  whatsappPrefill: string
  seoTitle: string
  seoDescription: string
  updatedAt: string
}

export type SiteConfigUpdate = Partial<
  Omit<SiteConfig, 'updatedAt'>
>

export function fetchSiteConfig() {
  return apiRequest<SiteConfig>('/api/v1/config')
}

export function updateSiteConfig(patch: SiteConfigUpdate) {
  return apiRequest<SiteConfig>('/api/v1/config', {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}
