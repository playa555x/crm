import { Suspense } from "react"
import { NotesList } from "@/components/notes/notes-list"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notizen | CRM",
  description: "Verwalten Sie Ihre Notizen",
}

export default function NotesPage() {
  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={
        <div className="flex items-center justify-center h-32">
          Lade Notizen...
        </div>
      }>
        <NotesList />
      </Suspense>
    </div>
  )
}