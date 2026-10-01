import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Kana from './pages/Kana.jsx'
import Level from './pages/Level.jsx'
import UnitList from './pages/UnitList.jsx'
import Unit from './pages/Unit.jsx'
import Favorites from './pages/Favorites.jsx'
import ZenMode from './pages/ZenMode.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import Navbar from './components/Navbar.jsx'
import { AppProvider } from './contexts/AppContext.jsx'

function App() {
  return (
    <AppProvider>
      <ThemeToggle />
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/kana" element={<Kana />} />
          <Route path="/:level" element={<Level />} />
          <Route path="/:level/:module" element={<UnitList />} />
          <Route path="/:level/:module/:unitId" element={<Unit />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/zen" element={<ZenMode />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AppProvider>
  )
}

export default App
