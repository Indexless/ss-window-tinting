import { useEffect, useState } from 'react'
import { PortalModal } from '../../../components/admin/PortalModal'
import type { FAQItem } from '../../../api/config'
import { useSiteConfig } from '../../../providers/SiteConfigProvider'
import { ConfigSaveBar, IconTrash, useConfigSectionSave } from './configShared'

export function FaqSettingsPage() {
  const { config } = useSiteConfig()
  const { status, error, saving, save } = useConfigSectionSave()
  const [faq, setFaq] = useState<FAQItem[]>([])
  const [pendingFaqRemove, setPendingFaqRemove] = useState<number | null>(null)

  useEffect(() => {
    if (!config) return
    setFaq(config.faq?.length ? config.faq : [])
  }, [config])

  function updateFaq(index: number, key: keyof FAQItem, value: string) {
    setFaq((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)))
  }

  return (
    <>
      <form
        className="ss-form ss-portal-panel"
        onSubmit={(e) =>
          void save(
            e,
            {
              faq: faq
                .map((item) => ({
                  question: item.question.trim(),
                  answer: item.answer.trim(),
                }))
                .filter((item) => item.question && item.answer),
            },
            'FAQ saved.',
          )
        }
      >
        <p className="ss-eyebrow">FAQ</p>
        <h2 className="ss-display ss-display-md mb-3">Questions and answers</h2>

        <div className="ss-faq-editor">
          {faq.map((item, index) => (
            <div className="ss-faq-editor-card" key={`faq-${index}`}>
              <div className="ss-faq-editor-top">
                <span className="ss-gallery-admin-badge">Q{index + 1}</span>
                <button
                  type="button"
                  className="ss-gallery-icon-btn is-danger"
                  aria-label="Remove FAQ"
                  onClick={() => setPendingFaqRemove(index)}
                >
                  <IconTrash />
                </button>
              </div>
              <label className="form-label">Question</label>
              <input
                className="form-control"
                value={item.question}
                onChange={(e) => updateFaq(index, 'question', e.target.value)}
              />
              <label className="form-label mt-2">Answer</label>
              <textarea
                className="form-control"
                rows={4}
                value={item.answer}
                onChange={(e) => updateFaq(index, 'answer', e.target.value)}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          className="ss-btn ss-btn-ghost mt-2"
          onClick={() => setFaq((prev) => [...prev, { question: '', answer: '' }])}
        >
          Add question
        </button>

        <ConfigSaveBar saving={saving} status={status} error={error} label="Save FAQ" />
      </form>

      <PortalModal
        open={pendingFaqRemove !== null}
        eyebrow="Confirm"
        title="Remove this FAQ?"
        onClose={() => setPendingFaqRemove(null)}
      >
        <p className="ss-muted-note">
          {pendingFaqRemove !== null
            ? faq[pendingFaqRemove]?.question || 'This question will be removed.'
            : ''}
        </p>
        <div className="ss-portal-inline-actions mt-4">
          <button type="button" className="ss-btn ss-btn-ghost" onClick={() => setPendingFaqRemove(null)}>
            Cancel
          </button>
          <button
            type="button"
            className="ss-btn ss-gallery-confirm-delete"
            onClick={() => {
              if (pendingFaqRemove === null) return
              setFaq((prev) => prev.filter((_, i) => i !== pendingFaqRemove))
              setPendingFaqRemove(null)
            }}
          >
            Yes, remove
          </button>
        </div>
      </PortalModal>
    </>
  )
}
