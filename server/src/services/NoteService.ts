
import { NoteRepository } from '../repositories/NoteRepository'
import { v4 as uuidv4 } from 'uuid'

export const NoteService = {
  async create(userId: number, role: 'USER'|'PREMIUM', title: string, content: string, imageUrl?: string|null, pinned?: boolean) {
    if (role === 'USER') {
      const count = await NoteRepository.countForUser(userId)
      if (count >= 10) return { success: false, message: 'Limit reached (10 notes for USER)' }
    }
    const note = await NoteRepository.create({ userId, title, content, imageUrl: imageUrl ?? null, pinned: !!pinned })
    return { success: true, data: note }
  },
  async list(userId: number) {
    const notes = await NoteRepository.listByUser(userId)
    return { success: true, data: notes }
  },
  async update(noteId: number, userId: number, patch: any) {
    const note = await NoteRepository.getById(noteId)
    if (!note || note.userId !== userId) return { success: false, message: 'Not found' }
    const ok = await NoteRepository.update(noteId, patch)
    return { success: ok }
  },
  async remove(noteId: number, userId: number) {
    const ok = await NoteRepository.delete(noteId, userId)
    return { success: ok }
  },
  async duplicate(noteId: number, userId: number, role: 'USER'|'PREMIUM') {
    const note = await NoteRepository.getById(noteId)
    if (!note || note.userId !== userId) return { success: false, message: 'Not found' }
    return this.create(userId, role, note.title + ' (Copy)', note.content, note.imageUrl ?? null, note.pinned)
  },
  async share(noteId: number, userId: number) {
    const note = await NoteRepository.getById(noteId)
    if (!note || note.userId !== userId) return { success: false, message: 'Not found' }
    const slug = note.slug ?? uuidv4().replace(/-/g,'')
    await NoteRepository.update(note.id!, { slug })
    return { success: true, data: { slug } }
  },
  async getPublic(slug: string) {
    const note = await NoteRepository.findBySlug(slug)
    if (!note) return { success: false, message: 'Not found' }
    // Return only public fields
    return { success: true, data: { title: note.title, content: note.content, imageUrl: note.imageUrl, updatedAt: note.updatedAt, slug: note.slug } }
  }
}
