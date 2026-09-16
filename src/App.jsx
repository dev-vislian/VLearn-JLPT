import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Kana from './pages/Kana.jsx'
import Level from './pages/Level.jsx'
import Unit from './pages/Unit.jsx'
import Favorites from './pages/Favorites.jsx'
import ZenMode from './pages/ZenMode.jsx'
import { AppProvider } from './contexts/AppContext.jsx'

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/kana" element={<Kana />} />
        <Route path="/:level" element={<Level />} />
        <Route path="/:level/:module/:unitId" element={<Unit />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/zen" element={<ZenMode />} />
      </Routes>
    </AppProvider>
  )
}

export default App
