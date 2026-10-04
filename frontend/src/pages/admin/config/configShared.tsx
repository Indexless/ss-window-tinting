import { type FormEvent, useState } from 'react'
import { updateSiteConfig, type PolicyDoc, type SiteConfigUpdate } from '../../../api/config'
import {
  instagramUrlFromHandle,
  isSocialPlatform,
  SOCIAL_PLATFORMS,
  type SocialPlatformId,
} from '../../../lib/socialPlatforms'
import { useSiteConfig } from '../../../providers/SiteConfigProvider'

export type SocialUrlMap = Record<SocialPlatformId, string>

export function emptySocialMap(): SocialUrlMap {
  return {
    instagram: '',
    facebook: '',
    tiktok: '',
    youtube: '',
    x: '',
    linkedin: '',
  }
}

export function emptyPolicy(): PolicyDoc {
  return { title: '', updatedAt: '', body: '' }
}

export function socialMapFromConfig(config: {
  socialLinks?: { platform: string; url: string }[]
  instagramHandle?: string
}): SocialUrlMap {
  const next = emptySocialMap()
  for (const link of config.socialLinks ?? []) {
    if (isSocialPlatform(link.platform) && link.url.trim()) {
      next[link.platform] = link.url.trim()
    }
  }
  if (!next.instagram && config.instagramHandle) {
    next.instagram = instagramUrlFromHandle(config.instagramHandle)
  }
  return next
}

export function socialLinksPayload(socialUrls: SocialUrlMap) {
  return SOCIAL_PLATFORMS.map((platform) => ({
    platform: platform.id,
    url: socialUrls[platform.id].trim(),
  })).filter((link) => link.url)
}

export function useConfigSectionSave() {
  const { refresh } = useSiteConfig()
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function save(e: FormEvent, patch: SiteConfigUpdate, successMessage: string) {
    e.preventDefault()
    setSaving(true)
    setStatus('')
    setError('')
    try {
      await updateSiteConfig(patch)
      await refresh()
      setStatus(successMessage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save settings')
    } finally {
      setSaving(false)
    }
  }

  return { status, error, saving, save }
}

export function ConfigSaveBar({
  saving,
  status,
  error,
  label = 'Save changes',
}: {
  saving: boolean
  status: string
  error: string
  label?: string
}) {
  return (
    <div className="ss-config-save-bar">
      {status ? <p className="ss-portal-status mb-0">{status}</p> : null}
      {error ? <p className="ss-portal-status is-error mb-0">{error}</p> : null}
      <button className="ss-btn ss-btn-primary" type="submit" disabled={saving}>
        {saving ? 'Saving…' : label}
      </button>
    </div>
  )
}

export function IconTrash() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 7h15M9.5 7V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5V7M18 7l-.7 11.2a1.5 1.5 0 0 1-1.5 1.4H8.2a1.5 1.5 0 0 1-1.5-1.4L6 7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PolicyEditor({
  label,
  value,
  onChange,
}: {
  label: string
  value: PolicyDoc
  onChange: (next: PolicyDoc) => void
}) {
  return (
    <div className="ss-policy-editor">
      <p className="ss-muted-note mb-2">{label}</p>
      <div className="ss-form-grid ss-form-grid-2">
        <div>
          <label className="form-label">Title</label>
          <input
            className="form-control"
            value={value.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
          />
        </div>
        <div>
          <label className="form-label">Last updated</label>
          <input
            className="form-control"
            placeholder="e.g. 3 October 2026"
            value={value.updatedAt}
            onChange={(e) => onChange({ ...value, updatedAt: e.target.value })}
          />
        </div>
      </div>
      <label className="form-label mt-3">Body</label>
      <textarea
        className="form-control ss-policy-textarea"
        value={value.body}
        onChange={(e) => onChange({ ...value, body: e.target.value })}
      />
      <p className="ss-muted-note mb-0 mt-2">
        Use blank lines between paragraphs. Start a line with ## for a heading, or - for a bullet. Use{' '}
        {'{{businessName}}'} to insert the business name.
      </p>
    </div>
  )
}
