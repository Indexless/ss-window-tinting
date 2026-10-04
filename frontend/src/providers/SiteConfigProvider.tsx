import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { fetchSiteConfig, type SiteConfig } from '../api/config'

type SiteConfigContextValue = {
  config: SiteConfig | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null)

const emptyPolicy = { title: '', updatedAt: '', body: '' }

const fallbackConfig: SiteConfig = {
  businessName: 'S&S Window Tinting',
  tagline: 'Professional Window Tinting',
  establishedYear: 2019,
  whatsappNumber: '',
  phone: '',
  email: '',
  instagramHandle: '',
  whatsappPrefill: "Hi S&S Window Tinting, I'd like a quote for window tinting.",
  seoTitle: 'S&S Window Tinting | Automotive, Commercial & Residential Window Tinting',
  seoDescription:
    'Professional window tinting for vehicles, homes and businesses. S&S Window Tinting provides quality automotive, commercial and residential window tinting services.',
  footerCategories: 'Automotive / Commercial / Residential',
  footerCopyright: '',
  footerServicesTitle: 'Services',
  footerNavigateTitle: 'Navigate',
  footerConnectTitle: 'Connect',
  footerServices: [
    { label: 'Automotive', href: '/#services' },
    { label: 'Commercial', href: '/#services' },
    { label: 'Residential', href: '/#services' },
  ],
  footerNavigate: [
    { label: 'Home', href: '/#home' },
    { label: 'Services', href: '/#services' },
    { label: 'Our Work', href: '/#work' },
    { label: 'About', href: '/#about' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Contact', href: '/#contact' },
  ],
  footerShowPrivacy: true,
  footerShowCookies: true,
  footerShowTerms: true,
  faq: [],
  socialLinks: [],
  policyPrivacy: emptyPolicy,
  policyCookies: emptyPolicy,
  policyTerms: emptyPolicy,
  updatedAt: '',
}

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function refresh() {
    setLoading(true)
    try {
      const next = await fetchSiteConfig()
      setConfig(next)
      setError(null)
      document.title = next.seoTitle
      const meta = document.querySelector('meta[name="description"]')
      if (meta) meta.setAttribute('content', next.seoDescription)
    } catch (err) {
      setConfig(fallbackConfig)
      setError(err instanceof Error ? err.message : 'Failed to load config')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  const value = useMemo(
    () => ({ config, loading, error, refresh }),
    [config, loading, error],
  )

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>
}

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext)
  if (!ctx) throw new Error('useSiteConfig must be used within SiteConfigProvider')
  return ctx
}
