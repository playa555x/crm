'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { OfferDialog } from '@/components/offers/offer-dialog'

export default function OffersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Angebote</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          Neues Angebot
        </Button>
      </div>

      <OfferDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  )
}

