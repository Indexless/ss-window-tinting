type Props = {
  className?: string
  variant?: 'transparent' | 'dark'
}

export function Logo({ className = '', variant = 'transparent' }: Props) {
  const src = variant === 'dark' ? '/logo-dark.png' : '/logo.png'
  return (
    <img className={className} src={src} alt="S&S Window Tinting" width={260} height={80} />
  )
}
