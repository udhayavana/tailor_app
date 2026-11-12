import { useState } from 'react'

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

export default ProfilePage
