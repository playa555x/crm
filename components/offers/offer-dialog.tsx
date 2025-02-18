'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OfferDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const categories = [
  {
    name: "Solarmodule",
    products: [
      { id: "1", name: "400W Modul", price: 299.99 },
      { id: "2", name: "500W Modul", price: 399.99 },
    ]
  },
  {
    name: "Wechselrichter",
    products: [
      { id: "3", name: "5kW Wechselrichter", price: 999.99 },
      { id: "4", name: "10kW Wechselrichter", price: 1499.99 },
    ]
  },
  {
    name: "Speicher",
    products: [
      { id: "5", name: "5kWh Speicher", price: 3999.99 },
      { id: "6", name: "10kWh Speicher", price: 5999.99 },
    ]
  }
]

export function OfferDialog({ open, onOpenChange }: OfferDialogProps) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [positions, setPositions] = useState<Array<{
    id: string
    productId: string
    description: string
    quantity: number
    price: number
  }>>([])
  const [notes, setNotes] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const addPosition = (productId: string) => {
    const product = categories
      .flatMap(cat => cat.products)
      .find(p => p.id === productId)
    
    if (!product) return

    setPositions([...positions, {
      id: Math.random().toString(),
      productId: product.id,
      description: product.name,
      quantity: 1,
      price: product.price
    }])
  }

  const removePosition = (id: string) => {
    setPositions(positions.filter(p => p.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    setPositions(positions.map(p => 
      p.id === id ? { ...p, quantity } : p
    ))
  }

  const handleSubmit = () => {
    // Handle offer creation
    console.log({
      title,
      date,
      positions,
      notes
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px] h-[800px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Neues Angebot erstellen</DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 gap-6 mt-4">
          {/* Left sidebar with categories */}
          <div className="w-64 border-r pr-4">
            <Label className="mb-2">Kategorien</Label>
            <ScrollArea className="h-[600px]">
              {categories.map((category) => (
                <div key={category.name} className="mb-4">
                  <h3 className="font-medium mb-2">{category.name}</h3>
                  <div className="space-y-2">
                    {category.products.map((product) => (
                      <Button
                        key={product.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => addPosition(product.id)}
                      >
                        {product.name}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Angebots-Titel"
                />
              </div>
              <div>
                <Label htmlFor="date">Datum</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <Card className="mb-4">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Artikel</TableHead>
                      <TableHead>Beschreibung</TableHead>
                      <TableHead className="w-[100px]">Menge</TableHead>
                      <TableHead className="text-right">Einzelpreis</TableHead>
                      <TableHead className="text-right">Gesamt</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {positions.map((position) => (
                      <TableRow key={position.id}>
                        <TableCell>{position.description}</TableCell>
                        <TableCell>
                          <Input
                            value={position.description}
                            onChange={(e) => {
                              setPositions(positions.map(p =>
                                p.id === position.id
                                  ? { ...p, description: e.target.value }
                                  : p
                              ))
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={1}
                            value={position.quantity}
                            onChange={(e) => updateQuantity(position.id, parseInt(e.target.value))}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {position.price.toFixed(2)} €
                        </TableCell>
                        <TableCell className="text-right">
                          {(position.price * position.quantity).toFixed(2)} €
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePosition(position.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="mb-4">
              <Label htmlFor="notes">Anmerkungen</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="text-lg font-medium">
                Gesamtbetrag: {positions.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(2)} €
              </div>
              <Button onClick={handleSubmit}>
                Angebot erstellen
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

