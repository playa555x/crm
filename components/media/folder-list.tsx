"use client"

import { useState, useEffect } from "react"
import { Folder } from 'lucide-react'
import { Button } from "@/components/ui/button"
import type { Folder as FolderType } from "@/types/media"

interface FolderListProps {
  contactId: string
  selectedFolderId: string | null
  onFolderSelect: (folderId: string | null) => void
}

export function FolderList({ contactId, selectedFolderId, onFolderSelect }: FolderListProps) {
  const [folders, setFolders] = useState<FolderType[]>([])

  useEffect(() => {
    loadFolders()
  }, [contactId])

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