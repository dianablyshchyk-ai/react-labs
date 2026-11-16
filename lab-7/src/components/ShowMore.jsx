import { useState } from 'react'

/**
 * Показує перші `step` елементів з `items` і кнопку, що показує наступні.
 *
 * Використання:
 *   <ShowMore items={reviews} step={3}>
 *     {(visibleItems) => <ul>…</ul>}
 *   </ShowMore>
 *
 * Вимоги — у тестах tests/ShowMore.test.jsx.
 */
export default function ShowMore({ items, step, children }) {
  const [count, setCount] = useState(step)
  const visibleItems = items.slice(0, count)
  const hiddenCount = items.length - visibleItems.length
  const canToggle = items.length > step

  return (
    <>
      {children(visibleItems)}
      {canToggle && (
        <button
          type="button"
          className="show-more"
          onClick={() =>
            setCount(hiddenCount > 0 ? count + step : step)
          }
        >
          {hiddenCount > 0
            ? `Показати ще ${Math.min(step, hiddenCount)}`
            : 'Згорнути'}
        </button>
      )}
    </>
  )
}