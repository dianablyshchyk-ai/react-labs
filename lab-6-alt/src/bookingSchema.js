import * as yup from 'yup'

const pad = (n) => String(n).padStart(2, '0')

// Сьогоднішня дата й поточний час у місцевому часовому поясі, у форматах
// <input type="date"> («2026-11-14») і <input type="time"> («18:30»).
// Такі рядки можна порівнювати як рядки.
export function today() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function nowTime() {
  const d = new Date()
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export const bookingSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Вкажіть ім'я: щонайменше дві літери")
    .min(2, "Вкажіть ім'я: щонайменше дві літери"),
  phone: yup
    .string()
    .trim()
    .required('Вкажіть телефон у форматі +380XXXXXXXXX')
    .matches(/^\+380\d{9}$/, 'Вкажіть телефон у форматі +380XXXXXXXXX'),
  date: yup
    .string()
    .required('Оберіть дату')
    .test('not-past-date', 'Ця дата вже минула', (value) => {
      if (!value) return true
      return value >= today()
    }),
  time: yup
    .string()
    .required('Оберіть час')
    .test(
      'working-hours',
      'Столик можна забронювати з 8:00 до 20:00',
      (value) => {
        if (!value) return true
        return value >= '08:00' && value <= '20:00'
      },
    )
    .test('not-past-time', 'Цей час сьогодні вже минув', function (value) {
      const { date } = this.parent
      if (!value || !date) return true
      return date !== today() || value > nowTime()
    }),
  guests: yup
    .number()
    .typeError('Щонайменше 1 гість')
    .integer()
    .min(1, 'Щонайменше 1 гість')
    .max(8, 'Не більше 8 гостей')
    .required('Щонайменше 1 гість'),
  comment: yup
    .string()
    .trim()
    .max(200, 'Коментар — до 200 символів')
    .default(''),
})
