"use client"

import { useRef, useEffect, useCallback } from "react"

interface UseAutoScrollOptions {
  dependency: unknown
  threshold?: number
}

export function useAutoScroll({ dependency, threshold = 50 }: UseAutoScrollOptions) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isManualRef = useRef(false)

  const scrollToBottom = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [])

  // Auto-scroll when content changes, unless user scrolled up manually
  useEffect(() => {
    if (!isManualRef.current) {
      scrollToBottom()
    }
  }, [dependency, scrollToBottom])

  // Detect manual scroll
  const handleScroll = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    isManualRef.current = distanceFromBottom > threshold
  }, [threshold])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  return { containerRef, scrollToBottom }
}
