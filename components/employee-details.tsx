import { useState } from 'react'
import { Employee } from '@/types/contact'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface EmployeeDetailsProps {
  employee: Employee
}

export function EmployeeDetails({ employee: initialEmployee }: EmployeeDetailsProps) {
  const [employee, setEmployee] = useState<Employee>(initialEmployee)

  const handleEmployeeUpdate = () => {
    console.log('Updated employee:', employee)
    // Here you would typically send the updated employee data to your backend
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mitarbeiterdaten</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); handleEmployeeUpdate(); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Vorname</Label>
              <Input
                id="firstName"
                value={employee.firstName}
                onChange={(e) => setEmployee({ ...employee, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nachname</Label>
              <Input
                id="lastName"
                value={employee.lastName}
                onChange={(e) => setEmployee({ ...employee, lastName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={employee.email}
                onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                value={employee.phone}
                onChange={(e) => setEmployee({ ...employee, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobil</Label>
              <Input
                id="mobile"
                type="tel"
                value={employee.mobile}
                onChange={(e) => setEmployee({ ...employee, mobile: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={employee.position}
                onChange={(e) => setEmployee({ ...employee, position: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Abteilung</Label>
              <Input
                id="department"
                value={employee.department}
                onChange={(e) => setEmployee({ ...employee, department: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hireDate">Einstellungsdatum</Label>
              <Input
                id="hireDate"
                type="date"
                value={employee.hireDate}
                onChange={(e) => setEmployee({ ...employee, hireDate: e.target.value })}
              />
            </div>
          </div>
          <Button type="submit">Änderungen speichern</Button>
        </form>
      </CardContent>
    </Card>
  )
}

