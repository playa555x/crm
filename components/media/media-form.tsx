// Vollständiger Pfad: /components/media/media-form.tsx

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Media } from "@/types/media"

interface MediaFormProps {
  media?: Media
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function MediaForm({ media, open, onOpenChange, onSuccess }: MediaFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const title = formData.get("title") as string
      const description = formData.get("description") as string

      if (media) {
        // Update existing media
        const { error } = await fetch(`/api/media/${media.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            title,
            description,
          }),
        }).then(res => res.json())

        if (error) throw error
      } else if (file) {
        // Upload new file
        const fileExt = file.name.split(".").pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        // 1. Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("media")
          .upload(filePath, file)

        if (uploadError) throw uploadError

        // 2. Create database entry
        const { error: dbError } = await fetch("/api/media", {
          method: "POST",
          body: JSON.stringify({
            title,
            description,
            file_path: filePath,
            file_type: file.type.split("/")[0],
            mime_type: file.type,
            size: file.size,
          }),
        }).then(res => res.json())

        if (dbError) throw dbError
      }

      onSuccess?.()
      router.refresh()
      onOpenChange(false)
    } catch (error) {
      console.error("Error:", error)
      alert("Ein Fehler ist aufgetreten")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {media ? "Medium bearbeiten" : "Neues Medium hochladen"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titel</Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={media?.title}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={media?.description || ""}
            />
          </div>
          {!media && (
            <div className="space-y-2">
              <Label htmlFor="file">Datei</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
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