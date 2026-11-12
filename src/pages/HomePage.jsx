import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { updateAccount } from '../services/authService.js'
import { initialMeasurements, initialOrders } from '../data/dashboardData.js'
import MeasurementPage from './MeasurementPage.jsx'
import OrdersPage from './OrdersPage.jsx'
import ProfilePage from './ProfilePage.jsx'
import DashboardPage from './DashboardPage.jsx'

function HomePage() {
  const { token, user, setToken, setUser } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState(
    location.pathname.includes('/measurements')
      ? 'measurements'
      : location.pathname.includes('/orders')
        ? 'orders'
        : 'dashboard',
  )
  const [orders, setOrders] = useState(initialOrders)
  const [measurementList, setMeasurementList] = useState(initialMeasurements)
  const actionPage = location.pathname === '/home/profile'
    ? 'profile'
    : location.pathname === '/home/orders/create'
      ? 'order'
      : location.pathname === '/home/measurements/create'
        ? 'measurement'
        : null

  if (!token || !user) {
    return <Navigate to="/" replace />
  }

  function signOut() {
    setToken(null)
    setUser(null)
    navigate('/', { replace: true })
  }

  async function saveProfile(profile) {
    const updatedUser = await updateAccount(user, profile)
    setUser(updatedUser)
  }

  function addOrder(order) {
    setOrders((currentOrders) => [order, ...currentOrders])
    setActiveSection('orders')
    navigate('/home')
  }

  function addMeasurement(measurement) {
    setMeasurementList((currentMeasurements) => [measurement, ...currentMeasurements])
    setActiveSection('measurements')
    navigate('/home')
  }

  function selectSection(section) {
    setActiveSection(section)
  }

  function renderOrderMenu() {
    return (
      <>
        <button
          className={`dashboard-nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
          type="button"
          onClick={() => selectSection('dashboard')}
        >
          <span aria-hidden="true">⌂</span>
          <span>Dashboard</span>
        </button>
        <button
          className={`dashboard-nav-item ${activeSection === 'orders' ? 'active' : ''}`}
          type="button"
          onClick={() => selectSection('orders')}
        >
          <span aria-hidden="true">▤</span>
          <span>Orders</span>
        </button>
        <button
          className={`dashboard-nav-item ${activeSection === 'measurements' ? 'active' : ''}`}
          type="button"
          onClick={() => selectSection('measurements')}
        >
          <span aria-hidden="true">⌁</span>
          <span>Measurements</span>
        </button>
      </>
    )
  }

  const firstName = user.fullName ? user.fullName.split(' ')[0] : 'there'

  return (
    <main className="dashboard-page">
      <header className="dashboard-topbar">
        <div className="dashboard-brand">
          <span className="dashboard-brand-mark">S</span>
          <span>Stitch Studio</span>
        </div>
        <nav className="desktop-dashboard-nav" aria-label="Dashboard navigation">
          {renderOrderMenu()}
        </nav>
        <div className="dashboard-user-actions">
          <button
            className="dashboard-profile-trigger"
            type="button"
            onClick={() => navigate('/home/profile')}
            aria-label={`Open profile for ${user.fullName || 'user'}`}
          >
            <span className="dashboard-user-name">{user.fullName}</span>
            <span className="dashboard-profile-icon" aria-hidden="true">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </span>
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="dashboard-welcome">
          <div>
            <p className="dashboard-eyebrow">YOUR STUDIO</p>
            <h1>Welcome, {firstName}</h1>
            <p>Keep track of your orders and measurements.</p>
          </div>
        </section>

        {actionPage === 'profile' ? (
          <ProfilePage
            user={user}
            onBack={() => navigate('/home')}
            onUpdate={saveProfile}
            onSignOut={signOut}
          />
        ) : actionPage === 'order' ? (
          <OrdersPage
            orders={orders}
            isCreating
            onBack={() => navigate('/home')}
            onCreate={addOrder}
          />
        ) : actionPage === 'measurement' ? (
          <MeasurementPage
            measurements={measurementList}
            client={user.fullName}
            isCreating
            onBack={() => navigate('/home')}
            onAdd={addMeasurement}
          />
        ) : activeSection === 'dashboard' ? (
          <DashboardPage orders={orders} onCreateOrder={() => navigate('/home/orders/create')} />
        ) : activeSection === 'orders' ? (
          <OrdersPage orders={orders} onStartCreate={() => navigate('/home/orders/create')} />
        ) : (
          <MeasurementPage
            measurements={measurementList}
            client={user.fullName}
            onStartCreate={() => navigate('/home/measurements/create')}
          />
        )}
      </div>

      <nav className="mobile-dashboard-nav" aria-label="Dashboard navigation">
        {renderOrderMenu()}
      </nav>
    </main>
  )
}

export default HomePage
