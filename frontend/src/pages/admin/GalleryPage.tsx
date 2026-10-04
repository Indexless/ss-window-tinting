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
import { PortalModal } from '../../components/admin/PortalModal'
import { SkeletonImage } from '../../components/ui/SkeletonImage'

function IconEye({ off = false }: { off?: boolean }) {
  if (off) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.5 5.6A10.4 10.4 0 0 1 12 5.3c5 0 9 4.2 10.5 6.2a1.5 1.5 0 0 1 0 1.7c-.5.7-1.5 1.9-2.9 3.1M6.2 6.3C4.5 7.6 3.2 9.2 2.5 10.2a1.5 1.5 0 0 0 0 1.7C4 14 8 18.2 13 18.2c1.1 0 2.1-.2 3.1-.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 7h15M9.5 7V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5V7M18 7l-.7 11.2a1.5 1.5 0 0 1-1.5 1.4H8.2a1.5 1.5 0 0 1-1.5-1.4L6 7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function IconChevron({ down = false }: { down?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={down ? 'M6 9l6 6 6-6' : 'M6 15l6-6 6 6'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function GalleryPage() {
  const [items, setItems] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<GalleryImage | null>(null)
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

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    setError('')
    try {
      await deleteGalleryImage(pendingDelete.id)
      setStatus('Image deleted.')
      setPendingDelete(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete image')
    } finally {
      setDeleting(false)
    }
  }

  const visibleCount = items.filter((item) => item.isVisible).length

  return (
    <>
      <div className="ss-portal-header">
        <div>
          <p className="ss-eyebrow">Gallery</p>
          <h1 className="ss-display ss-display-md">Our Work</h1>
          <p className="ss-muted-note mb-0 mt-2">
            Manage project photos shown in the website carousel.
          </p>
        </div>
        {!loading && items.length > 0 ? (
          <div className="ss-gallery-admin-stats" aria-label="Gallery summary">
            <div>
              <strong>{items.length}</strong>
              <span>Total</span>
            </div>
            <div>
              <strong>{visibleCount}</strong>
              <span>Visible</span>
            </div>
          </div>
        ) : null}
      </div>

      {status ? <p className="ss-portal-status">{status}</p> : null}
      {error ? <p className="ss-portal-status is-error">{error}</p> : null}

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
        className={`ss-gallery-dropzone ${dragOver ? 'is-active' : ''} ${uploading ? 'is-busy' : ''}`}
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setDragOver(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          void onUpload(e.dataTransfer.files)
        }}
      >
        <span className="ss-gallery-dropzone-title">
          {uploading ? 'Uploading…' : 'Drop images here or browse'}
        </span>
        <span className="ss-gallery-dropzone-meta">JPEG, PNG, WebP, or GIF · up to 3MB each</span>
      </button>

      <div className="ss-portal-panel ss-gallery-admin-panel">
        <div className="ss-gallery-admin-heading">
          <div>
            <p className="ss-eyebrow">Project photos</p>
            <h2 className="ss-display ss-display-md">Gallery library</h2>
          </div>
        </div>

        {loading ? (
          <div className="ss-gallery-admin mt-4">
            {Array.from({ length: 2 }, (_, i) => (
              <div key={`sk-${i}`} className="ss-gallery-admin-card is-skeleton" aria-hidden="true">
                <div className="ss-gallery-admin-thumb">
                  <span className="ss-skeleton" />
                </div>
                <div className="ss-gallery-admin-meta">
                  <span className="ss-skeleton ss-skeleton-line" />
                  <span className="ss-skeleton ss-skeleton-line is-wide" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="ss-gallery-admin-empty">
            <p className="ss-display ss-display-md mb-2">No photos yet</p>
            <p className="ss-muted-note mb-3">
              Upload a few project shots and they will show in Our Work on the site.
            </p>
            <button
              type="button"
              className="ss-btn ss-btn-primary"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              Upload images
            </button>
          </div>
        ) : (
          <div className="ss-gallery-admin mt-4">
            {items.map((item, index) => (
              <article
                key={item.id}
                className={`ss-gallery-admin-card ${item.isVisible ? '' : 'is-hidden'}`}
              >
                <div className="ss-gallery-admin-thumb">
                  <span className="ss-gallery-admin-index">{index + 1}</span>
                  <SkeletonImage
                    src={resolveAssetUrl(item.url)}
                    alt={item.alt || 'Gallery image'}
                  />
                </div>

                <div className="ss-gallery-admin-meta">
                  <div className="ss-gallery-admin-top">
                    <span
                      className={`ss-gallery-admin-badge ${item.isVisible ? 'is-live' : 'is-off'}`}
                    >
                      {item.isVisible ? 'Live on website' : 'Hidden'}
                    </span>
                    <div className="ss-gallery-admin-toolbar">
                      <button
                        type="button"
                        className="ss-gallery-icon-btn"
                        aria-label="Move up"
                        title="Move up"
                        disabled={index === 0}
                        onClick={() => void move(item, -1)}
                      >
                        <IconChevron />
                      </button>
                      <button
                        type="button"
                        className="ss-gallery-icon-btn"
                        aria-label="Move down"
                        title="Move down"
                        disabled={index === items.length - 1}
                        onClick={() => void move(item, 1)}
                      >
                        <IconChevron down />
                      </button>
                      <button
                        type="button"
                        className="ss-gallery-icon-btn"
                        aria-label={item.isVisible ? 'Hide image' : 'Show image'}
                        title={item.isVisible ? 'Hide' : 'Show'}
                        onClick={() => void toggleVisible(item)}
                      >
                        <IconEye off={item.isVisible} />
                      </button>
                      <button
                        type="button"
                        className="ss-gallery-icon-btn is-danger"
                        aria-label="Delete image"
                        title="Delete"
                        onClick={() => setPendingDelete(item)}
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </div>

                  <label className="form-label" htmlFor={`alt-${item.id}`}>
                    Alt text
                  </label>
                  <input
                    id={`alt-${item.id}`}
                    className="form-control"
                    defaultValue={item.alt}
                    key={`${item.id}-${item.alt}`}
                    onBlur={(e) => void saveAlt(item, e.target.value)}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <PortalModal
        open={Boolean(pendingDelete)}
        eyebrow="Confirm"
        title="Delete this photo?"
        onClose={() => {
          if (!deleting) setPendingDelete(null)
        }}
      >
        <p className="ss-muted-note">
          This removes it from Our Work and deletes the file from the server. This cannot be undone.
        </p>
        {pendingDelete ? (
          <div className="ss-gallery-delete-preview">
            <img
              src={resolveAssetUrl(pendingDelete.url)}
              alt={pendingDelete.alt || 'Photo to delete'}
            />
            <span>{pendingDelete.alt || 'Untitled photo'}</span>
          </div>
        ) : null}
        <div className="ss-portal-inline-actions mt-4">
          <button
            type="button"
            className="ss-btn ss-btn-ghost"
            disabled={deleting}
            onClick={() => setPendingDelete(null)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="ss-btn ss-gallery-confirm-delete"
            disabled={deleting}
            onClick={() => void confirmDelete()}
          >
            {deleting ? 'Deleting…' : 'Yes, delete'}
          </button>
        </div>
      </PortalModal>
    </>
  )
}
