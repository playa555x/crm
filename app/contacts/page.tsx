import { Suspense } from "react"
import { ContactList } from "@/components/ContactList"

export default function ContactsPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kontakte</h1>
      </div>
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border">
        <Suspense fallback={<div className="p-4">Lade Kontakte...</div>}>
          <ContactList />
        </Suspense>
      </div>
    </div>
  )
}