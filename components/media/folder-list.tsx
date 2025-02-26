"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Folder } from 'lucide-react'
import { Button } from "@/components/ui/button"
import type { Folder as FolderType } from "@/types/media"

interface FolderListProps {
  contactId: string
  selectedFolderId: string | null
  onFolderSelect: (folderId: string | null) => void
}

export const FolderList = forwardRef<{ reloadFolders: () => void }, FolderListProps>(
  ({ contactId, selectedFolderId, onFolderSelect }, ref) => {
    const [folders, setFolders] = useState<FolderType[]>([])

    async function loadFolders() {
      try {
        console.log("Loading folders for contact:", contactId)
        const response = await fetch(`/api/folders?contactId=${contactId}`)
        if (!response.ok) throw new Error("Failed to load folders")
        const data = await response.json()
        console.log("Loaded folders:", data)
        setFolders(data)
      } catch (error) {
        console.error("Error loading folders:", error)
      }
    }

    useEffect(() => {
      if (contactId) {
        loadFolders()
      }
    }, [contactId])

    useImperativeHandle(ref, () => ({
      reloadFolders: loadFolders
    }))

    return (
      <div className="space-y-2">
        <Button
          variant={selectedFolderId === null ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onFolderSelect(null)}
        >
          <Folder className="mr-2 h-4 w-4" />
          Alle Dateien
        </Button>
        {folders.map((folder) => (
          <Button
            key={folder.id}
            variant={selectedFolderId === folder.id ? "secondary" : "ghost"}
            className="w-full justify-start"
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