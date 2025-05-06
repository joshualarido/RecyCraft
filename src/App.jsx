import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Camera from './pages/Camera'
import Collection from './pages/Collection'
import Crafts from './pages/Crafts'
import NotFound from './pages/NotFound'

function App() {
  return (
    <>
    <div className='w-screen h-screen flex flex-row'>
      <Sidebar/>
      <div className="w-full bg-gray-100 px-6 py-8 z-0">
        <Routes>
          <Route path="/" element={<Navigate to="/camera" replace />} />

          <Route path="/camera" element={<Camera />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/crafts" element={<Crafts />} />
          <Route path="/404" element={<NotFound />} />
          
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </div>
    </div>
    </>
  )
}

export default App
