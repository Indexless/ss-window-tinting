export const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'tiktok', name: 'TikTok' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'x', name: 'X' },
  { id: 'linkedin', name: 'LinkedIn' },
] as const

export type SocialPlatformId = (typeof SOCIAL_PLATFORMS)[number]['id']

export function isSocialPlatform(value: string): value is SocialPlatformId {
  return SOCIAL_PLATFORMS.some((platform) => platform.id === value)
}

export function normalizePlatform(value: string): SocialPlatformId | null {
  const key = value.trim().toLowerCase()
  if (isSocialPlatform(key)) return key
  if (key === 'twitter') return 'x'
  if (key === 'ig') return 'instagram'
  if (key === 'fb') return 'facebook'
  if (key === 'yt') return 'youtube'
  return null
}

export function instagramUrlFromHandle(handle: string): string {
  const clean = handle.trim().replace(/^@/, '')
  return clean ? `https://instagram.com/${clean}` : ''
}

export function handleFromInstagramUrl(url: string): string {
  try {
    const parsed = new URL(url)
    const parts = parsed.pathname.split('/').filter(Boolean)
    return parts[0]?.replace(/^@/, '') ?? ''
  } catch {
    return url.replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').split('/')[0] ?? ''
  }
}
