import { useEffect, useState } from 'react'
type Props = { file: File; pages: { page: number; text: string }[] }
export default function DocumentPreview({ file, pages }: Props) {
  const [url, setUrl] = useState('')
  useEffect(() => { const next = URL.createObjectURL(file); setUrl(next); return () => URL.revokeObjectURL(next) }, [file])
  return <section className="preview-card">
    <div className="section-heading"><div><span className="eyebrow">SOURCE DOCUMENT</span><h2>Document preview</h2></div><span className="page-count">{pages.length} page{pages.length === 1 ? '' : 's'}</span></div>
    <div className="preview-stage">
      {url && (file.type === 'application/pdf' ? <iframe title="Uploaded licence PDF" src={url} /> : <img src={url} alt="Uploaded driving licence" />)}
    </div>
    <div className="source-text"><strong>Extracted text</strong><p>{pages.map(p=>`[Page ${p.page}] ${p.text}`).join('\n\n').slice(0,2500) || 'No text available.'}</p></div>
  </section>
}
