import { useState } from 'react'
import type { Source } from '../types'

type Message = { role: 'user' | 'assistant'; text: string; sources?: Source[] }
type Props = { documentId: string; onAsk: (id: string, q: string) => Promise<{ answer: string; sources: Source[] }> }
const examples = ['What is the licence expiry date?', 'What vehicles can the holder drive?', 'What is the licence number?']
export default function DocumentChat({ documentId, onAsk }: Props) {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function submit(q = question) {
    const clean = q.trim()
    if (!clean || busy) return
    setQuestion(''); setError('')
    setMessages(prev => [...prev, { role: 'user', text: clean }])
    setBusy(true)
    try {
      const result = await onAsk(documentId, clean)
      setMessages(prev => [...prev, { role: 'assistant', text: result.answer, sources: result.sources }])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to answer this question.')
    } finally { setBusy(false) }
  }
  return <section className="chat-card">
    <div className="section-heading"><div><span className="eyebrow">DOCUMENT Q&A</span><h2>Ask this document</h2></div><span className="ai-pill">AI assistant</span></div>
    <p className="muted small">Answers are based on retrieved text from the uploaded licence.</p>
    {messages.length === 0 && <div className="suggestions">{examples.map(q=><button key={q} className="suggestion" onClick={()=>submit(q)} disabled={busy}>{q}<span>↗</span></button>)}</div>}
    <div className="messages" aria-live="polite">
      {messages.map((m,i)=><div key={i} className={`message ${m.role}`}><span className="message-role">{m.role === 'user' ? 'YOU' : 'DOCUMENT AI'}</span><p>{m.text}</p>{m.sources?.length ? <div className="sources"><strong>Evidence</strong>{m.sources.map((s,j)=><details key={j}><summary>Page {s.page}</summary><p>{s.excerpt}</p></details>)}</div> : null}</div>)}
      {busy && <div className="message assistant"><span className="message-role">DOCUMENT AI</span><p>Searching the document…</p></div>}
    </div>
    {error && <p className="error-text">{error}</p>}
    <form className="chat-input" onSubmit={e=>{e.preventDefault();void submit()}}><input value={question} onChange={e=>setQuestion(e.target.value)} maxLength={1000} placeholder="Ask a question about this licence…" aria-label="Ask a question" /><button className="button primary" disabled={busy || !question.trim()}>Ask</button></form>
    <p className="fine-print">AI can make mistakes. Verify answers against the original document.</p>
  </section>
}
