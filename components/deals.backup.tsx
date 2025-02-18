import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Deal {
  id: string
  name: string
  value: number
  contactId: number
}

interface Stage {
  id: string
  name: string
  deals: Deal[]
}

interface Pipeline {
  id: string
  name: string
  stages: Stage[]
}

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  company: string
  position: string
  address: string
  notes: string
}

const initialContacts: Contact[] = [
  { 
    id: 1, 
    name: 'Max Mustermann', 
    email: 'max@beispiel.de', 
    phone: '123-456-7890',
    company: 'Muster GmbH',
    position: 'Geschäftsführer',
    address: 'Musterstraße 1, 12345 Musterstadt',
    notes: 'Wichtiger Kunde, bevorzugt E-Mail-Kommunikation'
  },
  { 
    id: 2, 
    name: 'Anna Schmidt', 
    email: 'anna@beispiel.de', 
    phone: '098-765-4321',
    company: 'Schmidt & Co. KG',
    position: 'Vertriebsleiterin',
    address: 'Beispielweg 42, 54321 Beispielstadt',
    notes: 'Interessiert an neuen Produkten, monatlicher Check-in'
  },
]

const initialPipelines: Pipeline[] = [
  {
    id: 'pipeline1',
    name: 'Verkaufspipeline',
    stages: [
      { id: 'stage1', name: 'Lead', deals: [{ id: 'deal1', name: 'Geschäft 1', value: 1000, contactId: 1 }] },
      { id: 'stage2', name: 'Qualifiziert', deals: [{ id: 'deal2', name: 'Geschäft 2', value: 2000, contactId: 2 }] },
      { id: 'stage3', name: 'Angebot', deals: [] },
      { id: 'stage4', name: 'Verhandlung', deals: [] },
      { id: 'stage5', name: 'Abgeschlossen', deals: [] },
    ],
  },
]

export function Deals() {
  const [pipelines, setPipelines] = useState<Pipeline[]>(initialPipelines)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  const onDragEnd = (result) => {
    if (!result.destination) return

    const { source, destination } = result
    const newPipelines = [...pipelines]
    const pipelineIndex = newPipelines.findIndex(p => p.id === source.droppableId.split('-')[0])
    const sourceStageIndex = newPipelines[pipelineIndex].stages.findIndex(s => s.id === source.droppableId.split('-')[1])
    const destStageIndex = newPipelines[pipelineIndex].stages.findIndex(s => s.id === destination.droppableId.split('-')[1])

    const [removed] = newPipelines[pipelineIndex].stages[sourceStageIndex].deals.splice(source.index, 1)
    newPipelines[pipelineIndex].stages[destStageIndex].deals.splice(destination.index, 0, removed)

    setPipelines(newPipelines)
  }

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal)
    const contact = initialContacts.find(c => c.id === deal.contactId)
    setSelectedContact(contact || null)
  }

  return (
    <div className="space-y-4">
      {pipelines.map((pipeline) => (
        <Card key={pipeline.id} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between py-2">
            <CardTitle className="text-lg">{pipeline.name}</CardTitle>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Phase hinzufügen
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex space-x-2 p-2 overflow-x-auto">
                {pipeline.stages.map((stage) => (
                  <Droppable key={stage.id} droppableId={`${pipeline.id}-${stage.id}`}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="w-56 bg-secondary p-2 rounded-lg"
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
                                <div>{deal.name}</div>
                                <div className="text-xs text-muted-foreground">{deal.value} €</div>
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
      <Button>
        <Plus className="mr-2 h-4 w-4" /> Pipeline hinzufügen
      </Button>

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
                <Input id="deal-name" value={selectedDeal.name} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deal-value" className="text-right">
                  Wert
                </Label>
                <Input id="deal-value" value={`${selectedDeal.value} €`} readOnly className="col-span-3" />
              </div>
            </div>
          )}
          {selectedContact && (
            <div className="grid gap-4 py-4">
              <h3 className="font-semibold">Kontaktinformationen</h3>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact-name" className="text-right">
                  Name
                </Label>
                <Input id="contact-name" value={selectedContact.name} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact-email" className="text-right">
                  E-Mail
                </Label>
                <Input id="contact-email" value={selectedContact.email} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact-phone" className="text-right">
                  Telefon
                </Label>
                <Input id="contact-phone" value={selectedContact.phone} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact-company" className="text-right">
                  Unternehmen
                </Label>
                <Input id="contact-company" value={selectedContact.company} readOnly className="col-span-3" />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

