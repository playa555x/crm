import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Paperclip, Send } from 'lucide-react'

interface ComposeEmailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ComposeEmail({ open, onOpenChange }: ComposeEmailProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Neue E-Mail</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="to">An</Label>
            <Input id="to" type="email" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">Betreff</Label>
            <Input id="subject" />
          </div>
          <div className="grid gap-2">
            <Textarea
              className="min-h-[300px]"
              placeholder="Schreiben Sie Ihre Nachricht..."
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button>
              <Send className="mr-2 h-4 w-4" /> Senden
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

