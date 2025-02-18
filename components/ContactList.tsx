"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { Contact } from "@/types/contact"
import { Card, CardContent } from "@/components/ui/card"

export function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([])

  useEffect(() => {
    async function fetchContacts() {
      try {
        const response = await fetch("/api/contacts")
        if (!response.ok) {
          throw new Error("Failed to fetch contacts")
        }
        const data = await response.json()
        setContacts(data)
      } catch (error) {
        console.error("Error fetching contacts:", error)
      }
    }

    fetchContacts()
  }, [])

  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <Link key={contact.id} href={`/contacts/${contact.id}`}>
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold">{`${contact.firstName} ${contact.lastName}`}</h3>
              <p className="text-sm text-gray-500">{contact.email}</p>
              <p className="text-sm text-gray-500">{contact.phone}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

