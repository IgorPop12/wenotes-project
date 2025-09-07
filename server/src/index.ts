
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { authRouter } from './routes/auth.routes'
import { notesRouter } from './routes/notes.routes'
import { publicRouter } from './routes/public.routes'

const app = express()
const PORT = process.env.PORT || 4000
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }))
app.use(express.json())

// static for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/notes', notesRouter)
app.use('/api/v1/public', publicRouter)

app.use((req, res) => res.status(404).json({ message: 'Not found' }))

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))