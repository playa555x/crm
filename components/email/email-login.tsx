import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EmailLoginProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogin: (provider: string) => void
}

export function EmailLogin({ open, onOpenChange, onLogin }: EmailLoginProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>E-Mail-Konto einrichten</DialogTitle>
          <DialogDescription>
            Wählen Sie Ihren E-Mail-Anbieter aus, um sich anzumelden.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button onClick={() => onLogin('outlook')}>Mit Outlook anmelden</Button>
          <Button onClick={() => onLogin('gmail')}>Mit Gmail anmelden</Button>
          <Button onClick={() => onLogin('yahoo')}>Mit Yahoo anmelden</Button>
          <Button onClick={() => onLogin('other')}>Anderer E-Mail-Anbieter</Button>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

