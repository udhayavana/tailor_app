import LoginForm from '../components/LoginForm.jsx'
import AuthWave from '../components/AuthWave.jsx'

function LoginPage() {
  return (
    <main className="login-page">
      <AuthWave />
      <section className="login-content" aria-labelledby="login-title">
        <h1 id="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in with your mobile number<br />to continue</p>
        <LoginForm />
      </section>
    </main>
  )
}

export default LoginPage
