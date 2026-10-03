import type { SiteConfig } from '../api/config'

export function whatsappUrl(config: SiteConfig | null | undefined, prefill?: string): string | null {
  if (!config?.whatsappNumber) return null
  const text = encodeURIComponent(prefill ?? config.whatsappPrefill ?? '')
  return `https://wa.me/${config.whatsappNumber}?text=${text}`
}

export function telHref(config: SiteConfig | null | undefined): string | null {
  if (!config?.phone) return null
  return `tel:${config.phone.replace(/\s+/g, '')}`
}

export function mailtoHref(config: SiteConfig | null | undefined): string | null {
  if (!config?.email) return null
  return `mailto:${config.email}`
}

export function instagramUrl(config: SiteConfig | null | undefined): string | null {
  if (!config?.instagramHandle) return null
  return `https://instagram.com/${config.instagramHandle}`
}
