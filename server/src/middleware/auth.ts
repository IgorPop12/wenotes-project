
import { Request, Response, NextFunction } from 'express'
import { verifyJwt } from '../utils/jwt'

export interface AuthRequest extends Request {
  user?: { id: number, role: 'USER' | 'PREMIUM', username: string }
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' })
  const token = header.substring(7)
  const payload = verifyJwt<{ id: number, role: 'USER' | 'PREMIUM', username: string }>(token)
  if (!payload) return res.status(401).json({ message: 'Invalid token' })
  req.user = payload
  next()
}
