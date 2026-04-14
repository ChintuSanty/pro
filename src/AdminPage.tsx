import { useState, useEffect } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'
import './AdminPage.css'

interface Session {
  id: string
  device: string
  startedAt: { seconds: number } | null
  updatedAt: { seconds: number } | null
  lastSlide: number
  maxSlide: number
  totalSlides: number
  slideHistory: { slide: number; seenAt: string }[]
}

const SLIDE_LABELS: Record<number, string> = {
  1: 'The Pitch',
  2: 'Disclaimer',
  3: "300% not eligible…",
  4: 'I like you',
  5: "Not proposing",
  6: 'Be my girlfriend',
  7: 'Know each other',
  8: "Won't regret this",
  9: 'More than I planned',
  10: 'Not rushing',
  11: "Situation isn't perfect",
  12: 'A slow honest shot',
  13: "Let's just try",
  14: 'Favourites list',
  15: 'The one tab',
  16: 'Best version of me',
  17: 'Asking you out',
  18: 'What do you say?',
}

function timeAgo(seconds: number): string {
  const diff = Math.floor(Date.now() / 1000 - seconds)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function formatTime(seconds: number): string {
  return new Date(seconds * 1000).toLocaleString()
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [sessions, setSessions] = useState<Session[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [fsError, setFsError] = useState('')

  const login = () => {
    if (password === 'Santy') {
      setAuthed(true)
      setError('')
    } else {
      setError('Wrong password')
    }
  }

  useEffect(() => {
    if (!authed) return
    setFsError('')
    const unsub = onSnapshot(
      collection(db, 'sessions'),
      (snap) => {
        const data = snap.docs
          .map(d => ({ id: d.id, ...d.data() } as Session))
          .sort((a, b) => {
            const ta = a.updatedAt?.seconds ?? 0
            const tb = b.updatedAt?.seconds ?? 0
            return tb - ta
          })
        setSessions(data)
        setFsError('')
      },
      (err) => {
        console.error('[admin] snapshot error:', err)
        setFsError(`Firestore error: ${err.message}. Go to Firebase Console → Firestore → Rules and set allow read, write: if true;`)
      }
    )
    return unsub
  }, [authed])

  if (!authed) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <p className="admin-logo">🔐</p>
          <h2>Admin Access</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            className="admin-input"
            autoFocus
          />
          {error && <p className="admin-error">{error}</p>}
          <button className="admin-btn" onClick={login}>Enter</button>
        </div>
      </div>
    )
  }

  const total = sessions.length
  const completed = sessions.filter(s => s.maxSlide === s.totalSlides).length
  const avgSlide = total > 0
    ? (sessions.reduce((sum, s) => sum + s.maxSlide, 0) / total).toFixed(1)
    : '—'

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Slide Journey Tracker</h1>
          <p className="admin-subtitle">Live · updates in real-time</p>
        </div>
        <button className="admin-back" onClick={() => window.location.hash = ''}>← Back</button>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <p className="stat-val">{total}</p>
          <p className="stat-label">Visitors</p>
        </div>
        <div className="stat-card">
          <p className="stat-val">{completed}</p>
          <p className="stat-label">Completed</p>
        </div>
        <div className="stat-card">
          <p className="stat-val">{avgSlide}</p>
          <p className="stat-label">Avg Slide</p>
        </div>
      </div>

      {fsError && (
        <div className="admin-fs-error">
          <strong>⚠️ Rules not set</strong>
          <p>Go to <strong>Firebase Console → Firestore → Rules</strong> and publish:</p>
          <code>{'allow read, write: if true;'}</code>
        </div>
      )}

      <div className="admin-sessions">
        {!fsError && sessions.length === 0 && (
          <p className="admin-empty">No sessions yet. Share the link to start tracking.</p>
        )}
        {sessions.map(session => {
          const pct = Math.round((session.maxSlide / (session.totalSlides || 16)) * 100)
          const isOpen = expanded === session.id
          const finished = session.maxSlide === (session.totalSlides || 16)

          return (
            <div key={session.id} className="session-card">
              <div className="session-top" onClick={() => setExpanded(isOpen ? null : session.id)}>
                <div className="session-left">
                  <span className={`session-badge ${finished ? 'badge-done' : 'badge-active'}`}>
                    {finished ? '✓ Done' : `Slide ${session.lastSlide}`}
                  </span>
                  <p className="session-device">{session.device}</p>
                  <p className="session-time">
                    {session.updatedAt ? timeAgo(session.updatedAt.seconds) : '—'}
                  </p>
                </div>
                <div className="session-right">
                  <p className="session-pct">{pct}%</p>
                  <span className="session-toggle">{isOpen ? '▲' : '▼'}</span>
                </div>
              </div>

              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%`, background: finished ? '#22c55e' : '#c44569' }} />
              </div>

              <p className="session-last-label">
                Last seen: <strong>{SLIDE_LABELS[session.maxSlide] || `Slide ${session.maxSlide}`}</strong>
              </p>

              {isOpen && (
                <div className="session-detail">
                  <p className="detail-heading">Slide Journey</p>
                  <div className="slide-bubbles">
                    {Array.from({ length: session.totalSlides || 16 }, (_, i) => {
                      const n = i + 1
                      const seen = session.slideHistory?.some(h => h.slide === n)
                      return (
                        <div key={n} className={`bubble ${seen ? 'bubble-seen' : ''} ${n === session.maxSlide ? 'bubble-current' : ''}`}>
                          {n}
                        </div>
                      )
                    })}
                  </div>
                  <div className="detail-meta">
                    <p>Started: {session.startedAt ? formatTime(session.startedAt.seconds) : '—'}</p>
                    <p>Last active: {session.updatedAt ? formatTime(session.updatedAt.seconds) : '—'}</p>
                    <p>Slides seen: {session.maxSlide} / {session.totalSlides || 16}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
