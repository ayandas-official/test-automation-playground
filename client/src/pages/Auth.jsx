
import React, { useState } from 'react'

export default function Auth() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('password123')
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(null)

  const login = async () => {
    setError(null)
    const r = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    })
    const data = await r.json()
    if (!r.ok) setError(data.error || 'Login failed')
  }

  const fetchProfile = async () => {
    setError(null)
    const r = await fetch('http://localhost:3001/api/auth/profile', { credentials: 'include' })
    const data = await r.json()
    if (!r.ok) setError(data.error || 'Profile failed')
    else setProfile(data)
  }

  const logout = async () => {
    await fetch('http://localhost:3001/api/auth/logout', { method: 'POST', credentials: 'include' })
    setProfile(null)
  }

  return (
    <div className="card">
      <h3>Auth Playground</h3>
      <div>
        <label>Username</label><br />
        <input value={username} onChange={e=>setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password</label><br />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      </div>
      <div style={{ marginTop: 8 }}>
        <button className="btn" onClick={login}>Login</button>
        <button className="btn" onClick={fetchProfile} style={{ marginLeft: 8 }}>Get Profile</button>
        <button className="btn" onClick={logout} style={{ marginLeft: 8 }}>Logout</button>
      </div>
      {profile && <pre className="card">{JSON.stringify(profile, null, 2)}</pre>}
      {error && <div className="card" style={{ color:'red' }}>{error}</div>}
    </div>
  )
}
