import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

interface FolderFormProps {
  contactId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function FolderForm({ contactId, open, onOpenChange, onSuccess }: FolderFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const name = formData.get("name") as string

      const response = await fetch("/api/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          contact_id: contactId,
        }),
      })

      if (!response.ok) throw new Error("Fehler beim Erstellen des Ordners")

      router.refresh()
      onOpenChange(false)
      toast({
        title: "Ordner erstellt",
        description: "Der Ordner wurde erfolgreich erstellt.",
      })
      onSuccess?.()
    } catch (error) {
      console.error("Error:", error)
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Beim Erstellen des Ordners ist ein Fehler aufgetreten.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neuen Ordner erstellen</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Ordnername eingeben"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Abbrechen
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Wird erstellt..." : "Erstellen"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}