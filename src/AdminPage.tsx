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

const TOTAL_SLIDES = 16

const SLIDE_LABELS: Record<number, string> = {
  1:  'Project Coffee ☕',
  2:  'Disclaimer',
  3:  "Wasn't supposed to feel this",
  4:  'I like you — no ctrl+Z',
  5:  'Not a proposal, just coffee',
  6:  'More than I budgeted for',
  7:  'Your eyes though…',
  8:  "I WANT to know you",
  9:  "Not rushing anything",
  10: "Situation? Lol, no",
  11: '300% valid reasons to say no',
  12: 'The list of why you should say yes',
  13: "People who say yes",
  14: 'One coffee, real conversation',
  15: 'This is me. Santy.',
  16: 'So… what do you say? ☕',
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
  const [loading, setLoading] = useState(false)

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
    setLoading(true)
    const unsub = onSnapshot(
      collection(db, 'sessions'),
      (snap) => {
        const data = snap.docs
          .map(d => ({ id: d.id, ...d.data() } as Session))
          .sort((a, b) => (b.updatedAt?.seconds ?? 0) - (a.updatedAt?.seconds ?? 0))
        setSessions(data)
        setFsError('')
        setLoading(false)
      },
      (err) => {
        console.error('[admin] snapshot error:', err.code, err.message)
        setLoading(false)
        if (err.code === 'permission-denied') {
          setFsError('permission-denied')
        } else {
          setFsError(err.message)
        }
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
  const completed = sessions.filter(s => s.maxSlide >= TOTAL_SLIDES).length
  const avgSlide = total > 0
    ? (sessions.reduce((sum, s) => sum + (s.maxSlide || 1), 0) / total).toFixed(1)
    : '—'

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Slide Journey Tracker</h1>
          <p className="admin-subtitle">{loading ? 'Connecting…' : 'Live · updates in real-time'}</p>
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
          <strong>⚠️ {fsError === 'permission-denied' ? 'Firestore rules blocking access' : 'Firestore error'}</strong>
          {fsError === 'permission-denied' ? (
            <>
              <p>Go to <strong>Firebase Console → Firestore Database → Rules</strong> and publish:</p>
              <code>{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sessions/{id} {
      allow read, write: if true;
    }
  }
}`}</code>
            </>
          ) : (
            <p>{fsError}</p>
          )}
        </div>
      )}

      <div className="admin-sessions">
        {!fsError && sessions.length === 0 && (
          <p className="admin-empty">No sessions yet. Share the link to start tracking.</p>
        )}
        {sessions.map(session => {
          const pct = Math.round(((session.maxSlide || 1) / TOTAL_SLIDES) * 100)
          const isOpen = expanded === session.id
          const finished = (session.maxSlide || 0) >= TOTAL_SLIDES

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
                    {Array.from({ length: TOTAL_SLIDES }, (_, i) => {
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
                    <p>Slides seen: {session.maxSlide || 1} / {TOTAL_SLIDES}</p>
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
