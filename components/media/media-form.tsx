"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Media, Folder } from "@/types/media"

interface MediaFormProps {
  media?: Media
  contactId?: string
  folderId?: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function MediaForm({ media, contactId, folderId, open, onOpenChange, onSuccess }: MediaFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [folders, setFolders] = useState<Folder[]>([])
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(folderId || null)

  useEffect(() => {
    if (contactId) {
      loadFolders()
    }
  }, [contactId])

  useEffect(() => {
    setSelectedFolderId(folderId || null)
  }, [folderId])

  async function loadFolders() {
    try {
      const response = await fetch(`/api/folders?contactId=${contactId}`)
      if (!response.ok) throw new Error("Failed to load folders")
      const data = await response.json()
      setFolders(data)
    } catch (error) {
      console.error("Error loading folders:", error)
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const title = formData.get("title") as string
      const description = formData.get("description") as string

      if (!title) {
        throw new Error("Titel ist erforderlich")
      }

      if (media) {
        // Update existing media
        const response = await fetch(`/api/media/${media.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            folder_id: selectedFolderId,
          }),
        })

        if (!response.ok) {
          throw new Error("Fehler beim Aktualisieren der Mediendatei")
        }
      } else if (selectedFile) {
        // Validate file size (max 10MB)
        if (selectedFile.size > 10 * 1024 * 1024) {
          throw new Error("Datei zu groß (max. 10MB)")
        }

        // Create structured file path
        const fileExt = selectedFile.name.split(".").pop()
        const fileName = `${contactId}/${selectedFolderId || "uncategorized"}/${Date.now()}.${fileExt}`

        // 1. Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("media")
          .upload(fileName, selectedFile, {
            cacheControl: "3600",
            upsert: false,
          })

        if (uploadError) throw uploadError

        // 2. Create database entry
        const response = await fetch("/api/media", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            file_path: fileName,
            file_type: selectedFile.type.split("/")[0],
            mime_type: selectedFile.type,
            size: selectedFile.size,
            contactId: contactId,
            folderId: selectedFolderId,
          }),
        })

        if (!response.ok) {
          throw new Error("Fehler beim Erstellen des Medieneintrags")
        }
      }

      onSuccess?.()
      router.refresh()
      onOpenChange(false)
    } catch (error: any) {
      console.error("Error:", error)
      alert(error.message || "Ein Fehler ist aufgetreten")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{media ? "Medium bearbeiten" : "Neues Medium hochladen"}</DialogTitle>
          <DialogDescription>
            {media
              ? "Bearbeiten Sie die Details des ausgewählten Mediums."
              : "Laden Sie ein neues Medium hoch und fügen Sie die erforderlichen Details hinzu. Maximale Dateigröße: 10MB."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titel</Label>
            <Input id="title" name="title" required defaultValue={media?.title} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea id="description" name="description" defaultValue={media?.description || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="folder">Ordner</Label>
            <Select value={selectedFolderId || undefined} onValueChange={setSelectedFolderId}>
              <SelectTrigger id="folder" className="w-full">
                <SelectValue placeholder="Ordner auswählen" />
              </SelectTrigger>
              <SelectContent>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {!media && (
            <div className="space-y-2">
              <Label htmlFor="file">Datei</Label>
              <Input
                id="file"
                name="file"
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                required
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Wird gespeichert..." : "Speichern"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}