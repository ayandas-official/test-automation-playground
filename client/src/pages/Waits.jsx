
import React, { useEffect, useState } from 'react'

export default function Waits() {
  const [enabled, setEnabled] = useState(false)
  const [appears, setAppears] = useState(false)
  const [loading, setLoading] = useState(false)
  const [delayResult, setDelayResult] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setEnabled(true), Math.floor(Math.random()*4000)+1000)
    const t2 = setTimeout(() => setAppears(true), Math.floor(Math.random()*5000)+500)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [])

  const callDelay = async () => {
    setLoading(true)
    setDelayResult(null)
    const ms = Math.floor(Math.random()*3000)+500
    const r = await fetch(`http://localhost:3001/api/delay?ms=${ms}`)
    const data = await r.json()
    setDelayResult(data)
    setLoading(false)
  }

  return (
    <div className="card">
      <h3>Waits & Flaky Elements</h3>
      <button className="btn" disabled={!enabled} onClick={callDelay}>
        {enabled ? 'Call Slow API' : 'Enabling...'}
      </button>
      {loading && <div style={{ display:'inline-block', marginLeft:8 }} className="spinner" aria-label="loading" />}
      {delayResult && <pre className="card">{JSON.stringify(delayResult, null, 2)}</pre>}
      <div style={{ marginTop: 12 }}>
        {appears ? <span id="late-element">I appeared late!</span> : <span aria-hidden>Waiting for element...</span>}
      </div>
    </div>
  )
}
