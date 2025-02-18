import { Suspense } from "react"
import { ContactList } from "@/components/ContactList"
import { ContactDetails } from "@/components/contact-details"

export default function ContactsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Kontakte</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Suspense fallback={<div>Lade Kontakte...</div>}>
            <ContactList />
          </Suspense>
        </div>
        <div className="md:col-span-2">
          <Suspense fallback={<div>Lade Kontaktdetails...</div>}>
            <ContactDetails />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

