import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, MoreHorizontal, Eye } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { InventoryItem } from '@/types/inventory'
import { inventoryItems } from '@/data/inventoryData'
import { OfferPreviewDialog } from './offers/offer-preview-dialog'

interface Offer {
  id: string;
  offerId: string;
  title: string;
  date: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  total: number;
  items: {
    inventoryItemId: string;
    quantity: number;
    unitPrice: number;
    total: number;
    description: string;
    unit: string;
  }[];
  customerName: string;
  customerCompany?: string;
  customerStreet?: string;
  customerPostalCode?: string;
  customerCity?: string;
  customerEmail?: string;
}

interface Order {
  id: string;
  title: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  total: number;
}

interface OfferItem {
  id: string;
  inventoryItemId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export function OffersAndOrders({ id }: { id: string }) {
  const [offers, setOffers] = useState<Offer[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isCreateOfferOpen, setIsCreateOfferOpen] = useState(false)
  const [newOffer, setNewOffer] = useState<Omit<Offer, 'id' | 'offerId'>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    status: 'draft',
    total: 0,
    items: [],
    customerName: '', // Added customer details
    customerCompany: '',
    customerStreet: '',
    customerPostalCode: '',
    customerCity: '',
    customerEmail: ''
  })
  const [offerItems, setOfferItems] = useState<OfferItem[]>([])
  const [inventoryItemsState, setInventoryItems] = useState<InventoryItem[]>([])
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [previewItem, setPreviewItem] = useState<Offer | null>(null)

  useEffect(() => {
    // In a real application, you would fetch offers and orders from your backend
    // For this example, we'll use mock data
    setOffers([
      { id: '1', offerId: 'OFF-12345', title: 'Solaranlage 5kW', date: '2023-06-01', status: 'sent', total: 15000, items: [], customerName: 'John Doe', customerCompany: 'Acme Corp' }, // Added customer details to mock data
      { id: '2', offerId: 'OFF-67890', title: 'Batteriespeicher 10kWh', date: '2023-06-15', status: 'accepted', total: 8000, items: [], customerName: 'Jane Doe', customerCompany: 'Beta Inc' }, // Added customer details to mock data
    ])
    setOrders([
      { id: '1', title: 'Solaranlage 5kW', date: '2023-07-01', status: 'in_progress', total: 15000 },
      { id: '2', title: 'Wartung', date: '2023-07-15', status: 'completed', total: 500 },
    ])
  }, [id])

  useEffect(() => {
    // In a real application, you would fetch inventory items from your backend
    setInventoryItems(inventoryItems)
  }, [])

  const handleAddOfferItem = () => {
    const newItem: OfferItem = {
      id: Date.now().toString(),
      inventoryItemId: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }
    setOfferItems([...offerItems, newItem])
  }

  const handleUpdateOfferItem = (id: string, field: keyof OfferItem, value: string | number) => {
    setOfferItems(offerItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        updatedItem.total = updatedItem.quantity * updatedItem.unitPrice
        return updatedItem
      }
      return item
    }))
  }

  const handleRemoveOfferItem = (id: string) => {
    setOfferItems(offerItems.filter(item => item.id !== id))
  }

  const handleSelectInventoryItem = (itemId: string, offerId: string) => {
    const inventoryItem = inventoryItemsState.find(item => item.id === itemId)
    if (inventoryItem) {
      setOfferItems(offerItems.map(item => {
        if (item.id === offerId) {
          return {
            ...item,
            inventoryItemId: itemId,
            description: inventoryItem.name,
            unitPrice: inventoryItem.price,
            total: item.quantity * inventoryItem.price
          }
        }
        return item
      }))
    }
  }

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer)
    setNewOffer({...offer, items: offer.items.map(item => ({...item, unit: ''}) )}) //Added to handle unit property
    setOfferItems(offer.items.map(item => ({
      id: item.inventoryItemId,
      inventoryItemId: item.inventoryItemId,
      description: inventoryItemsState.find(invItem => invItem.id === item.inventoryItemId)?.name || '',
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total
    })))
    setIsCreateOfferOpen(true)
  }

  const getNextId = (type: 'offer' | 'order' | 'invoice') => {
    const prefix = type === 'offer' ? 'AN' : type === 'order' ? 'AB' : 'RE';
    const existingIds = offers
      .map(o => o.offerId)
      .filter(id => id.startsWith(prefix))
      .map(id => parseInt(id.substring(2)));
    const nextNumber = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
  };

  const handleCreateOrUpdateOffer = () => {
    const total = offerItems.reduce((sum, item) => sum + item.total, 0)
    const updatedOffer: Offer = {
      ...newOffer,
      total,
      items: offerItems.map(item => ({
        inventoryItemId: item.inventoryItemId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
        description: item.description,
        unit: '' // Added unit property
      }))
    }

    if (editingOffer) {
      setOffers(offers.map(offer => offer.id === editingOffer.id ? updatedOffer : offer))
    } else {
      const newOfferWithId: Offer = {
        ...updatedOffer,
        id: Date.now().toString(),
        offerId: getNextId('offer'),
      }
      setOffers([...offers, newOfferWithId])
    }

    setIsCreateOfferOpen(false)
    setNewOffer({
      title: '',
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
      total: 0,
      items: [],
      customerName: '', // Added customer details
      customerCompany: '',
      customerStreet: '',
      customerPostalCode: '',
      customerCity: '',
      customerEmail: ''
    })
    setOfferItems([])
    setEditingOffer(null)
  }

  return (
    <Tabs defaultValue="offers">
      <TabsList>
        <TabsTrigger value="offers">Angebote</TabsTrigger>
        <TabsTrigger value="orders">Aufträge</TabsTrigger>
      </TabsList>
      <TabsContent value="offers">
        <Card>
          <CardHeader>
            <CardTitle>Angebote</CardTitle>
            <CardDescription>Übersicht aller Angebote für diesen Kunden</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Button onClick={() => {
                setEditingOffer(null);
                setNewOffer({
                  title: '',
                  date: new Date().toISOString().split('T')[0],
                  status: 'draft',
                  total: 0,
                  items: [],
                  customerName: '', // Added customer details
                  customerCompany: '',
                  customerStreet: '',
                  customerPostalCode: '',
                  customerCity: '',
                  customerEmail: ''
                });
                setOfferItems([]);
                setIsCreateOfferOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" /> Neues Angebot erstellen
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Titel</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Gesamtbetrag</TableHead>
                  <TableHead>Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>
                      <Button 
                        variant="link" 
                        onClick={() => setPreviewItem(offer)}
                      >
                        {offer.offerId}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="link" onClick={() => handleEditOffer(offer)}>
                        {offer.title}
                      </Button>
                    </TableCell>
                    <TableCell>{offer.date}</TableCell>
                    <TableCell>{offer.status}</TableCell>
                    <TableCell>{offer.total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setPreviewItem(offer)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Angebot anzeigen
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditOffer(offer)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Angebot bearbeiten
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="orders">
        <Card>
          <CardHeader>
            <CardTitle>Aufträge</CardTitle>
            <CardDescription>Übersicht aller Aufträge für diesen Kunden</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titel</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Gesamtbetrag</TableHead>
                  <TableHead>Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.title}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <Dialog open={isCreateOfferOpen} onOpenChange={(open) => {
        if (!open) {
          setEditingOffer(null);
          setNewOffer({
            title: '',
            date: new Date().toISOString().split('T')[0],
            status: 'draft',
            total: 0,
            items: [],
            customerName: '', // Added customer details
            customerCompany: '',
            customerStreet: '',
            customerPostalCode: '',
            customerCity: '',
            customerEmail: ''
          });
          setOfferItems([]);
        }
        setIsCreateOfferOpen(open);
      }}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{editingOffer ? 'Angebot bearbeiten' : 'Neues Angebot erstellen'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="offerTitle">Titel</Label>
                <Input
                  id="offerTitle"
                  value={newOffer.title}
                  onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="offerDate">Datum</Label>
                <Input
                  id="offerDate"
                  type="date"
                  value={newOffer.date}
                  onChange={(e) => setNewOffer({ ...newOffer, date: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Angebotspositionen</Label>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Artikel</TableHead>
                    <TableHead>Beschreibung</TableHead>
                    <TableHead>Menge</TableHead>
                    <TableHead>Einzelpreis</TableHead>
                    <TableHead>Gesamt</TableHead>
                    <TableHead>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offerItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Select
                          value={item.inventoryItemId}
                          onValueChange={(value) => handleSelectInventoryItem(value, item.id)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Artikel auswählen" />
                          </SelectTrigger>
                          <SelectContent>
                            {inventoryItemsState.map((invItem) => (
                              <SelectItem key={invItem.id} value={invItem.id}>
                                {invItem.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateOfferItem(item.id, 'quantity', parseFloat(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>{item.unitPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</TableCell>
                      <TableCell>{item.total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveOfferItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button onClick={handleAddOfferItem} className="mt-2">
                <Plus className="mr-2 h-4 w-4" /> Position hinzufügen
              </Button>
            </div>
            <div>
              <Label htmlFor="offerNotes">Anmerkungen</Label>
              <Textarea id="offerNotes" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleCreateOrUpdateOffer}>
              {editingOffer ? 'Angebot aktualisieren' : 'Angebot erstellen'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <OfferPreviewDialog 
        open={previewItem !== null}
        onOpenChange={(open) => !open && setPreviewItem(null)}
        offer={previewItem || undefined}
      />
    </Tabs>
  )
}

