
import React, { useEffect, useRef, useState } from 'react'

export default function WindowHandling() {
  const popupRef = useRef(null)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const handler = (event) => {
      // For local testing, origin will be http://localhost:3001
      setMessages(prev => [...prev, { from: event.origin, text: event.data }])
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  const openNewTab = () => {
    window.open('http://localhost:5173/table', '_blank')
  }

  const openPopup = () => {
    popupRef.current = window.open('http://localhost:3001/api/popup-content', 'popup', 'width=480,height=360')
  }

  const sendMessage = () => {
    popupRef.current?.postMessage('Hello from opener!', 'http://localhost:3001')
  }

  const closePopup = () => {
    popupRef.current?.close()
    popupRef.current = null
  }

  return (
    <div className="card">
      <h3>Window Handling Playground</h3>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        <a href="http://localhost:5173/table" target="_blank" rel="noopener noreferrer">Open link in new tab</a>
        <button className="btn" onClick={openNewTab}>window.open() tab</button>
        <button className="btn" onClick={openPopup}>Open popup</button>
        <button className="btn" onClick={sendMessage}>PostMessage to popup</button>
        <button className="btn" onClick={closePopup}>Close popup</button>
      </div>
      <div className="card" style={{ marginTop: 10 }}>
        <h4>Messages received</h4>
        <ul>
          {messages.map((m,i) => <li key={i}><strong>{m.from}:</strong> {String(m.text)}</li>)}
        </ul>
      </div>
    </div>
  )
}
