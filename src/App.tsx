import { useState } from 'react'
import './App.css'

type FormData = {
  nationalId: string
  phone: string
}

type Errors = {
  nationalId?: string
  phone?: string
}

const STORAGE_KEY = 'registration-form'

const nationalIdRegex = /^\d{10}$/
const phoneRegex = /^05\d{8}$/

function getSavedForm(): FormData {
  const saved = sessionStorage.getItem(STORAGE_KEY)

  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      return {
        nationalId: '',
        phone: '',
      }
    }
  }

  return {
    nationalId: '',
    phone: '',
  }
}

function App() {
  const [form, setForm] = useState<FormData>(getSavedForm)
  const [errors, setErrors] = useState<Errors>({})
  const [success, setSuccess] = useState(false)

  const handleChange = (field: keyof FormData, value: string) => {
    const numericValue = value.replace(/\D/g, '')
  
    const updatedForm = {
      ...form,
      [field]: numericValue,
    }

    setForm(updatedForm)

    // Save form data in the current browser session
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedForm))

    setErrors({
      ...errors,
      [field]: undefined,
    })

    setSuccess(false)
  }

  const validateForm = () => {
    const newErrors: Errors = {}

    if (!nationalIdRegex.test(form.nationalId)) {
      newErrors.nationalId =
        'National ID must contain exactly 10 digits.'
    }

    if (!phoneRegex.test(form.phone)) {
      newErrors.phone =
        'Phone number must start with 05 and contain 10 digits.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    // Simulate successful dispatch
    console.log('Submitted data:', form)

    // Clear cached session data after successful dispatch
    sessionStorage.removeItem(STORAGE_KEY)

    setForm({
      nationalId: '',
      phone: '',
    })

    setErrors({})
    setSuccess(true)
  }

  return (
    <div className="page">
      <div className="form-card">
        <h1>Registration Form</h1>

        <p className="description">
          Your information is temporarily saved during this session.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="nationalId">National ID</label>

            <input
              id="nationalId"
              type="text"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter National ID"
              value={form.nationalId}
              onChange={(event) =>
                handleChange('nationalId', event.target.value)
              }
            />

            {errors.nationalId && (
              <span className="error">{errors.nationalId}</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="phone">Mobile Number</label>

            <input
              id="phone"
              type="text"
              inputMode="numeric"
              maxLength={10}
              placeholder="05XXXXXXXX"
              value={form.phone}
              onChange={(event) =>
                handleChange('phone', event.target.value)
              }
            />

            {errors.phone && (
              <span className="error">{errors.phone}</span>
            )}
          </div>

          <button type="submit">Submit</button>

          {success && (
            <div className="success">
              Form submitted successfully.
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default App