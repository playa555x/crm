'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Mail, MessageSquare, PenTool, Plus, Search, Settings, Users, Workflow, FileSpreadsheet, BrainCircuit } from 'lucide-react'
import { WorkflowBuilder } from './workflow-builder'
import { WorkflowHistory } from './workflow-history'
import { WorkflowTemplates } from './workflow-templates'

const filterCategories = [
  { icon: MessageSquare, label: 'Privat' },
  { icon: Mail, label: 'E-Mail' },
  { icon: Users, label: 'Kampagnen' },
  { icon: Calendar, label: 'Aktivität' },
  { icon: Settings, label: 'Deal' },
  { icon: Users, label: 'Lead' },
  { icon: MessageSquare, label: 'Slack' },
  { icon: Users, label: 'Teams' },
  { icon: Calendar, label: 'Asana' },
  { icon: Settings, label: 'Trello' },
]

export function WorkflowPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Automatisierungen</h1>
          <p className="text-muted-foreground">
            Erstellen und verwalten Sie Ihre Workflow-Automatisierungen
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.href = '/workflow/ai'}>
            <BrainCircuit className="mr-2 h-4 w-4" />
            KI-Assistent
          </Button>
          <Button onClick={() => window.location.href = '/workflow/new'}>
            <Plus className="mr-2 h-4 w-4" />
            Neue Automatisierung
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Automatisierungen durchsuchen..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {filterCategories.map((category) => (
          <Button key={category.label} variant="outline" className="gap-2">
            <category.icon className="h-4 w-4" />
            {category.label}
          </Button>
        ))}
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Vorlagen</TabsTrigger>
          <TabsTrigger value="automations">Automatisierungen</TabsTrigger>
          <TabsTrigger value="history">Verlauf</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <WorkflowTemplates />
        </TabsContent>

        <TabsContent value="automations">
          <WorkflowBuilder />
        </TabsContent>

        <TabsContent value="history">
          <WorkflowHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}

