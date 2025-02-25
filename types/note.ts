export type Note = {
  id: string
  title: string
  content: string | null
  contact_id: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export type CreateNoteDTO = {
  title: string
  content?: string | null
  contact_id: string
}

export type UpdateNoteDTO = {
  title?: string
  content?: string | null
}