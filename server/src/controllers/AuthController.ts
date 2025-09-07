
import { Request, Response } from 'express'
import { loginSchema, registerSchema } from '../utils/validators'
import { AuthService } from '../services/AuthService'

export const AuthController = {
  async register(req: Request, res: Response) {
    const parsed = registerSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ message: 'Invalid data', issues: parsed.error.issues })
    const out = await AuthService.register(parsed.data.username, parsed.data.password, parsed.data.role)
    const code = out.success ? 200 : 400
    return res.status(code).json(out)
  },
  async login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ message: 'Invalid data', issues: parsed.error.issues })
    const out = await AuthService.login(parsed.data.username, parsed.data.password)
    const code = out.success ? 200 : 401
    return res.status(code).json(out)
  }
}
