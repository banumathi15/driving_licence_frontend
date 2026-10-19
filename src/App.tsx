import { useState } from 'react'
import UploadDocument from './components/UploadDocument'
import LicenceForm from './components/LicenceForm'
import DocumentPreview from './components/DocumentPreview'
import DocumentChat from './components/DocumentChat'
import { askQuestion, readableError, saveFields, uploadDocument } from './api'
import type { DocumentResponse, LicenceFields } from './types'

export default function App() {
  const [doc, setDoc] = useState<DocumentResponse | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function handleUpload(selected: File) {
    setLoading(true); setError(''); setNotice(''); setDoc(null); setFile(selected)
    try { setDoc(await uploadDocument(selected)) }
    catch (e) { setError(readableError(e)); setFile(null) }
    finally { setLoading(false) }
  }
  async function handleSave(fields: LicenceFields) {
    if (!doc) return
    setSaving(true); setError(''); setNotice('')
    try {
      const result = await saveFields(doc.documentId, fields)
      setDoc({ ...doc, fields: result.fields })
      setNotice(result.message)
    } catch (e) { setError(readableError(e)); throw e }
    finally { setSaving(false) }
  }
  async function handleAsk(id: string, question: string) {
    try { return await askQuestion(id, question) }
    catch (e) { throw new Error(readableError(e)) }
  }

  return <main className="app-shell">
    <header className="topbar"><a className="brand" href="#"><span className="brand-mark">L</span><span>Licence<span className="brand-light">Lens</span></span></a><div className="topbar-right"><span className="secure-dot" /> Private demo workspace <span className="version">AI DOCUMENT READER</span></div></header>
    <section className="hero"><div className="hero-copy"><span className="eyebrow">DOCUMENT INTELLIGENCE · FULL-STACK DEMO</span><h1>Turn a licence into<br/><span>structured data.</span></h1><p>Upload a driving licence, review AI-extracted details, and ask questions grounded in the source document.</p><div className="hero-points"><span>✓ OCR extraction</span><span>✓ Editable fields</span><span>✓ Evidence-backed Q&A</span></div></div><div className="hero-art" aria-hidden="true"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-document"><div className="art-chip">DL</div><div className="art-line long"/><div className="art-line medium"/><div className="art-line short"/><div className="art-stamp">AI<br/>READ</div></div><div className="art-spark spark-one">✳</div><div className="art-spark spark-two">✦</div></div></section>
    {error && <div className="alert error" role="alert"><strong>Something went wrong</strong><span>{error}</span><button onClick={()=>setError('')} aria-label="Dismiss error">×</button></div>}
    {notice && <div className="alert success" role="status"><strong>Saved</strong><span>{notice}</span><button onClick={()=>setNotice('')} aria-label="Dismiss message">×</button></div>}
    {!doc && <section className="upload-area"><UploadDocument loading={loading} onUpload={handleUpload}/>{loading && <p className="processing-note"><span className="spinner"/> Reading document and extracting fields. Scanned PDFs may take a little longer.</p>}<div className="privacy-note"><span>♧</span><p><strong>Privacy by design</strong><br/>This demo processes files in memory. Avoid uploading real identity documents to an untrusted deployment.</p></div></section>}
    {doc && file && <><div className="document-bar"><div><span className="status-dot"/><strong>{doc.originalName}</strong><span className="muted small"> · {doc.mode === 'llm' ? 'AI extraction' : 'Demo extraction'}</span></div><button className="button secondary" onClick={()=>{setDoc(null);setFile(null);setError('');setNotice('')}}>Upload another</button></div>
      {doc.warnings.map(w=><div className="alert warning" key={w}><span>{w}</span></div>)}
      <div className="workspace"><div className="left-column"><DocumentPreview file={file} pages={doc.pages}/></div><div className="right-column"><LicenceForm fields={doc.fields} onSave={handleSave} saving={saving}/><DocumentChat documentId={doc.documentId} onAsk={handleAsk}/></div></div>
    </>}
    <footer><span>LicenceLens · AI document reader</span><span>Review all extracted information before use</span></footer>
  </main>
}
