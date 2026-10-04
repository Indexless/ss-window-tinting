import { apiRequest } from './client'

export type FooterLink = {
  label: string
  href: string
}

export type FAQItem = {
  question: string
  answer: string
}

export type SocialLink = {
  platform: string
  url: string
}

export type PolicyDoc = {
  title: string
  updatedAt: string
  body: string
}

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
  footerCategories: string
  footerCopyright: string
  footerServicesTitle: string
  footerNavigateTitle: string
  footerConnectTitle: string
  footerServices: FooterLink[]
  footerNavigate: FooterLink[]
  footerShowPrivacy: boolean
  footerShowCookies: boolean
  footerShowTerms: boolean
  faq: FAQItem[]
  socialLinks: SocialLink[]
  policyPrivacy: PolicyDoc
  policyCookies: PolicyDoc
  policyTerms: PolicyDoc
  updatedAt: string
}

export type SiteConfigUpdate = Partial<Omit<SiteConfig, 'updatedAt'>>

export function fetchSiteConfig() {
  return apiRequest<SiteConfig>('/api/v1/config')
}

export function updateSiteConfig(patch: SiteConfigUpdate) {
  return apiRequest<SiteConfig>('/api/v1/config', {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}
