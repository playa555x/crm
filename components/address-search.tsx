'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'
import { useToast } from "@/components/ui/use-toast"

interface AddressSearchProps {
  onAddressSelect: (address: string, lat: number, lng: number) => void
}

interface Suggestion {
  place_id: string
  description: string
}

export function AddressSearch({ onAddressSelect }: AddressSearchProps) {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null)
  const placesService = useRef<google.maps.places.PlacesService | null>(null)
  const debouncedInput = useDebounce(inputValue, 300)
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google) {
      try {
        if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
          throw new Error('Google Maps API key is not configured')
        }
        autocompleteService.current = new window.google.maps.places.AutocompleteService()
        const dummyElement = document.createElement('div')
        placesService.current = new window.google.maps.places.PlacesService(dummyElement)
      } catch (error) {
        console.error('Error initializing Google Maps services:', error)
        toast({
          title: "Fehler",
          description: error instanceof Error ? error.message : "Google Maps konnte nicht initialisiert werden. Bitte überprüfen Sie den API-Schlüssel.",
          variant: "destructive",
        })
      }
    }
  }, [toast])

  useEffect(() => {
    if (!debouncedInput || !autocompleteService.current) {
      setSuggestions([])
      return
    }

    setIsLoading(true)

    const searchOptions: google.maps.places.AutocompletionRequest = {
      input: debouncedInput,
      componentRestrictions: { country: 'de' }, // Restrict to Germany
      types: ['address'], // Only return address results
    }

    autocompleteService.current.getPlacePredictions(
      searchOptions,
      (predictions: google.maps.places.AutocompletePrediction[] | null, status: google.maps.places.PlacesServiceStatus) => {
        setIsLoading(false)

        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions.map(prediction => ({
            place_id: prediction.place_id,
            description: prediction.description,
          })))
        } else {
          setSuggestions([])
          if (status !== google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            console.error('Error fetching address suggestions:', status)
            toast({
              title: "Fehler",
              description: "Adressvorschläge konnten nicht geladen werden. Bitte versuchen Sie es erneut.",
              variant: "destructive",
            })
          }
        }
      }
    )
  }, [debouncedInput, toast])

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    if (!placesService.current) return

    placesService.current.getDetails(
      {
        placeId: suggestion.place_id,
        fields: ['formatted_address', 'geometry']
      },
      (place: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry?.location) {
          const lat = place.geometry.location.lat()
          const lng = place.geometry.location.lng()
          setInputValue(suggestion.description)
          setSuggestions([])
          onAddressSelect(suggestion.description, lat, lng)
        } else {
          console.error('Error fetching place details:', status)
          toast({
            title: "Fehler",
            description: "Adressdetails konnten nicht abgerufen werden. Bitte versuchen Sie es erneut.",
            variant: "destructive",
          })
        }
      }
    )
  }

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Adresse eingeben (z.B. Heeper Straße 108)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow"
        />
        {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
      </div>
      {suggestions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-auto">
          <ul className="py-2">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.place_id}
                className="px-4 py-2 hover:bg-accent cursor-pointer"
                onClick={() => handleSuggestionSelect(suggestion)}
              >
                {suggestion.description}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}

