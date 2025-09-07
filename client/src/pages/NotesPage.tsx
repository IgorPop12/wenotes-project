
import { useEffect, useState } from 'react'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'
import type { Note } from '../types'

export default function NotesPage() {
  const { user, logout } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File|null>(null)
  const [error, setError] = useState<string|undefined>()
  const [info, setInfo] = useState<string|undefined>()

  const load = async () => {
    const res = await API.get('/notes')
    setNotes(res.data.data || [])
  }
  useEffect(()=>{ load() }, [])

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(undefined); setInfo(undefined)
    try {
      const form = new FormData()
      form.append('title', title)
      form.append('content', content)
      if (image) form.append('image', image)
      const res = await API.post('/notes', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      if (res.data.success) {
        setTitle(''); setContent(''); setImage(null)
        await load()
        setInfo('Beleška kreirana.')
      } else setError(res.data.message || 'Greška')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Greška')
    }
  }

  const togglePin = async (id: number, pinned: boolean) => {
    await API.patch(`/notes/${id}`, { pinned: !pinned }); await load()
  }
  const remove = async (id: number) => { await API.delete(`/notes/${id}`); await load() }
  const duplicate = async (id: number) => { await API.post(`/notes/${id}/duplicate`); await load() }
  const share = async (id: number) => {
    const res = await API.post(`/notes/${id}/share`)
    const slug = res.data?.data?.slug
    if (slug) {
      const url = `${location.origin}/#/public/${slug}`
      try { await navigator.clipboard.writeText(url) } catch {}
      setInfo('Javni link: ' + url)
    }
  }

  const serverBase = (import.meta as any).env.VITE_SERVER_BASE || 'http://localhost:4000'

  return (
    <div className="min-h-screen p-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">WeNotes</h1>
        <div className="text-sm">
          <span className="mr-2">Prijavljeni: <b>{user?.username}</b> ({user?.role})</span>
          <button className="border rounded px-3 py-1" onClick={logout}>Odjava</button>
        </div>
      </div>

      <form onSubmit={create} className="bg-white rounded-2xl shadow p-4 mb-6 grid gap-2 md:grid-cols-4">
        <input className="border rounded p-2" placeholder="Naslov" value={title} onChange={e=>setTitle(e.target.value)} required />
        <input className="border rounded p-2 md:col-span-2" placeholder="Sadržaj" value={content} onChange={e=>setContent(e.target.value)} required />
        <input type="file" accept="image/*" onChange={e=>setImage(e.target.files?.[0]||null)} />
        <button className="bg-black text-white rounded p-2 md:col-span-4">Dodaj belešku</button>
        {error && <p className="text-red-600 text-sm md:col-span-4">{error}</p>}
        {info && <p className="text-green-700 text-sm md:col-span-4">{info}</p>}
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {notes.map(n => (
          <div key={n.id} className="bg-white rounded-xl shadow p-4 flex flex-col">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold">{n.title}</h3>
              <button onClick={()=>togglePin(n.id, !!n.pinned)} className="text-xs border rounded px-2 py-1">{n.pinned ? 'Unpin' : 'Pin'}</button>
            </div>
            {n.imageUrl && <img src={`${serverBase}${n.imageUrl}`} alt="note" className="rounded mt-2 max-h-40 object-cover" />}
            <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap flex-1">{n.content}</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button className="border rounded px-2 py-1 text-sm" onClick={()=>duplicate(n.id)}>Dupliraj</button>
              <button className="border rounded px-2 py-1 text-sm" onClick={()=>share(n.id)}>Deli</button>
              <button className="border rounded px-2 py-1 text-sm" onClick={()=>remove(n.id)}>Obriši</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
