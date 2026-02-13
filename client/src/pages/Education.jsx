import React, {useState} from 'react'
import { useLanguage } from '../i18n/LanguageContext'

const lessons = [
  {id: 1, title: 'Digital Skills 101', category: 'Tech', level: 'Beginner', duration: '2 hours'},
  {id: 2, title: 'Basic Accounting for Farmers', category: 'Business', level: 'Intermediate', duration: '3 hours'},
  {id: 3, title: 'Online Safety & Privacy', category: 'Tech', level: 'Beginner', duration: '1.5 hours'},
  {id: 4, title: 'Market Trends Analysis', category: 'Business', level: 'Advanced', duration: '4 hours'},
  {id: 5, title: 'Resume Writing', category: 'Career', level: 'Beginner', duration: '2 hours'},
  {id: 6, title: 'Interview Preparation', category: 'Career', level: 'Intermediate', duration: '3 hours'}
]

export default function Education(){
  const { t } = useLanguage()
  const [filter, setFilter] = useState('All')
  const [progress, setProgress] = useState({})

  const filtered = filter === 'All' ? lessons : lessons.filter(l => l.category === filter)

  const toggleProgress = (id) => {
    setProgress(p => ({...p, [id]: !p[id]}))
  }

  return (
    <div>
      <div className="hero" style={{background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>
        <h1>{t('educationTitle')}</h1>
        <p>{t('educationSubtitle')}</p>
      </div>

      <div style={{display: 'flex', gap: 12, marginBottom: 24, overflowX: 'auto'}}>
        {[
          { key: 'All', label: t('all') },
          { key: 'Tech', label: t('tech') },
          { key: 'Business', label: t('business') },
          { key: 'Career', label: t('career') }
        ].map(cat => (
          <button key={cat.key} onClick={() => setFilter(cat.key)} className={filter === cat.key ? 'btn btn-primary' : 'btn'} style={{border: '1px solid', borderColor: filter === cat.key ? null : '#e5e7eb'}}>
            {cat.label}
          </button>
        ))}
      </div>

      <div className="card-grid">
        {filtered.map(lesson => (
          <div key={lesson.id} className="card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12}}>
              <div>
                <h3>{lesson.title}</h3>
                <p style={{fontSize: 13, color: '#0b5cff'}}>{lesson.category}</p>
              </div>
              <input type="checkbox" checked={progress[lesson.id] || false} onChange={() => toggleProgress(lesson.id)} style={{cursor: 'pointer', width: 20, height: 20}} />
            </div>
            <p style={{color: '#6b7280', fontSize: 14, marginBottom: 12}}>
              {lesson.level} • {lesson.duration}
            </p>
            <button className="btn btn-primary" style={{width: '100%'}}>{t('startLearning')}</button>
          </div>
        ))}
      </div>

      <div className="card" style={{marginTop: 32}}>
        <h3>{t('learningProgress')}</h3>
        <p style={{color: '#6b7280', marginTop: 8}}>{t('started')} {Object.values(progress).filter(Boolean).length} {t('lessons')}</p>
        <div style={{marginTop: 16, background: '#e5e7eb', height: 20, borderRadius: 10, overflow: 'hidden'}}>
          <div style={{
            background: '#10b981',
            height: '100%',
            width: `${(Object.values(progress).filter(Boolean).length / lessons.length) * 100}%`,
            transition: 'width 0.3s'
          }}></div>
        </div>
      </div>
    </div>
  )
}
