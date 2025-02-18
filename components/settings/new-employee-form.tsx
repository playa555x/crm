'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Role } from '@/types/employee'

export function NewEmployeeForm() {
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '' as Role,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the new employee data to your backend
    console.log('Creating new employee:', newEmployee)
    // Reset form after submission
    setNewEmployee({ firstName: '', lastName: '', email: '', role: '' as Role })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">Vorname</Label>
        <Input
          id="firstName"
          value={newEmployee.firstName}
          onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Nachname</Label>
        <Input
          id="lastName"
          value={newEmployee.lastName}
          onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-Mail</Label>
        <Input
          id="email"
          type="email"
          value={newEmployee.email}
          onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Rolle</Label>
        <Select
          value={newEmployee.role}
          onValueChange={(value) => setNewEmployee({...newEmployee, role: value as Role})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Rolle auswählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Vertriebsleiter">Vertriebsleiter</SelectItem>
            <SelectItem value="Vertriebler">Vertriebler</SelectItem>
            <SelectItem value="Innendienst">Innendienst</SelectItem>
            <SelectItem value="Monteur-AC">Monteur-AC</SelectItem>
            <SelectItem value="Monteur-DC">Monteur-DC</SelectItem>
            <SelectItem value="Planer">Planer</SelectItem>
            <SelectItem value="Geschäftsführer">Geschäftsführer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Mitarbeiter anlegen</Button>
    </form>
  )
}

