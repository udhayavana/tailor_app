import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { findAccount } from '../services/authService.js'

function LoginForm() {
  const { setToken, setUser } = useAuth()
  const navigate = useNavigate()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [status, setStatus] = useState({ loading: false, error: '' })

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus({ loading: true, error: '' })

    try {
      const account = await findAccount(countryCode, phoneNumber)

      if (account) {
        setUser(account)
        setToken('dummy-access-token')
        navigate('/home', { replace: true })
        return
      }

      navigate('/register', {
        state: { countryCode, phoneNumber },
      })
    } catch (error) {
      setStatus({ loading: false, error: error.message })
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="phone-input">
        <label className="visually-hidden" htmlFor="country-code">Country code</label>
        <select
          id="country-code"
          value={countryCode}
          onChange={(event) => setCountryCode(event.target.value)}
          aria-label="Country calling code"
        >
          <option value="+91">🇮🇳 &nbsp; +91</option>
          <option value="+1">🇺🇸 &nbsp; +1</option>
          <option value="+44">🇬🇧 &nbsp; +44</option>
        </select>
        <label className="visually-hidden" htmlFor="mobile-number">Mobile number</label>
        <input
          id="mobile-number"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="Mobile Number"
          value={phoneNumber}
          onChange={(event) => {
            setPhoneNumber(event.target.value)
            setStatus({ loading: false, error: '' })
          }}
          pattern="[0-9]{7,15}"
          maxLength={15}
          required
        />
      </div>
      <button className="sign-in-button" type="submit" disabled={status.loading}>
        {status.loading ? 'Checking…' : 'Sign In'}
      </button>
      {status.error && <p className="form-error" role="alert">{status.error}</p>}
    </form>
  )
}

export default LoginForm
