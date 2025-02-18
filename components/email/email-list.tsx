'use client'

import { useState } from 'react'
import { Mail, Star, Paperclip } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"

const newPastelColors = {
  lavender: '#E6E6FA',
  peach: '#FFDAB9',
  mint: '#98FB98',
  coral: '#FFB6C1',
};

interface Email {
  id: string
  from: string
  subject: string
  preview: string
  date: string
  isStarred: boolean
  hasAttachment: boolean
  isRead: boolean
}

const dummyEmails: Email[] = [
  {
    id: "1",
    from: "Max Mustermann",
    subject: "Projekt Update",
    preview: "Hier ist der aktuelle Stand des Projekts...",
    date: "10:30",
    isStarred: true,
    hasAttachment: true,
    isRead: false,
  },
  {
    id: "2",
    from: "Anna Schmidt",
    subject: "Meeting Protokoll",
    preview: "Anbei das Protokoll von heute Morgen...",
    date: "09:15",
    isStarred: false,
    hasAttachment: true,
    isRead: true,
  },
  // Add more dummy emails as needed
]

interface EmailListProps {
  folder: string
  onEmailSelect: (email: Email) => void
}

export function EmailList({ folder, onEmailSelect }: EmailListProps) {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null)

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email.id)
    onEmailSelect(email)
  }

  return (
    <ScrollArea className="flex-1">
      <div className="divide-y">
        {dummyEmails.map((email) => (
          <div
            key={email.id}
            className={`flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer ${
              !email.isRead ? "bg-muted/30 font-medium" : ""
            } ${selectedEmail === email.id ? "bg-muted" : ""}`}
            onClick={() => handleEmailClick(email)}
          >
            <Checkbox />
            <button
              className={`p-1 rounded-full hover:bg-muted ${
                email.isStarred ? "text-yellow-500" : "text-muted-foreground"
              }`}
            >
              <Star className="h-4 w-4" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate">{email.from}</span>
                {email.hasAttachment && (
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">{email.subject}</span>
                <span className="text-muted-foreground truncate">
                  - {email.preview}
                </span>
              </div>
            </div>
            <span 
              className="text-sm text-muted-foreground whitespace-nowrap px-2 py-1 rounded-full"
              style={{ backgroundColor: newPastelColors.coral }}
            >
              {email.date}
            </span>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

