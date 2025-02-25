"use client"

import { useState } from "react"
import type { Contact } from "@/types/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ContactFormProps {
  onSubmit: (contact: Partial<Contact>) => Promise<void>
  initialData?: Partial<Contact>
}

export function ContactForm({ onSubmit, initialData }: ContactFormProps) {
  const [formData, setFormData] = useState<Partial<Contact>>(
    initialData || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      mobile: "",
      company: "",
      position: "",
      street: "",
      houseNumber: "",
      postcode: "",
      city: "",
      website: "",
      notes: "",
      responsibleEmployee: "",
      category: "customer",
      companyContactPerson: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        mobile: "",
      },
      preferredContactMethod: "email",
      preferredContactPerson: "main",
      customerNumber: "",
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCompanyContactChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      companyContactPerson: {
        ...prev.companyContactPerson,
        [name]: value,
      },
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Hauptkontakt</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Vorname</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nachname</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerNumber">Kundennummer</Label>
            <Input
              id="customerNumber"
              name="customerNumber"
              value={formData.customerNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobil</Label>
            <Input
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company">Unternehmen</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="street">Straße</Label>
            <Input
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="houseNumber">Hausnummer</Label>
            <Input
              id="houseNumber"
              name="houseNumber"
              value={formData.houseNumber}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postcode">PLZ</Label>
            <Input
              id="postcode"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Stadt</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Firmenkontakt</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyContactPerson.firstName">Vorname</Label>
            <Input
              id="companyContactPerson.firstName"
              name="firstName"
              value={formData.companyContactPerson?.firstName}
              onChange={handleCompanyContactChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyContactPerson.lastName">Nachname</Label>
            <Input
              id="companyContactPerson.lastName"
              name="lastName"
              value={formData.companyContactPerson?.lastName}
              onChange={handleCompanyContactChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyContactPerson.email">E-Mail</Label>
            <Input
              id="companyContactPerson.email"
              name="email"
              type="email"
              value={formData.companyContactPerson?.email}
              onChange={handleCompanyContactChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyContactPerson.phone">Telefon</Label>
            <Input
              id="companyContactPerson.phone"
              name="phone"
              value={formData.companyContactPerson?.phone}
              onChange={handleCompanyContactChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyContactPerson.mobile">Mobil</Label>
            <Input
              id="companyContactPerson.mobile"
              name="mobile"
              value={formData.companyContactPerson?.mobile}
              onChange={handleCompanyContactChange}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Weitere Informationen</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Kategorie</Label>
            <Select
              name="category"
              value={formData.category}
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, category: value as Contact["category"] }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Kategorie auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Kunde</SelectItem>
                <SelectItem value="employee">Mitarbeiter</SelectItem>
                <SelectItem value="technician">Techniker</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="responsibleEmployee">Zuständiger Mitarbeiter</Label>
            <Input
              id="responsibleEmployee"
              name="responsibleEmployee"
              value={formData.responsibleEmployee}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="preferredContactMethod">Bevorzugte Kontaktart</Label>
            <Select
              name="preferredContactMethod"
              value={formData.preferredContactMethod}
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, preferredContactMethod: value as Contact["preferredContactMethod"] }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Kontaktart auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">E-Mail</SelectItem>
                <SelectItem value="phone">Telefon</SelectItem>
                <SelectItem value="mobile">Mobil</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferredContactPerson">Bevorzugter Kontakt</Label>
            <Select
              name="preferredContactPerson"
              value={formData.preferredContactPerson}
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, preferredContactPerson: value as Contact["preferredContactPerson"] }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Kontaktperson auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">Hauptkontakt</SelectItem>
                <SelectItem value="companyContact">Firmenkontakt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notizen</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectDescription">Projektbeschreibung</Label>
          <Textarea
            id="projectDescription"
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Speichern
      </Button>
    </form>
  )
}