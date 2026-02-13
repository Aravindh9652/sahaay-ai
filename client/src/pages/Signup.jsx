import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

export default function Signup({ setUser }){
  const { t } = useLanguage()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
      setError(t('allRequired'))
      return
    }
    
    if (password !== confirmPassword) {
      setError(t('passwordMismatch'))
      return
    }
    
    if (password.length < 6) {
      setError(t('passwordLength'))
      return
    }
    
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, email, password})
      })
      const data = await res.json()
      
      if (data.ok) {
        // Signup successful
        const user = { id: data.user.id, name: data.user.name, email: data.user.email, token: data.token }
        localStorage.setItem('sahaay_token', JSON.stringify(user))
        setUser(user)
        navigate('/dashboard')
      } else if (data.userExists) {
        // Account already exists
        setError(t('alreadyExists'))
        setTimeout(() => {
          navigate('/login', { state: { email } })
        }, 2000)
      } else {
        setError(data.error || 'Signup failed. Please try again.')
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
        <h2 style={{marginBottom: 24}}>{t('signupTitle')}</h2>
        {error && <div style={{color: error.includes('already') ? '#f59e0b' : '#ef4444', marginBottom: 16, padding: 12, background: error.includes('already') ? '#fffbeb' : '#fee2e2', borderRadius: 6, border: `1px solid ${error.includes('already') ? '#fde68a' : '#fecaca'}`}}>{error}</div>}
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>{t('fullName')}</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Your full name"
              required 
            />
          </div>
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
              placeholder="At least 6 characters"
              required 
            />
          </div>
          <div className="form-group">
            <label>{t('confirmPassword')}</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              placeholder="Confirm your password"
              required 
            />
          </div>
          <button type="submit" className="btn btn-secondary" style={{width: '100%'}} disabled={loading}>
            {loading ? t('creating') : t('createAccount')}
          </button>
        </form>
        <p style={{marginTop: 16, textAlign: 'center', color: '#6b7280'}}>
          {t('hasAccount')} <Link to="/login" style={{color: '#0b5cff', fontWeight: 600}}>{t('loginHere')}</Link>
        </p>
      </div>
    </div>
  )
}
