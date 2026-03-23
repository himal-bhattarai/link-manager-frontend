import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Response interceptor — unwrap data, normalize errors
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    // Silence 401 on /auth/me — it just means the user isn't logged in yet
    const isAuthCheck = err.config?.url?.includes('/auth/me')
    const is401 = err.response?.status === 401
    if (isAuthCheck && is401) {
      return Promise.reject(new Error('unauthenticated'))
    }
    const message = err.response?.data?.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export default api
