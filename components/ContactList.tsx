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
import { ScrollArea } from "@/components/ui/scroll-area"
import { ContactForm } from "./contact-form"

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
      setContacts(data || [])
    } catch (error) {
      console.error("Error fetching contacts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateContact = async (newContact: Partial<Contact>) => {
    try {
      const { data, error } = await supabase
        .from("contacts")
        .insert([newContact])
        .select()

      if (error) throw error

      setContacts([data[0], ...contacts])
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
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="relative flex-1 mr-4">
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
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Neu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Neuer Kontakt</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(90vh-8rem)] overflow-y-auto pr-4">
              <ContactForm onSubmit={handleCreateContact} />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-4">Lade Kontakte...</div>
      ) : (
        <div className="rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kundennr.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Unternehmen</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Kategorie</TableHead>
                <TableHead>Nächster Kontakt</TableHead>
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
                  <TableCell>
                    {contact.nextFollowUp 
                      ? new Date(contact.nextFollowUp).toLocaleDateString('de-DE')
                      : "-"
                    }
                  </TableCell>
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
        </div>
      )}
    </div>
  )
}