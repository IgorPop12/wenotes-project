
import { Response } from 'express'
import { noteCreateSchema } from '../utils/validators'
import { NoteService } from '../services/NoteService'
import type { AuthRequest } from '../middleware/auth'

export const NotesController = {
  async create(req: AuthRequest, res: Response) {
    const parsed = noteCreateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ message: 'Invalid data', issues: parsed.error.issues })
    const imageUrl = (req as any).file ? `/uploads/${(req as any).file.filename}` : (req.body.imageUrl ?? null)
    const out = await NoteService.create(req.user!.id, req.user!.role, parsed.data.title, parsed.data.content, imageUrl, parsed.data.pinned)
    const code = out.success ? 200 : 400
    return res.status(code).json(out)
  },
  async list(req: AuthRequest, res: Response) {
    const out = await NoteService.list(req.user!.id)
    return res.json(out)
  },
  async update(req: AuthRequest, res: Response) {
    const { id } = req.params as any
    const out = await NoteService.update(Number(id), req.user!.id, req.body)
    const code = out.success ? 200 : 404
    return res.status(code).json(out)
  },
  async remove(req: AuthRequest, res: Response) {
    const { id } = req.params as any
    const out = await NoteService.remove(Number(id), req.user!.id)
    const code = out.success ? 200 : 404
    return res.status(code).json(out)
  },
  async duplicate(req: AuthRequest, res: Response) {
    const { id } = req.params as any
    const out = await NoteService.duplicate(Number(id), req.user!.id, req.user!.role)
    const code = out.success ? 200 : 400
    return res.status(code).json(out)
  },
  async share(req: AuthRequest, res: Response) {
    const { id } = req.params as any
    const out = await NoteService.share(Number(id), req.user!.id)
    const code = out.success ? 200 : 404
    return res.status(code).json(out)
  }
}
