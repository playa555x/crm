"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Contact, Company, Deal, MediaItem, Note, Invoice } from "@/types/contact"
import { OffersAndOrders } from "./offers-and-orders"
import { Upload } from 'lucide-react'
import ImageUpload from "@/components/image-upload"
import { Avatar } from "@/components/ui/avatar"
import { NotesList } from "@/components/notes/notes-list"
import { ContactMedia } from "@/components/media/contact-media" // Neue Import-Zeile

interface ContactDetailsProps {
  id: string
}

export function ContactDetails({ id }: ContactDetailsProps) {
  const [contact, setContact] = useState<Contact | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [deals, setDeals] = useState<Deal[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    // Fetch contact data
    fetchContactData(id)
    // Fetch related data
    fetchCompanyData(id)
    fetchDeals(id)
    fetchInvoices(id)
  }, [id])

  const fetchContactData = async (id: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch contact data")
      }
      const data = await response.json()
      setContact(data)
    } catch (error) {
      console.error("Error fetching contact data:", error)
    }
  }

  const fetchCompanyData = async (id: string) => {
    try {
      const response = await fetch(`/api/companies/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch company data")
      }
      const data = await response.json()
      setCompany(data)
    } catch (error) {
      console.error("Error fetching company data:", error)
    }
  }

  const fetchDeals = async (id: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}/deals`)
      if (!response.ok) {
        throw new Error("Failed to fetch deals data")
      }
      const data = await response.json()
      setDeals(data)
    } catch (error) {
      console.error("Error fetching deals data:", error)
    }
  }

  const fetchInvoices = async (id: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}/invoices`)
      if (!response.ok) {
        throw new Error("Failed to fetch invoices")
      }
      const data = await response.json()
      setInvoices(data)
    } catch (error) {
      console.error("Error fetching invoices:", error)
    }
  }

  const handleImageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("contactId", id)

    try {
      const response = await fetch(`/api/contacts/${id}/avatar`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload avatar")
      }

      const data = await response.json()
      setAvatarUrl(data.imageUrl)
    } catch (error) {
      console.error("Error uploading avatar:", error)
    }
  }

  if (!contact) {
    return <div>Loading...</div>
  }

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList>
        <TabsTrigger value="general">Allgemeine Infos</TabsTrigger>
        <TabsTrigger value="company">Unternehmen</TabsTrigger>
        <TabsTrigger value="deals">Geschäfte</TabsTrigger>
        <TabsTrigger value="media">Mediathek</TabsTrigger>
        <TabsTrigger value="notes">Notizen</TabsTrigger>
        <TabsTrigger value="invoices">Rechnungen</TabsTrigger>
        <TabsTrigger value="offers-orders">Angebote & Aufträge</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar id={id} name={`${contact.firstName} ${contact.lastName}`} imageUrl={avatarUrl || undefined} />
              <div>
                <CardTitle>Kontaktinformationen</CardTitle>
                <CardDescription>Allgemeine Informationen über den Kontakt</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <ImageUpload onUpload={handleImageUpload} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={`${contact.firstName} ${contact.lastName}`} readOnly />
              </div>
              <div>
                <Label htmlFor="email">E-Mail</Label>
                <Input id="email" value={contact.email} readOnly />
              </div>
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" value={contact.phone} readOnly />
              </div>
              <div>
                <Label htmlFor="mobile">Mobil</Label>
                <Input id="mobile" value={contact.mobile} readOnly />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input id="position" value={contact.position} readOnly />
              </div>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" value={`${contact.street}, ${contact.postcode} ${contact.city}`} readOnly />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" value={contact.website} readOnly />
              </div>
              <div>
                <Label htmlFor="responsibleEmployee">Zuständiger Mitarbeiter</Label>
                <Input id="responsibleEmployee" value={contact.responsibleEmployee} readOnly />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="company">
        <CompanyInfo company={company} />
      </TabsContent>

      <TabsContent value="deals">
        <Deals deals={deals} />
      </TabsContent>

      <TabsContent value="media">
        <Media contactId={contact.id} />
      </TabsContent>

      <TabsContent value="notes">
        <Notes contactId={contact.id} />
      </TabsContent>

      <TabsContent value="invoices">
        <Invoices invoices={invoices} />
      </TabsContent>
      <TabsContent value="offers-orders">
        <OffersAndOrders id={contact.id.toString()} />
      </TabsContent>
    </Tabs>
  )
}

function CompanyInfo({ company }: { company: Company | null }) {
  if (!company) {
    return <div>Keine Unternehmensdaten verfügbar.</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unternehmensinformationen</CardTitle>
        <CardDescription>Details zum verknüpften Unternehmen</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="companyName">Unternehmensname</Label>
            <Input id="companyName" value={company.name} readOnly />
          </div>
          <div>
            <Label htmlFor="industry">Branche</Label>
            <Input id="industry" value={company.industry} readOnly />
          </div>
          <div>
            <Label htmlFor="employees">Mitarbeiteranzahl</Label>
            <Input id="employees" value={company.employees.toString()} readOnly />
          </div>
          <div>
            <Label htmlFor="revenue">Umsatz</Label>
            <Input id="revenue" value={company.revenue} readOnly />
          </div>
          <div className="col-span-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea id="description" value={company.description} readOnly />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Deals({ deals }: { deals: Deal[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Geschäfte</CardTitle>
        <CardDescription>Übersicht der Geschäfte mit diesem Kontakt</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Wert</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell>{deal.name}</TableCell>
                <TableCell>{deal.value.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</TableCell>
                <TableCell>{deal.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// NEUE Media-Komponente
function Media({ contactId }: { contactId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mediathek</CardTitle>
        <CardDescription>Dateien zu diesem Kontakt</CardDescription>
      </CardHeader>
      <CardContent>
        <ContactMedia contactId={contactId} />
      </CardContent>
    </Card>
  )
}

function Notes({ contactId }: { contactId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notizen</CardTitle>
        <CardDescription>Notizen zu diesem Kontakt</CardDescription>
      </CardHeader>
      <CardContent>
        <NotesList contactId={contactId} />
      </CardContent>
    </Card>
  )
}

function Invoices({ invoices }: { invoices: Invoice[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rechnungen</CardTitle>
        <CardDescription>Rechnungsübersicht für diesen Kontakt</CardDescription>
      </CardHeader>
      <CardContent>
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
                <TableCell>
                  {invoice.totalAmount.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}
                </TableCell>
                <TableCell>{invoice.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}