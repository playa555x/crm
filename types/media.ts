export type MediaType = 'image' | 'document' | 'video' | 'other'

export type Media = {
  id: string
  title: string
  description: string | null
  file_path: string
  file_type: MediaType
  mime_type: string
  size: number
  contact_id: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export type CreateMediaDTO = {
  title: string
  description?: string
  file_path: string
  file_type: MediaType
  mime_type: string
  size: number
  contact_id?: string
}

export type UpdateMediaDTO = {
  title?: string
  description?: string
  contact_id?: string
}