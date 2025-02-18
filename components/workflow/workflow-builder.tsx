'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, ArrowRight, X } from 'lucide-react'

interface WorkflowStep {
  id: string
  type: string
  config: Record<string, any>
}

interface Workflow {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
}

const stepTypes = [
  { value: 'trigger', label: 'Trigger' },
  { value: 'condition', label: 'Bedingung' },
  { value: 'action', label: 'Aktion' },
  { value: 'delay', label: 'Zeitverzögerung' },
  { value: 'email', label: 'E-Mail senden' },
]

export function WorkflowBuilder() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow>({
    id: '1',
    name: '',
    description: '',
    steps: []
  })

  const addStep = () => {
    setCurrentWorkflow(prev => ({
      ...prev,
      steps: [...prev.steps, { id: Date.now().toString(), type: '', config: {} }]
    }))
  }

  const removeStep = (stepId: string) => {
    setCurrentWorkflow(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
    }))
  }

  const updateStep = (stepId: string, type: string) => {
    setCurrentWorkflow(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId ? { ...step, type } : step
      )
    }))
  }

  const saveWorkflow = () => {
    if (currentWorkflow.name.trim() === '') return
    setWorkflows(prev => [...prev, currentWorkflow])
    setCurrentWorkflow({ id: Date.now().toString(), name: '', description: '', steps: [] })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Neue Automatisierung erstellen</CardTitle>
          <CardDescription>
            Definieren Sie die Schritte Ihrer Automatisierung
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={currentWorkflow.name}
                onChange={(e) => setCurrentWorkflow(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Name der Automatisierung"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                value={currentWorkflow.description}
                onChange={(e) => setCurrentWorkflow(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Beschreiben Sie die Automatisierung"
              />
            </div>
          </div>

          <div className="space-y-4">
            {currentWorkflow.steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{index + 1}.</span>
                  <Select value={step.type} onValueChange={(value) => updateStep(step.id, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Schritt auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {stepTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStep(step.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                {index < currentWorkflow.steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            ))}
            <Button variant="outline" onClick={addStep}>
              <Plus className="mr-2 h-4 w-4" />
              Schritt hinzufügen
            </Button>
          </div>

          <Button onClick={saveWorkflow} disabled={currentWorkflow.name.trim() === ''}>
            Automatisierung speichern
          </Button>
        </CardContent>
      </Card>

      {workflows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Aktive Automatisierungen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <Card key={workflow.id}>
                  <CardHeader>
                    <CardTitle>{workflow.name}</CardTitle>
                    <CardDescription>{workflow.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      {workflow.steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                          <div className="px-2 py-1 rounded-md bg-secondary">
                            {stepTypes.find(t => t.value === step.type)?.label}
                          </div>
                          {index < workflow.steps.length - 1 && (
                            <ArrowRight className="h-4 w-4 mx-2" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

