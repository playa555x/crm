import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Reply, Forward, Trash2 } from 'lucide-react'

interface EmailViewerProps {
  email: {
    from: string
    subject: string
    date: string
    content: string
  }
}

export function EmailViewer({ email }: EmailViewerProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold">{email.subject}</h2>
        <p className="text-sm text-muted-foreground">
          Von: {email.from} | {email.date}
        </p>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div dangerouslySetInnerHTML={{ __html: email.content }} />
      </ScrollArea>
      <div className="p-4 border-t flex justify-between">
        <div>
          <Button variant="outline" className="mr-2">
            <Reply className="mr-2 h-4 w-4" />
            Antworten
          </Button>
          <Button variant="outline">
            <Forward className="mr-2 h-4 w-4" />
            Weiterleiten
          </Button>
        </div>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Löschen
        </Button>
      </div>
    </div>
  )
}

