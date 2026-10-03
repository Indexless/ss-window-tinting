const ITEMS = [
  'Est. 2019',
  'Professional Installation',
  'Mobile Service',
  'Automotive • Commercial • Residential',
] as const

function TrustItems({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="ss-trust-group" aria-hidden={ariaHidden || undefined}>
      {ITEMS.map((item) => (
        <span key={item} className="ss-trust-item">
          {item}
        </span>
      ))}
    </div>
  )
}

export function TrustStrip() {
  return (
    <section className="ss-trust" aria-label="Trust">
      <div className="ss-trust-track">
        <TrustItems />
        <TrustItems ariaHidden />
        <TrustItems ariaHidden />
        <TrustItems ariaHidden />
      </div>
    </section>
  )
}
