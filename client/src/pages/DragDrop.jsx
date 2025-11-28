
import React, { useState } from 'react'

export default function DragDrop() {
  const [leftItems, setLeftItems] = useState(['Alpha', 'Bravo', 'Charlie'])
  const [rightItems, setRightItems] = useState(['Delta', 'Echo'])
  const [lastDrop, setLastDrop] = useState(null)

  const onDragStart = (e, item, from) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ item, from }))
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDrop = (e, to) => {
    const data = JSON.parse(e.dataTransfer.getData('text/plain'))
    const { item, from } = data
    if (from === to) return
    if (from === 'left') setLeftItems(prev => prev.filter(x => x !== item))
    if (from === 'right') setRightItems(prev => prev.filter(x => x !== item))
    if (to === 'left') setLeftItems(prev => [...prev, item])
    if (to === 'right') setRightItems(prev => [...prev, item])
    setLastDrop({ item, from, to })
  }

  const allowDrop = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }

  const Zone = ({ title, items, side }) => (
    <div
      role="list"
      onDragOver={allowDrop}
      onDrop={e => onDrop(e, side)}
      style={{ flex:1, minHeight: 160, border:'2px dashed #aaa', borderRadius:8, padding:8 }}>
      <h4>{title}</h4>
      {items.map(x => (
        <div key={x} role="listitem" draggable onDragStart={e => onDragStart(e, x, side)}
          style={{ background:'#f8fafc', border:'1px solid #ddd', padding:'6px 8px', borderRadius:6, marginBottom:6 }}>
          {x}
        </div>
      ))}
    </div>
  )

  return (
    <div className="card">
      <h3>Drag & Drop Playground</h3>
      <div style={{ display:'flex', gap:12 }}>
        <Zone title="Left" items={leftItems} side="left" />
        <Zone title="Right" items={rightItems} side="right" />
      </div>
      {lastDrop && <p id="drop-result">Dropped {lastDrop.item} from {lastDrop.from} to {lastDrop.to}</p>}
    </div>
  )
}
