"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { de } from "date-fns/locale"
import { MoreHorizontal, Pencil, Trash, Download, FileText, ImageIcon, File } from "lucide-react"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

  const isImage = media.file_type === "image"
  const isPDF = media.mime_type === "application/pdf"

  // Get public URL for the file
  const { data } = supabase.storage.from("media").getPublicUrl(media.file_path)
  const publicUrl = data?.publicUrl

  // Bestimme das passende Icon basierend auf dem Dateityp
  const FileTypeIcon = () => {
    if (isImage) return <ImageIcon className="h-12 w-12 text-muted-foreground" />
    if (isPDF) return <FileText className="h-12 w-12 text-muted-foreground" />
    return <File className="h-12 w-12 text-muted-foreground" />
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative aspect-video cursor-pointer bg-muted" onClick={() => setPreviewOpen(true)}>
            {isImage && publicUrl ? (
              <Image
                src={publicUrl || "/placeholder.svg"}
                alt={media.title}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <FileTypeIcon />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{media.title}</h3>
              <p className="text-sm text-muted-foreground">{media.description || "Keine Beschreibung"}</p>
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
          Hochgeladen{" "}
          {formatDistanceToNow(new Date(media.created_at), {
            addSuffix: true,
            locale: de,
          })}
        </CardFooter>
      </Card>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{media.title}</DialogTitle>
            <DialogDescription>{media.description || "Keine Beschreibung verfügbar"}</DialogDescription>
          </DialogHeader>
          {isImage && publicUrl ? (
            <div className="relative aspect-video">
              <Image
                src={publicUrl || "/placeholder.svg"}
                alt={media.title}
                fill
                className="object-contain"
                onError={() => setImageError(true)}
                sizes="100vw"
                priority
              />
            </div>
          ) : isPDF && publicUrl ? (
            <iframe src={publicUrl} className="w-full h-[80vh]" title={media.title} />
          ) : (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <FileTypeIcon />
              </div>
              <p className="mb-4 text-muted-foreground">Vorschau nicht verfügbar für diesen Dateityp</p>
              <Button onClick={() => onDownload(media)}>
                <Download className="mr-2 h-4 w-4" />
                Datei herunterladen
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

