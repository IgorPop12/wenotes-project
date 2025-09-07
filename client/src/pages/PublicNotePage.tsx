
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../services/api'

type PublicNote = { title: string, content: string, imageUrl?: string|null, updatedAt?: string, slug?: string }

export default function PublicNotePage() {
  const { slug } = useParams()
  const [note, setNote] = useState<PublicNote|null>(null)
  const [error, setError] = useState<string|undefined>()
  const serverBase = (import.meta as any).env.VITE_SERVER_BASE || 'http://localhost:4000'

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get(`/public/${slug}`)
        if (res.data.success) setNote(res.data.data)
        else setError('Beleška nije pronađena.')
      } catch {
        setError('Greška pri učitavanju.')
      }
    })()
  }, [slug])

  if (error) return <div className="min-h-screen flex items-center justify-center"><p>{error}</p></div>
  if (!note) return <div className="min-h-screen flex items-center justify-center"><p>Učitavanje...</p></div>

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">{note.title}</h1>
      {note.updatedAt && <p className="text-xs text-gray-500 mt-1">Ažurirano: {new Date(note.updatedAt).toLocaleString()}</p>}
      {note.imageUrl && <img src={`${serverBase}${note.imageUrl}`} alt="note" className="rounded mt-3 max-h-80 object-cover" />}
      <p className="mt-4 whitespace-pre-wrap">{note.content}</p>
    </div>
  )
}
