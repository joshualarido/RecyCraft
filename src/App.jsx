import './App.css'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Camera from './pages/Camera'
import Collection from './pages/Collection'
import Crafts from './pages/Crafts'

function App() {
  return (
    <>
    <div className='w-screen h-screen flex flex-row'>
      <Sidebar/>
      <div className="w-full bg-gray-100 px-6 py-8 z-0">
        <Routes>
          <Route path="/" element={<Camera />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/crafts" element={<Crafts />} />
        </Routes>
      </div>
    </div>
    </>
  )
}

export default App
