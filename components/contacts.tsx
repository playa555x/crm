'use client'

import { useState, useMemo, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus, Edit, ExternalLink, ArrowUpDown, Mail, MapPin } from 'lucide-react'
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
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/contexts/auth-context'
import { AutocompleteInput } from '@/components/autocomplete-input'
import { customers } from '@/data/customerData'
import { employees } from '../components/employees/employees-overview'


const columns = [
  { key: 'customerNumber', label: 'Kundennummer' },
  { key: 'company', label: 'Firma' },
  { key: 'name', label: 'Name' },
  { key: 'phone', label: 'Nummer' },
  { key: 'email', label: 'E-Mail' },
  { key: 'responsibleEmployee', label: 'Ansprechpartner' },
  { key: 'address', label: 'Adresse' },
  { key: 'invoices', label: 'Rechnungen' },
  { key: 'personnelNumber', label: 'Personalnummer' },
]

const getOptionsForColumn = (key: string) => {
  switch (key) {
    case 'company':
      return ['Muster GmbH', 'Schmidt & Co. KG', 'SolarTech GmbH', 'Solar CRM']
    case 'name':
      return ['Max Mustermann', 'Anna Schmidt', 'Lukas Meyer', 'Sarah Weber']
    default:
      return []
  }
}

export function Contacts() {
  const { hasPermission } = useAuth()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isAddContactOpen, setIsAddContactOpen] = useState(false)
  const [isEditContactOpen, setIsEditContactOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: keyof Contact; direction: 'asc' | 'desc' } | null>(null)
  const [filters, setFilters] = useState({
    type: 'all',
    search: '',
  })
  const [selectedColumns, setSelectedColumns] = useState(['customerNumber', 'name', 'email', 'phone', 'company', 'position', 'personnelNumber'])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    // Load initial data
    loadContacts()
  }, [currentPage, filters, activeFilter])

  const loadContacts = async () => {
    // This would be an API call in a real application
    const allContacts = [
      ...customers,
      ...(employees || []).map(employee => ({
        ...employee,
        category: 'employee',
        customerNumber: employee.personnelNumber
      }))
    ]
    const filteredContacts = allContacts.filter(contact => 
      (activeFilter === 'all' || contact.category === activeFilter) &&
      (filters.search === '' || 
        contact.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
        contact.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        contact.company.toLowerCase().includes(filters.search.toLowerCase()) ||
        (contact.customerNumber && contact.customerNumber.toLowerCase().includes(filters.search.toLowerCase())) ||
        (contact.personnelNumber && contact.personnelNumber.toLowerCase().includes(filters.search.toLowerCase()))
      )
    )
    const startIndex = (currentPage - 1) * 50
    const endIndex = startIndex + 50
    setContacts(filteredContacts.slice(startIndex, endIndex))
    setTotalPages(Math.ceil(filteredContacts.length / 50))
  }


  const handleSort = (key: keyof Contact) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedContacts = useMemo(() => {
    let sortableContacts = [...contacts]
    if (sortConfig !== null) {
      sortableContacts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    return sortableContacts
  }, [contacts, sortConfig])

  const generateUniqueCustomerNumber = () => {
    const prefix = 'KD'
    const existingNumbers = contacts.map(c => c.customerNumber).filter(Boolean)
    let newNumber
    do {
      newNumber = `${prefix}${Math.floor(100000 + Math.random() * 900000)}`
    } while (existingNumbers.includes(newNumber))
    return newNumber
  }

  const handleAddContact = (newContact: Omit<Contact, 'id'>) => {
    const id = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1
    const customerNumber = newContact.category === 'customer' ? generateUniqueCustomerNumber() : ''
    setContacts([...contacts, { id, ...newContact, customerNumber }])
    setIsAddContactOpen(false)
  }

  const handleUpdateContact = (updatedContact: Contact) => {
    setContacts(contacts.map(c => c.id === updatedContact.id ? updatedContact : c))
    setIsEditContactOpen(false)
    setEditingContact(null)
  }

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact)
    setIsEditContactOpen(true)
  }

  const handleColumnToggle = (columnKey: string) => {
    setSelectedColumns(prev => 
      prev.includes(columnKey)
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kontakte</h2>
        <div className="flex space-x-2">
          <Button key="all" variant={activeFilter === 'all' ? "default" : "outline"} onClick={() => setActiveFilter('all')}>Alle</Button>
          <Button key="customer" variant={activeFilter === 'customer' ? "default" : "outline"} onClick={() => setActiveFilter('customer')}>Kunden</Button>
          <Button key="employee" variant={activeFilter === 'employee' ? "default" : "outline"} onClick={() => setActiveFilter('employee')}>Mitarbeiter</Button>
          <Button key="company" variant={activeFilter === 'company' ? "default" : "outline"} onClick={() => setActiveFilter('company')}>Firmen</Button>
          <Button key="technician" variant={activeFilter === 'technician' ? "default" : "outline"} onClick={() => setActiveFilter('technician')}>Monteure</Button>
          {hasPermission('edit_all_contacts') && (
            <Button key="add" onClick={() => setIsAddContactOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Kontakt hinzufügen
            </Button>
          )}
        </div>
      </div>

      <div className="flex space-x-2">
        <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Typ auswählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle</SelectItem>
            <SelectItem value="customer">Kunden</SelectItem>
            <SelectItem value="employee">Mitarbeiter</SelectItem>
            <SelectItem value="technician">Monteure</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Suche..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
          className="max-w-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {columns.map((column) => (
          <label key={`column-${column.key}`} className="flex items-center space-x-2">
            <Checkbox
              checked={selectedColumns.includes(column.key)}
              onCheckedChange={() => handleColumnToggle(column.key)}
            />
            <span>{column.label}</span>
          </label>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {selectedColumns.map((column) => (
              <TableHead key={`header-${column}`}>
                <Button variant="ghost" onClick={() => handleSort(column as keyof Contact)}>
                  {columns.find(c => c.key === column)?.label || column}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            ))}
            <TableHead key="header-actions">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedContacts.map((contact) => {
            const uniqueKey = contact.customerNumber || contact.personnelNumber || `contact-${contact.id}`;
            return (
              <TableRow key={uniqueKey}>
                {selectedColumns.includes('customerNumber') && (
                  <TableCell key={`customerNumber-${uniqueKey}`}>{contact.customerNumber || '-'}</TableCell>
                )}
                {selectedColumns.includes('name') && (
                  <TableCell key={`name-${uniqueKey}`}>
                    <Link href={`/contacts/${contact.id}`}>
                      {`${contact.firstName} ${contact.lastName}`}
                    </Link>
                  </TableCell>
                )}
                {selectedColumns.includes('email') && (
                  <TableCell key={`email-${uniqueKey}`}>
                    <Link href={`mailto:${contact.email}`}>
                      <Mail className="inline mr-2 h-4 w-4" />
                      {contact.email}
                    </Link>
                  </TableCell>
                )}
                {selectedColumns.includes('phone') && <TableCell key={`phone-${uniqueKey}`}>{contact.phone}</TableCell>}
                {selectedColumns.includes('company') && <TableCell key={`company-${uniqueKey}`}>{contact.company}</TableCell>}
                {selectedColumns.includes('position') && <TableCell key={`position-${uniqueKey}`}>{contact.position}</TableCell>}
                {selectedColumns.includes('personnelNumber') && <TableCell key={`personnelNumber-${uniqueKey}`}>{contact.personnelNumber || '-'}</TableCell>}
                {selectedColumns.includes('address') && (
                  <TableCell key={`address-${uniqueKey}`}>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${contact.street} ${contact.houseNumber}, ${contact.postcode} ${contact.city}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="inline mr-2 h-4 w-4" />
                      {`${contact.street} ${contact.houseNumber}, ${contact.postcode} ${contact.city}`}
                    </a>
                  </TableCell>
                )}
                <TableCell key={`actions-${uniqueKey}`}>
                  <div className="flex space-x-2">
                    {hasPermission('edit_all_contacts') && (
                      <Button variant="ghost" size="sm" onClick={() => handleEditContact(contact)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Link href={`/contacts/${contact.id}`} passHref>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {(currentPage - 1) * 50 + 1} to {Math.min(currentPage * 50, contacts.length)} of {contacts.length} contacts
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {hasPermission('edit_all_contacts') && (
        <>
          <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Neuen Kontakt hinzufügen</DialogTitle>
              </DialogHeader>
              <ContactForm onSubmit={handleAddContact} />
            </DialogContent>
          </Dialog>

          <Dialog open={isEditContactOpen} onOpenChange={setIsEditContactOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Kontakt bearbeiten</DialogTitle>
              </DialogHeader>
              <ContactForm contact={editingContact} onSubmit={handleUpdateContact} />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}

function ContactForm({ contact, onSubmit }: { contact?: Contact, onSubmit: (contact: Contact | Omit<Contact, 'id'>) => void }) {
  const [formData, setFormData] = useState<Omit<Contact, 'id'>>(contact || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    street: '',
    houseNumber: '',
    postcode: '',
    city: '',
    website: '',
    notes: '',
    responsibleEmployee: '',
    category: 'customer',
    projectDescription: '',
    companyContactPerson: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      mobile: '',
    },
    preferredContactMethod: 'email',
    preferredContactPerson: 'main',
    lastContact: '',
    nextFollowUp: '',
    invoices: [],
    personnelNumber: '',
    customerNumber: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(contact ? { ...contact, ...formData } : formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Vorname</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Nachname</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="email">E-Mail</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="phone">Telefon</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="company">Unternehmen</Label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="position">Position</Label>
        <Input
          id="position"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="street">Straße</Label>
        <Input
          id="street"
          value={formData.street}
          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="houseNumber">Hausnummer</Label>
        <Input
          id="houseNumber"
          value={formData.houseNumber}
          onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="postcode">PLZ</Label>
        <Input
          id="postcode"
          value={formData.postcode}
          onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="city">Stadt</Label>
        <Input
          id="city"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="url"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="category">Kategorie</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value as Contact['category'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Kategorie auswählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer">Kunde</SelectItem>
            <SelectItem value="employee">Mitarbeiter</SelectItem>
            <SelectItem value="technician">Monteur</SelectItem>
            <SelectItem value="company">Firma</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {formData.category === 'employee' && (
        <div>
          <Label htmlFor="personnelNumber">Personalnummer</Label>
          <Input
            id="personnelNumber"
            value={formData.personnelNumber}
            onChange={(e) => setFormData({ ...formData, personnelNumber: e.target.value })}
          />
        </div>
      )}
      <Button type="submit">{contact ? 'Aktualisieren' : 'Hinzufügen'}</Button>
    </form>
  )
}

export { Contacts }

