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
 * Ред'юсер форми «Нове замовлення». Отримує чернетку й дію, повертає нову
 * чернетку.
 */
export function draftReducer(state, action) {
  switch (action.type) {
    case 'customer_changed':
      return {
        ...state,
        customerName: action.name,
      }

    case 'drink_added':
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: action.id,
            drink: action.drink,
            size: 'M',
            milk: defaultMilk(action.drink),
            syrups: [],
          },
        ],
      }

    case 'size_chosen':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.itemId ? { ...item, size: action.size } : item,
        ),
      }

    case 'milk_chosen':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.itemId ? { ...item, milk: action.milk } : item,
        ),
      }

    case 'syrup_toggled':
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id !== action.itemId) return item
          const syrups = item.syrups.includes(action.syrup)
            ? item.syrups.filter((s) => s !== action.syrup)
            : [...item.syrups, action.syrup]
          return { ...item, syrups }
        }),
      }

    case 'item_removed':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.itemId),
      }

    case 'draft_cleared':
      return emptyDraft

    default:
      throw new Error(`Unknown draft action: ${action.type}`)
  }
}