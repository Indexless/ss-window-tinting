import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react'

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  wrapperClassName?: string
  fill?: boolean
}

export function SkeletonImage({
  className = '',
  wrapperClassName = '',
  fill = false,
  alt = '',
  src,
  onLoad,
  onError,
  ...rest
}: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true)
    }
  }, [src])

  const wrapperClass = [
    'ss-skeleton-media',
    fill ? 'is-fill' : '',
    loaded ? 'is-loaded' : '',
    wrapperClassName,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={wrapperClass}>
      {!loaded ? <span className="ss-skeleton" aria-hidden="true" /> : null}
      <img
        ref={imgRef}
        className={className}
        src={src}
        alt={alt}
        onLoad={(e) => {
          setLoaded(true)
          onLoad?.(e)
        }}
        onError={(e) => {
          setLoaded(true)
          onError?.(e)
        }}
        {...rest}
      />
    </span>
  )
}
