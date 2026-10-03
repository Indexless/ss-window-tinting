import { apiRequest } from './client'

export type GalleryImage = {
  id: string
  url: string
  alt: string
  sortOrder: number
  isVisible: boolean
  createdAt: string
}

const base = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? ''

export function resolveAssetUrl(url: string): string {
  if (!url) return url
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url
  if (url.startsWith('/')) return `${base}${url}`
  return url
}

export function fetchPublicGallery() {
  return apiRequest<GalleryImage[]>('/api/v1/gallery')
}

export function fetchAdminGallery() {
  return apiRequest<GalleryImage[]>('/api/v1/gallery/admin')
}

export async function uploadGalleryImage(file: File, alt = '') {
  const body = new FormData()
  body.append('file', file)
  if (alt.trim()) body.append('alt', alt.trim())

  const res = await fetch(`${base}/api/v1/gallery`, {
    method: 'POST',
    credentials: 'include',
    body,
  })
  const json = (await res.json()) as {
    data?: GalleryImage
    error?: { message: string }
  }
  if (!res.ok || json.error || !json.data) {
    throw new Error(json.error?.message ?? 'Upload failed')
  }
  return json.data
}

export function updateGalleryImage(
  id: string,
  patch: Partial<Pick<GalleryImage, 'alt' | 'sortOrder' | 'isVisible'>>,
) {
  return apiRequest<GalleryImage>(`/api/v1/gallery/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}

export function reorderGallery(orderedIds: string[]) {
  return apiRequest<GalleryImage[]>('/api/v1/gallery/reorder', {
    method: 'PATCH',
    body: JSON.stringify({ orderedIds }),
  })
}

export function deleteGalleryImage(id: string) {
  return apiRequest<{ ok: boolean }>(`/api/v1/gallery/${id}`, {
    method: 'DELETE',
  })
}
