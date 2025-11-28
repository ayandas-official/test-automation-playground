
import React from 'react'

export default function IframePage() {
  return (
    <div className="card">
      <h3>iFrame Playground</h3>
      <iframe title="inner" src="http://localhost:3001/api/iframe-content" style={{ width:'100%', height:200, border:'1px solid #ddd' }} />
    </div>
  )
}
