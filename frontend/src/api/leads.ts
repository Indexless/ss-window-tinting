import { apiRequest } from './client'

export type LeadSource = 'website' | 'whatsapp' | 'other'
export type LeadStatus = 'new' | 'contacted' | 'quoted' | 'won' | 'lost'

export type Lead = {
  id: string
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
  privacyConsent: boolean
  marketingConsent: boolean
  consentedAt?: string
  createdAt: string
  updatedAt: string
}

export type CreateLeadInput = {
  name: string
  phone?: string
  email?: string
  service?: string
  propertyType?: string
  preferredContact?: string
  message?: string
  source?: LeadSource
  notes?: string
  privacyConsent?: boolean
  marketingConsent?: boolean
}

export type UpdateLeadInput = Partial<
  Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'privacyConsent' | 'marketingConsent' | 'consentedAt'>
>

export function submitWebsiteLead(input: CreateLeadInput) {
  return apiRequest<{ id: string }>('/api/v1/leads', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function fetchLeads() {
  return apiRequest<Lead[]>('/api/v1/leads')
}

export function createManualLead(input: CreateLeadInput) {
  return apiRequest<Lead>('/api/v1/leads/manual', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateLead(id: string, input: UpdateLeadInput) {
  return apiRequest<Lead>(`/api/v1/leads/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}
