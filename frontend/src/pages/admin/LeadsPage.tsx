import { useEffect, useState, type FormEvent } from 'react'
import { PortalModal } from '../../components/admin/PortalModal'
import {
  createManualLead,
  fetchLeads,
  updateLead,
  type Lead,
  type LeadSource,
  type LeadStatus,
} from '../../api/leads'

type LeadForm = {
  name: string
  phone: string
  email: string
  service: string
  propertyType: string
  preferredContact: string
  message: string
  source: LeadSource
  status: LeadStatus
  notes: string
}

const emptyForm: LeadForm = {
  name: '',
  phone: '',
  email: '',
  service: '',
  propertyType: '',
  preferredContact: 'WhatsApp',
  message: '',
  source: 'whatsapp',
  status: 'new',
  notes: '',
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString()
  } catch {
    return value
  }
}

function leadToForm(lead: Lead): LeadForm {
  return {
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    service: lead.service,
    propertyType: lead.propertyType,
    preferredContact: lead.preferredContact || 'WhatsApp',
    message: lead.message,
    source: lead.source,
    status: lead.status,
    notes: lead.notes,
  }
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="ss-lead-detail-row">
      <span>{label}</span>
      <strong>{value.trim() ? value : '-'}</strong>
    </div>
  )
}

export function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState<LeadForm>(emptyForm)

  const [viewLead, setViewLead] = useState<Lead | null>(null)
  const [editLead, setEditLead] = useState<Lead | null>(null)
  const [editForm, setEditForm] = useState<LeadForm | null>(null)

  async function load() {
    setLoading(true)
    try {
      setLeads(await fetchLeads())
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load leads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  function openCreate() {
    setCreateForm({ ...emptyForm, source: 'whatsapp' })
    setError('')
    setCreateOpen(true)
  }

  function openView(lead: Lead) {
    setViewLead(lead)
    setError('')
  }

  function openEdit(lead: Lead) {
    setViewLead(null)
    setEditLead(lead)
    setEditForm(leadToForm(lead))
    setError('')
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await createManualLead({
        name: createForm.name,
        phone: createForm.phone,
        email: createForm.email,
        service: createForm.service,
        propertyType: createForm.propertyType,
        preferredContact: createForm.preferredContact,
        message: createForm.message,
        source: createForm.source,
        notes: createForm.notes,
      })
      setCreateOpen(false)
      setCreateForm(emptyForm)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add lead')
    } finally {
      setSaving(false)
    }
  }

  async function onEdit(e: FormEvent) {
    e.preventDefault()
    if (!editLead || !editForm) return
    setSaving(true)
    setError('')
    try {
      await updateLead(editLead.id, {
        name: editForm.name,
        phone: editForm.phone,
        email: editForm.email,
        service: editForm.service,
        propertyType: editForm.propertyType,
        preferredContact: editForm.preferredContact,
        message: editForm.message,
        source: editForm.source,
        status: editForm.status,
        notes: editForm.notes,
      })
      setEditLead(null)
      setEditForm(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update lead')
    } finally {
      setSaving(false)
    }
  }

  function renderFormFields(
    form: LeadForm,
    setForm: (updater: (prev: LeadForm) => LeadForm) => void,
    opts?: { includeStatus?: boolean; idPrefix?: string },
  ) {
    const prefix = opts?.idPrefix ?? 'lead'
    return (
      <div className="ss-form-grid ss-form-grid-2">
        <div>
          <label className="form-label" htmlFor={`${prefix}-name`}>
            Name
          </label>
          <input
            id={`${prefix}-name`}
            className="form-control"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div>
          <label className="form-label" htmlFor={`${prefix}-phone`}>
            Phone / WhatsApp
          </label>
          <input
            id={`${prefix}-phone`}
            className="form-control"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </div>
        <div>
          <label className="form-label" htmlFor={`${prefix}-email`}>
            Email
          </label>
          <input
            id={`${prefix}-email`}
            type="email"
            className="form-control"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>
        <div>
          <label className="form-label" htmlFor={`${prefix}-service`}>
            Service
          </label>
          <select
            id={`${prefix}-service`}
            className="form-select"
            value={form.service}
            onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
          >
            <option value="">Select service</option>
            <option value="Automotive">Automotive</option>
            <option value="Commercial">Commercial</option>
            <option value="Residential">Residential</option>
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor={`${prefix}-property`}>
            Vehicle / Property
          </label>
          <input
            id={`${prefix}-property`}
            className="form-control"
            value={form.propertyType}
            onChange={(e) => setForm((f) => ({ ...f, propertyType: e.target.value }))}
          />
        </div>
        <div>
          <label className="form-label" htmlFor={`${prefix}-pref`}>
            Preferred contact
          </label>
          <select
            id={`${prefix}-pref`}
            className="form-select"
            value={form.preferredContact}
            onChange={(e) => setForm((f) => ({ ...f, preferredContact: e.target.value }))}
          >
            <option>WhatsApp</option>
            <option>Phone</option>
            <option>Email</option>
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor={`${prefix}-source`}>
            Source
          </label>
          <select
            id={`${prefix}-source`}
            className="form-select"
            value={form.source}
            onChange={(e) => setForm((f) => ({ ...f, source: e.target.value as LeadSource }))}
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="website">Website</option>
            <option value="other">Other</option>
          </select>
        </div>
        {opts?.includeStatus ? (
          <div>
            <label className="form-label" htmlFor={`${prefix}-status`}>
              Status
            </label>
            <select
              id={`${prefix}-status`}
              className="form-select"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as LeadStatus }))}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="quoted">Quoted</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        ) : null}
        <div className="ss-form-span-2">
          <label className="form-label" htmlFor={`${prefix}-message`}>
            Message
          </label>
          <textarea
            id={`${prefix}-message`}
            className="form-control"
            rows={3}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          />
        </div>
        <div className="ss-form-span-2">
          <label className="form-label" htmlFor={`${prefix}-notes`}>
            Internal notes
          </label>
          <textarea
            id={`${prefix}-notes`}
            className="form-control"
            rows={2}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="ss-portal-header">
        <div>
          <p className="ss-eyebrow">Leads</p>
          <h1 className="ss-display ss-display-md">Quote requests</h1>
        </div>
        <button type="button" className="ss-btn ss-btn-primary" onClick={openCreate}>
          Custom Quote
        </button>
      </div>

      {error && !createOpen && !editLead && !viewLead ? (
        <p className="ss-portal-status is-error">{error}</p>
      ) : null}

      <div className="ss-portal-panel">
        <p className="ss-eyebrow">Inbox</p>
        <h2 className="ss-display ss-display-md">All leads</h2>
        {loading ? (
          <p className="ss-muted-note mt-3 mb-0">Loading…</p>
        ) : leads.length === 0 ? (
          <p className="ss-muted-note mt-3 mb-0">
            No leads yet. Website quotes and custom quotes show up here.
          </p>
        ) : (
          <div className="ss-portal-table-wrap">
            <table className="ss-portal-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Service</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{formatDate(lead.createdAt)}</td>
                    <td>{lead.name}</td>
                    <td>
                      {lead.phone || '-'}
                      {lead.email ? (
                        <>
                          <br />
                          <span className="ss-muted-note">{lead.email}</span>
                        </>
                      ) : null}
                    </td>
                    <td>{lead.service || '-'}</td>
                    <td>
                      <span className="ss-portal-badge">{lead.source}</span>
                    </td>
                    <td>
                      <span className={`ss-portal-badge ${lead.status === 'new' ? 'is-on' : ''}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td>
                      <div className="ss-portal-inline-actions">
                        <button type="button" className="ss-btn ss-btn-ghost" onClick={() => openView(lead)}>
                          View
                        </button>
                        <button type="button" className="ss-btn ss-btn-ghost" onClick={() => openEdit(lead)}>
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PortalModal
        open={createOpen}
        wide
        eyebrow="Leads"
        title="Custom quote"
        onClose={() => {
          if (!saving) setCreateOpen(false)
        }}
      >
        <form className="ss-form mt-3" onSubmit={onCreate}>
          {renderFormFields(createForm, (updater) => setCreateForm((f) => updater(f)), {
            idPrefix: 'create-lead',
          })}
          {error && createOpen ? <p className="ss-portal-status is-error">{error}</p> : null}
          <div className="ss-cta-row mt-3">
            <button className="ss-btn ss-btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save quote'}
            </button>
            <button
              className="ss-btn ss-btn-ghost"
              type="button"
              disabled={saving}
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </PortalModal>

      <PortalModal
        open={Boolean(viewLead)}
        wide
        eyebrow="Leads"
        title="View lead"
        onClose={() => setViewLead(null)}
      >
        {viewLead ? (
          <div className="ss-lead-detail mt-3">
            <DetailRow label="When" value={formatDate(viewLead.createdAt)} />
            <DetailRow label="Name" value={viewLead.name} />
            <DetailRow label="Phone / WhatsApp" value={viewLead.phone} />
            <DetailRow label="Email" value={viewLead.email} />
            <DetailRow label="Service" value={viewLead.service} />
            <DetailRow label="Vehicle / Property" value={viewLead.propertyType} />
            <DetailRow label="Preferred contact" value={viewLead.preferredContact} />
            <DetailRow label="Source" value={viewLead.source} />
            <DetailRow label="Status" value={viewLead.status} />
            <DetailRow label="Message" value={viewLead.message} />
            <DetailRow label="Internal notes" value={viewLead.notes} />
            <DetailRow
              label="Privacy consent"
              value={viewLead.privacyConsent ? 'Yes' : 'No'}
            />
            <DetailRow
              label="Marketing consent"
              value={viewLead.marketingConsent ? 'Yes' : 'No'}
            />
            <DetailRow
              label="Consent recorded"
              value={viewLead.consentedAt ? formatDate(viewLead.consentedAt) : '-'}
            />
            <div className="ss-cta-row mt-3">
              <button
                type="button"
                className="ss-btn ss-btn-primary"
                onClick={() => openEdit(viewLead)}
              >
                Edit
              </button>
              <button type="button" className="ss-btn ss-btn-ghost" onClick={() => setViewLead(null)}>
                Close
              </button>
            </div>
          </div>
        ) : null}
      </PortalModal>

      <PortalModal
        open={Boolean(editLead && editForm)}
        wide
        eyebrow="Leads"
        title="Edit lead"
        onClose={() => {
          if (!saving) {
            setEditLead(null)
            setEditForm(null)
          }
        }}
      >
        {editForm ? (
          <form className="ss-form mt-3" onSubmit={onEdit}>
            {renderFormFields(editForm, (updater) => setEditForm((f) => (f ? updater(f) : f)), {
              includeStatus: true,
              idPrefix: 'edit-lead',
            })}
            {error && editLead ? <p className="ss-portal-status is-error">{error}</p> : null}
            <div className="ss-cta-row mt-3">
              <button className="ss-btn ss-btn-primary" type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              <button
                className="ss-btn ss-btn-ghost"
                type="button"
                disabled={saving}
                onClick={() => {
                  setEditLead(null)
                  setEditForm(null)
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}
      </PortalModal>
    </>
  )
}
