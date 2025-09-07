
import { z } from 'zod'

export const registerSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
  role: z.enum(['USER','PREMIUM'])
})

export const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100)
})

export const noteCreateSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  pinned: z.coerce.boolean().optional()
})
