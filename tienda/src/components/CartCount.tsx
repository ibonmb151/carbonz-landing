'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cart-store'

/**
 * Client-only cart badge that reads from localStorage AFTER hydration.
 * Renders 0 on server, updates to real count on client.
 * Uses suppressHydrationWarning as extra safety.
 */
export function CartBadge({ className = '' }: { className?: string }) {
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Read initial count from store (already hydrated from localStorage)
    const initialCount = useCart.getState().items.reduce(
      (sum, item) => sum + item.quantity,
      0
    )
    setCount(initialCount)

    // Subscribe to future changes
    const unsub = useCart.subscribe((state) => {
      const newCount = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      )
      setCount(newCount)
    })

    return unsub
  }, [])

  // During SSR and before hydration, render hidden with count 0
  const visible = mounted && count > 0

  return (
    <span
      className={`${className}${visible ? ' visible' : ''}`}
      suppressHydrationWarning
    >
      {count}
    </span>
  )
}
