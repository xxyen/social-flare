import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ChatBox from './ChatBox.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px'}}>
      <App />
      <ChatBox />
    </div> 
  </StrictMode>,
)
