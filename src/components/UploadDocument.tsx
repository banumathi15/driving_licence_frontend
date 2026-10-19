import { useRef, useState } from 'react'

type Props = { loading: boolean; onUpload: (file: File) => void }
const ACCEPTED = ['application/pdf', 'image/png', 'image/jpeg']
export default function UploadDocument({ loading, onUpload }: Props) {
  const input = useRef<HTMLInputElement>(null)
  const [localError, setLocalError] = useState('')
  function handle(file?: File) {
    setLocalError('')
    if (!file) return
    if (!ACCEPTED.includes(file.type)) { setLocalError('Choose a PDF, PNG, or JPEG file.'); return }
    if (file.size > 10 * 1024 * 1024) { setLocalError('File must be 10 MB or smaller.'); return }
    onUpload(file)
  }
  return <div className="upload-card">
    <div className="upload-icon">↥</div>
    <h2>Upload a driving licence</h2>
    <p>PDF or image · Maximum 10 MB</p>
    <input ref={input} type="file" accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg" hidden onChange={e => handle(e.target.files?.[0])} />
    <button className="button primary" disabled={loading} onClick={() => input.current?.click()}>{loading ? 'Reading document…' : 'Choose document'}</button>
    {localError && <p className="error-text">{localError}</p>}
    <p className="fine-print">Use the sample documents provided with the assignment.</p>
  </div>
}
