import { Link, useLocation } from 'react-router-dom'
import { Home, Heart, Zap, Moon, Sun } from 'lucide-react'
import { useApp } from '../contexts/AppContext.jsx'

export default function Navbar() {
  const location = useLocation()
  const { theme, toggleTheme } = useApp()

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/', label: 'Beranda', icon: Home },
    { path: '/favorites', label: 'Favorit', icon: Heart },
    { path: '/zen', label: 'Zen', icon: Zap },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-zen-card/50 backdrop-blur-md border-b border-zen-border/30 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl md:text-2xl font-bold text-zen-accent-dark font-display">
            VLearn
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
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
              className="ml-2 p-2 rounded-lg text-zen-text-dark hover:bg-zen-accent/10 transition-all duration-300"
              title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-1">
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
                <Icon size={18} />
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-zen-text-dark hover:bg-zen-accent/10 transition-all duration-300"
              title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
