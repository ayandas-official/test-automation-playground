
import React, { useState, useEffect } from 'react'

export default function Api() {
  const [out, setOut] = useState(null)
  const [error, setError] = useState(null)

  const call = async (path) => {
    setError(null)
    setOut(null)
    try {
      const r = await fetch(`http://localhost:3001${path}`)
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || r.statusText)
      setOut(data)
    } catch (e) { setError(e.message) }
  }

  const callStream = () => {
    setError(null)
    setOut({ streaming: true, events: [] })
    const es = new EventSource('http://localhost:3001/api/stream')
    es.addEventListener('tick', (ev) => {
      setOut(prev => ({ ...prev, events: [...prev.events, JSON.parse(ev.data)] }))
    })
    es.addEventListener('end', () => { es.close() })
    es.onerror = () => { setError('Stream error'); es.close() }
  }

  return (
    <div className="card">
      <h3>API Explorer</h3>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        <button className="btn" onClick={() => call('/api/health')}>Health</button>
        <button className="btn" onClick={() => call(`/api/delay?ms=${Math.floor(Math.random()*3000)+500}`)}>Delay</button>
        <button className="btn" onClick={() => call('/api/random-error')}>Random Error</button>
        <button className="btn" onClick={() => call('/api/rate-limit')}>Rate Limit</button>
        <button className="btn" onClick={callStream}>Stream (SSE)</button>
        <button className="btn" onClick={() => call('/api/users')}>Get Users</button>
      </div>
      {out && <pre className="card">{JSON.stringify(out, null, 2)}</pre>}
      {error && <div className="card" style={{ color:'red' }}>{error}</div>}
    </div>
  )
}
