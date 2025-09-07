
export type Role = 'USER' | 'PREMIUM'

export interface User {
  id?: number
  username: string
  password: string
  role: Role
}
