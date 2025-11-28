
import React from 'react'

export default function A11y() {
  return (
    <div className="card">
      <h3>Accessibility Examples</h3>
      <div style={{ display:'flex', gap:16 }}>
        <div style={{ flex:1 }}>
          <h4>Broken</h4>
          <button>Click me</button>
          <img src="" alt="" />
          <div role="button">Non-focusable div as button</div>
          <label>Unassociated label</label>
          <input />
        </div>
        <div style={{ flex:1 }}>
          <h4>Fixed</h4>
          <button aria-label="Click me">Click me</button>
          <img src="" alt="Decorative image" />
          <button>Proper button</button>
          <label htmlFor="good-input">Associated label</label>
          <input id="good-input" aria-describedby="help" />
          <small id="help">Helpful description</small>
        </div>
      </div>
    </div>
  )
}
