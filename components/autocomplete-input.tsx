'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from "@/components/ui/input"

interface AutocompleteInputProps {
  placeholder: string
  options: string[]
  onSelect: (value: string) => void
}

export function AutocompleteInput({ placeholder, options, onSelect }: AutocompleteInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [filteredOptions, setFilteredOptions] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const filtered = options.filter(option =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    )
    setFilteredOptions(filtered)
    setIsOpen(filtered.length > 0 && inputValue.length > 0)
  }, [inputValue, options])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleOptionClick = (option: string) => {
    setInputValue(option)
    onSelect(option)
    setIsOpen(false)
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={inputRef}>
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
      />
      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

