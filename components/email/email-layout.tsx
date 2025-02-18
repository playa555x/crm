'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Mail, Inbox, Send, File, Trash2, Star, AlertCircle, Settings, Plus, Search, Paperclip } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { EmailList } from "./email-list"
import { ComposeEmail } from "./compose-email"
import { EmailSettings } from "./email-settings"
import { EmailViewer } from "./email-viewer"
import { EmailLogin } from "./email-login"
import { ResizablePanel } from "./resizable-panel"

const newPastelColors = {
  lavender: '#E6E6FA',
  peach: '#FFDAB9',
  mint: '#98FB98',
  coral: '#FFB6C1',
};

interface NavItem {
  icon: React.ElementType
  label: string
  count?: number
}

const defaultFolders: NavItem[] = [
  { icon: Inbox, label: "Posteingang", count: 12 },
  { icon: Star, label: "Markiert", count: 3 },
  { icon: Send, label: "Gesendet" },
  { icon: File, label: "Entwürfe", count: 2 },
  { icon: Trash2, label: "Papierkorb" },
  { icon: AlertCircle, label: "Spam" },
]

export function EmailLayout() {
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState("Posteingang")
  const [selectedEmail, setSelectedEmail] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = (provider: string) => {
    // Hier würde die tatsächliche Login-Logik implementiert werden
    console.log(`Logging in with ${provider}`)
    setIsLoggedIn(true)
    setIsLoginOpen(false)
  }

  const handleEmailSelect = (email: any) => {
    setSelectedEmail(email)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left Sidebar */}
      <ResizablePanel defaultSize={20}>
        <div className="w-full h-full border-r bg-background p-4 flex flex-col">
          <Button 
            className="w-full mb-4" 
            onClick={() => setIsComposeOpen(true)}
            style={{ backgroundColor: newPastelColors.lavender, color: 'black' }}
          >
            <Plus className="mr-2 h-4 w-4" /> Neue E-Mail
          </Button>
          
          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {defaultFolders.map((folder) => (
                <Button
                  key={folder.label}
                  variant={selectedFolder === folder.label ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedFolder(folder.label)}
                >
                  <folder.icon className="mr-2 h-4 w-4" />
                  {folder.label}
                  {folder.count && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {folder.count}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </ScrollArea>

          <Separator className="my-4" />
          
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Einstellungen
          </Button>
        </div>
      </ResizablePanel>

      {/* Main Content */}
      <ResizablePanel defaultSize={40}>
        <div className="flex-1 flex flex-col">
          <div className="border-b p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="E-Mails durchsuchen..."
                className="pl-10 w-full"
              />
            </div>
          </div>
          {isLoggedIn ? (
            <EmailList folder={selectedFolder} onEmailSelect={handleEmailSelect} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Button onClick={() => setIsLoginOpen(true)}>E-Mail-Konto einrichten</Button>
            </div>
          )}
        </div>
      </ResizablePanel>

      {/* Email Viewer */}
      <ResizablePanel defaultSize={40}>
        {selectedEmail ? (
          <EmailViewer email={selectedEmail} />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Wählen Sie eine E-Mail aus, um sie anzuzeigen
          </div>
        )}
      </ResizablePanel>

      {/* Compose Email Dialog */}
      <ComposeEmail 
        open={isComposeOpen} 
        onOpenChange={setIsComposeOpen} 
      />

      {/* Settings Dialog */}
      <EmailSettings
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />

      {/* Login Dialog */}
      <EmailLogin
        open={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onLogin={handleLogin}
      />
    </div>
  )
}

