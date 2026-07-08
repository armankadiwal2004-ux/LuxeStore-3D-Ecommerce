import { useState, useEffect, useCallback } from 'react'
import { debounce } from 'lodash'

// Debounced search hook
export function useDebounceSearch(delay = 300) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const debouncedSet = useCallback(
    debounce((val) => setDebouncedQuery(val), delay),
    [delay]
  )

  useEffect(() => {
    debouncedSet(query)
    return () => debouncedSet.cancel()
  }, [query, debouncedSet])

  return { query, setQuery, debouncedQuery }
}

// Mouse position hook for cursor glow
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e) => setPosition({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return position
}

// Intersection observer for lazy animations
export function useInView(options = {}) {
  const [ref, setRef] = useState(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!ref) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        observer.disconnect()
      }
    }, { threshold: 0.1, ...options })
    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref])

  return [setRef, inView]
}
