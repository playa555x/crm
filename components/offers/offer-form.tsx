import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash, ChevronDown, ChevronRight } from 'lucide-react'
import { InventoryItem } from '@/types/inventory'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Import the fetchInventoryItems function
import { fetchInventoryItems } from '@/lib/api'

interface OfferFormProps {
  onSubmit: (offerData: any) => void
}

export function OfferForm({ onSubmit }: OfferFormProps) {
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [offerDate, setOfferDate] = useState('')
  const [items, setItems] = useState<Array<{ inventoryItemId: string; quantity: number; unitPrice: number }>>([])
  const [notes, setNotes] = useState('')
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [inventoryByCategory, setInventoryByCategory] = useState<Record<string, InventoryItem[]>>({})
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const loadInventoryItems = async () => {
      const items = await fetchInventoryItems()
      setInventoryItems(items)
      
      // Group items by category
      const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = []
        }
        acc[item.category].push(item)
        return acc
      }, {} as Record<string, InventoryItem[]>)
      setInventoryByCategory(groupedItems)

      // Initialize open states for categories
      setOpenCategories(Object.keys(groupedItems).reduce((acc, category) => {
        acc[category] = false
        return acc
      }, {} as Record<string, boolean>))
      
      // Automatically add items marked as "Standardmäßig im Angebot enthalten"
      const defaultItems = items
        .filter(item => item.includeInOffer)
        .sort((a, b) => a.offerPriority - b.offerPriority)
        .map(item => ({
          inventoryItemId: item.id,
          quantity: 1,
          unitPrice: item.price
        }))
      setItems(defaultItems)
    }
    loadInventoryItems()
  }, [])

  const addItem = (inventoryItem: InventoryItem) => {
    const existingItem = items.find(item => item.inventoryItemId === inventoryItem.id)
    if (existingItem) {
      setItems(items.map(item => 
        item.inventoryItemId === inventoryItem.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setItems([...items, { 
        inventoryItemId: inventoryItem.id, 
        quantity: 1, 
        unitPrice: inventoryItem.price 
      }])
    }
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: string | number) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setItems(updatedItems)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const offerData = {
      customerName,
      customerEmail,
      date: offerDate,
      items,
      notes,
    }
    onSubmit(offerData)
  }

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        {/* Left sidebar with categories and items */}
        <Card className="col-span-1">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Produktkategorien</h3>
            <ScrollArea className="h-[600px] pr-4">
              {Object.entries(inventoryByCategory).map(([category, categoryItems]) => (
                <Collapsible
                  key={category}
                  open={openCategories[category]}
                  onOpenChange={() => toggleCategory(category)}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left">
                    <span>{category}</span>
                    {openCategories[category] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul className="pl-4">
                      {categoryItems.map((item) => (
                        <li key={item.id} className="flex items-center justify-between py-2">
                          <span>{item.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => addItem(item)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right side with offer details */}
        <div className="col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Kundenname</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="customerEmail">Kunden-E-Mail</Label>
              <Input
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="offerDate">Angebotsdatum</Label>
            <Input
              id="offerDate"
              type="date"
              value={offerDate}
              onChange={(e) => setOfferDate(e.target.value)}
              required
            />
          </div>
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produkt</TableHead>
                    <TableHead className="text-right">Menge</TableHead>
                    <TableHead className="text-right">Einzelpreis (€)</TableHead>
                    <TableHead className="text-right">Gesamt (€)</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => {
                    const inventoryItem = inventoryItems.find(i => i.id === item.inventoryItemId)
                    return (
                      <TableRow key={index}>
                        <TableCell>{inventoryItem?.name || 'Unknown Product'}</TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                            min="1"
                            className="w-20 text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {item.unitPrice.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {(item.quantity * item.unitPrice).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div>
            <Label htmlFor="notes">Notizen</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button type="submit">Angebot erstellen</Button>
        </div>
      </div>
    </form>
  )
}

