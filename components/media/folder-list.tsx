"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Folder } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Folder as FolderType } from "@/types/media"

interface FolderListProps {
  contactId: string
  selectedFolderId: string | null
  onFolderSelect: (folderId: string | null) => void
}

export const FolderList = forwardRef<{ reloadFolders: () => void }, FolderListProps>(
  ({ contactId, selectedFolderId, onFolderSelect }, ref) => {
    const [folders, setFolders] = useState<FolderType[]>([])
    const [currentFolder, setCurrentFolder] = useState<FolderType | null>(null)

    async function loadFolders() {
      try {
        console.log("Loading folders for contact:", contactId)
        const response = await fetch(`/api/folders?contactId=${contactId}`)
        if (!response.ok) throw new Error("Failed to load folders")
        const data = await response.json()
        console.log("Loaded folders:", data)
        setFolders(data)
        
        // Set current folder if one is selected
        if (selectedFolderId) {
          const current = data.find((f: FolderType) => f.id === selectedFolderId)
          setCurrentFolder(current || null)
        } else {
          setCurrentFolder(null)
        }
      } catch (error) {
        console.error("Error loading folders:", error)
      }
    }

    useEffect(() => {
      if (contactId) {
        loadFolders()
      }
    }, [contactId, selectedFolderId])

    useImperativeHandle(ref, () => ({
      reloadFolders: loadFolders
    }))

    return (
      <div className="space-y-2">
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Aktueller Ordner:</h3>
          <p className="text-sm text-muted-foreground">
            {currentFolder ? currentFolder.name : "Alle Dateien"}
          </p>
        </div>
        <Button
          variant={selectedFolderId === null ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start",
            selectedFolderId === null && "bg-accent text-accent-foreground"
          )}
          onClick={() => onFolderSelect(null)}
        >
          <Folder className="mr-2 h-4 w-4" />
          Alle Dateien
        </Button>
        {folders.map((folder) => (
          <Button
            key={folder.id}
            variant={selectedFolderId === folder.id ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              selectedFolderId === folder.id && "bg-accent text-accent-foreground"
            )}
            onClick={() => onFolderSelect(folder.id)}
          >
            <Folder className="mr-2 h-4 w-4" />
            {folder.name}
          </Button>
        ))}
      </div>
    )
  }
)

FolderList.displayName = "FolderList"