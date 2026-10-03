import { useEffect, useState } from 'react'
import { images } from '../config/images'
import { fetchPublicGallery, resolveAssetUrl, type GalleryImage } from '../api/gallery'

export type GalleryItem = { id: string; src: string; alt: string }

function toItems(rows: GalleryImage[]): GalleryItem[] {
  return rows.map((row) => ({
    id: row.id,
    src: resolveAssetUrl(row.url),
    alt: row.alt || 'S&S Window Tinting project',
  }))
}

const fallback: GalleryItem[] = images.gallery.map((item, index) => ({
  id: `fallback-${index}`,
  src: item.src,
  alt: item.alt,
}))

export function usePublicGallery() {
  const [gallery, setGallery] = useState<GalleryItem[]>(fallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchPublicGallery()
      .then((rows) => {
        if (cancelled) return
        const next = toItems(rows)
        if (next.length > 0) setGallery(next)
      })
      .catch(() => {
        // Keep static fallback if the gallery API is unavailable.
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { gallery, loading }
}
