import { Suspense } from "react"
import { ContactList } from "@/components/ContactList"
import { ContactDetails } from "@/components/contact-details"

export default function ContactsPage() {
  return (
    <div className="container mx-auto py-6 max-w-[1600px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kontakte</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border">
            <Suspense fallback={<div className="p-4">Lade Kontakte...</div>}>
              <ContactList />
            </Suspense>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border">
            <Suspense fallback={<div className="p-4">Lade Kontaktdetails...</div>}>
              <ContactDetails />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}