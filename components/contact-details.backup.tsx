import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Folder, File, Upload, Calendar, Phone, Mail, Globe, Building2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Deal {
  name: string
  value: string
  status: string
}

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  company: string
  position: string
  address: string
  website: string
  notes: string
  deals?: Deal[]
  lastContact?: string
  nextFollowUp?: string
}

interface Note {
  id: number
  content: string
  isPublic: boolean
  createdAt: string
}

interface Folder {
  id: number
  name: string
  files: File[]
}

interface File {
  id: number
  name: string
  url: string
  uploadedAt: string
}

export function ContactDetails({ contact: initialContact }: { contact: Contact }) {
  const [contact, setContact] = useState<Contact>(initialContact)
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      content: 'Erstes Gespräch sehr positiv verlaufen. Interesse an Cloud-Lösungen.',
      isPublic: false,
      createdAt: '2024-01-02'
    },
    {
      id: 2,
      content: 'Angebot für Software-Lizenzen gesendet.',
      isPublic: true,
      createdAt: '2024-01-03'
    }
  ])
  const [newNote, setNewNote] = useState<Omit<Note, 'id' | 'createdAt'>>({ content: '', isPublic: false })
  const [folders, setFolders] = useState<Folder[]>([
    {
      id: 1,
      name: 'Verträge',
      files: [
        { id: 1, name: 'Rahmenvertrag_2024.pdf', url: '#', uploadedAt: '2024-01-02' },
        { id: 2, name: 'Angebot_Q1_2024.pdf', url: '#', uploadedAt: '2024-01-03' }
      ]
    },
    {
      id: 2,
      name: 'Präsentationen',
      files: [
        { id: 3, name: 'Produktpräsentation.pptx', url: '#', uploadedAt: '2024-01-02' }
      ]
    }
  ])
  const [newFolder, setNewFolder] = useState('')

  const handleContactUpdate = () => {
    console.log('Aktualisierter Kontakt:', contact)
  }

  const handleAddNote = () => {
    if (newNote.content.trim()) {
      const id = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1
      setNotes([...notes, { 
        id, 
        ...newNote, 
        createdAt: new Date().toISOString().split('T')[0]
      }])
      setNewNote({ content: '', isPublic: false })
    }
  }

  const handleAddFolder = () => {
    if (newFolder.trim()) {
      const id = folders.length > 0 ? Math.max(...folders.map(f => f.id)) + 1 : 1
      setFolders([...folders, { id, name: newFolder, files: [] }])
      setNewFolder('')
    }
  }

  const handleFileUpload = (folderId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const updatedFolders = folders.map(folder => {
        if (folder.id === folderId) {
          const newFile = {
            id: folder.files.length > 0 ? Math.max(...folder.files.map(f => f.id)) + 1 : 1,
            name: file.name,
            url: URL.createObjectURL(file),
            uploadedAt: new Date().toISOString().split('T')[0]
          }
          return { ...folder, files: [...folder.files, newFile] }
        }
        return folder
      })
      setFolders(updatedFolders)
    }
  }

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList>
        <TabsTrigger value="general">Allgemeine Informationen</TabsTrigger>
        <TabsTrigger value="media">Mediathek</TabsTrigger>
        <TabsTrigger value="notes">Notizen</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Kontaktinformationen</CardTitle>
              <CardDescription>Bearbeiten Sie die Kontaktdaten von {contact.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); handleContactUpdate(); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail</Label>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <Input id="email" type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <Input id="phone" type="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Unternehmen</Label>
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <Input id="company" value={contact.company} onChange={(e) => setContact({ ...contact, company: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input id="position" value={contact.position} onChange={(e) => setContact({ ...contact, position: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <Input id="website" type="url" value={contact.website} onChange={(e) => setContact({ ...contact, website: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Textarea id="address" value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} />
                  </div>
                </div>
                <Button type="submit">Änderungen speichern</Button>
              </form>
            </CardContent>
          </Card>

          {contact.deals && contact.deals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Geschäfte</CardTitle>
                <CardDescription>Aktuelle Geschäfte mit {contact.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contact.deals.map((deal, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{deal.name}</h4>
                        <p className="text-sm text-gray-500">{deal.value}</p>
                      </div>
                      <Badge variant={
                        deal.status === 'Abgeschlossen' ? 'default' :
                        deal.status === 'In Verhandlung' ? 'secondary' :
                        'outline'
                      }>
                        {deal.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Termine</CardTitle>
              <CardDescription>Letzter Kontakt und nächste Schritte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Letzter Kontakt</Label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{contact.lastContact}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Nächster Termin</Label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{contact.nextFollowUp}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="media">
        <Card>
          <CardHeader>
            <CardTitle>Mediathek</CardTitle>
            <CardDescription>Verwalten Sie Dokumente und Dateien für {contact.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input 
                  placeholder="Neuer Ordner" 
                  value={newFolder} 
                  onChange={(e) => setNewFolder(e.target.value)}
                />
                <Button onClick={handleAddFolder}><Plus className="mr-2 h-4 w-4" /> Ordner erstellen</Button>
              </div>
              {folders.map((folder) => (
                <div key={folder.id} className="border p-4 rounded-md">
                  <h3 className="font-semibold flex items-center">
                    <Folder className="mr-2 h-4 w-4" /> {folder.name}
                  </h3>
                  <div className="mt-2 space-y-2">
                    {folder.files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <File className="mr-2 h-4 w-4" />
                          <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {file.name}
                          </a>
                        </div>
                        <span className="text-sm text-gray-500">{file.uploadedAt}</span>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <Input 
                        type="file" 
                        id={`file-upload-${folder.id}`} 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(folder.id, e)}
                      />
                      <Label htmlFor={`file-upload-${folder.id}`} className="cursor-pointer">
                        <Button variant="outline" asChild>
                          <span><Upload className="mr-2 h-4 w-4" /> Datei hochladen</span>
                        </Button>
                      </Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="notes">
        <Card>
          <CardHeader>
            <CardTitle>Notizen</CardTitle>
            <CardDescription>Verwalten Sie Notizen für {contact.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Textarea 
                  placeholder="Neue Notiz hinzufügen..." 
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="public-note" 
                    checked={newNote.isPublic}
                    onCheckedChange={(checked) => setNewNote({ ...newNote, isPublic: checked as boolean })}
                  />
                  <Label htmlFor="public-note">Öffentliche Notiz</Label>
                </div>
                <Button onClick={handleAddNote}>Notiz hinzufügen</Button>
              </div>
              {notes.map((note) => (
                <div key={note.id} className="border p-4 rounded-md">
                  <p>{note.content}</p>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                    <span>{note.isPublic ? 'Öffentlich' : 'Intern'}</span>
                    <span>{note.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

