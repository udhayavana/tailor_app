import { useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { updateAccount } from '../services/authService.js'

const pageSize = 5

const initialOrders = [
  { id: 'ORD-1084', garmentType: 'Evening gown', measurementNo: 'M-2048', orderDate: '2026-11-10', orderStatus: 'In progress', paidStatus: 'Partially paid' },
  { id: 'ORD-1083', garmentType: 'Formal suit', measurementNo: 'M-2047', orderDate: '2026-11-09', orderStatus: 'Ready for fitting', paidStatus: 'Paid' },
  { id: 'ORD-1082', garmentType: 'Bridal lehenga', measurementNo: 'M-2045', orderDate: '2026-11-07', orderStatus: 'In progress', paidStatus: 'Unpaid' },
  { id: 'ORD-1081', garmentType: 'Silk blouse', measurementNo: 'M-2044', orderDate: '2026-11-05', orderStatus: 'Completed', paidStatus: 'Paid' },
  { id: 'ORD-1080', garmentType: 'Linen trousers', measurementNo: 'M-2042', orderDate: '2026-11-04', orderStatus: 'In progress', paidStatus: 'Partially paid' },
  { id: 'ORD-1079', garmentType: 'Wedding sherwani', measurementNo: 'M-2041', orderDate: '2026-11-02', orderStatus: 'Ready for fitting', paidStatus: 'Paid' },
  { id: 'ORD-1078', garmentType: 'Cotton kurta', measurementNo: 'M-2040', orderDate: '2026-10-31', orderStatus: 'Completed', paidStatus: 'Paid' },
  { id: 'ORD-1077', garmentType: 'A-line skirt', measurementNo: 'M-2038', orderDate: '2026-10-29', orderStatus: 'In progress', paidStatus: 'Unpaid' },
  { id: 'ORD-1076', garmentType: 'Blazer', measurementNo: 'M-2037', orderDate: '2026-10-27', orderStatus: 'Completed', paidStatus: 'Paid' },
  { id: 'ORD-1075', garmentType: 'Bridal gown', measurementNo: 'M-2036', orderDate: '2026-10-25', orderStatus: 'In progress', paidStatus: 'Partially paid' },
  { id: 'ORD-1074', garmentType: 'Pleated dress', measurementNo: 'M-2034', orderDate: '2026-10-23', orderStatus: 'Completed', paidStatus: 'Paid' },
  { id: 'ORD-1073', garmentType: 'Waistcoat', measurementNo: 'M-2032', orderDate: '2026-10-21', orderStatus: 'Ready for fitting', paidStatus: 'Unpaid' },
]

const measurements = [
  { number: 'M-2048', client: 'Ava Morgan', garmentType: 'Evening gown', updated: 'Nov 10, 2026', unit: 'in', bodyMeasurements: { chest: 34, shoulder: 15, waist: 28, armLength: 23, hips: 36, inseam: 30 } },
  { number: 'M-2047', client: 'James Lee', garmentType: 'Formal suit', updated: 'Nov 9, 2026', unit: 'in', bodyMeasurements: { chest: 40, shoulder: 18, waist: 34, armLength: 25, hips: 40, inseam: 32 } },
  { number: 'M-2045', client: 'Sofia Patel', garmentType: 'Bridal lehenga', updated: 'Nov 7, 2026', unit: 'in', bodyMeasurements: { chest: 36, shoulder: 16, waist: 29, armLength: 23, hips: 38, inseam: 30 } },
  { number: 'M-2044', client: 'Mia Thompson', garmentType: 'Silk blouse', updated: 'Nov 5, 2026', unit: 'in', bodyMeasurements: { chest: 32, shoulder: 14, waist: 26, armLength: 22, hips: 35, inseam: 29 } },
  { number: 'M-2042', client: 'Noah Williams', garmentType: 'Linen trousers', updated: 'Nov 4, 2026', unit: 'in', bodyMeasurements: { chest: 39, shoulder: 17, waist: 33, armLength: 24, hips: 39, inseam: 31 } },
  { number: 'M-2041', client: 'Isabella Chen', garmentType: 'Wedding sherwani', updated: 'Nov 2, 2026', unit: 'in', bodyMeasurements: { chest: 38, shoulder: 17, waist: 32, armLength: 24, hips: 39, inseam: 31 } },
]

const bodyMeasurementFields = [
  { name: 'chest', label: 'Chest / Bust', placeholder: 32, limits: { in: [24, 60], cm: [61, 152] } },
  { name: 'shoulder', label: 'Shoulder Width', placeholder: 14, limits: { in: [10, 24], cm: [25, 61] } },
  { name: 'waist', label: 'Waist', placeholder: 28, limits: { in: [20, 50], cm: [51, 127] } },
  { name: 'armLength', label: 'Arm Length', placeholder: 24, limits: { in: [18, 30], cm: [46, 76] } },
  { name: 'hips', label: 'Hips', placeholder: 36, limits: { in: [28, 60], cm: [71, 152] } },
  { name: 'inseam', label: 'Inseam', placeholder: 30, limits: { in: [24, 40], cm: [61, 102] } },
]

const emptyBodyMeasurements = Object.fromEntries(
  bodyMeasurementFields.map(({ name }) => [name, '']),
)

const emptyDraft = {
  garmentType: '',
  measurementNo: '',
  orderDate: new Date().toISOString().slice(0, 10),
  orderStatus: 'In progress',
  paidStatus: 'Unpaid',
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

function statusClass(status) {
  return status.toLowerCase().replace(/\s+/g, '-')
}

function createMeasurementCode() {
  const now = new Date()
  return `MSR-${now.getFullYear()}${String(now.getTime()).slice(-6)}`
}

function OrderCard({ order }) {
  return (
    <article className="order-card">
      <div className="order-field">
        <span>Garment type</span>
        <strong>{order.garmentType}</strong>
      </div>
      <div className="order-field">
        <span>Measurement No</span>
        <strong>{order.measurementNo}</strong>
      </div>
      <div className="order-field">
        <span>Order date</span>
        <time dateTime={order.orderDate}>{formatDate(order.orderDate)}</time>
      </div>
      <div className="order-field">
        <span>Order Status</span>
        <strong className={`status-pill ${statusClass(order.orderStatus)}`}>{order.orderStatus}</strong>
      </div>
      <div className="order-field">
        <span>Paid Status</span>
        <strong className={`status-pill ${statusClass(order.paidStatus)}`}>{order.paidStatus}</strong>
      </div>
    </article>
  )
}

function CreateOrderPage({ onBack, onCreate }) {
  const [draft, setDraft] = useState(emptyDraft)

  function updateDraft(event) {
    const { name, value } = event.target
    setDraft((currentDraft) => ({ ...currentDraft, [name]: value }))
  }

  function submitOrder(event) {
    event.preventDefault()
    onCreate({ ...draft, id: `ORD-${Date.now()}` })
  }

  return (
    <section className="create-record-page" aria-labelledby="create-order-title">
      <button className="back-to-list-button" type="button" onClick={onBack}>← Back to listing</button>
      <div className="create-order-modal">
        <div className="modal-heading">
          <div>
            <p className="home-eyebrow">NEW WORK</p>
            <h2 id="create-order-title">Create order</h2>
          </div>
        </div>
        <form className="order-form" onSubmit={submitOrder}>
          <label>
            <span>Garment type</span>
            <input name="garmentType" value={draft.garmentType} onChange={updateDraft} placeholder="e.g. Evening gown" required />
          </label>
          <label>
            <span>Measurement No</span>
            <input name="measurementNo" value={draft.measurementNo} onChange={updateDraft} placeholder="e.g. M-2049" required />
          </label>
          <label>
            <span>Order date</span>
            <input name="orderDate" type="date" value={draft.orderDate} onChange={updateDraft} required />
          </label>
          <div className="order-form-row">
            <label>
              <span>Order Status</span>
              <select name="orderStatus" value={draft.orderStatus} onChange={updateDraft}>
                <option>In progress</option>
                <option>Ready for fitting</option>
                <option>Completed</option>
              </select>
            </label>
            <label>
              <span>Paid Status</span>
              <select name="paidStatus" value={draft.paidStatus} onChange={updateDraft}>
                <option>Unpaid</option>
                <option>Partially paid</option>
                <option>Paid</option>
              </select>
            </label>
          </div>
          <div className="modal-actions">
            <button className="cancel-button" type="button" onClick={onBack}>Cancel</button>
            <button className="create-order-button" type="submit">Create Order</button>
          </div>
        </form>
      </div>
    </section>
  )
}

function AddMeasurementPage({ client, onBack, onAdd }) {
  const [measurementCode] = useState(createMeasurementCode)
  const [unit, setUnit] = useState('in')
  const [draft, setDraft] = useState(emptyBodyMeasurements)
  const [copyStatus, setCopyStatus] = useState('')

  function updateDraft(event) {
    const { name, value } = event.target
    setDraft((currentDraft) => ({ ...currentDraft, [name]: value }))
  }

  function changeUnit(nextUnit) {
    if (nextUnit === unit) return

    setDraft((currentDraft) => Object.fromEntries(
      Object.entries(currentDraft).map(([name, value]) => [
        name,
        value === ''
          ? value
          : String(Math.round(Number(value) * (nextUnit === 'cm' ? 2.54 : 1 / 2.54) * 10) / 10),
      ]),
    ))
    setUnit(nextUnit)
  }

  async function copyMeasurementCode() {
    try {
      await navigator.clipboard.writeText(measurementCode)
      setCopyStatus('Measurement code copied.')
    } catch {
      setCopyStatus('Unable to copy the measurement code.')
    }
  }

  function submitMeasurement(event) {
    event.preventDefault()
    onAdd({
      number: measurementCode,
      client,
      garmentType: 'Body measurements',
      unit,
      bodyMeasurements: draft,
      updated: new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date()),
    })
  }

  return (
    <section className="create-record-page measurement-create-page" aria-labelledby="add-measurement-title">
      <form className="measurement-form" onSubmit={submitMeasurement}>
        <div className="measurement-form-header">
          <button className="measurement-back-button" type="button" onClick={onBack} aria-label="Back to listing">
            <span aria-hidden="true">‹</span>
          </button>
          <div>
            <h2 id="add-measurement-title">Add Measurements</h2>
            <p>Please enter your body measurements</p>
          </div>
        </div>

        <div className="measurement-code-card">
          <div>
            <span>Measurement Code</span>
            <strong>{measurementCode}</strong>
          </div>
          <button type="button" onClick={copyMeasurementCode} aria-label="Copy measurement code" title="Copy code">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="8" y="3" width="12" height="15" rx="2" />
              <path d="M16 21H5a2 2 0 0 1-2-2V7" />
            </svg>
          </button>
        </div>
        <p className="measurement-copy-status" role="status">{copyStatus}</p>

        <div className="measurement-unit-toggle" aria-label="Measurement unit">
          <button
            className={unit === 'in' ? 'active' : ''}
            type="button"
            aria-pressed={unit === 'in'}
            onClick={() => changeUnit('in')}
          >
            Inches (in)
          </button>
          <button
            className={unit === 'cm' ? 'active' : ''}
            type="button"
            aria-pressed={unit === 'cm'}
            onClick={() => changeUnit('cm')}
          >
            Centimeters (cm)
          </button>
        </div>

        <div className="body-measurement-grid">
          {bodyMeasurementFields.map(({ name, label, placeholder, limits }) => (
            <label className="body-measurement-field" key={name}>
              <span className="body-measurement-info">
                <strong>{label}</strong>
                <span>({limits[unit][0]} – {limits[unit][1]} {unit})</span>
              </span>
              <input
                name={name}
                type="number"
                min={limits[unit][0]}
                max={limits[unit][1]}
                step="0.1"
                value={draft[name]}
                onChange={updateDraft}
                placeholder={`e.g. ${placeholder}`}
                required
              />
            </label>
          ))}
        </div>

        <button className="save-measurements-button" type="submit">Save Measurements</button>
      </form>
    </section>
  )
}

const phoneCountryCodes = [
  { code: '+91', label: 'India +91' },
  { code: '+1', label: 'US +1' },
  { code: '+44', label: 'UK +44' },
]

function ProfilePage({ user, onBack, onUpdate, onSignOut }) {
  const [draft, setDraft] = useState({
    fullName: user.fullName || '',
    address: user.address || '',
    countryCode: user.countryCode || '+91',
    phoneNumber: user.phoneNumber || '',
    alternateCountryCode: user.alternateCountryCode || '+91',
    alternatePhone: user.alternatePhone || '',
  })
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })

  function updateField(event) {
    const { name, value } = event.target
    setDraft((currentDraft) => ({ ...currentDraft, [name]: value }))
    setStatus({ loading: false, error: '', success: '' })
  }

  async function submitProfile(event) {
    event.preventDefault()
    setStatus({ loading: true, error: '', success: '' })

    try {
      await onUpdate(draft)
      setStatus({ loading: false, error: '', success: 'Profile updated successfully.' })
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  return (
    <section className="profile-page" aria-labelledby="profile-page-title">
      <div className="profile-page-heading">
        <button className="profile-back-button" type="button" onClick={onBack} aria-label="Back to dashboard">
          <span aria-hidden="true">‹</span>
        </button>
        <div>
          <p className="dashboard-eyebrow">ACCOUNT DETAILS</p>
          <h1 id="profile-page-title">My Profile</h1>
          <p>View and update your contact information.</p>
        </div>
      </div>

      <form className="profile-edit-form" onSubmit={submitProfile}>
        <label className="profile-edit-field">
          <span>Full name</span>
          <input
            name="fullName"
            autoComplete="name"
            value={draft.fullName}
            onChange={updateField}
            required
          />
        </label>

        <label className="profile-edit-field profile-edit-address">
          <span>Address</span>
          <textarea
            name="address"
            autoComplete="street-address"
            value={draft.address}
            onChange={updateField}
            required
          />
        </label>

        <div className="profile-phone-grid">
          <label className="profile-edit-field">
            <span>Primary mobile</span>
            <div className="profile-phone-control">
              <select name="countryCode" value={draft.countryCode} onChange={updateField} aria-label="Primary mobile country code">
                {phoneCountryCodes.map(({ code, label }) => <option key={code} value={code}>{label}</option>)}
              </select>
              <input
                name="phoneNumber"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={draft.phoneNumber}
                onChange={updateField}
                pattern="[0-9]{7,15}"
                maxLength={15}
                required
              />
            </div>
          </label>
          <label className="profile-edit-field">
            <span>Alternate mobile</span>
            <div className="profile-phone-control">
              <select
                name="alternateCountryCode"
                value={draft.alternateCountryCode}
                onChange={updateField}
                aria-label="Alternate mobile country code"
              >
                {phoneCountryCodes.map(({ code, label }) => <option key={code} value={code}>{label}</option>)}
              </select>
              <input
                name="alternatePhone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={draft.alternatePhone}
                onChange={updateField}
                pattern="[0-9]{7,15}"
                maxLength={15}
              />
            </div>
          </label>
        </div>

        <div className="profile-edit-actions">
          <button className="save-profile-button" type="submit" disabled={status.loading}>
            {status.loading ? 'Updating…' : 'Update Profile'}
          </button>
          <button className="profile-sign-out-button" type="button" onClick={onSignOut}>Sign out</button>
        </div>
        {status.error && <p className="form-error" role="alert">{status.error}</p>}
        {status.success && <p className="profile-success" role="status">{status.success}</p>}
      </form>
    </section>
  )
}

function HomePage() {
  const { token, user, setToken, setUser } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState(
    location.pathname.includes('/measurements') ? 'measurements' : 'orders',
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [orders, setOrders] = useState(initialOrders)
  const [measurementList, setMeasurementList] = useState(measurements)
  const actionPage = location.pathname === '/home/profile'
    ? 'profile'
    : location.pathname === '/home/orders/create'
      ? 'order'
    : location.pathname === '/home/measurements/create'
      ? 'measurement'
      : null

  const totalPages = Math.ceil(orders.length / pageSize)
  const pageOrders = useMemo(
    () => orders.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, orders],
  )

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
    setCurrentPage(1)
    setActiveSection('orders')
    navigate('/home')
  }

  function addMeasurement(measurement) {
    setMeasurementList((currentMeasurements) => [measurement, ...currentMeasurements])
    setCurrentPage(1)
    setActiveSection('measurements')
    navigate('/home')
  }

  function selectSection(section) {
    setActiveSection(section)
    setCurrentPage(1)
  }

  function renderOrderMenu() {
    return (
      <>
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
  const visibleMeasurements = measurementList.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const measurementPages = Math.ceil(measurementList.length / pageSize)
  const displayedPages = activeSection === 'orders' ? totalPages : measurementPages
  const displayedTotal = activeSection === 'orders' ? orders.length : measurementList.length

  function changePage(page) {
    setCurrentPage(Math.max(1, Math.min(page, displayedPages)))
  }

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
          <CreateOrderPage onBack={() => navigate('/home')} onCreate={addOrder} />
        ) : actionPage === 'measurement' ? (
          <AddMeasurementPage client={user.fullName} onBack={() => navigate('/home')} onAdd={addMeasurement} />
        ) : (
          <section className="dashboard-listing" aria-labelledby="list-title">
            <div className="list-panel-heading">
              <div>
                <h2 id="list-title">{activeSection === 'orders' ? 'Orders' : 'Measurements'}</h2>
                <p>{activeSection === 'orders' ? 'Your recent garment orders' : 'Saved client measurement profiles'}</p>
              </div>
              <div className="list-heading-actions">
                <span className="list-count">{displayedTotal} total</span>
                {activeSection === 'orders' ? (
                  <button className="list-action-button" type="button" onClick={() => navigate('/home/orders/create')}>
                    <span aria-hidden="true">+</span> Create Order
                  </button>
                ) : (
                  <button className="list-action-button" type="button" onClick={() => navigate('/home/measurements/create')}>
                    <span aria-hidden="true">+</span> Add Measurement
                  </button>
                )}
              </div>
            </div>

            <div className="dashboard-list-panel">
              {activeSection === 'orders' ? (
                <div className="orders-list">
                  <div className="order-card order-list-labels" aria-hidden="true">
                    <span>Garment type</span>
                    <span>Measurement No</span>
                    <span>Order date</span>
                    <span>Order Status</span>
                    <span>Paid Status</span>
                  </div>
                  {pageOrders.map((order) => <OrderCard key={order.id} order={order} />)}
                </div>
              ) : (
                <div className="measurements-list">
                  <div className="measurement-card measurement-list-labels" aria-hidden="true">
                    <span>Measurement Code</span>
                    <span>Client</span>
                    <span>Profile</span>
                    <span>Last updated</span>
                  </div>
                  {visibleMeasurements.map((measurement) => (
                    <article className="measurement-card" key={measurement.number}>
                      <div className="measurement-summary">
                        <strong className="measurement-number">{measurement.number}</strong>
                        <strong>{measurement.client}</strong>
                        <span>{measurement.garmentType}</span>
                        <time>{measurement.updated}</time>
                      </div>
                      <dl className="measurement-values">
                        {bodyMeasurementFields.map(({ name, label }) => (
                          <div key={name}>
                            <dt>{label}</dt>
                            <dd>
                              {measurement.bodyMeasurements?.[name] ?? '—'}
                              {measurement.bodyMeasurements?.[name] !== undefined && ` ${measurement.unit}`}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </article>
                  ))}
                </div>
              )}

              <div className="pagination">
                <span className="pagination-summary">
                  Showing {displayedTotal ? (currentPage - 1) * pageSize + 1 : 0}–
                  {Math.min(currentPage * pageSize, displayedTotal)} of {displayedTotal}
                </span>
                <div className="pagination-controls" aria-label={`${activeSection} pages`}>
                  <button type="button" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                  </button>
                  {Array.from({ length: displayedPages }, (_, index) => index + 1).map((page) => (
                    <button
                      className={page === currentPage ? 'current' : ''}
                      type="button"
                      aria-current={page === currentPage ? 'page' : undefined}
                      key={page}
                      onClick={() => changePage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button type="button" onClick={() => changePage(currentPage + 1)} disabled={currentPage === displayedPages}>
                    Next
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <nav className="mobile-dashboard-nav" aria-label="Dashboard navigation">
        {renderOrderMenu()}
      </nav>
    </main>
  )
}

export default HomePage
