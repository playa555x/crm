// Vollständiger Pfad: /components/media/media-card.tsx

import { formatDistanceToNow } from "date-fns"
import { de } from "date-fns/locale"
import { MoreHorizontal, Pencil, Trash, Download } from 'lucide-react'
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
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
  const isImage = media.file_type === 'image'

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        {isImage ? (
          <div className="relative aspect-video">
            <Image
              src={media.file_path || "/placeholder.svg"}
              alt={media.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="relative aspect-video bg-muted flex items-center justify-center">
            <span className="text-muted-foreground uppercase">
              {media.file_type}
            </span>
          </div>
        )}
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
  )
}