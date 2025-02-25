import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { MediaGrid } from "./media-grid"
import { MediaForm } from "./media-form"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import type { Media } from "@/types/media"

interface ContactMediaProps {
  contactId: string
}

export function ContactMedia({ contactId }: ContactMediaProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [media, setMedia] = useState<Media[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadMedia()
  }, [contactId])

  async function loadMedia() {
    try {
      const response = await fetch(`/api/media?contactId=${contactId}`)
      const data = await response.json()
      setMedia(data)
    } catch (error) {
      console.error("Error loading media:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDownload(media: Media) {
    try {
      const { data, error } = await supabase.storage
        .from("media")
        .download(media.file_path)

      if (error) throw error

      const url = window.URL.createObjectURL(data)
      const link = document.createElement("a")
      link.href = url
      link.download = media.title
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading file:", error)
      alert("Fehler beim Herunterladen der Datei")
    }
  }

  async function handleDelete(id: string) {
    try {
      const mediaToDelete = media.find(m => m.id === id)
      if (!mediaToDelete) return

      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from("media")
        .remove([mediaToDelete.file_path])

      if (storageError) throw storageError

      // Delete database entry
      const { error: dbError } = await fetch(`/api/media/${id}`, {
        method: "DELETE",
      }).then(res => res.json())

      if (dbError) throw dbError

      await loadMedia()
    } catch (error) {
      console.error("Error deleting media:", error)
      alert("Fehler beim Löschen der Datei")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Datei hochladen
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Lädt...</p>
        </div>
      ) : (
        <MediaGrid
          media={media}
          onEdit={(media) => {
            // TODO: Implement edit functionality
            console.log("Edit media:", media)
          }}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      )}

      <MediaForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={() => {
          loadMedia()
          setIsFormOpen(false)
        }}
        contactId={contactId}
      />
    </div>
  )
}