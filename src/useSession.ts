import { useEffect, useRef } from 'react'
import { doc, setDoc, arrayUnion, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

export async function recordResponse(response: 'yes' | 'ask_again') {
  const id = localStorage.getItem('prop_session_id')
  if (!id) return
  await setDoc(doc(db, 'sessions', id), {
    response,
    respondedAt: serverTimestamp(),
  }, { merge: true }).catch(err => console.error('[session] response write failed:', err.code))
}

function getSessionId(): string {
  let id = localStorage.getItem('prop_session_id')
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    localStorage.setItem('prop_session_id', id)
  }
  return id
}

function getDeviceInfo(): string {
  const ua = navigator.userAgent
  if (/iPhone/.test(ua)) return 'iPhone'
  if (/iPad/.test(ua)) return 'iPad'
  if (/Android/.test(ua)) return 'Android'
  if (/Windows/.test(ua)) return 'Windows'
  if (/Mac/.test(ua)) return 'Mac'
  return 'Unknown Device'
}

function getBrowser(): string {
  const ua = navigator.userAgent
  if (/Chrome/.test(ua) && !/Edge/.test(ua)) return 'Chrome'
  if (/Safari/.test(ua) && !/Chrome/.test(ua)) return 'Safari'
  if (/Firefox/.test(ua)) return 'Firefox'
  if (/Edge/.test(ua)) return 'Edge'
  return 'Browser'
}

export function useSession(activeIndex: number, totalSlides: number, enabled: boolean) {
  const sessionId = useRef(getSessionId())
  const maxReached = useRef(0)
  const isFirstWrite = useRef(true)

  useEffect(() => {
    if (!enabled) return

    const slideNum = activeIndex + 1
    if (slideNum > maxReached.current) maxReached.current = slideNum

    const device = `${getDeviceInfo()} · ${getBrowser()}`

    const payload: Record<string, unknown> = {
      device,
      updatedAt: serverTimestamp(),
      lastSlide: slideNum,
      maxSlide: maxReached.current,
      totalSlides,
      slideHistory: arrayUnion({ slide: slideNum, seenAt: new Date().toISOString() }),
    }

    // Always set startedAt on first write of this session (regardless of slide)
    if (isFirstWrite.current) {
      payload.startedAt = serverTimestamp()
      isFirstWrite.current = false
    }

    setDoc(doc(db, 'sessions', sessionId.current), payload, { merge: true })
      .catch(err => console.error('[session] write failed — check Firestore rules:', err.code, err.message))
  }, [activeIndex, totalSlides, enabled])
}
