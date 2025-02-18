'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Wand2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function WorkflowAIPage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Here you would integrate with your AI service
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)
    // Navigate to workflow builder with pre-filled template
    router.push('/workflow')
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Zurück
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>KI-Assistent für Workflow-Erstellung</CardTitle>
          <CardDescription>
            Beschreiben Sie in natürlicher Sprache, was Ihr Workflow tun soll.
            Der KI-Assistent wird daraus einen passenden Workflow erstellen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="z.B.: Sende eine E-Mail an den Vertriebsmitarbeiter, wenn ein neuer Lead erstellt wird und erstelle nach 3 Tagen eine Erinnerung zur Nachverfolgung, falls der Lead noch nicht kontaktiert wurde."
            className="min-h-[200px]"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button 
            onClick={handleGenerate} 
            disabled={!prompt.trim() || isGenerating}
            className="w-full"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {isGenerating ? 'Workflow wird erstellt...' : 'Workflow erstellen'}
          </Button>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Beispiele:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Wenn ein Deal die Phase "Verhandlung" erreicht, plane ein Meeting mit dem Kunden ein</li>
              <li>• Sende eine Willkommens-E-Mail an neue Kontakte und erstelle nach einer Woche eine Aufgabe zur Nachverfolgung</li>
              <li>• Wenn ein Deal 30 Tage inaktiv ist, benachrichtige den Vertriebsleiter und den zuständigen Mitarbeiter</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

