import axios from 'axios'
import type { DocumentResponse, LicenceFields, Source } from './types'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api', timeout: 90000 })
export function readableError(error: unknown): string {
  if (axios.isAxiosError(error)) return error.response?.data?.error || error.message || 'Request failed.'
  return error instanceof Error ? error.message : 'An unexpected error occurred.'
}
export async function uploadDocument(file: File) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post<DocumentResponse>('/documents', form)
  return data
}
export async function saveFields(id: string, fields: LicenceFields) {
  const { data } = await api.put<{ fields: LicenceFields; message: string }>(`/documents/${id}`, fields)
  return data
}
export async function askQuestion(id: string, question: string) {
  const { data } = await api.post<{ answer: string; sources: Source[] }>(`/documents/${id}/chat`, { question })
  return data
}
