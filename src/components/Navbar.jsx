import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Heart, Zap, Moon, Sun, Volume2, VolumeX } from 'lucide-react'
import { useApp } from '../contexts/AppContext.jsx'
import { isSoundEnabled, setSoundEnabled } from '../utils/sound.js'
import ZenMiniBar from './ZenMiniBar.jsx'

export default function Navbar() {
  const location = useLocation()
  const { theme, toggleTheme } = useApp()
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled())

  const handleSoundToggle = () => {
    setSoundOn(setSoundEnabled(!soundOn))
  }

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/', label: 'Beranda', icon: Home },
    { path: '/favorites', label: 'Favorit', icon: Heart },
    { path: '/zen', label: 'Zen', icon: Zap },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-zen-card/50 backdrop-blur-md border-b border-zen-border/30 shadow-lg">
      <ZenMiniBar />
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-lg sm:text-xl md:text-2xl font-bold text-zen-accent-dark font-display shrink-0">
            VLearn
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive(path)
                    ? 'bg-zen-accent text-white shadow-md'
                    : 'text-zen-text-dark hover:bg-zen-accent/10'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className="ml-1 p-2 rounded-lg text-zen-text-dark hover:bg-zen-accent/10 transition-all duration-300"
              title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={handleSoundToggle}
              className="p-2 rounded-lg text-zen-text-dark hover:bg-zen-accent/10 transition-all duration-300"
              title={soundOn ? 'Matikan suara' : 'Nyalakan suara'}
            >
              {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} className="text-zen-text/50" />}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-0.5">
            {navItems.map(({ path, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isActive(path)
                    ? 'bg-zen-accent text-white'
                    : 'text-zen-text-dark hover:bg-zen-accent/10'
                }`}
              >
                <Icon size={16} />
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-zen-text-dark hover:bg-zen-accent/10 transition-all duration-300"
              title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              onClick={handleSoundToggle}
              className="p-1.5 rounded-lg text-zen-text-dark hover:bg-zen-accent/10 transition-all duration-300"
              title={soundOn ? 'Matikan suara' : 'Nyalakan suara'}
            >
              {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} className="text-zen-text/50" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
