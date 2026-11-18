/**
 * Компонент вищого порядку (HOC): отримує компонент і повертає новий, який
 * рендерить `Component` з тими самими props, а під час кліку ще й надсилає
 * подію `event` в аналітику (`track` з src/analytics.js).
 *
 * Використання:
 *   const AddToCartButton = withAnalytics(Button, 'add_to_cart')
 *
 *   <AddToCartButton analyticsData={{ productId }} onClick={add}>
 *     Додати в кошик
 *   </AddToCartButton>
 *
 * Поки що повертає `Component` без змін. Вимоги — у тестах
 * tests/withAnalytics.test.jsx.
 */
import { track } from '../analytics.js'

export function withAnalytics(Component, event) {
  function WithAnalytics({ analyticsData, onClick, ...props }) {
    const handleClick = (clickEvent) => {
      track(event, analyticsData)
      onClick?.(clickEvent)
    }

    return <Component {...props} onClick={handleClick} />
  }

  const componentName = Component.displayName || Component.name || 'Component'
  WithAnalytics.displayName = `withAnalytics(${componentName})`

  return WithAnalytics
}