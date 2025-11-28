
import React, { useEffect, useRef, useState } from 'react'

export default function Forms() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('tester')
  const [gender, setGender] = useState('female')
  const [interests, setInterests] = useState({ ui: true, api: false, mobile: false })
  const [country, setCountry] = useState('India')
  const [dob, setDob] = useState('')
  const [resume, setResume] = useState(null)
  const [wantsNewsletter, setWantsNewsletter] = useState(true)
  const [resp, setResp] = useState(null)
  const [error, setError] = useState(null)

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const modalRef = useRef(null)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && showModal) setShowModal(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showModal])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setResp(null)
    try {
      const payload = {
        name,
        email,
        role,
        gender,
        interests: Object.keys(interests).filter(k => interests[k]),
        country,
        dob,
        wantsNewsletter,
      }
      const r = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Request failed')
      setResp(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const uploadResume = async () => {
    if (!resume) return alert('Please choose a file first.')
    const fd = new FormData()
    fd.append('files', resume)
    const r = await fetch('http://localhost:3001/api/upload', { method: 'POST', body: fd })
    const data = await r.json()
    alert('Upload done: ' + (data.uploaded?.[0]?.filename || 'ok'))
  }

  const toggleInterest = (key) => setInterests(prev => ({ ...prev, [key]: !prev[key] }))

  const showAlert = () => {
    alert('Basic alert for testing automation!')
  }
  const showConfirm = () => {
    const ok = confirm('Do you confirm the details?')
    setWantsNewsletter(ok)
  }
  const showPrompt = () => {
    const v = prompt('Enter a tag (e.g., QA):', '')
    if (v) setRole(v)
  }

  return (
    <div className="card">
      <h3>Complex Form + Dialogs</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label><br />
          <input aria-label="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Jane" />
        </div>
        <div>
          <label>Email</label><br />
          <input aria-label="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="jane@example.com" />
        </div>
        <div>
          <label>Role</label><br />
          <select aria-label="role" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="tester">Tester</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        {/* Radios */}
        <fieldset style={{ marginTop: 8 }}>
          <legend>Gender</legend>
          <label><input type="radio" name="gender" value="female" checked={gender==='female'} onChange={()=>setGender('female')} /> Female</label>{' '}
          <label><input type="radio" name="gender" value="male" checked={gender==='male'} onChange={()=>setGender('male')} /> Male</label>{' '}
          <label><input type="radio" name="gender" value="other" checked={gender==='other'} onChange={()=>setGender('other')} /> Other</label>
        </fieldset>

        {/* Checkboxes */}
        <fieldset style={{ marginTop: 8 }}>
          <legend>Interests</legend>
          <label><input type="checkbox" checked={interests.ui} onChange={()=>toggleInterest('ui')} /> UI</label>{' '}
          <label><input type="checkbox" checked={interests.api} onChange={()=>toggleInterest('api')} /> API</label>{' '}
          <label><input type="checkbox" checked={interests.mobile} onChange={()=>toggleInterest('mobile')} /> Mobile</label>
        </fieldset>

        {/* Select */}
        <div style={{ marginTop: 8 }}>
          <label>Country</label><br />
          <select aria-label="country" value={country} onChange={e=>setCountry(e.target.value)}>
            <option>India</option>
            <option>United States</option>
            <option>United Kingdom</option>
            <option>Germany</option>
            <option>Japan</option>
          </select>
        </div>

        {/* Calendar (date) */}
        <div style={{ marginTop: 8 }}>
          <label>Date of Birth</label><br />
          <input type="date" aria-label="dob" value={dob} onChange={e=>setDob(e.target.value)} />
        </div>

        {/* File input */}
        <div style={{ marginTop: 8 }}>
          <label>Resume (PDF)</label><br />
          <input type="file" accept="application/pdf" onChange={e=>setResume(e.target.files?.[0] || null)} />
          <button type="button" className="btn" style={{ marginLeft: 8 }} onClick={uploadResume}>Upload Resume</button>
        </div>

        {/* Newsletter checkbox */}
        <div style={{ marginTop: 8 }}>
          <label><input type="checkbox" checked={wantsNewsletter} onChange={e=>setWantsNewsletter(e.target.checked)} /> Subscribe to newsletter</label>
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="btn" type="submit">Submit</button>
          <button type="button" className="btn" style={{ marginLeft: 8 }} onClick={()=>setShowModal(true)}>Open Modal</button>
        </div>
      </form>

      {/* Alerts */}
      <div style={{ marginTop: 12 }}>
        <button className="btn" onClick={showAlert}>Alert</button>
        <button className="btn" onClick={showConfirm} style={{ marginLeft: 8 }}>Confirm</button>
        <button className="btn" onClick={showPrompt} style={{ marginLeft: 8 }}>Prompt</button>
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="modal-overlay" style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'grid', placeItems: 'center'
        }}>
          <div ref={modalRef} className="modal" style={{ background: '#fff', padding: 16, borderRadius: 8, width: 400 }}>
            <h4 id="modal-title">Confirm Submission</h4>
            <p>Do you want to submit the form with current values?</p>
            <div style={{ display:'flex', gap: 8 }}>
              <button className="btn" onClick={() => { setShowModal(false); handleSubmit(new Event('submit', { cancelable: true })); }}>Yes, submit</button>
              <button className="btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {resp && <pre className="card">{JSON.stringify(resp, null, 2)}</pre>}
      {error && <div className="card" style={{ color: 'red' }}>{error}</div>}
    </div>
  )
}
