
import bcrypt from 'bcrypt'
import { UserRepository } from '../repositories/UserRepository'
import { signJwt } from '../utils/jwt'
import type { Role } from '../models/User'

export const AuthService = {
  async register(username: string, password: string, role: Role) {
    const exists = await UserRepository.findByUsername(username)
    if (exists) return { success: false, message: 'User already exists' } as any
    const hash = await bcrypt.hash(password, 10)
    const created = await UserRepository.create({ username, password: hash, role })
    const token = signJwt({ id: created.id!, username: created.username, role: created.role })
    return { success: true, message: 'Registered', data: { id: created.id!, username: created.username, role: created.role, token } }
  },
  async login(username: string, password: string) {
    const user = await UserRepository.findByUsername(username)
    if (!user) return { success: false, message: 'Invalid credentials' }
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return { success: false, message: 'Invalid credentials' }
    const token = signJwt({ id: user.id!, username: user.username, role: user.role as Role })
    return { success: true, message: 'Logged in', data: { id: user.id!, username: user.username, role: user.role as Role, token } }
  }
}
