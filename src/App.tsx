import { useState, useRef, useEffect } from 'react'
import './App.css'
import { useSession } from './useSession'
import AdminPage from './AdminPage'

interface Card {
  id: number
  text: string
  type: 'title' | 'disclaimer' | 'wait' | 'plain'
  gradient: string
  peek: string
}

const cards: Card[] = [
  {
    id: 1, type: 'title', text: '',
    gradient: 'linear-gradient(160deg, #ff6b9d 0%, #c44569 50%, #8b2252 100%)',
    peek: 'linear-gradient(160deg, #ff8fab, #d63384)',
  },
  {
    id: 2, type: 'disclaimer', text: '',
    gradient: 'linear-gradient(160deg, #f9a825 0%, #e91e8c 55%, #7b1fa2 100%)',
    peek: 'linear-gradient(160deg, #fce4ec, #e91e8c)',
  },
  {
    id: 3, type: 'plain', text: "I know I'm 300% not eligible…",
    gradient: 'linear-gradient(160deg, #f48fb1 0%, #ad1457 55%, #560027 100%)',
    peek: 'linear-gradient(160deg, #fce4ec, #f06292)',
  },
  {
    id: 4, type: 'wait', text: 'I like you',
    gradient: 'linear-gradient(160deg, #9c27b0 0%, #4a148c 55%, #1a0030 100%)',
    peek: 'linear-gradient(160deg, #ce93d8, #7b1fa2)',
  },
  {
    id: 5, type: 'plain', text: "I'm not proposing to you",
    gradient: 'linear-gradient(160deg, #ff8a80 0%, #e53935 55%, #7f0000 100%)',
    peek: 'linear-gradient(160deg, #ffcdd2, #ef9a9a)',
  },
  {
    id: 6, type: 'wait', text: 'I want you to be my girlfriend',
    gradient: 'linear-gradient(160deg, #e91e63 0%, #9c27b0 55%, #4a148c 100%)',
    peek: 'linear-gradient(160deg, #f48fb1, #ce93d8)',
  },
  {
    id: 7, type: 'plain', text: 'I want us to know more about each other',
    gradient: 'linear-gradient(160deg, #c2185b 0%, #7b1fa2 55%, #311b92 100%)',
    peek: 'linear-gradient(160deg, #f06292, #ba68c8)',
  },
  {
    id: 8, type: 'plain', text: "I know it might sound odd to you, but I'm sure you won't regret this",
    gradient: 'linear-gradient(160deg, #880e4f 0%, #4a148c 55%, #1a0030 100%)',
    peek: 'linear-gradient(160deg, #f48fb1, #9c27b0)',
  },
  {
    id: 9, type: 'plain', text: "I'm into you — more than I planned to be",
    gradient: 'linear-gradient(160deg, #d81b60 0%, #6a1b9a 55%, #1a0030 100%)',
    peek: 'linear-gradient(160deg, #f06292, #ab47bc)',
  },
  {
    id: 10, type: 'wait', text: "But I'm not here to rush anything",
    gradient: 'linear-gradient(160deg, #9c27b0 0%, #512da8 55%, #1a0030 100%)',
    peek: 'linear-gradient(160deg, #ba68c8, #7986cb)',
  },
  {
    id: 11, type: 'plain', text: "I know my situation isn't perfect right now",
    gradient: 'linear-gradient(160deg, #c62828 0%, #6a1b9a 55%, #1a0030 100%)',
    peek: 'linear-gradient(160deg, #ef9a9a, #ce93d8)',
  },
  {
    id: 12, type: 'plain', text: "All I'm asking for is a shot — slow, honest, and without pressure",
    gradient: 'linear-gradient(160deg, #e53935 0%, #8e24aa 55%, #1a0030 100%)',
    peek: 'linear-gradient(160deg, #ef9a9a, #ba68c8)',
  },
  {
    id: 13, type: 'wait', text: "I don't want to hurt you. I don't want to be hurt either. So let's just… try.",
    gradient: 'linear-gradient(160deg, #b71c1c 0%, #4a148c 55%, #1a0030 100%)',
    peek: 'linear-gradient(160deg, #ff8a80, #9c27b0)',
  },
  {
    id: 14, type: 'plain', text: "I want a lifetime subscription to your favourites list — no free trial, no cancellations, just permanently saved",
    gradient: 'linear-gradient(160deg, #c2185b 0%, #6a1b9a 55%, #1a0030 100%)',
    peek: 'linear-gradient(160deg, #f48fb1, #ce93d8)',
  },
  {
    id: 15, type: 'plain', text: "You're the one tab I never want to close",
    gradient: 'linear-gradient(160deg, #880e4f 0%, #512da8 55%, #1a0030 100%)',
    peek: 'linear-gradient(160deg, #f48fb1, #9575cd)',
  },
  {
    id: 16, type: 'plain', text: "You make me want to be the version of myself that actually deserves you",
    gradient: 'linear-gradient(160deg, #6a1b9a 0%, #1565c0 55%, #0d0030 100%)',
    peek: 'linear-gradient(160deg, #ba68c8, #64b5f6)',
  },
  {
    id: 17, type: 'plain', text: "This is me asking you out — so we can really get to know each other",
    gradient: 'linear-gradient(160deg, #e91e63 0%, #7b1fa2 55%, #1a0030 100%)',
    peek: 'linear-gradient(160deg, #f48fb1, #ab47bc)',
  },
  {
    id: 18, type: 'plain', text: "So… what do you say?",
    gradient: 'linear-gradient(160deg, #ff6b9d 0%, #c44569 50%, #8b2252 100%)',
    peek: 'linear-gradient(160deg, #ff8fab, #f48fb1)',
  },
]

function CardContent({ card }: { card: Card }) {
  if (card.type === 'title') {
    return (
      <div className="card-inner card-inner-centered">
        <h1 className="card-title card-title-xl">The<br />Pitch</h1>
      </div>
    )
  }

  if (card.type === 'disclaimer') {
    return (
      <div className="card-inner card-inner-centered">
        <p className="disclaimer-label">⚠️ Disclaimer</p>
        <p className="disclaimer-warning">Warning</p>
        <p className="disclaimer-body">
          This presentation may cause unexpected smiling.<br />
          Viewer discretion is advised.
        </p>
      </div>
    )
  }

  if (card.type === 'wait') {
    return (
      <div className="card-inner card-inner-centered">
        <div className="slide-wait-content">
          <p className="slide-main-text">{card.text}</p>
          <div className="slide-gap" />
          <p className="wait-1">wait</p>
          <p className="wait-2">wait</p>
          <p className="wait-3">wait</p>
        </div>
      </div>
    )
  }

  // plain
  return (
    <div className="card-inner card-inner-centered">
      <p className="plain-text">{card.text}</p>
    </div>
  )
}

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin')
  const dragStartX = useRef(0)
  const dragDeltaX = useRef(0)

  useSession(activeIndex, cards.length)

  useEffect(() => {
    const handler = () => setIsAdmin(window.location.hash === '#admin')
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  if (isAdmin) return <AdminPage />

  const goTo = (index: number) => {
    if (index >= 0 && index < cards.length) setActiveIndex(index)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    dragStartX.current = e.clientX
    dragDeltaX.current = 0
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    dragDeltaX.current = e.clientX - dragStartX.current
  }
  const onPointerUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    if (dragDeltaX.current < -60) goTo(activeIndex + 1)
    else if (dragDeltaX.current > 60) goTo(activeIndex - 1)
    dragDeltaX.current = 0
  }

  const card = cards[activeIndex]

  return (
    <>
      <div className="desktop-gate">
        <div className="gate-card">
          <span className="gate-emoji">💕</span>
          <h2 className="gate-title">Made for Mobile</h2>
          <p className="gate-text">Open on your phone or resize the browser under 430 px to feel the love.</p>
        </div>
      </div>

      <div className="mobile-app">
        <div
          className="card-viewport"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {cards.map((c, i) => {
            const offset = i - activeIndex
            if (offset <= 0 || offset > 2) return null
            return (
              <div
                key={c.id}
                className="card-peek"
                style={{
                  '--peek-grad': c.peek,
                  '--peek-offset': `${offset * 12}px`,
                  '--peek-scale': `${1 - offset * 0.05}`,
                } as React.CSSProperties}
              />
            )
          })}

          <div
            key={card.id}
            className="card-main"
            style={{ '--card-grad': card.gradient } as React.CSSProperties}
          >
            <div className="card-glow" />
            <div className="card-orb card-orb-1" />
            <div className="card-orb card-orb-2" />

            <CardContent card={card} />

            <button className="arrow-overlay arrow-left" onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0} aria-label="Previous">‹</button>
            <button className="arrow-overlay arrow-right" onClick={() => goTo(activeIndex + 1)} disabled={activeIndex === cards.length - 1} aria-label="Next">›</button>
          </div>
        </div>

        <div className="bottom-dots">
          {cards.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === activeIndex ? 'dot-active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Card ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  )
}
