
import { Request, Response } from 'express'
import { NoteService } from '../services/NoteService'

export const PublicController = {
  async bySlug(req: Request, res: Response) {
    const { slug } = req.params as any
    const out = await NoteService.getPublic(slug)
    const code = out.success ? 200 : 404
    return res.status(code).json(out)
  }
}
