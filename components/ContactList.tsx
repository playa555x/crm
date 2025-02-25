"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search } from 'lucide-react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Contact } from "@/types/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ContactForm } from "./contact-form"

// Hilfs-Funktion zur Konvertierung von snake_case zu camelCase
const snakeToCamelCase = (data: any) => {
  if (Array.isArray(data)) {
    return data.map(item => snakeToCamelCase(item))
  }
  
  if (typeof data === 'object' && data !== null) {
    const newData: any = {}
    Object.keys(data).forEach(key => {
      const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase())
      newData[camelKey] = snakeToCamelCase(data[key])
    })
    return newData
  }
  
  return data
}

// Hilfs-Funktion zur Konvertierung von camelCase zu snake_case
const camelToSnakeCase = (data: any) => {
  if (Array.isArray(data)) {
    return data.map(item => camelToSnakeCase(item))
  }
  
  if (typeof data === 'object' && data !== null) {
    const newData: any = {}
    Object.keys(data).forEach(key => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
      newData[snakeKey] = camelToSnakeCase(data[key])
    })
    return newData
  }
  
  return data
}

export function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      
      // Konvertiere snake_case zu camelCase
      const convertedData = snakeToCamelCase(data) as Contact[]
      setContacts(convertedData || [])
    } catch (error) {
      console.error("Error fetching contacts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateContact = async (newContact: Partial<Contact>) => {
    try {
      // Konvertiere zu snake_case für Supabase
      const contactData = camelToSnakeCase(newContact)

      const { data, error } = await supabase
        .from("contacts")
        .insert([contactData])
        .select()

      if (error) throw error

      // Konvertiere zurück zu camelCase
      const convertedData = snakeToCamelCase(data[0]) as Contact
      setContacts([convertedData, ...contacts])
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error creating contact:", error)
    }
  }

  const getCategoryBadge = (category: Contact["category"]) => {
    const colors = {
      customer: "bg-green-500",
      employee: "bg-blue-500",
      technician: "bg-purple-500"
    }
    
    const labels = {
      customer: "Kunde",
      employee: "Mitarbeiter",
      technician: "Techniker"
    }

    return (
      <Badge
        variant="secondary"
        className={`${colors[category]} text-white`}
      >
        {labels[category]}
      </Badge>
    )
  }

  const filteredContacts = contacts.filter((contact) => {
    const searchTerm = searchQuery.toLowerCase()
    return (
      contact.firstName?.toLowerCase().includes(searchTerm) ||
      contact.lastName?.toLowerCase().includes(searchTerm) ||
      contact.email?.toLowerCase().includes(searchTerm) ||
      contact.company?.toLowerCase().includes(searchTerm) ||
      contact.customerNumber?.toLowerCase().includes(searchTerm)
    )
  })

  return (
    <div>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="relative flex-1 mr-4 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Kontakte durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Neu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Neuer Kontakt</DialogTitle>
            </DialogHeader>
            <div className="max-h-[calc(100vh-10rem)] overflow-y-auto pr-6">
              <ContactForm onSubmit={handleCreateContact} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">Lade Kontakte...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Kundennr.</TableHead>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead className="w-[200px]">Unternehmen</TableHead>
                <TableHead className="w-[200px]">E-Mail</TableHead>
                <TableHead className="w-[150px]">Telefon</TableHead>
                <TableHead className="w-[120px]">Kategorie</TableHead>
                <TableHead className="w-[150px]">Stadt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.customerNumber || "-"}</TableCell>
                  <TableCell>
                    <Link
                      href={`/contacts/${contact.id}`}
                      className="hover:underline"
                    >
                      {contact.firstName} {contact.lastName}
                    </Link>
                  </TableCell>
                  <TableCell>{contact.company || "-"}</TableCell>
                  <TableCell>{contact.email || "-"}</TableCell>
                  <TableCell>{contact.phone || contact.mobile || "-"}</TableCell>
                  <TableCell>{getCategoryBadge(contact.category)}</TableCell>
                  <TableCell>{contact.city || "-"}</TableCell>
                </TableRow>
              ))}
              {filteredContacts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Keine Kontakte gefunden
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}