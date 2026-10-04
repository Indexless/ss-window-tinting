type Props = {
  body: string
  businessName?: string
}

function applyTokens(text: string, businessName: string) {
  return text.replaceAll('{{businessName}}', businessName)
}

/** Renders simple policy markup: blank-line paragraphs, ## headings, - bullets, bare URLs. */
export function PolicyBody({ body, businessName = 'S&S Window Tinting' }: Props) {
  const text = applyTokens(body.trim(), businessName)
  if (!text) return null

  const blocks = text.split(/\n{2,}/)
  return (
    <>
      {blocks.map((block, index) => {
        const lines = block.split('\n').map((line) => line.trimEnd())
        const first = lines[0]?.trim() ?? ''

        if (first.startsWith('## ')) {
          return <h3 key={`h-${index}`}>{first.slice(3).trim()}</h3>
        }

        const isList = lines.every((line) => !line.trim() || line.trim().startsWith('- '))
        if (isList) {
          return (
            <ul key={`ul-${index}`}>
              {lines
                .filter((line) => line.trim())
                .map((line, i) => {
                  const item = line.trim().replace(/^- /, '')
                  return <li key={`li-${index}-${i}`}>{linkify(item)}</li>
                })}
            </ul>
          )
        }

        return (
          <p key={`p-${index}`}>
            {lines.map((line, i) => (
              <span key={`ln-${index}-${i}`}>
                {i > 0 ? <br /> : null}
                {linkify(line)}
              </span>
            ))}
          </p>
        )
      })}
    </>
  )
}

function linkify(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g)
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <a key={`a-${i}`} href={part} target="_blank" rel="noreferrer">
          {part.replace(/^https?:\/\//, '')}
        </a>
      )
    }
    return <span key={`t-${i}`}>{part}</span>
  })
}
