import { produce } from 'immer'
import { defaultMilk } from '../data/menu.js'

/**
 * Чернетка нового замовлення — стан форми «Нове замовлення»:
 *   { customerName: 'Оля', items: [{ id, drink, size, milk, syrups }] }
 * customerName — текст поля «Ім'я гостя», items — додані напої.
 *
 * Порожня чернетка заморожена (Object.freeze), як і її масив items:
 * ред'юсер не може її змінити, лише повернути нову чернетку.
 */
export const emptyDraft = Object.freeze({
  customerName: '',
  items: Object.freeze([]),
})

/**
 * Ред'юсер форми «Нове замовлення» на Immer (curried producer).
 * Отримує чернетку й дію, повертає нову чернетку.
 */
export const draftReducer = produce((draft, action) => {
  switch (action.type) {
    case 'customer_changed':
      draft.customerName = action.name
      break

    case 'drink_added':
      draft.items.push({
        id: action.id,
        drink: action.drink,
        size: 'M',
        milk: defaultMilk(action.drink),
        syrups: [],
      })
      break

    case 'size_chosen': {
      const item = draft.items.find((i) => i.id === action.itemId)
      if (item) item.size = action.size
      break
    }

    case 'milk_chosen': {
      const item = draft.items.find((i) => i.id === action.itemId)
      if (item) item.milk = action.milk
      break
    }

    case 'syrup_toggled': {
      const item = draft.items.find((i) => i.id === action.itemId)
      if (!item) break
      const index = item.syrups.indexOf(action.syrup)
      if (index === -1) {
        item.syrups.push(action.syrup)
      } else {
        item.syrups.splice(index, 1)
      }
      break
    }

    case 'item_removed': {
      const index = draft.items.findIndex((i) => i.id === action.itemId)
      if (index !== -1) draft.items.splice(index, 1)
      break
    }

    case 'draft_cleared':
      return emptyDraft

    default:
      throw new Error(`Unknown draft action: ${action.type}`)
  }
})
