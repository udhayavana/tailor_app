const monthFormatter = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' })
const statuses = ['New', 'In progress', 'Completed']

function getLastThreeMonths() {
  const today = new Date()
  return Array.from({ length: 3 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - 2 + index, 1)
    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      label: monthFormatter.format(date),
      counts: { New: 0, 'In progress': 0, Completed: 0 },
    }
  })
}

function summarizeOrders(orders) {
  const months = getLastThreeMonths()
  const monthByKey = new Map(months.map((month) => [month.key, month]))

  orders.forEach((order) => {
    const month = monthByKey.get(order.orderDate.slice(0, 7))
    if (!month) return

    const status = order.orderStatus === 'Completed'
      ? 'Completed'
      : order.orderStatus === 'New'
        ? 'New'
        : 'In progress'
    month.counts[status] += 1
  })

  return months
}

function DashboardPage({ orders, onCreateOrder }) {
  const monthlyOrders = summarizeOrders(orders)
  const completedTotal = monthlyOrders.reduce((total, month) => total + month.counts.Completed, 0)
  const maxCompleted = Math.max(1, ...monthlyOrders.map((month) => month.counts.Completed))

  return (
    <section className="dashboard-overview" aria-labelledby="dashboard-overview-title">
      <div className="dashboard-overview-heading">
        <div>
          <h2 id="dashboard-overview-title">Order overview</h2>
          <p>Order activity for the last three months</p>
        </div>
        <button className="list-action-button" type="button" onClick={onCreateOrder}>
          <span aria-hidden="true">+</span> Create Order
        </button>
      </div>

      <section className="dashboard-chart-card" aria-labelledby="completed-chart-title">
        <div className="dashboard-chart-heading">
          <div>
            <h3 id="completed-chart-title">Completed orders</h3>
            <p>Orders completed per month</p>
          </div>
          <strong className="completed-orders-total">{completedTotal}</strong>
        </div>
        <div className="completed-orders-chart" role="img" aria-label={`Completed orders for the last three months: ${monthlyOrders.map(({ label, counts }) => `${label}, ${counts.Completed}`).join('; ')}`}>
          {monthlyOrders.map(({ key, label, counts }) => (
            <div className="completed-chart-column" key={key}>
              <span className="completed-chart-value">{counts.Completed}</span>
              <div className="completed-chart-track">
                <div
                  className="completed-chart-bar"
                  style={{ height: `${Math.max(counts.Completed ? 8 : 0, (counts.Completed / maxCompleted) * 100)}%` }}
                />
              </div>
              <span className="completed-chart-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="monthly-orders-card" aria-labelledby="monthly-orders-title">
        <div className="monthly-orders-heading">
          <h3 id="monthly-orders-title">Monthly order status</h3>
          <p>New, in progress, and completed orders</p>
        </div>
        <div className="monthly-orders-table-wrap">
          <table className="monthly-orders-table">
            <thead>
              <tr>
                <th scope="col">Month</th>
                {statuses.map((status) => <th scope="col" key={status}>{status}</th>)}
              </tr>
            </thead>
            <tbody>
              {monthlyOrders.map(({ key, label, counts }) => (
                <tr key={key}>
                  <th scope="row">{label}</th>
                  {statuses.map((status) => <td key={status}>{counts[status]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}

export default DashboardPage
