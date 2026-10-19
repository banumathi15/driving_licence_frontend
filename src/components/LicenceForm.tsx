import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { LicenceFields } from '../types'

const formSchema = z.object({
  fullName: z.string().max(200),
  licenceNumber: z.string().max(200),
  dateOfBirth: z.string().max(50),
  dateOfIssue: z.string().max(50),
  dateOfExpiry: z.string().max(50),
  address: z.string().max(1000),
  vehicleClassesText: z.string().max(500),
  issuingAuthority: z.string().max(300),
  otherInformationText: z.string().max(1500)
})
type FormValues = z.infer<typeof formSchema>
const scalarFields: { key: keyof Pick<FormValues,'fullName'|'licenceNumber'|'dateOfBirth'|'dateOfIssue'|'dateOfExpiry'|'address'|'issuingAuthority'>; label: string }[] = [
  { key:'fullName', label:'Full name' }, { key:'licenceNumber', label:'Licence number' },
  { key:'dateOfBirth', label:'Date of birth' }, { key:'dateOfIssue', label:'Date of issue' },
  { key:'dateOfExpiry', label:'Date of expiry' }, { key:'address', label:'Address' },
  { key:'issuingAuthority', label:'Issuing authority' }
]
type Props = { fields: LicenceFields; onSave: (fields: LicenceFields) => Promise<void>; saving: boolean }
export default function LicenceForm({ fields, onSave, saving }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: toForm(fields)
  })
  useEffect(() => reset(toForm(fields)), [fields, reset])
  async function submit(values: FormValues) {
    await onSave({
      fullName: values.fullName.trim() || null, licenceNumber: values.licenceNumber.trim() || null,
      dateOfBirth: values.dateOfBirth.trim() || null, dateOfIssue: values.dateOfIssue.trim() || null,
      dateOfExpiry: values.dateOfExpiry.trim() || null, address: values.address.trim() || null,
      issuingAuthority: values.issuingAuthority.trim() || null,
      vehicleClasses: values.vehicleClassesText.split(',').map(x=>x.trim()).filter(Boolean),
      otherInformation: values.otherInformationText.split('\n').map(x=>x.trim()).filter(Boolean)
    })
  }
  return <form className="form-card" onSubmit={handleSubmit(submit)} noValidate>
    <div className="section-heading"><div><span className="eyebrow">EXTRACTED DATA</span><h2>Review information</h2></div><span className="editable-pill">Editable</span></div>
    <p className="muted small">Review every value against the original document before saving.</p>
    <div className="field-grid">
      {scalarFields.map(field => <label key={field.key} className={field.key === 'address' ? 'field full' : 'field'}>
        <span>{field.label}</span>
        {field.key === 'address' ? <textarea rows={3} {...register(field.key)} placeholder="Not found in document" /> : <input {...register(field.key)} placeholder="Not found in document" />}
        {errors[field.key] && <small className="error-text">{errors[field.key]?.message}</small>}
      </label>)}
      <label className="field full"><span>Vehicle / licence classes <small>(comma-separated)</small></span><input {...register('vehicleClassesText')} placeholder="e.g. LMV, MCWG" /></label>
      <label className="field full"><span>Other information <small>(one item per line)</small></span><textarea rows={2} {...register('otherInformationText')} placeholder="Optional additional information" /></label>
    </div>
    <button className="button primary" disabled={saving}>{saving ? 'Saving…' : isDirty ? 'Save reviewed data' : 'Save reviewed data'}</button>
  </form>
}
function toForm(f: LicenceFields): FormValues {
  return { fullName:f.fullName || '', licenceNumber:f.licenceNumber || '', dateOfBirth:f.dateOfBirth || '', dateOfIssue:f.dateOfIssue || '', dateOfExpiry:f.dateOfExpiry || '', address:f.address || '', vehicleClassesText:f.vehicleClasses.join(', '), issuingAuthority:f.issuingAuthority || '', otherInformationText:f.otherInformation.join('\n') }
}
