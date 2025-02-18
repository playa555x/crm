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
import { Upload, Trash2 } from "lucide-react"
import ImageUpload from "@/components/image-upload"
import Avatar from "@/components/ui/avatar"

interface ContactDetailsProps {
  id: string
}

export function ContactDetails({ id }: ContactDetailsProps) {
  const [contact, setContact] = useState<Contact | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [deals, setDeals] = useState<Deal[]>([])
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([])
  const [newFolderName, setNewFolderName] = useState("")
  const [newNote, setNewNote] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    // Fetch contact data
    fetchContactData(id)
    // Fetch related data
    fetchCompanyData(id)
    fetchDeals(id)
    fetchMediaItems(id)
    fetchNotes(id)
    fetchInvoices(id)
    fetchFolders(id)
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

  const fetchMediaItems = async (id: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}/media`)
      if (!response.ok) {
        throw new Error("Failed to fetch media items")
      }
      const data = await response.json()
      setMediaItems(data)
    } catch (error) {
      console.error("Error fetching media items:", error)
    }
  }

  const fetchNotes = async (id: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}/notes`)
      if (!response.ok) {
        throw new Error("Failed to fetch notes")
      }
      const data = await response.json()
      setNotes(data)
    } catch (error) {
      console.error("Error fetching notes:", error)
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

  const fetchFolders = async (id: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}/folders`)
      if (!response.ok) {
        throw new Error("Failed to fetch folders")
      }
      const data = await response.json()
      setFolders(data)
    } catch (error) {
      console.error("Error fetching folders:", error)
    }
  }

  const handleAddFolder = async () => {
    if (newFolderName.trim()) {
      try {
        const response = await fetch(`/api/contacts/${id}/folders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newFolderName.trim() }),
        })
        if (!response.ok) {
          throw new Error("Failed to add folder")
        }
        const newFolder = await response.json()
        setFolders([...folders, newFolder])
        setNewFolderName("")
      } catch (error) {
        console.error("Error adding folder:", error)
      }
    }
  }

  const handleRemoveFolder = async (folderId: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}/folders/${folderId}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to remove folder")
      }
      setFolders(folders.filter((folder) => folder.id !== folderId))
      setMediaItems(mediaItems.filter((item) => item.folderId !== folderId))
    } catch (error) {
      console.error("Error removing folder:", error)
    }
  }

  const handleFileUpload = async (folderId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("folderId", folderId)

        const response = await fetch(`/api/contacts/${id}/media`, {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Failed to upload file")
        }

        const newMediaItem = await response.json()
        setMediaItems([...mediaItems, newMediaItem])
      } catch (error) {
        console.error("Error uploading file:", error)
      }
    }
  }

  const handleAddNote = async () => {
    if (newNote.trim()) {
      try {
        const response = await fetch(`/api/contacts/${id}/notes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newNote.trim(),
            isPublic: false,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to add note")
        }

        const newNoteItem = await response.json()
        setNotes([...notes, newNoteItem])
        setNewNote("")
      } catch (error) {
        console.error("Error adding note:", error)
      }
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
        <Media
          mediaItems={mediaItems}
          folders={folders}
          onAddFolder={handleAddFolder}
          onRemoveFolder={handleRemoveFolder}
          onFileUpload={handleFileUpload}
          newFolderName={newFolderName}
          setNewFolderName={setNewFolderName}
        />
      </TabsContent>

      <TabsContent value="notes">
        <Notes notes={notes} newNote={newNote} setNewNote={setNewNote} onAddNote={handleAddNote} />
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

function Media({
  mediaItems,
  folders,
  onAddFolder,
  onRemoveFolder,
  onFileUpload,
  newFolderName,
  setNewFolderName,
}: {
  mediaItems: MediaItem[]
  folders: { id: string; name: string }[]
  onAddFolder: () => void
  onRemoveFolder: (folderId: string) => void
  onFileUpload: (folderId: string, event: React.ChangeEvent<HTMLInputElement>) => void
  newFolderName: string
  setNewFolderName: (name: string) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mediathek</CardTitle>
        <CardDescription>Dokumente und Dateien für diesen Kontakt</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Neuer Ordner"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="mb-2"
          />
          <Button onClick={onAddFolder}>Ordner hinzufügen</Button>
        </div>
        {folders.map((folder) => (
          <div key={folder.id} className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{folder.name}</h3>
              <Button variant="destructive" size="sm" onClick={() => onRemoveFolder(folder.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Aktion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mediaItems
                  .filter((item) => item.folderId === folder.id)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>
                        <Button variant="link" asChild>
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            Öffnen
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <div className="mt-2">
              <Input
                type="file"
                onChange={(e) => onFileUpload(folder.id, e)}
                className="hidden"
                id={`file-upload-${folder.id}`}
              />
              <label htmlFor={`file-upload-${folder.id}`}>
                <Button as="span">
                  <Upload className="mr-2 h-4 w-4" />
                  Datei hochladen
                </Button>
              </label>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function Notes({
  notes,
  newNote,
  setNewNote,
  onAddNote,
}: {
  notes: Note[]
  newNote: string
  setNewNote: (note: string) => void
  onAddNote: () => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notizen</CardTitle>
        <CardDescription>Notizen zu diesem Kontakt</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Textarea
            placeholder="Neue Notiz"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="mb-2"
          />
          <Button onClick={onAddNote}>Notiz hinzufügen</Button>
        </div>
        {notes.map((note) => (
          <div key={note.id} className="mb-4 p-4 border rounded">
            <p>{note.content}</p>
            <div className="mt-2 text-sm text-gray-500">
              <span>{note.isPublic ? "Öffentlich" : "Intern"}</span>
              <span className="ml-4">{note.createdAt}</span>
            </div>
          </div>
        ))}
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

