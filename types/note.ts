export type Note = {
  id: string
  title: string
  content: string | null
  contactId: string | null
  createdBy: string
  createdAt: string
  updatedAt: string
}

export type CreateNoteInput = {
  title: string
  content?: string
  contactId?: string
}

export type UpdateNoteInput = Partial<CreateNoteInput>