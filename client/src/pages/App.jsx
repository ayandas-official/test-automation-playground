
import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './Home.jsx'
import Forms from './Forms.jsx'
import Waits from './Waits.jsx'
import Api from './Api.jsx'
import Upload from './Upload.jsx'
import Auth from './Auth.jsx'
import TablePage from './TablePage.jsx'
import IframePage from './IframePage.jsx'
import ShadowPage from './ShadowPage.jsx'
import A11y from './A11y.jsx'
import DragDrop from './DragDrop.jsx'
import WindowHandling from './WindowHandling.jsx'


export default function App() {
  return (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/forms">Forms</Link>
          <Link to="/drag">Drag & Drop</Link>
          <Link to="/windows">Windows</Link>
          <Link to="/waits">Waits</Link>
          <Link to="/api">API</Link>
          <Link to="/upload">Upload</Link>
          <Link to="/auth">Auth</Link>
          <Link to="/table">Table</Link>
          <Link to="/iframe">iFrame</Link>
          <Link to="/shadow">Shadow DOM</Link>
          <Link to="/a11y">A11y</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forms" element={<Forms />} />
          <Route path="/waits" element={<Waits />} />
          <Route path="/api" element={<Api />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/table" element={<TablePage />} />
          <Route path="/iframe" element={<IframePage />} />
          <Route path="/shadow" element={<ShadowPage />} />
          <Route path="/a11y" element={<A11y />} />
          <Route path="/drag" element={<DragDrop />} />
          <Route path="/windows" element={<WindowHandling />} />
        </Routes>
      </main>
    </>
  )
}
