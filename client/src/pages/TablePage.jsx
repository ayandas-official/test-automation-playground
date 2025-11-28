
import React, { useEffect, useMemo, useState } from 'react'

export default function TablePage() {
  const [rows, setRows] = useState([])
  const [sortBy, setSortBy] = useState('name')
  const [asc, setAsc] = useState(true)
  const [page, setPage] = useState(1)
  const pageSize = 5

  useEffect(() => {
    fetch('http://localhost:3001/api/users').then(r => r.json()).then(setRows)
  }, [])

  const sorted = useMemo(() => {
    return [...rows].sort((a,b) => {
      const av = a[sortBy].toString().toLowerCase()
      const bv = b[sortBy].toString().toLowerCase()
      return (av > bv ? 1 : av < bv ? -1 : 0) * (asc ? 1 : -1)
    })
  }, [rows, sortBy, asc])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const pageData = sorted.slice((page-1)*pageSize, page*pageSize)

  const headers = ['id','name','email','role']

  return (
    <div className="card">
      <h3>Table - Sort & Paginate</h3>
      <div style={{ marginBottom: 8 }}>
        Sort by:{' '}
        {headers.map(h => (
          <button key={h} className="btn" onClick={()=>{ setSortBy(h); setAsc(h===sortBy? !asc : true) }} style={{ marginRight: 6 }}>
            {h} {sortBy===h ? (asc ? '▲' : '▼') : ''}
          </button>
        ))}
      </div>
      <table>
        <thead>
          <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {pageData.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 8 }}>
        <button className="btn" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Prev</button>
        <span style={{ margin:'0 8px' }}>Page {page} / {totalPages}</span>
        <button className="btn" disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </div>
  )
}
