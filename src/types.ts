export type LicenceFields = {
  fullName: string | null
  licenceNumber: string | null
  dateOfBirth: string | null
  dateOfIssue: string | null
  dateOfExpiry: string | null
  address: string | null
  vehicleClasses: string[]
  issuingAuthority: string | null
  otherInformation: string[]
}
export type Source = { page: number; excerpt: string }
export type DocumentResponse = {
  documentId: string
  originalName: string
  fields: LicenceFields
  pages: { page: number; text: string }[]
  extractedText: string
  mode: string
  warnings: string[]
}
