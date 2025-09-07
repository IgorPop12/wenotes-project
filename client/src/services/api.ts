
import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1'
})

API.interceptors.request.use((config) => {
  const raw = localStorage.getItem('auth')
  if (raw) {
    const { token } = JSON.parse(raw)
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default API
