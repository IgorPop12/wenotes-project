
import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import { NotesController } from '../controllers/NotesController'
import { requireAuth } from '../middleware/auth'

const storage = multer.diskStorage({
  destination: path.join(process.cwd(), 'server', 'uploads'),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, crypto.randomBytes(8).toString('hex') + ext)
  }
})
const upload = multer({ storage })

export const notesRouter = Router()

notesRouter.use(requireAuth)

notesRouter.get('/', NotesController.list)
notesRouter.post('/', upload.single('image'), NotesController.create)
notesRouter.patch('/:id', NotesController.update)
notesRouter.delete('/:id', NotesController.remove)
notesRouter.post('/:id/duplicate', NotesController.duplicate)
notesRouter.post('/:id/share', NotesController.share)
