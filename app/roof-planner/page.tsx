'use client'

import { useState } from 'react'
import { RoofPlanner } from '@/components/roof-planner'
import Script from 'next/script'
import { useToast } from "@/components/ui/use-toast"

export default function RoofPlannerPage() {
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const { toast } = useToast()

  const handleScriptLoad = () => {
    setScriptLoaded(true)
  }

  const handleScriptError = () => {
    toast({
      title: "Fehler",
      description: "Google Maps konnte nicht geladen werden. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.",
      variant: "destructive",
    })
  }

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`}
        onLoad={handleScriptLoad}
        onError={handleScriptError}
        strategy="lazyOnload"
      />
      {scriptLoaded ? <RoofPlanner /> : <div>Lade Google Maps...</div>}
    </>
  )
}

