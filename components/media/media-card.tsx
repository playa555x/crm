import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { de } from "date-fns/locale"
import { MoreHorizontal, Pencil, Trash, Download } from 'lucide-react'
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Media } from "@/types/media"

interface MediaCardProps {
  media: Media
  onEdit: (media: Media) => void
  onDelete: (id: string) => void
  onDownload: (media: Media) => void
}

export function MediaCard({ media, onEdit, onDelete, onDownload }: MediaCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const supabase = createClientComponentClient()
  
  const isImage = media.file_type === 'image'
  const isPDF = media.mime_type === 'application/pdf'
  
  // Get public URL for the file
  const { data } = supabase.storage.from('media').getPublicUrl(media.file_path)
  const publicUrl = data?.publicUrl

  // Fallback URL wenn keine public URL verfügbar
  const imageUrl = !imageError && publicUrl ? publicUrl : "/placeholder.svg"

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div 
            className="relative aspect-video cursor-pointer" 
            onClick={() => setPreviewOpen(true)}
          >
            {isImage ? (
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={media.title}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
                loading="lazy"
              />
            ) : (
              <div className="relative aspect-video bg-muted flex items-center justify-center">
                <span className="text-muted-foreground uppercase">
                  {media.file_type}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{media.title}</h3>
              <p className="text-sm text-muted-foreground">
                {media.description || "Keine Beschreibung"}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Menü öffnen</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onDownload(media)}>
                  <Download className="mr-2 h-4 w-4" />
                  Herunterladen
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(media)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Bearbeiten
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (confirm("Möchten Sie diese Datei wirklich löschen?")) {
                      onDelete(media.id)
                    }
                  }}
                  className="text-destructive"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Löschen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
          Hochgeladen {formatDistanceToNow(new Date(media.created_at), {
            addSuffix: true,
            locale: de,
          })}
        </CardFooter>
      </Card>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{media.title}</DialogTitle>
          </DialogHeader>
          {isImage ? (
            <div className="relative aspect-video">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={media.title}
                fill
                className="object-contain"
                onError={() => setImageError(true)}
                sizes="100vw"
                priority
              />
            </div>
          ) : isPDF ? (
            <iframe
              src={publicUrl}
              className="w-full h-[80vh]"
              title={media.title}
            />
          ) : (
            <div className="text-center py-8">
              <p>Vorschau nicht verfügbar</p>
              <Button onClick={() => onDownload(media)} className="mt-4">
                Herunterladen
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}