import { startTransition, useActionState, useRef } from 'react'
import { useFormik } from 'formik'
import GuestsStepper from './GuestsStepper.jsx'
import { bookingSchema } from '../bookingSchema.js'
import { sendBooking } from '../api.js'

const initialValues = {
  name: '',
  phone: '',
  date: '',
  time: '',
  guests: 2,
  comment: '',
}

export default function BookingForm() {
  const formRef = useRef(null)
  const [result, dispatch, isPending] = useActionState(bookTable, null)

  const formik = useFormik({
    initialValues,
    validationSchema: bookingSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      if (isPending) return
      startTransition(() => dispatch(values))
    },
  })

  async function bookTable(previousResult, booking) {
    if (booking === null) return null
    const response = await sendBooking(booking)
    if (response.ok) startTransition(() => formik.resetForm())
    return response
  }

  async function handleFormSubmit(e) {
    e.preventDefault()
    const errors = await formik.validateForm()
    formik.handleSubmit(e)
    if (Object.keys(errors).length > 0) {
      const firstField = Object.keys(errors)[0]
      formRef.current?.elements[firstField]?.focus()
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.currentTarget.requestSubmit()
    }
  }

  function handleReset() {
    formRef.current?.elements.name?.focus()
    formik.resetForm()
    startTransition(() => dispatch(null))
  }

  const showError = (field) =>
    Boolean(formik.touched[field] && formik.errors[field])

  return (
    <form
      ref={formRef}
      className="booking-form"
      noValidate
      onSubmit={handleFormSubmit}
      onKeyDown={handleKeyDown}
    >
      <div className="field">
        <label>
          Ім'я
          <input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autoComplete="name"
            required
            aria-invalid={showError('name') ? 'true' : 'false'}
            aria-describedby="name-error"
          />
        </label>
        <p id="name-error" className="field-error">
          {showError('name') ? formik.errors.name : ''}
        </p>
      </div>
      <div className="field">
        <label>
          Телефон
          <input
            type="tel"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autoComplete="tel"
            placeholder="+380671234567"
            required
            aria-invalid={showError('phone') ? 'true' : 'false'}
            aria-describedby="phone-error"
          />
        </label>
        <p id="phone-error" className="field-error">
          {showError('phone') ? formik.errors.phone : ''}
        </p>
      </div>
      <div className="row">
        <div className="field">
          <label>
            Дата
            <input
              type="date"
              name="date"
              value={formik.values.date}
              onChange={(e) => {
                formik.handleChange(e)
                if (formik.values.time) {
                  formik.setFieldTouched('time', true, true)
                }
              }}
              onBlur={formik.handleBlur}
              required
              aria-invalid={showError('date') ? 'true' : 'false'}
              aria-describedby="date-error"
            />
          </label>
          <p id="date-error" className="field-error">
            {showError('date') ? formik.errors.date : ''}
          </p>
        </div>
        <div className="field">
          <label>
            Час
            <input
              type="time"
              name="time"
              value={formik.values.time}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              aria-invalid={showError('time') ? 'true' : 'false'}
              aria-describedby="time-error"
            />
          </label>
          <p id="time-error" className="field-error">
            {showError('time') ? formik.errors.time : ''}
          </p>
        </div>
      </div>
      <GuestsStepper
        value={formik.values.guests}
        onChange={(val) => formik.setFieldValue('guests', val)}
      />
      <label>
        Коментар
        <textarea
          name="comment"
          value={formik.values.comment}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          maxLength={200}
          aria-describedby="comment-counter"
        />
      </label>
      <p id="comment-counter" className="counter">
        {formik.values.comment.length} / 200
      </p>
      <div className="actions">
        <button type="submit" aria-disabled={isPending}>
          {isPending ? 'Надсилаємо…' : 'Забронювати'}
        </button>
        <button type="button" onClick={handleReset}>
          Очистити
        </button>
      </div>
      <p
        role="status"
        className={result?.ok === false ? 'status error' : 'status'}
      >
        {result?.message}
      </p>
    </form>
  )
}
