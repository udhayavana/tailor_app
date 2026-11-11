import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { registerAccount } from '../services/authService.js'

function ProfileRegistrationForm({ countryCode, phoneNumber }) {
  const { setToken, setUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    address: '',
    alternateCountryCode: '+91',
    alternatePhone: '',
  })
  const [status, setStatus] = useState({ loading: false, error: '' })

  function updateField(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
    setStatus((currentStatus) => ({ ...currentStatus, error: '' }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus({ loading: true, error: '' })

    try {
      const account = await registerAccount({
        ...form,
        countryCode,
        phoneNumber,
      })
      setUser(account)
      setToken('dummy-access-token')
      navigate('/home', { replace: true })
    } catch (error) {
      setStatus({ loading: false, error: error.message })
    }
  }

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <label className="profile-input-row">
        <span className="profile-field-icon" aria-hidden="true">♙</span>
        <span className="visually-hidden">Full name</span>
        <input
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="Full Name"
          value={form.fullName}
          onChange={updateField}
          required
        />
      </label>

      <label className="profile-input-row address-row">
        <span className="profile-field-icon" aria-hidden="true">⌖</span>
        <span className="visually-hidden">Address</span>
        <textarea
          name="address"
          autoComplete="street-address"
          placeholder="Address"
          value={form.address}
          onChange={updateField}
          required
        />
      </label>

      <div className="phone-input alternate-phone">
        <span className="profile-field-icon" aria-hidden="true">⌕</span>
        <label className="visually-hidden" htmlFor="alternate-country-code">Alternate phone country code</label>
        <select
          id="alternate-country-code"
          name="alternateCountryCode"
          value={form.alternateCountryCode}
          onChange={updateField}
          aria-label="Alternate phone country code"
        >
          <option value="+91">🇮🇳 +91</option>
          <option value="+1">🇺🇸 +1</option>
          <option value="+44">🇬🇧 +44</option>
        </select>
        <label className="visually-hidden" htmlFor="alternate-mobile">Alternate mobile number</label>
        <input
          id="alternate-mobile"
          name="alternatePhone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="Alternate Mobile No."
          value={form.alternatePhone}
          onChange={updateField}
          pattern="[0-9]{7,15}"
          maxLength={15}
        />
      </div>

      <button className="create-profile-button" type="submit" disabled={status.loading}>
        {status.loading ? 'Creating…' : 'Create Profile'}
      </button>
      {status.error && <p className="form-error" role="alert">{status.error}</p>}
    </form>
  )
}

export default ProfileRegistrationForm
