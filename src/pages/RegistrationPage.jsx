import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthWave from '../components/AuthWave.jsx'
import ProfileRegistrationForm from '../components/ProfileRegistrationForm.jsx'

function RegistrationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const registration = location.state

  if (!registration?.phoneNumber || !registration?.countryCode) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="login-page registration-page">
      <AuthWave />
      <section className="login-content registration-content" aria-labelledby="registration-title">
        <button className="back-button" type="button" onClick={() => navigate('/')} aria-label="Back to sign in">
          ‹
        </button>
        <h1 id="registration-title">Create Your Profile</h1>
        <p className="login-subtitle">Please provide the following details<br />to complete your registration</p>
        <ProfileRegistrationForm
          countryCode={registration.countryCode}
          phoneNumber={registration.phoneNumber}
        />
      </section>
    </main>
  )
}

export default RegistrationPage
