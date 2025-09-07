
export type Role = 'USER' | 'PREMIUM'
export type Note = { id: number, title: string, content: string, imageUrl?: string|null, pinned?: boolean, slug?: string|null }
export type AuthSuccess = { success: true, message: string, data: { id: number, username: string, role: Role, token: string } }
export type AuthFail = { success: false, message: string }
export type AuthResponse = AuthSuccess | AuthFail
