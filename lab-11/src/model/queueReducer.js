/**
 * Ред'юсер черги замовлень.
 *
 * Стан: { orders: [...], lastNumber }. Кожне замовлення — як у src/data/orders.js:
 *   { id, number, status, customer: { id, name }, items: [...] }
 * status — колонка на дошці: 'new' («Нові»), 'brewing' («Готуються»),
 * 'ready' («Готові») або 'served' («Видані»).
 */

const nextStatus = { new: 'brewing', brewing: 'ready', ready: 'served' }

export function createInitialState(orders) {
  const lastNumber =
    orders.length > 0 ? Math.max(...orders.map((order) => order.number)) : 0
  return { orders, lastNumber }
}

export function queueReducer(state, action) {
  switch (action.type) {
    case 'order_placed': {
      const nextNumber = state.lastNumber + 1
      const order = {
        ...action.order,
        number: nextNumber,
        status: 'new',
        items: action.order.items.map((item) => ({ ...item, done: false })),
      }
      return {
        ...state,
        lastNumber: nextNumber,
        orders: [...state.orders, order],
      }
    }

    case 'item_toggled': {
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.orderId
            ? {
                ...order,
                items: order.items.map((item) =>
                  item.id === action.itemId
                    ? { ...item, done: !item.done }
                    : item,
                ),
              }
            : order,
        ),
      }
    }

    case 'order_advanced': {
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.orderId
            ? { ...order, status: nextStatus[order.status] }
            : order,
        ),
      }
    }

    case 'order_cancelled': {
      return {
        ...state,
        orders: state.orders.filter((order) => order.id !== action.orderId),
      }
    }

    case 'customer_renamed': {
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.customer.id === action.customerId
            ? {
                ...order,
                customer: { ...order.customer, name: action.name },
              }
            : order,
        ),
      }
    }

    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}


export function selectColumn(state, status) {
  return state.orders.filter((order) => order.status === status)
}

export function selectOrder(state, id) {
  return state.orders.find((order) => order.id === id)
}