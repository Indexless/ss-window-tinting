import type { CSSProperties, ReactNode } from 'react'
import { useReveal } from '../../hooks/useReveal'

type Props = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  as?: 'div' | 'section' | 'article'
}

export function Reveal({ children, className = '', style, as = 'div' }: Props) {
  const ref = useReveal<HTMLDivElement>()
  const Tag = as

  return (
    <Tag ref={ref} className={`ss-reveal ${className}`.trim()} style={style}>
      {children}
    </Tag>
  )
}
