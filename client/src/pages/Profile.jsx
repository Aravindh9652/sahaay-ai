import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

export default function Profile({ setUser }){
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const raw = localStorage.getItem('sahaay_token')
    if (raw) {
      try {
        const u = JSON.parse(raw)
        setName(u.name || '')
        setEmail(u.email || '')
      } catch (e) {}
    }
  }, [])

  const save = (e) => {
    e.preventDefault()
    const raw = localStorage.getItem('sahaay_token')
    let user = raw ? JSON.parse(raw) : {}
    user.name = name
    user.email = email
    localStorage.setItem('sahaay_token', JSON.stringify(user))
    if (setUser) setUser(user)
    setMessage('Saved')
    setTimeout(() => navigate('/dashboard'), 800)
  }

  return (
    <div className="form-container">
      <div className="card">
        <h2 style={{marginBottom: 24}}>{t('editProfile')}</h2>
        {message && <div style={{marginBottom:12, color:'#059669'}}>{message}</div>}
        <form onSubmit={save}>
          <div className="form-group">
            <label>{t('fullName')}</label>
            <input value={name} onChange={e=>setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>{t('email')}</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">{t('editProfile')}</button>
        </form>
      </div>
    </div>
  )
}
