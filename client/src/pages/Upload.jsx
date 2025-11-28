
import React, { useState } from 'react'

export default function Upload() {
  const [files, setFiles] = useState([])
  const [resp, setResp] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    for (const f of files) fd.append('files', f)
    const r = await fetch('http://localhost:3001/api/upload', { method: 'POST', body: fd })
    const data = await r.json()
    setResp(data)
  }

  return (
    <div className="card">
      <h3>File Upload</h3>
      <form onSubmit={onSubmit}>
        <input type="file" multiple onChange={e => setFiles([...e.target.files])} />
        <button className="btn" type="submit">Upload</button>
      </form>
      {resp && <pre className="card">{JSON.stringify(resp, null, 2)}</pre>}
    </div>
  )
}
