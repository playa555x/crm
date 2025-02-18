'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Search } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type SearchResult = {
  id: string
  type: 'customer' | 'deal'
  title: string
  subtitle: string
}

const mockSearchResults: SearchResult[] = [
  { id: '1', type: 'customer', title: 'Max Mustermann', subtitle: 'Kunde seit 2022' },
  { id: '2', type: 'customer', title: 'Anna Schmidt', subtitle: 'Interessent' },
  { id: '3', type: 'deal', title: 'Solaranlage Projekt', subtitle: '25.000 € - In Verhandlung' },
  { id: '4', type: 'deal', title: 'Energiespeicher Angebot', subtitle: '10.000 € - Angebot erstellt' },
  { id: '5', type: 'customer', title: 'Firma XYZ GmbH', subtitle: 'Großkunde' },
]

export function AdvancedSearch() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between md:w-[300px] lg:w-[400px]"
        >
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          {value
            ? mockSearchResults.find((result) => result.id === value)?.title
            : "Suchen..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 md:w-[300px] lg:w-[400px]">
        <Command>
          <CommandInput placeholder="Kunden oder Geschäfte suchen..." />
          <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
          <CommandGroup>
            {mockSearchResults.map((result) => (
              <CommandItem
                key={result.id}
                onSelect={() => {
                  setValue(result.id)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === result.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div>
                  <p>{result.title}</p>
                  <p className="text-sm text-muted-foreground">{result.subtitle}</p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

