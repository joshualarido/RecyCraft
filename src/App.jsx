import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from './components/Sidebar'
import Camera from './pages/Camera'
import Collection from './pages/Collection'
import Crafts from './pages/Crafts'
import CraftDetails from './pages/CraftDetails'
import NotFound from './pages/NotFound'

function App() {
  const callGemini = async (prompt) => {
    try {
      const res = await axios.post('/gemini', {
        prompt: prompt
      })
      console.log("Gemini API response: ", res.data)
    } catch (error) {
      console.error("Error calling Gemini API:", error);
    }
  }

  callGemini(`generate me an image of a recycled plastic water bottle as a soil planter`)

  return (
    <>
    <div className='w-screen h-screen flex flex-row overflow-hidden'>
      <Sidebar/>
      <div className="flex-1 bg-gray-100 px-6 py-8 z-0 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/camera" replace />} />

          <Route path="/camera" element={<Camera />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/crafts" element={<Crafts />} />
          <Route path="/craftdetails" element={<CraftDetails />} />
          <Route path="/404" element={<NotFound />} />
          
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </div>
    </div>
    </>
  );
}

export default App;
