import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface OfferTemplateProps {
  offerData: {
    id: string
    customerName: string
    date: string
    items: Array<{ description: string; quantity: number; unitPrice: number; total: number }>
    total: number
  }
}

export const OfferTemplate: React.FC<OfferTemplateProps> = ({ offerData }) => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Angebot {offerData.id}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p><strong>Kunde:</strong> {offerData.customerName}</p>
          <p><strong>Datum:</strong> {offerData.date}</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Beschreibung</TableHead>
              <TableHead>Menge</TableHead>
              <TableHead>Einzelpreis</TableHead>
              <TableHead>Gesamt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offerData.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unitPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</TableCell>
                <TableCell>{item.total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-6 text-right">
          <p><strong>Gesamtbetrag: {offerData.total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</strong></p>
        </div>
      </CardContent>
    </Card>
  )
}

