import { bookingSchema } from './bookingSchema.js'
import { describeBooking } from './describeBooking.js'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function sendBooking(booking) {
  console.info('Сервер отримав бронювання:', booking)
  await wait(1000)

  let validData
  try {
    validData = await bookingSchema.validate(booking, { abortEarly: false })
  } catch {
    return { ok: false, message: 'Сервер не прийняв дані: перевірте форму.' }
  }

  if (validData.time === '19:00') {
    return {
      ok: false,
      message: 'На 19:00 вільних столиків немає. Оберіть інший час.',
    }
  }
  return { ok: true, message: describeBooking(validData) }
}

export async function subscribe(email) {
  await wait(1000)
  if (email.endsWith('@example.com')) {
    return { ok: false, message: 'Ця адреса вже підписана.', email }
  }
  return { ok: true, message: `Готово: новини надходитимуть на ${email}.` }
}
