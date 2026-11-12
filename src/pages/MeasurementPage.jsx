import { useState } from 'react'

const pageSize = 5

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

function createMeasurementCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from(
    { length: 4 },
    () => characters[Math.floor(Math.random() * characters.length)],
  ).join('')
}

function AddMeasurementPage({ client, onBack, onAdd }) {
  const [measurementCode] = useState(createMeasurementCode)
  const [unit, setUnit] = useState('in')
  const [draft, setDraft] = useState(emptyBodyMeasurements)
  const [garmentType, setGarmentType] = useState('')
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
      garmentType,
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

        <label className="measurement-garment-type">
          <span>Garment Type</span>
          <input
            name="garmentType"
            value={garmentType}
            onChange={(event) => setGarmentType(event.target.value)}
            placeholder="e.g. Evening gown"
            required
          />
        </label>

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

function MeasurementPage({ measurements, client, isCreating = false, onBack, onAdd, onStartCreate }) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(measurements.length / pageSize)
  const visibleMeasurements = measurements.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  if (isCreating) {
    return <AddMeasurementPage client={client} onBack={onBack} onAdd={onAdd} />
  }

  function changePage(page) {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <section className="dashboard-listing" aria-labelledby="list-title">
      <div className="list-panel-heading">
        <div>
          <h2 id="list-title">Measurements</h2>
          <p>Saved client measurement profiles</p>
        </div>
        <div className="list-heading-actions">
          <span className="list-count">{measurements.length} total</span>
          <button className="list-action-button" type="button" onClick={onStartCreate}>
            <span aria-hidden="true">+</span> Add Measurement
          </button>
        </div>
      </div>

      <div className="dashboard-list-panel">
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

        <div className="pagination">
          <span className="pagination-summary">
            Showing {measurements.length ? (currentPage - 1) * pageSize + 1 : 0}–
            {Math.min(currentPage * pageSize, measurements.length)} of {measurements.length}
          </span>
          <div className="pagination-controls" aria-label="measurements pages">
            <button type="button" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
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
            <button type="button" onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MeasurementPage
