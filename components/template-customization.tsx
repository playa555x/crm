"use client"

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { OfferTemplate } from './templates/offer-template'
import { OrderTemplate } from './templates/order-template'
import { InvoiceTemplate } from './templates/invoice-template'

const sampleData = {
  id: 'SAMPLE-001',
  customerName: 'Musterfirma GmbH',
  date: '2023-06-15',
  dueDate: '2023-07-15',
  items: [
    { description: 'Produkt A', quantity: 2, unitPrice: 100, total: 200 },
    { description: 'Dienstleistung B', quantity: 1, unitPrice: 500, total: 500 },
  ],
  total: 700,
}

export const TemplateCustomization: React.FC = () => {
  const [offerTemplate, setOfferTemplate] = useState('')
  const [orderTemplate, setOrderTemplate] = useState('')
  const [invoiceTemplate, setInvoiceTemplate] = useState('')

  const handleSave = (template: string) => {
    // Here you would typically save the template to your backend
    console.log(`Saving ${template} template`)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Template-Anpassung</h1>
      <Tabs defaultValue="offer">
        <TabsList>
          <TabsTrigger value="offer">Angebot</TabsTrigger>
          <TabsTrigger value="order">Auftrag</TabsTrigger>
          <TabsTrigger value="invoice">Rechnung</TabsTrigger>
        </TabsList>
        <TabsContent value="offer">
          <Card>
            <CardHeader>
              <CardTitle>Angebotsvorlage anpassen</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={offerTemplate}
                onChange={(e) => setOfferTemplate(e.target.value)}
                placeholder="Geben Sie hier Ihre angepasste Angebotsvorlage ein..."
                className="min-h-[300px] mb-4"
              />
              <Button onClick={() => handleSave('offer')}>Speichern</Button>
            </CardContent>
          </Card>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Vorschau:</h2>
            <OfferTemplate offerData={sampleData} />
          </div>
        </TabsContent>
        <TabsContent value="order">
          <Card>
            <CardHeader>
              <CardTitle>Auftragsvorlage anpassen</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={orderTemplate}
                onChange={(e) => setOrderTemplate(e.target.value)}
                placeholder="Geben Sie hier Ihre angepasste Auftragsvorlage ein..."
                className="min-h-[300px] mb-4"
              />
              <Button onClick={() => handleSave('order')}>Speichern</Button>
            </CardContent>
          </Card>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Vorschau:</h2>
            <OrderTemplate orderData={sampleData} />
          </div>
        </TabsContent>
        <TabsContent value="invoice">
          <Card>
            <CardHeader>
              <CardTitle>Rechnungsvorlage anpassen</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={invoiceTemplate}
                onChange={(e) => setInvoiceTemplate(e.target.value)}
                placeholder="Geben Sie hier Ihre angepasste Rechnungsvorlage ein..."
                className="min-h-[300px] mb-4"
              />
              <Button onClick={() => handleSave('invoice')}>Speichern</Button>
            </CardContent>
          </Card>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Vorschau:</h2>
            <InvoiceTemplate invoiceData={sampleData} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

