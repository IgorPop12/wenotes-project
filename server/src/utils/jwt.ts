
import jwt from 'jsonwebtoken'

export function signJwt(payload: object, expiresIn: string = '7d') {
  const secret = process.env.JWT_SECRET || 'dev_secret'
  return jwt.sign(payload, secret, { expiresIn })
}

export function verifyJwt<T = any>(token: string): T | null {
  const secret = process.env.JWT_SECRET || 'dev_secret'
  try {
    return jwt.verify(token, secret) as T
  } catch {
    return null
  }
}
