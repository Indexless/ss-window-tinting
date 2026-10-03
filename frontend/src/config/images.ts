/**
 * Premium stock photography used until S&S project assets are supplied.
 * Replace paths under /images with real project photography when available.
 */
const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const images = {
  hero: u('photo-1492144534655-ae79c964c9d7', 1920),
  trustBg: u('photo-1503376780353-7e6692767b70', 1200),
  automotive: u('photo-1618843479313-40f8afb4b4d8', 1400),
  commercial: u('photo-1486406146926-c627a92ad1ab', 1400),
  residential: u('photo-1600596542815-ffad4c1539a9', 1400),
  whySs: u('photo-1502877338535-766e1452684a', 1400),
  featured: u('photo-1544636331-e26879cd4d9b', 1600),
  finalCta: u('photo-1553440569-bcc63803a83d', 1920),
  gallery: [
    { src: u('photo-1503376780353-7e6692767b70', 1200), alt: 'Premium vehicle with window tint' },
    { src: u('photo-1618843479313-40f8afb4b4d8', 1200), alt: 'Luxury SUV exterior' },
    { src: u('photo-1544636331-e26879cd4d9b', 1200), alt: 'Sports car silhouette' },
    { src: u('photo-1492144534655-ae79c964c9d7', 1200), alt: 'Dark automotive detailing finish' },
    { src: u('photo-1553440569-bcc63803a83d', 1200), alt: 'Vehicle side profile' },
    { src: u('photo-1605559424843-9e4c228bf1c2', 1200), alt: 'Modern car glass detail' },
    { src: u('photo-1486406146926-c627a92ad1ab', 1200), alt: 'Commercial building glass' },
    { src: u('photo-1600596542815-ffad4c1539a9', 1200), alt: 'Modern home with large windows' },
  ],
} as const
