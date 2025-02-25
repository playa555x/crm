"use client"

import { useEffect, useState } from "react"
import { Plus } from 'lucide-react'
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { NoteCard } from "./note-card"
import { NoteForm } from "./note-form"
import type { Note } from "@/types/note"
import { toast } from "@/components/ui/use-toast"

export function NotesList() {
  const router = useRouter()
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | undefined>()

  useEffect(() => {
    fetchNotes()
  }, [])

  async function fetchNotes() {
    try {
      const response = await fetch("/api/notes")
      if (!response.ok) throw new Error("Fehler beim Laden der Notizen")
      const data = await response.json()
      setNotes(data)
    } catch (error) {
      console.error("Error:", error)
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Notizen konnten nicht geladen werden.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (note: Note) => {
    setSelectedNote(note)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Fehler beim Löschen der Notiz")

      setNotes(notes.filter(note => note.id !== id))
      toast({
        title: "Notiz gelöscht",
        description: "Die Notiz wurde erfolgreich gelöscht.",
      })
      router.refresh()
    } catch (error) {
      console.error("Error:", error)
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Beim Löschen der Notiz ist ein Fehler aufgetreten.",
      })
    }
  }

  if (isLoading) {
    return <div>Lade Notizen...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notizen</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Neue Notiz
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
        {notes.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            Keine Notizen vorhanden
          </div>
        )}
      </div>

      <NoteForm
        note={selectedNote}
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) setSelectedNote(undefined)
        }}
      />
    </div>
  )
}