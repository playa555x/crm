'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, ArrowLeft, Bell } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PipelineCategory, Pipeline, Stage, Deal } from '@/types/deal'
import { toast } from "@/components/ui/use-toast"
import { getPipelineCategoriesWithDeals, updateDealStatus, invoiceSteps } from '@/data/dealData'

const pastelColors = {
  blue: '#A7C7E7',
  green: '#C1E1C1',
  yellow: '#FFEFD5',
  pink: '#FFD1DC',
  purple: '#E6E6FA',
}

// Mock data for pipeline categories
const initialPipelineCategories: PipelineCategory[] = [
  {
    id: 'category1',
    name: 'Verkaufspipeline',
    pipelines: [
      {
        id: 'pipeline1',
        name: 'Hauptpipeline',
        stages: [
          { id: 'stage1', name: 'Lead', deals: [] },
          { id: 'stage2', name: 'Qualifiziert', deals: [] },
          { id: 'stage3', name: 'Angebot', deals: [] },
          { id: 'stage4', name: 'Verhandlung', deals: [] },
          { id: 'stage5', name: 'Abgeschlossen', deals: [] },
        ],
      },
      {
        id: 'pipeline2',
        name: 'Netzanfrage',
        stages: [
          { id: 'stage6', name: 'Netzanfrage', deals: [] },
          { id: 'stage7', name: 'Bearbeitung VNB', deals: [] },
          { id: 'stage8', name: 'Netzbestätigung', deals: [] },
          { id: 'stage9', name: 'Warenbestellung', deals: [] },
          { id: 'stage10', name: 'Warenversand', deals: [] },
        ],
      },
      {
        id: 'pipeline3',
        name: 'Montage',
        stages: [
          { id: 'stage11', name: 'Terminieren', deals: [] },
          { id: 'stage12', name: 'In Planung', deals: [] },
          { id: 'stage13', name: 'Montage läuft', deals: [] },
          { id: 'stage14', name: 'Montage abgeschlossen', deals: [] },
          { id: 'stage15', name: 'Doku-Versand', deals: [] },
        ],
      },
      {
        id: 'pipeline4',
        name: 'Nachbearbeitung',
        stages: [
          { id: 'stage16', name: 'Qualitätsprüfung', deals: [] },
          { id: 'stage17', name: 'Beschwerden bearbeiten', deals: [] },
          { id: 'stage18', name: 'Nacharbeiten', deals: [] },
          { id: 'stage19', name: 'Abgeschlossen', deals: [] },
        ],
      },
    ],
  },
  {
    id: 'category2',
    name: 'Großanlagen',
    pipelines: [
      {
        id: 'pipeline5',
        name: 'Großanlagen Verkauf',
        stages: [
          { id: 'stage20', name: 'Anfrage', deals: [] },
          { id: 'stage21', name: 'Planung', deals: [] },
          { id: 'stage22', name: 'Angebot', deals: [] },
          { id: 'stage23', name: 'Verhandlung', deals: [] },
          { id: 'stage24', name: 'Abschluss', deals: [] },
        ],
      },
    ],
  },
]

export function Deals() {
  const [pipelineCategories, setPipelineCategories] = useState<PipelineCategory[]>(
    getPipelineCategoriesWithDeals(initialPipelineCategories)
  )
  const [selectedCategory, setSelectedCategory] = useState<PipelineCategory | null>(null)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [isAddPipelineOpen, setIsAddPipelineOpen] = useState(false)
  const [newPipeline, setNewPipeline] = useState<Omit<Pipeline, 'id' | 'stages'>>({
    name: '',
  })
  const [notifications, setNotifications] = useState<number>(0)

  useEffect(() => {
    // Simulate notifications
    setNotifications(Math.floor(Math.random() * 5))
  }, [])

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    // Dropped outside the list
    if (!destination) {
      return
    }

    const sourceStageId = source.droppableId
    const destStageId = destination.droppableId

    const newCategories = [...pipelineCategories]
    const category = newCategories.find(cat => cat.pipelines.some(pipeline => 
      pipeline.stages.some(stage => stage.id === sourceStageId || stage.id === destStageId)
    ))

    if (category) {
      const pipeline = category.pipelines.find(p => 
        p.stages.some(stage => stage.id === sourceStageId || stage.id === destStageId)
      )

      if (pipeline) {
        const sourceStage = pipeline.stages.find(stage => stage.id === sourceStageId)
        const destStage = pipeline.stages.find(stage => stage.id === destStageId)

        if (sourceStage && destStage) {
          const [movedDeal] = sourceStage.deals.splice(source.index, 1)
          destStage.deals.splice(destination.index, 0, movedDeal)

          // Update the status of the moved deal
          movedDeal.status = destStage.name
          const updatedDeal = updateDealStatus(movedDeal, destStage.name)

          // Perform actions based on the destination stage
          if (destStage.name === 'Netzanfrage') {
            handleNetzanfrageAction(updatedDeal)
          } else if (destStage.name === 'Netzbestätigung') {
            handleNetzbestaetigungAction(updatedDeal)
          } else if (destStage.name === 'Warenversand') {
            handleWarenversandAction(updatedDeal)
          } else if (destStage.name === 'Montage abgeschlossen') {
            handleMontageAbgeschlossenAction(updatedDeal)
          }

          setPipelineCategories(newCategories)
        }
      }
    }
  }

  const handleNetzanfrageAction = (deal: Deal) => {
    toast({
      title: "Netzanfrage gestartet",
      description: `Möchten Sie alle notwendigen Daten des Kunden an den Monteur senden und eine Rechnung über 10% erstellen?`,
      action: (
        <Button onClick={() => handleNetzanfrageConfirm(deal)}>
          Bestätigen
        </Button>
      ),
    })
  }

  const handleNetzanfrageConfirm = (deal: Deal) => {
    // Send data to technician
    console.log(`Sending data for deal ${deal.id} to technician`)

    // Create invoice
    const invoiceAmount = deal.value * 0.1
    deal.paymentStatus.invoiced += invoiceAmount

    // Schedule reminder
    setTimeout(() => {
      toast({
        title: "Erinnerung",
        description: `5 Tage sind vergangen. Bitte überprüfen Sie den Status der Netzanfrage für ${deal.name}.`,
      })
    }, 5 * 24 * 60 * 60 * 1000) // 5 days in milliseconds

    toast({
      title: "Aktion ausgeführt",
      description: "Daten gesendet, Rechnung erstellt und Erinnerung geplant.",
    })
  }

  const handleNetzbestaetigungAction = (deal: Deal) => {
    toast({
      title: "Netzbestätigung erhalten",
      description: `Wurde die Netzanfrage genehmigt?`,
      action: (
        <Button onClick={() => handleNetzbestaetigungConfirm(deal)}>
          Genehmigt
        </Button>
      ),
    })
  }

  const handleNetzbestaetigungConfirm = (deal: Deal) => {
    toast({
      title: "Bestätigung",
      description: "Sind Sie sicher, dass die Netzanfrage genehmigt wurde?",
      action: (
        <Button onClick={() => {
          // Create 50% invoice
          const invoiceAmount = deal.value * 0.5
          deal.paymentStatus.invoiced += invoiceAmount

          // Send invoice via email
          console.log(`Sending 50% invoice for deal ${deal.id} to customer`)

          toast({
            title: "Genehmigung bestätigt",
            description: "50% Rechnung erstellt und per E-Mail versendet.",
          })
        }}>
          Ja, genehmigt
        </Button>
      ),
    })
  }

  const handleWarenversandAction = (deal: Deal) => {
    toast({
      title: "Warenversand",
      description: `Möchten Sie eine Rechnung über 90% des Gesamtbetrags erstellen?`,
      action: (
        <Button onClick={() => handleWarenversandConfirm(deal)}>
          Bestätigen
        </Button>
      ),
    })
  }

  const handleWarenversandConfirm = (deal: Deal) => {
    // Create 90% invoice
    const invoiceAmount = deal.value * 0.9
    deal.paymentStatus.invoiced += invoiceAmount

    // Send invoice via email
    console.log(`Sending 90% invoice for deal ${deal.id} to customer`)

    toast({
      title: "Warenversand bestätigt",
      description: "90% Rechnung erstellt und per E-Mail versendet.",
    })
  }

  const handleMontageAbgeschlossenAction = (deal: Deal) => {
    toast({
      title: "Montage abgeschlossen",
      description: `Möchten Sie die Abschlussdokumentation versenden und die finale Rechnung über 100% erstellen?`,
      action: (
        <Button onClick={() => handleMontageAbgeschlossenConfirm(deal)}>
          Bestätigen
        </Button>
      ),
    })
  }

  const handleMontageAbgeschlossenConfirm = (deal: Deal) => {
    // Send documentation
    console.log(`Sending final documentation for deal ${deal.id} to customer`)

    // Create 100% invoice
    const invoiceAmount = deal.value
    deal.paymentStatus.invoiced = invoiceAmount

    // Send invoice via email
    console.log(`Sending final invoice for deal ${deal.id} to customer`)

    toast({
      title: "Montage abgeschlossen",
      description: "Abschlussdokumentation versendet und finale Rechnung erstellt.",
    })
  }

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal)
  }

  const handleUpdateDeal = () => {
    if (selectedDeal) {
      const newCategories = pipelineCategories.map(category => ({
        ...category,
        pipelines: category.pipelines.map(pipeline => ({
          ...pipeline,
          stages: pipeline.stages.map(stage => ({
            ...stage,
            deals: stage.deals.map(deal => 
              deal.id === selectedDeal.id ? { ...deal, ...selectedDeal } : deal
            )
          }))
        }))
      }))
      setPipelineCategories(newCategories)
      setSelectedDeal(null)
    }
  }

  const handleDeleteDeal = (dealId: string) => {
    const newCategories = pipelineCategories.map(category => ({
      ...category,
      pipelines: category.pipelines.map(pipeline => ({
        ...pipeline,
        stages: pipeline.stages.map(stage => ({
          ...stage,
          deals: stage.deals.filter(deal => deal.id !== dealId)
        }))
      }))
    }))
    setPipelineCategories(newCategories)
    setSelectedDeal(null)
  }

  const handleAddPipeline = () => {
    const id = `pipeline${Date.now()}`
    const pipeline: Pipeline = { 
      id, 
      ...newPipeline, 
      stages: [
        { id: `stage${Date.now()}1`, name: 'Neue Phase 1', deals: [] },
        { id: `stage${Date.now()}2`, name: 'Neue Phase 2', deals: [] },
        { id: `stage${Date.now()}3`, name: 'Neue Phase 3', deals: [] },
      ] 
    }
    const newCategories = [...pipelineCategories]
    newCategories[0].pipelines.push(pipeline)
    setPipelineCategories(newCategories)
    setIsAddPipelineOpen(false)
    setNewPipeline({ name: '' })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Geschäfte</h2>
        <div className="flex space-x-2">
          <Button onClick={() => setIsAddPipelineOpen(true)} className="bg-[#A7C7E7] text-black hover:bg-[#8EB3E3]">
            <Plus className="mr-2 h-4 w-4" /> Pipeline hinzufügen
          </Button>
          <Button className="relative">
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {notifications}
              </span>
            )}
          </Button>
        </div>
      </div>

      {selectedCategory ? (
        <div>
          <Button onClick={() => setSelectedCategory(null)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zur Übersicht
          </Button>
          {selectedCategory.pipelines.map((pipeline) => (
            <Card key={pipeline.id} className="overflow-hidden mb-4">
              <CardHeader className="flex flex-row items-center justify-between py-2">
                <CardTitle className="text-lg">{pipeline.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <DragDropContext onDragEnd={onDragEnd}>
                  <div className="flex space-x-2 p-2 overflow-x-auto">
                    {pipeline.stages.map((stage) => (
                      <Droppable key={stage.id} droppableId={stage.id}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="w-64 bg-secondary p-2 rounded-lg"
                          >
                            <h3 className="font-semibold mb-2 text-sm">{stage.name}</h3>
                            {stage.deals.map((deal, index) => (
                              <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="bg-background p-2 mb-2 rounded text-sm cursor-pointer hover:bg-accent"
                                    onClick={() => handleDealClick(deal)}
                                  >
                                    <div className="font-medium">{deal.name}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {deal.value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                                    </div>
                                    <div className="text-xs mt-1">
                                      <span className={deal.paymentStatus.paid >= deal.paymentStatus.invoiced ? "text-green-500" : "text-red-500"}>
                                        {((deal.paymentStatus.paid / deal.value) * 100).toFixed(0)}% bezahlt
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    ))}
                  </div>
                </DragDropContext>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pipelineCategories.map((category) => (
            <Card key={category.id} className="cursor-pointer hover:bg-accent" onClick={() => setSelectedCategory(category)}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{category.pipelines.length} Pipelines</p>
                <p>{category.pipelines.reduce((acc, pipeline) => 
                  acc + pipeline.stages.reduce((acc, stage) => acc + stage.deals.length, 0), 0)} Geschäfte
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedDeal} onOpenChange={() => setSelectedDeal(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Geschäftsdetails</DialogTitle>
          </DialogHeader>
          {selectedDeal && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deal-name" className="text-right">
                  Name
                </Label>
                <Input 
                  id="deal-name" 
                  value={selectedDeal.name} 
                  onChange={(e) => setSelectedDeal({...selectedDeal, name: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deal-value" className="text-right">
                  Wert
                </Label>
                <Input 
                  id="deal-value" 
                  type="number"
                  value={selectedDeal.value} 
                  onChange={(e) => setSelectedDeal({...selectedDeal, value: Number(e.target.value)})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deal-status" className="text-right">
                  Status
                </Label>
                <Input 
                  id="deal-status" 
                  value={selectedDeal.status} 
                  onChange={(e) => setSelectedDeal({...selectedDeal, status: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deal-description" className="text-right">
                  Beschreibung
                </Label>
                <Textarea 
                  id="deal-description" 
                  value={selectedDeal.description} 
                  onChange={(e) => setSelectedDeal({...selectedDeal, description: e.target.value})}
                  className="col-span-3" 
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => handleDeleteDeal(selectedDeal!.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Löschen
            </Button>
            <Button onClick={handleUpdateDeal}>
              <Edit className="mr-2 h-4 w-4" />
              Aktualisieren
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddPipelineOpen} onOpenChange={setIsAddPipelineOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Neue Pipeline hinzufügen</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-pipeline-name" className="text-right">
                Name
              </Label>
              <Input 
                id="new-pipeline-name" 
                value={newPipeline.name} 
                onChange={(e) => setNewPipeline({...newPipeline, name: e.target.value})}
                className="col-span-3" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddPipeline} className="bg-[#A7C7E7] text-black hover:bg-[#8EB3E3]">Hinzufügen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

