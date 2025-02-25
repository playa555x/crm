// Vollständiger Pfad: /components/media/media-grid.tsx

import { MediaCard } from "./media-card"
import type { Media } from "@/types/media"

interface MediaGridProps {
  media: Media[]
  onEdit: (media: Media) => void
  onDelete: (id: string) => void
  onDownload: (media: Media) => void
}

export function MediaGrid({ media, onEdit, onDelete, onDownload }: MediaGridProps) {
  if (media.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Keine Medien vorhanden</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {media.map((item) => (
        <MediaCard
          key={item.id}
          media={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onDownload={onDownload}
        />
      ))}
    </div>
  )
}