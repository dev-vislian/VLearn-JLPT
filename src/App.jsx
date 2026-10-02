import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Kana from './pages/Kana.jsx'
import Level from './pages/Level.jsx'
import UnitList from './pages/UnitList.jsx'
import Unit from './pages/Unit.jsx'
import Favorites from './pages/Favorites.jsx'
import ZenMode from './pages/ZenMode.jsx'
import Navbar from './components/Navbar.jsx'
import { AppProvider } from './contexts/AppContext.jsx'
import { ZenProvider, useZen } from './contexts/ZenContext.jsx'

function Shell() {
  // Di mobile ZenMiniBar duduk tepat di bawah navbar, jadi konten butuh ruang
  // ekstra selama sesi aktif. Di desktop widget-nya melayang di dalam navbar,
  // sehingga padding tambahan tidak diperlukan.
  const { isZenActive } = useZen()

  return (
    <>
      <Navbar />
      <div className={isZenActive ? 'pt-32 md:pt-16 pb-10' : 'pt-16 pb-10'}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/kana" element={<Kana />} />
          <Route path="/zen" element={<ZenMode />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/:level" element={<Level />} />
          <Route path="/:level/:module" element={<UnitList />} />
          <Route path="/:level/:module/:unitId" element={<Unit />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  )
}

function App() {
  return (
    <AppProvider>
      <ZenProvider>
        <Shell />
      </ZenProvider>
    </AppProvider>
  )
}

export default App