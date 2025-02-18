import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Contact, Invoice, InvoiceItem } from '@/types/contact'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InventoryItem } from '@/types/inventory'

interface CustomerDetailsProps {
  customer: Contact
  onUpdateCustomer: (updatedCustomer: Contact) => void
  inventory: InventoryItem[]
}

export function CustomerDetails({ customer, onUpdateCustomer, inventory }: CustomerDetailsProps) {
  const [newInvoice, setNewInvoice] = useState<Omit<Invoice, 'id'>>({
    number: '',
    date: '',
    dueDate: '',
    items: [],
    totalAmount: 0,
    status: 'draft'
  })

  const [selectedItem, setSelectedItem] = useState<string>('')
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1)

  const addInvoiceItem = () => {
    const inventoryItem = inventory.find(item => item.id === selectedItem)
    if (inventoryItem) {
      const newItem: InvoiceItem = {
        ...inventoryItem,
        quantity: selectedQuantity
      }
      setNewInvoice({
        ...newInvoice,
        items: [...newInvoice.items, newItem],
      })
      setSelectedItem('')
      setSelectedQuantity(1)
    }
  }

  const removeInvoiceItem = (index: number) => {
    const newItems = [...newInvoice.items]
    newItems.splice(index, 1)
    setNewInvoice({ ...newInvoice, items: newItems })
  }

  const updateInvoiceItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...newInvoice.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setNewInvoice({ ...newInvoice, items: newItems })
  }

  const calculateTotal = () => {
    return newInvoice.items.reduce((total, item) => total + item.quantity * item.price, 0)
  }

  useEffect(() => {
    setNewInvoice(prev => ({ ...prev, totalAmount: calculateTotal() }))
  }, [newInvoice.items])

  const handleAddInvoice = () => {
    const invoice: Invoice = {
      ...newInvoice,
      id: Date.now().toString(),
    }
    const updatedCustomer = {
      ...customer,
      invoices: [...customer.invoices, invoice]
    }
    onUpdateCustomer(updatedCustomer)
    setNewInvoice({
      number: '',
      date: '',
      dueDate: '',
      items: [],
      totalAmount: 0,
      status: 'draft'
    })
  }

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList>
        <TabsTrigger value="general">Allgemein</TabsTrigger>
        <TabsTrigger value="invoices">Rechnungen</TabsTrigger>
        <TabsTrigger value="notes">Notizen</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Kundeninformationen</CardTitle>
            <CardDescription>AllgemeineCardDescription>Allgemeine Informationen über den Kunden</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={`${customer.firstName} ${customer.lastName}`} readOnly />
              </div>
              <div>
                <Label htmlFor="email">E-Mail</Label>
                <Input id="email" value={customer.email} readOnly />
              </div>
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" value={customer.phone} readOnly />
              </div>
              <div>
                <Label htmlFor="company">Unternehmen</Label>
                <Input id="company" value={customer.company} readOnly />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="invoices">
        <Card>
          <CardHeader>
            <CardTitle>Rechnungserstellung</CardTitle>
            <CardDescription>Erstellen Sie hier eine neue Rechnung</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber">Rechnungsnummer</Label>
                  <Input
                    id="invoiceNumber"
                    value={newInvoice.number}
                    onChange={(e) => setNewInvoice({ ...newInvoice, number: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="invoiceDate">Rechnungsdatum</Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={newInvoice.date}
                    onChange={(e) => setNewInvoice({ ...newInvoice, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Fälligkeitsdatum</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Rechnungspositionen</h4>
                <div className="flex space-x-2 mb-2">
                  <Select value={selectedItem} onValueChange={setSelectedItem}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Artikel auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventory.map((item) => (
                        <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Menge"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
                    className="w-[100px]"
                  />
                  <Button onClick={addInvoiceItem}>Hinzufügen</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Artikel</TableHead>
                      <TableHead>Typ</TableHead>
                      <TableHead>Menge</TableHead>
                      <TableHead>Preis</TableHead>
                      <TableHead>Gesamt</TableHead>
                      <TableHead>Aktion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newInvoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateInvoiceItem(index, 'quantity', parseInt(e.target.value))}
                            className="w-[80px]"
                          />
                        </TableCell>
                        <TableCell>{item.price.toFixed(2)} €</TableCell>
                        <TableCell>{(item.quantity * item.price).toFixed(2)} €</TableCell>
                        <TableCell>
                          <Button variant="ghost" onClick={() => removeInvoiceItem(index)}>Entfernen</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="text-right">
                <strong>Gesamtbetrag: {newInvoice.totalAmount.toFixed(2)} €</strong>
              </div>
              <Button className="w-full" onClick={handleAddInvoice}>Rechnung erstellen</Button>
            </div>
          </CardContent>
        </Card>
        <InvoicesList invoices={customer.invoices} />
      </TabsContent>
      <TabsContent value="notes">
        <Card>
          <CardHeader>
            <CardTitle>Notizen</CardTitle>
            <CardDescription>Verwalten Sie hier Ihre Notizen zum Kunden</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={customer.notes}
              onChange={(e) => onUpdateCustomer({ ...customer, notes: e.target.value })}
              placeholder="Fügen Sie hier Ihre Notizen hinzu..."
              className="w-full min-h-[200px] p-2 border rounded"
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

function InvoicesList({ invoices }: { invoices: Invoice[] }) {
  const calculateTotals = () => {
    const total = invoices.reduce((acc, invoice) => acc + invoice.totalAmount, 0);
    const paid = invoices.filter(invoice => invoice.status === 'paid').reduce((acc, invoice) => acc + invoice.totalAmount, 0);
    return { total, paid };
  }

  const { total, paid } = calculateTotals();

  return (
    <>
      <div className="mb-4 p-4 bg-secondary rounded-lg">
        <h4 className="font-semibold mb-2">Rechnungsübersicht</h4>
        <p>Gesamtbetrag: {total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</p>
        <p>Bezahlt: {paid.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</p>
        <p>Ausstehend: {(total - paid).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rechnungsnummer</TableHead>
            <TableHead>Datum</TableHead>
            <TableHead>Fälligkeitsdatum</TableHead>
            <TableHead>Betrag</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.number}</TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell>{invoice.dueDate}</TableCell>
              <TableCell>{invoice.totalAmount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</TableCell>
              <TableCell>{invoice.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

