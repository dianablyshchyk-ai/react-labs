import { useState } from 'react'

/**
 * Логіка «Показати ще» без розмітки.
 *
 * Використання:
 *   const { visibleItems, hiddenCount, showMore, collapse } = useShowMore(items, 4)
 *
 * Вимоги — у тестах tests/useShowMore.test.jsx.
 */
export function useShowMore(items, step = 3) {
  const [count, setCount] = useState(step)
  const visibleItems = items.slice(0, count)
  const hiddenCount = items.length - visibleItems.length

  const showMore = () => {
    setCount((prev) => Math.min(items.length, prev + step))
  }

  const collapse = () => {
    setCount(step)
  }

  return { visibleItems, hiddenCount, showMore, collapse }
}