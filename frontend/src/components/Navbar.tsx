// src/components/Navbar.tsx
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import useAuth from '../context/AuthContext'
import useParticleSettings from '../hooks/useParticleSettings'

const Navbar: React.FC = () => {
  const { user, logoutUser } = useAuth()
  const { enabled: particlesEnabled, toggle: toggleParticles } = useParticleSettings()
  const [scrollY, setScrollY] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Calculate navbar opacity based on scroll (fade in from 0 to 1 over 100px)
  const navOpacity = Math.min(scrollY / 100, 1)
  const bgOpacity = Math.min(scrollY / 120, 0.85)

  const linkClass = (isActive: boolean) =>
    `${isActive ? 'text-yellow-300 font-semibold' : 'hover:text-yellow-200'} transition`

  return (
    <nav className="fixed w-full z-50" style={{
      backgroundColor: `rgba(255, 255, 255, ${bgOpacity * 0.06})`,
      backdropFilter: `blur(${Math.min(scrollY / 30, 12)}px)`,
      borderBottomColor: `rgba(255, 255, 255, ${navOpacity * 0.1})`,
      borderBottomWidth: '1px',
      transition: 'all 0.05s ease-out'
    }}>
      <div className="container mx-auto flex items-center justify-between p-4">
        <NavLink to="/" className="flex items-center gap-3">
          <span className="text-2xl font-extrabold tracking-wide text-white">Golf Charity</span>
          <span className="hidden sm:inline text-sm font-medium text-green-100">Play. Win. Give.</span>
        </NavLink>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleParticles}
            className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/8 hover:bg-white/12 text-white text-xs transition"
            title="Toggle particles"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={particlesEnabled ? 'currentColor' : 'none'} xmlns="http://www.w3.org/2000/svg">
              <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="18" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="6" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span>{particlesEnabled ? 'On' : 'Off'}</span>
          </button>

          <button
            className="md:hidden text-white"
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <NavLink to="/" className={({ isActive }) => linkClass(isActive)}>
            Home
          </NavLink>

          {user ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => linkClass(isActive)}>
                Dashboard
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => linkClass(isActive)}>
                Profile
              </NavLink>
              <NavLink to="/my-winnings" className={({ isActive }) => linkClass(isActive)}>
                My Winnings
              </NavLink>
              <NavLink to="/subscription" className={({ isActive }) => linkClass(isActive)}>
                Subscription
              </NavLink>

              {user.isAdmin && (
                <>
                  <NavLink to="/admin" className={({ isActive }) => 'bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded transition'}>
                    Admin Panel
                  </NavLink>
                  <NavLink to="/admin/winners" className={({ isActive }) => 'bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded transition'}>
                    Winners
                  </NavLink>
                </>
              )}

              <button onClick={logoutUser} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => 'bg-white text-green-700 px-3 py-1 rounded hover:bg-green-100 transition'}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => 'bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300 transition'}>
                Register
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${open ? 'block' : 'hidden'} w-full mt-2`}>
          <div className="bg-white/4 backdrop-blur-md rounded-lg p-4 flex flex-col gap-3">
            <button
              onClick={() => { toggleParticles(); setOpen(false) }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/8 hover:bg-white/12 text-white text-xs transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={particlesEnabled ? 'currentColor' : 'none'} xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="18" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="6" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span>Particles: {particlesEnabled ? 'On' : 'Off'}</span>
            </button> 
            <NavLink to="/" onClick={() => setOpen(false)} className={({ isActive }) => linkClass(isActive)}>
              Home
            </NavLink>

            {user ? (
              <>
                <NavLink to="/dashboard" onClick={() => setOpen(false)} className={({ isActive }) => linkClass(isActive)}>
                  Dashboard
                </NavLink>
                <NavLink to="/profile" onClick={() => setOpen(false)} className={({ isActive }) => linkClass(isActive)}>
                  Profile
                </NavLink>
                <NavLink to="/my-winnings" onClick={() => setOpen(false)} className={({ isActive }) => linkClass(isActive)}>
                  My Winnings
                </NavLink>
                <NavLink to="/subscription" onClick={() => setOpen(false)} className={({ isActive }) => linkClass(isActive)}>
                  Subscription
                </NavLink>
                {user.isAdmin && (
                  <>
                    <NavLink to="/admin" onClick={() => setOpen(false)} className={({ isActive }) => 'bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded transition'}>
                      Admin Panel
                    </NavLink>
                    <NavLink to="/admin/winners" onClick={() => setOpen(false)} className={({ isActive }) => 'bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded transition'}>
                      Winners
                    </NavLink>
                  </>
                )}

                <button onClick={() => { logoutUser(); setOpen(false) }} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={() => setOpen(false)} className={({ isActive }) => 'bg-white text-green-700 px-3 py-1 rounded hover:bg-green-100 transition'}>
                  Login
                </NavLink>
                <NavLink to="/register" onClick={() => setOpen(false)} className={({ isActive }) => 'bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300 transition'}>
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;