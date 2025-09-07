
import pool from '../config/db'
import type { User } from '../models/User'

export const UserRepository = {
  async findByUsername(username: string): Promise<User | null> {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username=?',[username])
    const arr = rows as any[]
    return arr.length ? arr[0] as User : null
  },
  async findById(id: number): Promise<User | null> {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id=?',[id])
    const arr = rows as any[]
    return arr.length ? arr[0] as User : null
  },
  async create(user: User): Promise<User> {
    const [res] = await pool.execute('INSERT INTO users (username,password,role) VALUES (?,?,?)',
      [user.username, user.password, user.role])
    return { id: (res as any).insertId, ...user }
  }
}
