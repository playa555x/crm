import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface EmailSettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmailSettings({ open, onOpenChange }: EmailSettingsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] h-[600px]">
        <DialogHeader>
          <DialogTitle>E-Mail-Einstellungen</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="encryption" className="h-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="encryption">Verschlüsselung</TabsTrigger>
            <TabsTrigger value="security">Sicherheit</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="features">Funktionen</TabsTrigger>
            <TabsTrigger value="general">Allgemein</TabsTrigger>
          </TabsList>
          <ScrollArea className="h-[450px] mt-4">
            <TabsContent value="encryption" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Verschlüsselte Übertragung (TLS)</Label>
                    <p className="text-sm text-muted-foreground">
                      Aktiviert die TLS-Verschlüsselung für alle E-Mails
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Ende-zu-Ende Verschlüsselung</Label>
                    <p className="text-sm text-muted-foreground">
                      Aktiviert die Ende-zu-Ende-Verschlüsselung für alle E-Mails
                    </p>
                  </div>
                  <Switch />
                </div>
                {/* Add more encryption settings */}
              </div>
            </TabsContent>
            <TabsContent value="security" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Zwei-Faktor-Authentifizierung</Label>
                    <p className="text-sm text-muted-foreground">
                      Zusätzliche Sicherheit durch 2FA
                    </p>
                  </div>
                  <Switch />
                </div>
                {/* Add more security settings */}
              </div>
            </TabsContent>
            <TabsContent value="business" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Eigene Domains</Label>
                    <p className="text-sm text-muted-foreground">
                      Verwalten Sie Ihre eigenen E-Mail-Domains
                    </p>
                  </div>
                  <Switch />
                </div>
                {/* Add more business settings */}
              </div>
            </TabsContent>
            <TabsContent value="features" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Offline-Unterstützung</Label>
                    <p className="text-sm text-muted-foreground">
                      E-Mails offline verfügbar machen
                    </p>
                  </div>
                  <Switch />
                </div>
                {/* Add more feature settings */}
              </div>
            </TabsContent>
            <TabsContent value="general" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatische Antworten</Label>
                    <p className="text-sm text-muted-foreground">
                      Konfigurieren Sie automatische Antworten
                    </p>
                  </div>
                  <Switch />
                </div>
                {/* Add more general settings */}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

