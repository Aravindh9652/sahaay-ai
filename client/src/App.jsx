import React, {useState, useEffect} from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CivicHub from './pages/CivicHub'
import Education from './pages/Education'
import Market from './pages/Market'
import Translate from './pages/Translate'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import './App.css'

function AppContent(){
  const [user, setUser] = useState(null)
  const { language, setLanguage, t } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('sahaay_token')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const logout = () => {
    localStorage.removeItem('sahaay_token')
    setUser(null)
    navigate('/')
  }

  const languages = [
    { code: 'en', name: 'English' }, 
    { code: 'hi', name: 'हिन्दी' }, 
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'bn', name: 'বাংলা' }
  ]

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="logo">{t('logo')}</Link>
        </div>
        <div className="nav-center">
          {user && (
            <>
              <Link to="/civic">{t('civic')}</Link>
              <Link to="/education">{t('learn')}</Link>
              <Link to="/market">{t('market')}</Link>
              <Link to="/translate">{t('translate')}</Link>
            </>
          )}
        </div>
        <div className="nav-right">
          <select value={language} onChange={e => setLanguage(e.target.value)} className="lang-select">
            {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">👤 {t('dashboard')}</Link>
              <button onClick={logout} className="btn-logout">{t('logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">{t('login')}</Link>
              <Link to="/signup" className="btn-signup">{t('signup')}</Link>
            </>
          )}
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/civic" element={<CivicHub />} />
          <Route path="/education" element={<Education />} />
          <Route path="/market" element={<Market />} />
          <Route path="/translate" element={<Translate />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Login setUser={setUser} />} />
          <Route path="/profile" element={<Profile setUser={setUser} />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App(){
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </BrowserRouter>
  )
}
