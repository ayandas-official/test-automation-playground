
import React, { useEffect } from 'react'

class ShadowWidget extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' })
    root.innerHTML = `
      <style>
        .box { border: 1px dashed #aaa; padding: 8px; }
        .btn { background:#22c55e; color:#fff; border:none; padding:6px 10px; border-radius:4px; }
      </style>
      <div class="box">
        <input id="shadow-input" placeholder="Type inside shadow" />
        <button class="btn" id="shadow-btn">Shadow Click</button>
        <p id="shadow-msg"></p>
      </div>
    `
    const btn = root.getElementById('shadow-btn')
    const msg = root.getElementById('shadow-msg')
    btn.addEventListener('click', () => { msg.textContent = 'Clicked inside shadow!' })
  }
}

export default function ShadowPage() {
  useEffect(() => {
    if (!customElements.get('shadow-widget')) {
      customElements.define('shadow-widget', ShadowWidget)
    }
  }, [])

  return (
    <div className="card">
      <h3>Shadow DOM Playground</h3>
      <shadow-widget></shadow-widget>
    </div>
  )
}
