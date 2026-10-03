import { useEffect, useRef, useState } from 'react'
import {
  deleteGalleryImage,
  fetchAdminGallery,
  reorderGallery,
  resolveAssetUrl,
  updateGalleryImage,
  uploadGalleryImage,
  type GalleryImage,
} from '../../api/gallery'

export function GalleryPage() {
  const [items, setItems] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  async function load() {
    setLoading(true)
    try {
      setItems(await fetchAdminGallery())
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load gallery')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function onUpload(files: FileList | null) {
    if (!files?.length) return
    setUploading(true)
    setError('')
    setStatus('')
    let uploaded = 0
    try {
      for (const file of Array.from(files)) {
        await uploadGalleryImage(file)
        uploaded += 1
      }
      setStatus(uploaded === 1 ? 'Image uploaded.' : `${uploaded} images uploaded.`)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      if (uploaded > 0) await load()
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function toggleVisible(item: GalleryImage) {
    setError('')
    try {
      await updateGalleryImage(item.id, { isVisible: !item.isVisible })
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update image')
    }
  }

  async function saveAlt(item: GalleryImage, alt: string) {
    if (alt.trim() === item.alt) return
    setError('')
    try {
      await updateGalleryImage(item.id, { alt: alt.trim() })
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update alt text')
    }
  }

  async function move(item: GalleryImage, direction: -1 | 1) {
    const index = items.findIndex((i) => i.id === item.id)
    const next = index + direction
    if (index < 0 || next < 0 || next >= items.length) return
    const ordered = [...items]
    const [removed] = ordered.splice(index, 1)
    ordered.splice(next, 0, removed)
    setError('')
    try {
      setItems(await reorderGallery(ordered.map((i) => i.id)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reorder gallery')
    }
  }

  async function remove(item: GalleryImage) {
    if (!window.confirm('Remove this image from the gallery?')) return
    setError('')
    try {
      await deleteGalleryImage(item.id)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete image')
    }
  }

  return (
    <>
      <div className="ss-portal-header">
        <div>
          <p className="ss-eyebrow">Gallery</p>
          <h1 className="ss-display ss-display-md">Image gallery</h1>
        </div>
        <div className="ss-cta-row">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            hidden
            onChange={(e) => void onUpload(e.target.files)}
          />
          <button
            type="button"
            className="ss-btn ss-btn-primary"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? 'Uploading…' : 'Upload images'}
          </button>
        </div>
      </div>

      <p className="ss-muted-note mb-3">
        Visible images appear in Our Work on the website. JPEG, PNG, WebP, or GIF up to 3MB.
      </p>

      {status ? <p className="ss-portal-status">{status}</p> : null}
      {error ? <p className="ss-portal-status is-error">{error}</p> : null}

      <div className="ss-portal-panel">
        <p className="ss-eyebrow">Our Work</p>
        <h2 className="ss-display ss-display-md">Project photos</h2>

        {loading ? (
          <p className="ss-muted-note mt-3 mb-0">Loading…</p>
        ) : items.length === 0 ? (
          <p className="ss-muted-note mt-3 mb-0">
            No gallery images yet. Upload project photos to show them on the site.
          </p>
        ) : (
          <div className="ss-gallery-admin mt-4">
            {items.map((item, index) => (
              <article key={item.id} className={`ss-gallery-admin-card ${item.isVisible ? '' : 'is-hidden'}`}>
                <div className="ss-gallery-admin-thumb">
                  <img src={resolveAssetUrl(item.url)} alt={item.alt || 'Gallery image'} />
                </div>
                <div className="ss-gallery-admin-meta">
                  <label className="form-label" htmlFor={`alt-${item.id}`}>
                    Alt text
                  </label>
                  <input
                    id={`alt-${item.id}`}
                    className="form-control"
                    defaultValue={item.alt}
                    onBlur={(e) => void saveAlt(item, e.target.value)}
                  />
                  <div className="ss-portal-inline-actions mt-3">
                    <button
                      type="button"
                      className="ss-btn ss-btn-ghost"
                      disabled={index === 0}
                      onClick={() => void move(item, -1)}
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      className="ss-btn ss-btn-ghost"
                      disabled={index === items.length - 1}
                      onClick={() => void move(item, 1)}
                    >
                      Down
                    </button>
                    <button type="button" className="ss-btn ss-btn-ghost" onClick={() => void toggleVisible(item)}>
                      {item.isVisible ? 'Hide' : 'Show'}
                    </button>
                    <button type="button" className="ss-btn ss-btn-ghost" onClick={() => void remove(item)}>
                      Delete
                    </button>
                  </div>
                  <p className="ss-muted-note mb-0 mt-2">
                    {item.isVisible ? 'Visible on website' : 'Hidden from website'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
