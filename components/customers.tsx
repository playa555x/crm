import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus, Edit, ExternalLink, ArrowUpDown } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from 'next/link'
import { Contact } from '@/types/contact'

const initialContacts: Contact[] = [
  { 
    id: 1,
    id: 'CRM001',
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max@beispiel.de', 
    phone: '123-456-7890',
    company: 'Muster GmbH',
    position: 'Geschäftsführer',
    street: 'Musterstraße 1',
    postcode: '12345',
    city: 'Musterstadt',
    website: 'www.mustergmbh.de',
    notes: 'Wichtiger Kunde, bevorzugt E-Mail-Kommunikation',
    responsibleEmployee: 'Sarah Weber',
  },
  { 
    id: 2,
    id: 'CRM002',
    firstName: 'Anna',
    lastName: 'Schmidt',
    email: 'anna@beispiel.de', 
    phone: '098-765-4321',
    company: 'Schmidt & Co. KG',
    position: 'Vertriebsleiterin',
    street: 'Beispielweg 42',
    postcode: '54321',
    city: 'Beispielstadt',
    website: 'www.schmidt-co.de',
    notes: 'Interessiert an neuen Produkten, monatlicher Check-in',
    responsibleEmployee: 'Michael Bauer',
  },
]

const employees = ['Sarah Weber', 'Michael Bauer', 'Lisa Müller', 'Thomas Klein']

export function Customers() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [isAddContactOpen, setIsAddContactOpen] = useState(false)
  const [isEditContactOpen, setIsEditContactOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: keyof Contact; direction: 'asc' | 'desc' } | null>(null)
  const [filters, setFilters] = useState({
    employee: 'all',
    postcode: '',
    city: '',
    position: ''
  })
  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>({
    id: '',
    firstName: '',
    lastName: '',
    email: '', 
    phone: '',
    company: '',
    position: '',
    street: '',
    postcode: '',
    city: '',
    website: '',
    notes: '',
    responsibleEmployee: ''
  })

  const handleSort = (key: keyof Contact) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedContacts = [...contacts].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
    return 0
  })

  const filteredContacts = sortedContacts.filter(contact => {
    return (filters.employee === 'all' || contact.responsibleEmployee === filters.employee) &&
           (filters.postcode === '' || contact.postcode.includes(filters.postcode)) &&
           (filters.city === '' || contact.city.toLowerCase().includes(filters.city.toLowerCase())) &&
           (filters.position === '' || contact.position.toLowerCase().includes(filters.position.toLowerCase()))
  })

  const handleAddContact = () => {
    const id = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1
    const id = `CRM${String(newId).padStart(3, '0')}`
    setContacts([...contacts, { id, id, ...newContact }])
    setNewContact({
      id: '',
      firstName: '',
      lastName: '',
      email: '', 
      phone: '',
      company: '',
      position: '',
      street: '',
      postcode: '',
      city: '',
      website: '',
      notes: '',
      responsibleEmployee: ''
    })
    setIsAddContactOpen(false)
  }

  const handleUpdateContact = () => {
    if (editingContact) {
      setContacts(contacts.map(c => c.id === editingContact.id ? { ...editingContact, ...newContact } : c))
      setNewContact({
        id: '',
        firstName: '',
        lastName: '',
        email: '', 
        phone: '',
        company: '',
        position: '',
        street: '',
        postcode: '',
        city: '',
        website: '',
        notes: '',
        responsibleEmployee: ''
      })
      setIsEditContactOpen(false)
      setEditingContact(null)
    }
  }

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact)
    setNewContact(contact)
    setIsEditContactOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kontakte</h2>
        <Button onClick={() => setIsAddContactOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Kontakt hinzufügen
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select value={filters.employee} onValueChange={(value) => setFilters({...filters, employee: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Nach Mitarbeiter filtern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Mitarbeiter</SelectItem>
            {employees.map((employee) => (
              <SelectItem key={employee} value={employee}>{employee}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input 
          placeholder="PLZ" 
          value={filters.postcode}
          onChange={(e) => setFilters({...filters, postcode: e.target.value})}
        />
        <Input 
          placeholder="Stadt" 
          value={filters.city}
          onChange={(e) => setFilters({...filters, city: e.target.value})}
        />
        <Input 
          placeholder="Position" 
          value={filters.position}
          onChange={(e) => setFilters({...filters, position: e.target.value})}
        />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('id')} className="cursor-pointer">
                Kunden ID <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort('lastName')} className="cursor-pointer">
                Name <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort('email')} className="cursor-pointer">
                E-Mail <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort('phone')} className="cursor-pointer">
                Telefon <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort('company')} className="cursor-pointer">
                Unternehmen <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort('position')} className="cursor-pointer">
                Position <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort('postcode')} className="cursor-pointer">
                PLZ <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort('city')} className="cursor-pointer">
                Stadt <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort('street')} className="cursor-pointer">
                Straße <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort('responsibleEmployee')} className="cursor-pointer">
                Zuständiger Mitarbeiter <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>{contact.id}</TableCell>
                <TableCell>{`${contact.lastName}, ${contact.firstName}`}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{contact.company}</TableCell>
                <TableCell>{contact.position}</TableCell>
                <TableCell>{contact.postcode}</TableCell>
                <TableCell>{contact.city}</TableCell>
                <TableCell>{contact.street}</TableCell>
                <TableCell>{contact.responsibleEmployee}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditContact(contact)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Link href={`/contacts/${contact.id}`} passHref>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Neuen Kontakt hinzufügen</DialogTitle>
          </DialogHeader>
          <ContactForm 
            contact={newContact} 
            setContact={setNewContact} 
            onSubmit={handleAddContact}
            employees={employees}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditContactOpen} onOpenChange={setIsEditContactOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Kontakt bearbeiten</DialogTitle>
          </DialogHeader>
          <ContactForm 
            contact={newContact} 
            setContact={setNewContact} 
            onSubmit={handleUpdateContact}
            employees={employees}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface ContactFormProps {
  contact: Omit<Contact, 'id'>
  setContact: React.Dispatch<React.SetStateAction<Omit<Contact, 'id'>>>
  onSubmit: () => void
  employees: string[]
}

function ContactForm({ contact, setContact, onSubmit, employees }: ContactFormProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="firstName" className="text-right">
          Vorname
        </Label>
        <Input
          id="firstName"
          value={contact.firstName}
          onChange={(e) => setContact({ ...contact, firstName: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="lastName" className="text-right">
          Nachname
        </Label>
        <Input
          id="lastName"
          value={contact.lastName}
          onChange={(e) => setContact({ ...contact, lastName: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          E-Mail
        </Label>
        <Input
          id="email"
          type="email"
          value={contact.email}
          onChange={(e) => setContact({ ...contact, email: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phone" className="text-right">
          Telefon
        </Label>
        <Input
          id="phone"
          type="tel"
          value={contact.phone}
          onChange={(e) => setContact({ ...contact, phone: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="company" className="text-right">
          Unternehmen
        </Label>
        <Input
          id="company"
          value={contact.company}
          onChange={(e) => setContact({ ...contact, company: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="position" className="text-right">
          Position
        </Label>
        <Input
          id="position"
          value={contact.position}
          onChange={(e) => setContact({ ...contact, position: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="street" className="text-right">
          Straße
        </Label>
        <Input
          id="street"
          value={contact.street}
          onChange={(e) => setContact({ ...contact, street: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="postcode" className="text-right">
          PLZ
        </Label>
        <Input
          id="postcode"
          value={contact.postcode}
          onChange={(e) => setContact({ ...contact, postcode: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="city" className="text-right">
          Stadt
        </Label>
        <Input
          id="city"
          value={contact.city}
          onChange={(e) => setContact({ ...contact, city: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="website" className="text-right">
          Website
        </Label>
        <Input
          id="website"
          type="url"
          value={contact.website}
          onChange={(e) => setContact({ ...contact, website: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="responsibleEmployee" className="text-right">
          Zuständiger Mitarbeiter
        </Label>
        <Select
          value={contact.responsibleEmployee || 'select'}
          onValueChange={(value) => setContact({ ...contact, responsibleEmployee: value })}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Mitarbeiter auswählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="select" disabled>Mitarbeiter auswählen</SelectItem>
            {employees.map((employee) => (
              <SelectItem key={employee} value={employee}>
                {employee}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="notes" className="text-right">
          Notizen
        </Label>
        <Textarea
          id="notes"
          value={contact.notes}
          onChange={(e) => setContact({ ...contact, notes: e.target.value })}
          className="col-span-3"
        />
      </div>
      <Button onClick={onSubmit}>Speichern</Button>
    </div>
  )
}

