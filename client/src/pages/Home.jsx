
import React from 'react'

export default function Home() {
  return (
    <div className="card">
      <h2>Test Automation Playground</h2>
      <p>Use the navigation to explore scenarios: forms, waits/flakiness, API, uploads, auth, table, iframe, shadow DOM, and accessibility.</p>
      <ul>
        <li>Server: <code>http://localhost:3001</code></li>
        <li>Client: <code>http://localhost:5173</code></li>
      </ul>
    </div>
  )
}
