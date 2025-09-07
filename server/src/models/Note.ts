
export interface Note {
  id?: number
  userId: number
  title: string
  content: string
  imageUrl?: string | null
  pinned?: boolean
  slug?: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
}
