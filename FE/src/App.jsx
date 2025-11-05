import { Routes, Route } from 'react-router-dom'
import StartPage from './pages/StartPage'
import ChatPage from './pages/ChatPage'
import LicenseModal from './components/LicenseModal'

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/license" element={<LicenseModal />} />
    </Routes>
  )
}

export default App

