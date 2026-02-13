import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

export default function Login({ setUser }){
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
      })
      const data = await res.json()
      
      if (data.ok) {
        // Login successful
        const user = { id: data.user.id, name: data.user.name, email: data.user.email, token: data.token }
        localStorage.setItem('sahaay_token', JSON.stringify(user))
        setUser(user)
        navigate('/dashboard')
      } else if (data.userNotFound) {
        // User doesn't exist - redirect to signup
        setError(t('accountNotFound'))
        setTimeout(() => {
          navigate('/signup', { state: { email } })
        }, 1500)
      } else {
        // Other errors (wrong password, etc.)
        setError(data.error || t('invalidPassword'))
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <div className="card">
        <h2 style={{marginBottom: 24}}>{t('loginTitle')}</h2>
        {error && <div style={{color: error.includes('create') ? '#059669' : '#ef4444', marginBottom: 16, padding: 12, background: error.includes('create') ? '#ecfdf5' : '#fee2e2', borderRadius: 6, border: `1px solid ${error.includes('create') ? '#d1fae5' : '#fecaca'}`}}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>{t('email')}</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="you@example.com"
              required 
            />
          </div>
          <div className="form-group">
            <label>{t('password')}</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••"
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={loading}>
            {loading ? t('checking') : t('login')}
          </button>
        </form>
        <p style={{marginTop: 16, textAlign: 'center', color: '#6b7280'}}>
          {t('noAccount')} <Link to="/signup" style={{color: '#0b5cff', fontWeight: 600}}>{t('signUpHere')}</Link>
        </p>
      </div>
    </div>
  )
}
