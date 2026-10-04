import { useEffect, useState } from 'react'
import type { PolicyDoc } from '../../../api/config'
import { useSiteConfig } from '../../../providers/SiteConfigProvider'
import { ConfigSaveBar, emptyPolicy, PolicyEditor, useConfigSectionSave } from './configShared'

export function PoliciesSettingsPage() {
  const { config } = useSiteConfig()
  const { status, error, saving, save } = useConfigSectionSave()
  const [policyPrivacy, setPolicyPrivacy] = useState<PolicyDoc>(emptyPolicy())
  const [policyCookies, setPolicyCookies] = useState<PolicyDoc>(emptyPolicy())
  const [policyTerms, setPolicyTerms] = useState<PolicyDoc>(emptyPolicy())

  useEffect(() => {
    if (!config) return
    setPolicyPrivacy(config.policyPrivacy ?? emptyPolicy())
    setPolicyCookies(config.policyCookies ?? emptyPolicy())
    setPolicyTerms(config.policyTerms ?? emptyPolicy())
  }, [config])

  return (
    <form
      className="ss-form ss-portal-panel"
      onSubmit={(e) =>
        void save(
          e,
          {
            policyPrivacy: {
              title: policyPrivacy.title.trim() || 'Privacy Policy',
              updatedAt: policyPrivacy.updatedAt.trim(),
              body: policyPrivacy.body.trim(),
            },
            policyCookies: {
              title: policyCookies.title.trim() || 'Cookie Policy',
              updatedAt: policyCookies.updatedAt.trim(),
              body: policyCookies.body.trim(),
            },
            policyTerms: {
              title: policyTerms.title.trim() || 'Website Terms',
              updatedAt: policyTerms.updatedAt.trim(),
              body: policyTerms.body.trim(),
            },
          },
          'Policies saved.',
        )
      }
    >
      <p className="ss-eyebrow">Policies</p>
      <h2 className="ss-display ss-display-md mb-3">Legal pages</h2>

      <PolicyEditor label="Privacy policy" value={policyPrivacy} onChange={setPolicyPrivacy} />
      <PolicyEditor label="Cookie policy" value={policyCookies} onChange={setPolicyCookies} />
      <PolicyEditor label="Website terms" value={policyTerms} onChange={setPolicyTerms} />

      <ConfigSaveBar saving={saving} status={status} error={error} label="Save policies" />
    </form>
  )
}
