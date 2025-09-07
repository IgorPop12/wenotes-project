
import { useState } from 'react'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'
import type { AuthResponse, Role } from '../types'

export default function LoginRegister() {
  const { login } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('USER')
  const [error, setError] = useState<string|undefined>()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(undefined)
    try {
      const url = isRegister ? '/auth/register' : '/auth/login'
      const body = isRegister ? { username, password, role } : { username, password }
      const res = await API.post<AuthResponse>(url, body)
      if (res.data.success) {
        const { id, username: u, role, token } = res.data.data
        login({ id, username: u, role }, token)
        window.location.hash = '/'
      } else setError(res.data.message)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Greška')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">{isRegister ? 'Registracija' : 'Prijava'}</h1>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full border rounded p-2" placeholder="Korisničko ime" value={username} onChange={e=>setUsername(e.target.value)} minLength={3} maxLength={50} required />
          <input className="w-full border rounded p-2" placeholder="Lozinka" type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={6} maxLength={100} required />
          {isRegister && (
            <select className="w-full border rounded p-2" value={role} onChange={e=>setRole(e.target.value as Role)}>
              <option value="USER">Korisnik</option>
              <option value="PREMIUM">Premium korisnik</option>
            </select>
          )}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button className="w-full bg-black text-white rounded p-2">{isRegister ? 'Registruj se' : 'Prijavi se'}</button>
        </form>
        <button className="mt-3 w-full border rounded p-2" onClick={()=>setIsRegister(v=>!v)}>
          {isRegister ? 'Imate nalog? Prijava' : 'Nemate nalog? Registracija'}
        </button>
      </div>
    </div>
  )
}
