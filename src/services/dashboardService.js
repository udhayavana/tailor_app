import apiClient from './apiClient.js'

export async function getDashboardSummary(token) {
  const response = await apiClient.get('/dashboard', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  return response.data
}
