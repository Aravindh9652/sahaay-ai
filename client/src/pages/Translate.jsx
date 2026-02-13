import React, {useState, useRef, useEffect} from 'react'
import { useLanguage } from '../i18n/LanguageContext'

const languages = [
  {code: 'en', name: 'English'},
  {code: 'hi', name: 'हिंदी (Hindi)'},
  {code: 'ta', name: 'Tamil'},
  {code: 'te', name: 'Telugu'},
  {code: 'bn', name: 'Bengali'}
]

export default function Translate(){
  const { t } = useLanguage()
  const [text, setText] = useState('')
  const [target, setTarget] = useState('hi')
  const [source, setSource] = useState('auto')
  const [useAI, setUseAI] = useState(false)
  const [result, setResult] = useState('')
  const [detected, setDetected] = useState('')
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.onresult = (e) => {
        const transcript = Array.from(e.results).map(r => r[0].transcript).join('')
        setText(transcript)
      }
      recognitionRef.current.onend = () => setListening(false)
    }
  }, [])

  const startVoice = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start()
      setListening(true)
    }
  }

  const stopVoice = () => {
    if (recognitionRef.current) recognitionRef.current.stop()
  }

  const translate = async () => {
    if (!text) return
    setLoading(true)
    try {
      const res = await fetch('/api/translate/translate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({text, target, source, useAI})
      })
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      
      const data = await res.json()
      
      // Handle the response
      if (data.translated) {
        setResult(data.translated)
        if (data.detected) setDetected(data.detected)
      } else if (data.error) {
        setResult(`Error: ${data.error}`)
      } else {
        setResult(`Could not translate: ${text}`)
      }
    } catch (err) {
      console.error('Translation error:', err)
      setResult(`${text} (${target})`)
    } finally {
      setLoading(false)
    }
  }

  const speakTranslation = () => {
    if (!result) return
    const utterance = new SpeechSynthesisUtterance(result)
    
    // Language code mapping for speech synthesis
    const langMap = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'bn': 'bn-IN'
    }
    
    utterance.lang = langMap[target] || target
    utterance.rate = 0.9
    utterance.pitch = 1
    window.speechSynthesis.cancel() // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div>
      <div className="hero" style={{background: 'linear-gradient(135deg, #ec4899, #db2777)'}}>
        <h1>{t('translateTitle')}</h1>
        <p>{t('translateSubtitle')}</p>
      </div>

      <div className="card" style={{maxWidth: 600, margin: '32px auto'}}>
        <h3>{t('textTranslation')}</h3>
        
        <div className="form-group" style={{marginTop: 16}}>
          <label>{t('message')}</label>
          <textarea 
            value={text} 
            onChange={e => setText(e.target.value)} 
            rows={4}
            placeholder="Enter or speak your message..."
          />
          <div style={{display: 'flex', gap: 12, marginTop: 8}}>
            <button 
              className={`btn ${listening ? 'btn-primary' : 'btn-secondary'}`}
              onClick={listening ? stopVoice : startVoice}
              style={{flex: 1}}
            >
              {listening ? `🎤 ${t('listening')}` : `🎤 ${t('speak')}`}
            </button>
            <button 
              onClick={() => setText('')}
              style={{flex: 1, background: '#e5e7eb', border: 'none', borderRadius: 6, cursor: 'pointer'}}
            >
              {t('clear')}
            </button>
          </div>
        </div>

        <div className="form-group" style={{display: 'flex', gap: 12, alignItems: 'center'}}>
          <div style={{flex: 1}}>
            <label>Source</label>
            <select value={source} onChange={e => setSource(e.target.value)}>
              <option value="auto">Auto-detect</option>
              {languages.map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>

          <div style={{flex: 1}}>
            <label>{t('translateTo')}</label>
            <select value={target} onChange={e => setTarget(e.target.value)}>
              {languages.filter(l => l.code !== 'en').map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{display: 'flex', gap: 12, alignItems: 'center', marginTop: 8}}>
          <label style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <input type="checkbox" checked={useAI} onChange={e => setUseAI(e.target.checked)} />
            Use AI translation (OpenAI)
          </label>
        </div>

        <button 
          onClick={translate} 
          className="btn btn-primary"
          style={{width: '100%'}}
          disabled={loading || !text}
        >
          {loading ? t('translating') : t('translate')}
        </button>

        {result && (
          <div style={{marginTop: 20, padding: 16, background: '#f0fdf4', borderRadius: 8, border: '1px solid #dcfce7'}}>
            <h4 style={{marginBottom: 8}}>{t('translation')}</h4>
            <p style={{margin: 0, fontSize: 18, color: '#15803d', fontWeight: 500}}>{result}</p>
            {detected && (
              <p style={{marginTop: 8, fontSize: 13, color: '#374151'}}>Detected: {detected}</p>
            )}
            <button 
              onClick={speakTranslation}
              style={{marginTop: 12, padding: '8px 16px', background: '#22c55e', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600}}
            >
              🔊 {t('listen')}
            </button>
          </div>
        )}
      </div>

      <div className="card-grid" style={{marginTop: 32}}>
        <div className="card">
          <h3>💬 {t('languages')}</h3>
          <p>{languages.map(l => l.name).join(', ')}</p>
        </div>
        <div className="card">
          <h3>✓ {t('features')}</h3>
          <ul style={{color: '#6b7280', paddingLeft: 20}}>
            <li>Voice input & output</li>
            <li>Low-bandwidth mode</li>
            <li>Offline dictionary</li>
            <li>Literacy-friendly UI</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
