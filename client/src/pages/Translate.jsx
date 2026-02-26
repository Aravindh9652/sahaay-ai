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
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)', padding: '20px 0'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 20px'}}>

        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '40px',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: 'white',
            marginBottom: '16px',
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            {t('translateTitle')}
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {t('translateSubtitle')}
          </p>
        </div>

        {/* Translation Card */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '40px',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          margin: '0 auto 40px auto'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px'}}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ec4899, #db2777)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              💬
            </div>
            <h3 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1f2937'
            }}>
              {t('textTranslation')}
            </h3>
          </div>

          <div style={{marginBottom: '20px'}}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#374151'
            }}>
              {t('message')}
            </label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={4}
              placeholder="Enter or speak your message..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                fontSize: '16px',
                resize: 'vertical',
                transition: 'border-color 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ec4899'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <div style={{display: 'flex', gap: '12px', marginTop: '12px'}}>
              <button
                className={`btn ${listening ? 'btn-primary' : 'btn-secondary'}`}
                onClick={listening ? stopVoice : startVoice}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: listening ? '#ec4899' : '#f3f4f6',
                  color: listening ? 'white' : '#374151',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                {listening ? `🎤 ${t('listening')}` : `🎤 ${t('speak')}`}
              </button>
              <button
                onClick={() => setText('')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  background: 'white',
                  color: '#374151',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.borderColor = '#ec4899'}
                onMouseLeave={(e) => e.target.style.borderColor = '#e5e7eb'}
              >
                {t('clear')}
              </button>
            </div>
          </div>

          <div style={{display: 'flex', gap: '12px', alignItems: 'end', marginBottom: '20px'}}>
            <div style={{flex: 1}}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#374151'
              }}>
                Source
              </label>
              <select
                value={source}
                onChange={e => setSource(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ec4899'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              >
                <option value="auto">Auto-detect</option>
                {languages.map(l => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>

            <div style={{flex: 1}}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#374151'
              }}>
                {t('translateTo')}
              </label>
              <select
                value={target}
                onChange={e => setTarget(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ec4899'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              >
                {languages.filter(l => l.code !== 'en').map(l => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px'}}>
            <input
              type="checkbox"
              checked={useAI}
              onChange={e => setUseAI(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                accentColor: '#ec4899'
              }}
            />
            <label style={{
              fontWeight: '600',
              color: '#374151',
              cursor: 'pointer'
            }}>
              Use AI translation (OpenAI)
            </label>
          </div>

          <button
            onClick={translate}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #ec4899, #db2777)',
              color: 'white',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)',
              opacity: loading || !text ? 0.6 : 1
            }}
            disabled={loading || !text}
            onMouseEnter={(e) => {
              if (!loading && text) {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && text) {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 15px rgba(236, 72, 153, 0.3)'
              }
            }}
          >
            {loading ? t('translating') : t('translate')}
          </button>

          {result && (
            <div style={{
              marginTop: '24px',
              padding: '20px',
              background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
              borderRadius: '12px',
              border: '1px solid #bbf7d0'
            }}>
              <h4 style={{
                margin: '0 0 12px 0',
                color: '#166534',
                fontSize: '1.2rem'
              }}>
                {t('translation')}
              </h4>
              <p style={{
                margin: '0 0 12px 0',
                fontSize: '18px',
                color: '#15803d',
                fontWeight: '500',
                lineHeight: '1.5'
              }}>
                {result}
              </p>
              {detected && (
                <p style={{
                  margin: '8px 0 12px 0',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  Detected: {detected}
                </p>
              )}
              <button
                onClick={speakTranslation}
                style={{
                  padding: '8px 16px',
                  background: '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)'
                  e.target.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = 'none'
                }}
              >
                🔊 {t('listen')}
              </button>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-4px)'
            e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'
          }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px'}}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #ec4899, #db2777)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                💬
              </div>
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1f2937'
                }}>
                  {t('languages')}
                </h3>
                <p style={{
                  margin: 0,
                  color: '#6b7280',
                  fontSize: '0.9rem'
                }}>
                  {languages.map(l => l.name).join(', ')}
                </p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-4px)'
            e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'
          }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px'}}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                ✓
              </div>
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1f2937'
                }}>
                  {t('features')}
                </h3>
                <ul style={{
                  color: '#6b7280',
                  paddingLeft: '20px',
                  margin: '8px 0 0 0',
                  lineHeight: '1.6'
                }}>
                  <li>Voice input & output</li>
                  <li>Low-bandwidth mode</li>
                  <li>Offline dictionary</li>
                  <li>Literacy-friendly UI</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
