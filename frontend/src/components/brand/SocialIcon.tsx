import type { SocialPlatformId } from '../../lib/socialPlatforms'

type Props = {
  platform: SocialPlatformId
  size?: number
}

export function SocialIcon({ platform, size = 18 }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    'aria-hidden': true as const,
  }

  switch (platform) {
    case 'instagram':
      return (
        <svg {...common}>
          <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm9.25 1.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
        </svg>
      )
    case 'facebook':
      return (
        <svg {...common}>
          <path d="M14 8h2.5V5.1C16.1 5 15.2 5 14.2 5H12c-2.4 0-4 1.5-4 4.2V12H5v3h3v7h3.5v-7H15l.5-3h-4V9.3c0-.9.3-1.3 1.5-1.3Z" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg {...common}>
          <path d="M14.5 3c.4 2.4 1.9 4.2 4.2 4.6v3.1c-1.5-.1-2.9-.6-4.1-1.4v6.5c0 3.4-2.7 6.1-6.1 6.1S2.4 19.2 2.4 15.8 5.1 9.7 8.5 9.7c.4 0 .8 0 1.1.1v3.2c-.3-.1-.7-.2-1.1-.2-1.6 0-2.9 1.3-2.9 3s1.3 3 2.9 3 2.9-1.3 2.9-3V3h3.1Z" />
        </svg>
      )
    case 'youtube':
      return (
        <svg {...common}>
          <path d="M22 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C18.4 5.4 12 5.4 12 5.4s-6.4 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 9 2 12.2 2 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.4.4 7.8.4 7.8.4s6.4 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6ZM10.2 15.3V9.1l5.3 3.1-5.3 3.1Z" />
        </svg>
      )
    case 'x':
      return (
        <svg {...common}>
          <path d="M14.7 10.3 22 2h-2.2l-6.1 6.9L8.7 2H2l7.7 10.9L2 22h2.2l6.6-7.5L15.3 22H22l-7.3-11.7Zm-2.3 2.6-.8-1.1L5.1 3.7h2.7l4.7 6.6.8 1.1 6.3 8.9h-2.7l-5.5-7.4Z" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg {...common}>
          <path d="M6.2 9.2H3.3V21h2.9V9.2ZM4.8 3C3.7 3 2.8 3.9 2.8 5s.9 2 2 2 2-.9 2-2-.9-2-2-2ZM21 21h-2.9v-6.2c0-1.8-.7-2.4-1.8-2.4-1.2 0-2 .8-2 2.5V21H11.4V9.2h2.8v1.6c.5-.9 1.8-1.9 3.7-1.9 2.6 0 4.1 1.6 4.1 5V21Z" />
        </svg>
      )
    default:
      return null
  }
}
