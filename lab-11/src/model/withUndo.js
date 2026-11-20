export function createHistory(present) {
  return {
    past: [],
    present,
    future: [],
  }
}

export function withUndo(reducer, limit = 20) {
  return function undoableReducer(history, action) {
    const { past, present, future } = history

    switch (action.type) {
      case 'undo': {
        if (past.length === 0) return history
        const previous = past[past.length - 1]
        const nextPast = past.slice(0, -1)
        return {
          past: nextPast,
          present: previous,
          future: [present, ...future],
        }
      }

      case 'redo': {
        if (future.length === 0) return history
        const [next, ...nextFuture] = future
        const nextPast = [...past, present].slice(-limit)
        return {
          past: nextPast,
          present: next,
          future: nextFuture,
        }
      }

      default: {
        const nextPresent = reducer(present, action)
        if (nextPresent === present) return history

        const nextPast =
          limit > 0 ? [...past, present].slice(-limit) : []

        return {
          past: nextPast,
          present: nextPresent,
          future: [],
        }
      }
    }
  }
}