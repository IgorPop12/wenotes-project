
import pool from '../config/db'
import type { Note } from '../models/Note'

export const NoteRepository = {
  async create(note: Note): Promise<Note> {
    const [res] = await pool.execute(
      'INSERT INTO notes (userId,title,content,imageUrl,pinned,slug) VALUES (?,?,?,?,?,?)',
      [note.userId, note.title, note.content, note.imageUrl ?? null, note.pinned ? 1 : 0, note.slug ?? null]
    )
    return { id: (res as any).insertId, ...note }
  },
  async update(noteId: number, patch: Partial<Note>): Promise<boolean> {
    const fields = []
    const values: any[] = []
    for (const [k,v] of Object.entries(patch)) {
      fields.push(`${k}=?`)
      values.push(v)
    }
    if (!fields.length) return true
    values.push(noteId)
    const [res] = await pool.execute(`UPDATE notes SET ${fields.join(', ')} WHERE id=?`, values)
    return (res as any).affectedRows > 0
  },
  async getById(id: number): Promise<Note | null> {
    const [rows] = await pool.execute('SELECT * FROM notes WHERE id=?',[id])
    const arr = rows as any[]
    return arr.length ? arr[0] as Note : null
  },
  async listByUser(userId: number): Promise<Note[]> {
    const [rows] = await pool.execute('SELECT * FROM notes WHERE userId=? ORDER BY pinned DESC, updatedAt DESC',[userId])
    return rows as Note[]
  },
  async delete(id: number, userId: number): Promise<boolean> {
    const [res] = await pool.execute('DELETE FROM notes WHERE id=? AND userId=?',[id,userId])
    return (res as any).affectedRows > 0
  },
  async countForUser(userId: number): Promise<number> {
    const [rows] = await pool.execute('SELECT COUNT(*) as c FROM notes WHERE userId=?',[userId])
    const arr = rows as any[]
    return arr.length ? Number(arr[0].c) : 0
  },
  async findBySlug(slug: string): Promise<Note | null> {
    const [rows] = await pool.execute('SELECT * FROM notes WHERE slug=?',[slug])
    const arr = rows as any[]
    return arr.length ? arr[0] as Note : null
  }
}
