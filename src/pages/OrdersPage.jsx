import { useMemo, useState } from 'react'

const pageSize = 5

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
                <option>New</option>
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

function OrdersPage({ orders, isCreating = false, onBack, onCreate, onStartCreate }) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(orders.length / pageSize)
  const pageOrders = useMemo(
    () => orders.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, orders],
  )

  if (isCreating) {
    return <CreateOrderPage onBack={onBack} onCreate={onCreate} />
  }

  function changePage(page) {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <section className="dashboard-listing" aria-labelledby="list-title">
      <div className="list-panel-heading">
        <div>
          <h2 id="list-title">Orders</h2>
          <p>Your recent garment orders</p>
        </div>
        <div className="list-heading-actions">
          <span className="list-count">{orders.length} total</span>
          <button className="list-action-button" type="button" onClick={onStartCreate}>
            <span aria-hidden="true">+</span> Create Order
          </button>
        </div>
      </div>

      <div className="dashboard-list-panel">
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

        <div className="pagination">
          <span className="pagination-summary">
            Showing {orders.length ? (currentPage - 1) * pageSize + 1 : 0}–
            {Math.min(currentPage * pageSize, orders.length)} of {orders.length}
          </span>
          <div className="pagination-controls" aria-label="orders pages">
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

export default OrdersPage
