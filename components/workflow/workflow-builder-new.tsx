'use client'

import React, { useState, useCallback } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  Connection,
  EdgeChange,
  NodeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Handle,
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Activity, Mail, Calendar, Users, FileText, Bell, Clock, Check, Settings, Plus, Save } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"

const triggerTypes = [
  { id: 'activity', label: 'Aktivität', icon: Activity, options: ['Hinzugefügt', 'Erstellt', 'Entfernt', 'Aktualisiert'] },
  { id: 'deal', label: 'Geschäft', icon: FileText, options: ['Neue Phase', 'Gewonnen', 'Verloren', 'Wert geändert'] },
  { id: 'email', label: 'E-Mail', icon: Mail, options: ['Gesendet', 'Empfangen', 'Geöffnet', 'Link geklickt'] },
  { id: 'contact', label: 'Kontakt', icon: Users, options: ['Neu erstellt', 'Aktualisiert', 'Gelöscht', 'Zusammengeführt'] },
  { id: 'calendar', label: 'Kalender', icon: Calendar, options: ['Termin erstellt', 'Termin aktualisiert', 'Termin gelöscht'] },
]

const actionTypes = [
  { id: 'send_email', label: 'E-Mail senden', icon: Mail },
  { id: 'create_task', label: 'Aufgabe erstellen', icon: FileText },
  { id: 'create_event', label: 'Termin erstellen', icon: Calendar },
  { id: 'notification', label: 'Benachrichtigung', icon: Bell },
  { id: 'delay', label: 'Zeitverzögerung', icon: Clock },
]

const conditionTypes = [
  { id: 'field_value', label: 'Feldwert', icon: Check },
  { id: 'time_based', label: 'Zeitbasiert', icon: Clock },
  { id: 'user_based', label: 'Benutzerbasiert', icon: Users },
]

interface NodeData {
  label: string
  type: string
  icon?: React.ElementType
  config?: any
}

const CustomNode = ({ data }: { data: NodeData }) => {
  const Icon = data.icon || Settings

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 min-w-[200px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" />
        <div>
          <div className="font-medium">{data.label}</div>
          <div className="text-sm text-muted-foreground">{data.type}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  )
}

const nodeTypes = {
  custom: CustomNode,
}

export function WorkflowBuilder() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [isGlobal, setIsGlobal] = useState(false)
  const [isAdmin, setIsAdmin] = useState(true) // In einer echten Anwendung würde dies aus dem Benutzerkontext kommen

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  )

  const addNode = (type: string, nodeType: string, icon: React.ElementType) => {
    const newNode: Node = {
      id: `${type}-${nodes.length + 1}`,
      type: 'custom',
      position: { x: 100, y: 100 },
      data: { label: nodeType, type, icon },
    }
    setNodes((nds) => [...nds, newNode])
  }

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    setIsConfigOpen(true)
  }

  const validateWorkflow = () => {
    const hasTrigger = nodes.some(node => node.data.type === 'trigger')
    const hasAction = nodes.some(node => node.data.type === 'action')

    if (!hasTrigger || !hasAction) {
      toast({
        title: "Validierungsfehler",
        description: "Der Workflow muss mindestens einen Trigger und eine Aktion enthalten.",
        variant: "destructive",
      })
      return false
    }

    const connectedNodeIds = new Set<string>()
    edges.forEach(edge => {
      connectedNodeIds.add(edge.source)
      connectedNodeIds.add(edge.target)
    })

    if (connectedNodeIds.size !== nodes.length) {
      toast({
        title: "Validierungsfehler",
        description: "Alle Elemente müssen miteinander verbunden sein.",
        variant: "destructive",
      })
      return false
    }

    toast({
      title: "Validierung erfolgreich",
      description: "Der Workflow ist gültig und kann gespeichert werden.",
    })
    return true
  }

  return (
    <div className="container mx-auto py-6 h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Neuer Workflow</h1>
          <p className="text-muted-foreground">
            Erstellen Sie einen neuen automatisierten Workflow
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {isAdmin && (
            <div className="flex items-center space-x-2">
              <Switch
                id="global-switch"
                checked={isGlobal}
                onCheckedChange={setIsGlobal}
              />
              <Label htmlFor="global-switch">Globale Anwendung</Label>
            </div>
          )}
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Vorlage laden
          </Button>
          <Button onClick={validateWorkflow}>
            <Save className="mr-2 h-4 w-4" />
            Speichern
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[250px,1fr] gap-4 h-full">
        <Card>
          <CardHeader>
            <CardTitle>Elemente</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="triggers" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="triggers" className="flex-1">Trigger</TabsTrigger>
                <TabsTrigger value="actions" className="flex-1">Aktionen</TabsTrigger>
                <TabsTrigger value="conditions" className="flex-1">Bedingungen</TabsTrigger>
              </TabsList>
              <TabsContent value="triggers">
                <div className="space-y-2">
                  {triggerTypes.map((trigger) => (
                    <Select key={trigger.id} onValueChange={(value) => addNode('trigger', `${trigger.label}: ${value}`, trigger.icon)}>
                      <SelectTrigger>
                        <SelectValue placeholder={trigger.label} />
                      </SelectTrigger>
                      <SelectContent>
                        {trigger.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="actions">
                <div className="space-y-2">
                  {actionTypes.map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => addNode('action', action.label, action.icon)}
                    >
                      <action.icon className="mr-2 h-4 w-4" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="conditions">
                <div className="space-y-2">
                  {conditionTypes.map((condition) => (
                    <Button
                      key={condition.id}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => addNode('condition', condition.label, condition.icon)}
                    >
                      <condition.icon className="mr-2 h-4 w-4" />
                      {condition.label}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="relative">
          <div className="absolute inset-0">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        </Card>
      </div>

      <Sheet open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <SheetContent className="w-[400px]">
          <SheetHeader>
            <SheetTitle>Element konfigurieren</SheetTitle>
            <SheetDescription>
              Konfigurieren Sie die Eigenschaften des ausgewählten Elements
            </SheetDescription>
          </SheetHeader>
          {selectedNode && (
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input 
                  value={selectedNode.data.label} 
                  onChange={(e) => {
                    const updatedNodes = nodes.map(node => 
                      node.id === selectedNode.id 
                        ? { ...node, data: { ...node.data, label: e.target.value } }
                        : node
                    )
                    setNodes(updatedNodes)
                  }}
                />
              </div>
              
              {selectedNode.data.type === 'trigger' && (
                <div className="space-y-2">
                  <Label>Ereignis</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Ereignis auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created">Erstellt</SelectItem>
                      <SelectItem value="updated">Aktualisiert</SelectItem>
                      <SelectItem value="deleted">Gelöscht</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedNode.data.type === 'action' && (
                <div className="space-y-2">
                  <Label>Aktion konfigurieren</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Aktion konfigurieren" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Sofort ausführen</SelectItem>
                      <SelectItem value="delayed">Mit Verzögerung</SelectItem>
                      <SelectItem value="scheduled">Zeitplan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedNode.data.type === 'condition' && (
                <div className="space-y-2">
                  <Label>Bedingung</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Bedingung auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Ist gleich</SelectItem>
                      <SelectItem value="not_equals">Ist nicht gleich</SelectItem>
                      <SelectItem value="contains">Enthält</SelectItem>
                      <SelectItem value="greater_than">Größer als</SelectItem>
                      <SelectItem value="less_than">Kleiner als</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

