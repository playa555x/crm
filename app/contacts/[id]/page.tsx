import { Suspense } from "react"
import { ContactDetails } from "@/components/contact-details"

export default function ContactPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<div>Lade Kontaktdetails...</div>}>
        <ContactDetails id={params.id} />
      </Suspense>
    </div>
  )
}

