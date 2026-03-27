import './landing.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Application } from './Router'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>,
)

