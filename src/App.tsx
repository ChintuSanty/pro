import { useState, useRef, useEffect, useCallback } from 'react'
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
    id: 1, type: 'title', text: 'Project Coffee ☕',
    gradient: 'linear-gradient(160deg, #ff6b9d 0%, #c44569 50%, #8b2252 100%)',
    peek: 'linear-gradient(160deg, #ff8fab, #d63384)',
  },
  {
    id: 2, type: 'disclaimer', text: "DISCLAIMER: I built a whole slideshow for this. Yes, I'm that guy. No, I don't regret it. Please don't close the tab.",
    gradient: 'linear-gradient(160deg, #f9a825 0%, #e91e8c 55%, #7b1fa2 100%)',
    peek: 'linear-gradient(160deg, #fce4ec, #e91e8c)',
  },
  {
    id: 3, type: 'plain', text: "Okay so. I wasn't supposed to feel this way. I had absolutely zero plans for this. And then you happened. Very rude of you, honestly.",
    gradient: 'linear-gradient(160deg, #f48fb1 0%, #ad1457 55%, #560027 100%)',
    peek: 'linear-gradient(160deg, #fce4ec, #f06292)',
  },
  {
    id: 4, type: 'wait', text: "I like you. Said it. Universe heard it. No ctrl+Z on this one.",
    gradient: 'linear-gradient(160deg, #9c27b0 0%, #4a148c 55%, #1a0030 100%)',
    peek: 'linear-gradient(160deg, #ce93d8, #7b1fa2)',
  },
  {
    id: 5, type: 'plain', text: "Before you panic — this is not a proposal. This is coffee. Possibly two or more coffees. Relax. I'm not that far into the questline yet.",
    gradient: 'linear-gradient(160deg, #ff8a80 0%, #e53935 55%, #7f0000 100%)',
    peek: 'linear-gradient(160deg, #ffcdd2, #ef9a9a)',
  },
  {
    id: 6, type: 'plain', text: "I'm into you more than I budgeted for. This was not in the roadmap. You basically shipped yourself into my life without a changelog and now I'm dealing with the consequences.",
    gradient: 'linear-gradient(160deg, #e91e63 0%, #9c27b0 55%, #4a148c 100%)',
    peek: 'linear-gradient(160deg, #f48fb1, #ce93d8)',
  },
  {
    id: 7, type: 'plain', text: "And your eyes. I don't know how to explain it but I could just… stop. Get completely lost in them. Like I forget what I was even saying. Which, if you know me, is saying a lot.",
    gradient: 'linear-gradient(160deg, #c2185b 0%, #7b1fa2 55%, #311b92 100%)',
    peek: 'linear-gradient(160deg, #f06292, #ba68c8)',
  },
  {
    id: 8, type: 'plain', text: "I don't NEED to know you. I'll survive either way — I have games, I have a very full schedule of doing nothing. But I want to know you. That want is loud and it's annoying and it's very much there.",
    gradient: 'linear-gradient(160deg, #880e4f 0%, #4a148c 55%, #1a0030 100%)',
    peek: 'linear-gradient(160deg, #f48fb1, #9c27b0)',
  },
  {
    id: 9, type: 'wait', text: "And I'm not rushing anything. Zero pressure. I'm the most patient guy you'll ever meet. (I waited for hours once I'm into something or someone.)",
    gradient: 'linear-gradient(160deg, #9c27b0 0%, #512da8 55%, #1a0030 100%)',
    peek: 'linear-gradient(160deg, #ba68c8, #7986cb)',
  },
  {
    id: 10, type: 'plain', text: "Is my situation perfect right now? Lol, no. Am I still here making a whole presentation about my feelings? Yes. Make of that what you will.",
    gradient: 'linear-gradient(160deg, #c62828 0%, #6a1b9a 55%, #1a0030 100%)',
    peek: 'linear-gradient(160deg, #ef9a9a, #ce93d8)',
  },
  {
    id: 11, type: 'plain', text: "I know you've got like 300% valid reasons to say no. I've thought of most of them myself. And I'm still here. That's not desperation — that's just me being very sure about something for once.",
    gradient: 'linear-gradient(160deg, #d81b60 0%, #6a1b9a 55%, #1a0030 100%)',
    peek: 'linear-gradient(160deg, #f06292, #ab47bc)',
  },
  {
    id: 12, type: 'plain', text: "So here's why you should say yes — and yes, I made a list, because I'm that guy:\n\n☕ Worst case? Great coffee and zero awkwardness because I'm genuinely fun to talk to.\n🎮 I will absolutely let you win. Sometimes. Okay rarely. But the offer stands.\n🫂 I'm loyal to a fault. When I'm in, I'm in. No fine print.\n😂 I will make you laugh. Not on purpose always, but still — it counts.\n👀 I promise to always look at you like you're worth getting lost in. Because you are.",
    gradient: 'linear-gradient(160deg, #e53935 0%, #8e24aa 55%, #1a0030 100%)',
    peek: 'linear-gradient(160deg, #ef9a9a, #ba68c8)',
  },
  {
    id: 13, type: 'wait', text: "People who say yes to the unexpected thing always have better stories. The best ones start with 'I almost didn't, but…'",
    gradient: 'linear-gradient(160deg, #6a1b9a 0%, #1565c0 55%, #0d0030 100%)',
    peek: 'linear-gradient(160deg, #ba68c8, #64b5f6)',
  },
  {
    id: 14, type: 'plain', text: "All I'm asking for is a shot. Slow. Honest. No pressure. One coffee, real conversation, and let's just see what happens. The worst case is genuinely not that bad.",
    gradient: 'linear-gradient(160deg, #c2185b 0%, #6a1b9a 55%, #1a0030 100%)',
    peek: 'linear-gradient(160deg, #f48fb1, #ce93d8)',
  },
  {
    id: 15, type: 'plain', text: "So this is me. Santy. Gamer, occasional menace — asking you out. Not because I had to. Because I really, genuinely wanted to.",
    gradient: 'linear-gradient(160deg, #e91e63 0%, #7b1fa2 55%, #1a0030 100%)',
    peek: 'linear-gradient(160deg, #f48fb1, #ab47bc)',
  },
  {
    id: 16, type: 'plain', text: "So… what do you say? ☕",
    gradient: 'linear-gradient(160deg, #ff6b9d 0%, #c44569 50%, #8b2252 100%)',
    peek: 'linear-gradient(160deg, #ff8fab, #f48fb1)',
  },
]

/* ── Character mascot ── */
function Character({ show, onFlip }: { show: boolean; onFlip: boolean }) {
  const [bubble, setBubble] = useState(false)
  const [bubbleText, setBubbleText] = useState('stay till the end! 👀')
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const showBubble = useCallback((text?: string) => {
    if (text) setBubbleText(text)
    setBubble(true)
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current)
    bubbleTimerRef.current = setTimeout(() => setBubble(false), 3500)
  }, [])

  useEffect(() => {
    if (!show) return
    // Initial pop-in bubble
    const init = setTimeout(() => showBubble('stay till the end! 👀'), 800)
    // Repeat every 20s
    intervalRef.current = setInterval(() => {
      const msgs = [
        'stay till the end! 👀',
        "don't swipe away 🙏",
        'it gets better, promise ☕',
        'almost there... 👀',
        "you're still here 🥹",
      ]
      showBubble(msgs[Math.floor(Math.random() * msgs.length)])
    }, 20000)
    return () => {
      clearTimeout(init)
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current)
    }
  }, [show, showBubble])

  if (!show) return null

  return (
    <div className={`character-wrap ${onFlip ? 'character-flip' : ''}`}>
      {bubble && (
        <div className="speech-bubble animate-bubble">
          {bubbleText}
        </div>
      )}
      <img
        src="/santy_pixel_1.png"
        alt="Santy"
        className="character-img"
        onClick={() => showBubble('hey! eyes on the slides 😄')}
      />
    </div>
  )
}

/* ── Card content ── */
function CardContent({ card }: { card: Card }) {
  if (card.type === 'title') {
    return (
      <div className="card-inner card-inner-centered">
        <h1 className="card-title card-title-xl">{card.text}</h1>
      </div>
    )
  }
  if (card.type === 'disclaimer') {
    return (
      <div className="card-inner card-inner-centered">
        <p className="disclaimer-label">⚠️ Disclaimer</p>
        <p className="disclaimer-warning">Warning</p>
        <p className="disclaimer-body">{card.text}</p>
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
  return (
    <div className="card-inner card-inner-centered">
      <p className="plain-text" style={{ whiteSpace: 'pre-line' }}>{card.text}</p>
    </div>
  )
}

/* ── Main app ── */
export default function App() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin')
  const [flipping, setFlipping] = useState(false)
  const [flipDir, setFlipDir] = useState<'left' | 'right'>('left')
  const [characterFlip, setCharacterFlip] = useState(false)
  const dragStartX = useRef(0)
  const isDragging = useRef(false)

  useSession(activeIndex, cards.length)

  useEffect(() => {
    const handler = () => setIsAdmin(window.location.hash === '#admin')
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= cards.length || flipping) return
    const dir = index > activeIndex ? 'left' : 'right'
    setFlipDir(dir)
    setFlipping(true)
    setCharacterFlip(true)
    setTimeout(() => {
      setActiveIndex(index)
      setFlipping(false)
      setTimeout(() => setCharacterFlip(false), 400)
    }, 420)
  }, [activeIndex, flipping])

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true
    dragStartX.current = e.clientX
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    isDragging.current = false
    const delta = e.clientX - dragStartX.current
    if (delta < -60) goTo(activeIndex + 1)
    else if (delta > 60) goTo(activeIndex - 1)
  }

  if (isAdmin) return <AdminPage />

  const card = cards[activeIndex]
  const showCharacter = activeIndex >= 2   // appears from slide 3 onward

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
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* Peek cards */}
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

          {/* Active card with page-flip */}
          <div
            className={`card-main ${flipping ? `flip-${flipDir}` : ''}`}
            style={{ '--card-grad': card.gradient } as React.CSSProperties}
          >
            <div className="card-glow" />
            <div className="card-orb card-orb-1" />
            <div className="card-orb card-orb-2" />
            <CardContent card={card} />

            <button className="arrow-overlay arrow-left"  onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0}>‹</button>
            <button className="arrow-overlay arrow-right" onClick={() => goTo(activeIndex + 1)} disabled={activeIndex === cards.length - 1}>›</button>
          </div>

          {/* Character */}
          <Character show={showCharacter} onFlip={characterFlip} />
        </div>

        {/* Dots */}
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
