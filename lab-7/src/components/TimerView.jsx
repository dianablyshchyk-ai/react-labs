/**
 * Простий (presentational) компонент таймера: лише показує те, що отримав у
 * props, і викликає передані обробники. Власного стану й ефектів не має.
 *
 * Використання:
 *   <TimerView
 *     method={method}
 *     secondsLeft={175}
 *     status="running"   // 'idle' | 'running' | 'paused' | 'done'
 *     onStart={…}
 *     onPause={…}
 *     onReset={…}
 *   />
 *
 * Вимоги — у тестах tests/TimerView.test.jsx.
 */
import { formatTime } from '../formatTime.js'

export default function TimerView({
  method,
  secondsLeft,
  status,
  onStart,
  onPause,
  onReset,
}) {
  let primaryLabel = 'Старт'
  let primaryHandler = onStart

  if (status === 'running') {
    primaryLabel = 'Пауза'
    primaryHandler = onPause
  } else if (status === 'paused') {
    primaryLabel = 'Продовжити'
    primaryHandler = onStart
  } else if (status === 'done') {
    primaryLabel = 'Спочатку'
    primaryHandler = onReset
  }

  const showReset = status === 'running' || status === 'paused'

  return (
    <article className="brew-timer" aria-labelledby={`${method.id}-title`}>
      <h3 id={`${method.id}-title`}>{method.name}</h3>
      <p>{method.recipe}</p>
      <p className="time" role="timer">
        {formatTime(secondsLeft)}
      </p>
      <div className="timer-controls">
        <button type="button" onClick={primaryHandler}>
          {primaryLabel}
        </button>
        {showReset && (
          <button type="button" onClick={onReset}>
            Скинути
          </button>
        )}
      </div>
      <p className="timer-done" role="status">
        {status === 'done' ? 'Готово! Час пити каву.' : ''}
      </p>
    </article>
  )
}
