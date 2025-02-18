import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface InvoiceTemplateProps {
  invoiceData: {
    id: string
    customerName: string
    date: string
    dueDate: string
    items: Array<{ description: string; quantity: number; unitPrice: number; total: number }>
    total: number
  }
}

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ invoiceData }) => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Rechnung {invoiceData.id}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p><strong>Kunde:</strong> {invoiceData.customerName}</p>
          <p><strong>Datum:</strong> {invoiceData.date}</p>
          <p><strong>Fälligkeitsdatum:</strong> {invoiceData.dueDate}</p>
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
            {invoiceData.items.map((item, index) => (
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
          <p><strong>Gesamtbetrag: {invoiceData.total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</strong></p>
        </div>
      </CardContent>
    </Card>
  )
}

