import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { MediaGrid } from "./media-grid"
import { MediaForm } from "./media-form"
import { FolderForm } from "./folder-form"
import { FolderList } from "./folder-list"
import { Button } from "@/components/ui/button"
import { Plus, FolderPlus } from 'lucide-react'
import type { Media } from "@/types/media"
import { useRef } from "react"

interface ContactMediaProps {
  contactId: string
}

export function ContactMedia({ contactId }: ContactMediaProps) {
  const [isMediaFormOpen, setIsMediaFormOpen] = useState(false)
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false)
  const [media, setMedia] = useState<Media[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadMedia()
  }, [contactId, selectedFolderId])

  async function loadMedia() {
    try {
      let url = `/api/media?contactId=${contactId}`
      if (selectedFolderId) {
        url += `&folderId=${selectedFolderId}`
      }
      const response = await fetch(url)
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
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-1 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Ordner</h3>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFolderFormOpen(true)}
          >
            <FolderPlus className="h-4 w-4" />
          </Button>
        </div>
<FolderList
  ref={folderListRef}
  contactId={contactId}
  selectedFolderId={selectedFolderId}
  onFolderSelect={setSelectedFolderId}
/>
      </div>

      <div className="col-span-3 space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => setIsMediaFormOpen(true)}>
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
      </div>

      <MediaForm
        open={isMediaFormOpen}
        onOpenChange={setIsMediaFormOpen}
        onSuccess={() => {
          loadMedia()
          setIsMediaFormOpen(false)
        }}
        contactId={contactId}
        folderId={selectedFolderId}
      />

<FolderForm
  open={isFolderFormOpen}
  onOpenChange={setIsFolderFormOpen}
  onSuccess={() => {
    folderListRef.current?.reloadFolders() // Lade die Ordnerliste neu
    loadMedia()
    setIsFolderFormOpen(false)
  }}
  contactId={contactId}
/>
    </div>
  )
}