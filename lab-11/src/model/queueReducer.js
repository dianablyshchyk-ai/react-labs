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
  const ordersById = {}
  const orderIds = []
  const customersById = {}
  const customerIds = []

  for (const order of orders) {
    const { customer, ...rest } = order
    ordersById[order.id] = {
      ...rest,
      customerId: customer.id,
    }
    orderIds.push(order.id)

    if (!customersById[customer.id]) {
      customersById[customer.id] = { ...customer }
      customerIds.push(customer.id)
    }
  }

  const lastNumber =
    orders.length > 0 ? Math.max(...orders.map((order) => order.number)) : 0

  return {
    orders: { byId: ordersById, ids: orderIds },
    customers: { byId: customersById, ids: customerIds },
    lastNumber,
  }
}

export function queueReducer(state, action) {
  switch (action.type) {
    case 'order_placed': {
      const nextNumber = state.lastNumber + 1
      const { id, customer, items } = action.order

      const order = {
        id,
        number: nextNumber,
        status: 'new',
        customerId: customer.id,
        items: items.map((item) => ({ ...item, done: false })),
      }

      const hasCustomer = Boolean(state.customers.byId[customer.id])
      const nextCustomers = hasCustomer
        ? state.customers
        : {
            byId: {
              ...state.customers.byId,
              [customer.id]: { id: customer.id, name: customer.name },
            },
            ids: [...state.customers.ids, customer.id],
          }

      return {
        ...state,
        lastNumber: nextNumber,
        orders: {
          byId: { ...state.orders.byId, [id]: order },
          ids: [...state.orders.ids, id],
        },
        customers: nextCustomers,
      }
    }

    case 'item_toggled': {
      const order = state.orders.byId[action.orderId]
      if (!order) return state

      return {
        ...state,
        orders: {
          ...state.orders,
          byId: {
            ...state.orders.byId,
            [action.orderId]: {
              ...order,
              items: order.items.map((item) =>
                item.id === action.itemId
                  ? { ...item, done: !item.done }
                  : item,
              ),
            },
          },
        },
      }
    }

    case 'order_advanced': {
      const order = state.orders.byId[action.orderId]
      if (!order) return state

      return {
        ...state,
        orders: {
          ...state.orders,
          byId: {
            ...state.orders.byId,
            [action.orderId]: {
              ...order,
              status: nextStatus[order.status],
            },
          },
        },
      }
    }

    case 'order_cancelled': {
      const { [action.orderId]: removed, ...remainingById } = state.orders.byId
      if (!removed) return state

      return {
        ...state,
        orders: {
          byId: remainingById,
          ids: state.orders.ids.filter((id) => id !== action.orderId),
        },
      }
    }

    case 'customer_renamed': {
      const customer = state.customers.byId[action.customerId]
      if (!customer) return state

      return {
        ...state,
        customers: {
          ...state.customers,
          byId: {
            ...state.customers.byId,
            [action.customerId]: {
              ...customer,
              name: action.name,
            },
          },
        },
      }
    }

    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

function denormalizeOrder(state, order) {
  const { customerId, ...rest } = order
  return {
    ...rest,
    customer: state.customers.byId[customerId],
  }
}

export function selectColumn(state, status) {
  return state.orders.ids
    .map((id) => state.orders.byId[id])
    .filter((order) => order.status === status)
    .map((order) => denormalizeOrder(state, order))
}

export function selectOrder(state, id) {
  const order = state.orders.byId[id]
  if (!order) return undefined
  return denormalizeOrder(state, order)
}
