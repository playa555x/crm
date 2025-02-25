import { Suspense } from "react"
import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { ArrowLeft } from 'lucide-react'
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

export default async function NotePage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  const { data: note, error } = await supabase
    .from("notes")
    .select("*, contacts(*)")
    .eq("id", params.id)
    .single()

  if (error || !note) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/notes" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Übersicht
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{note.title}</h1>
          {note.contacts && (
            <Link 
              href={`/contacts/${note.contacts.id}`}
              className="text-sm text-muted-foreground hover:underline"
            >
              Verknüpft mit: {note.contacts.first_name} {note.contacts.last_name}
            </Link>
          )}
        </div>

        <div className="prose dark:prose-invert max-w-none">
          {note.content}
        </div>

        <div className="text-sm text-muted-foreground">
          Erstellt am: {formatDate(note.created_at)}
          {note.updated_at !== note.created_at && (
            <> | Zuletzt bearbeitet: {formatDate(note.updated_at)}</>
          )}
        </div>
      </div>
    </div>
  )
}