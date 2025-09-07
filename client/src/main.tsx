
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import LoginRegister from './pages/LoginRegister'
import NotesPage from './pages/NotesPage'
import PublicNotePage from './pages/PublicNotePage'
import NotFound from './pages/NotFound'
import ProtectedRoute from './pages/ProtectedRoute'

const router = createHashRouter([
  { path: '/', element: <ProtectedRoute><NotesPage/></ProtectedRoute> },
  { path: '/auth', element: <LoginRegister/> },
  { path: '/public/:slug', element: <PublicNotePage/> },
  { path: '*', element: <NotFound/> }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)
