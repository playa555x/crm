import { format, formatDistanceToNow, isValid } from "date-fns"
import { de } from "date-fns/locale"
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Note } from "@/types/note"

interface NoteCardProps {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Kein Datum"
    
    const date = new Date(dateString)
    if (!isValid(date)) return "Ungültiges Datum"

    try {
      return {
        relative: formatDistanceToNow(date, {
          addSuffix: true,
          locale: de,
        }),
        absolute: format(date, "dd.MM.yyyy HH:mm", { locale: de })
      }
    } catch (error) {
      console.error("Error formatting date:", error)
      return {
        relative: "Datum nicht verfügbar",
        absolute: "Datum nicht verfügbar"
      }
    }
  }

  const createdDate = formatDate(note.created_at)
  const updatedDate = formatDate(note.updated_at)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Link href={`/notes/${note.id}`} className="hover:underline">
            {note.title}
          </Link>
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Menü öffnen</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(note)}>
              <Pencil className="mr-2 h-4 w-4" />
              Bearbeiten
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => {
                if (confirm("Möchten Sie diese Notiz wirklich löschen?")) {
                  onDelete(note.id)
                }
              }}
              className="text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Löschen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {note.content || "Keine Notiz"}
        </p>
        <div className="mt-2 text-xs text-muted-foreground">
          <div title={createdDate.absolute}>Erstellt: {createdDate.relative}</div>
          {note.updated_at !== note.created_at && (
            <div title={updatedDate.absolute}>Aktualisiert: {updatedDate.relative}</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}