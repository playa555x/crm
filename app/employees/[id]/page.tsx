'use client'

import { useState, useEffect } from 'react'
import { EmployeeDetails } from '@/components/employee-details'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Employee } from '@/types/contact'

// This would typically come from an API or database
const mockEmployees: Employee[] = [
  {
    id: 1,
    firstName: 'Emir',
    lastName: 'Keco',
    email: 'emir.keco@example.com',
    phone: '030-12345678',
    mobile: '0170-12345678',
    position: 'Verkaufsleiter',
    department: 'Vertrieb',
    hireDate: '2020-01-15',
  },
  {
    id: 2,
    firstName: 'Fabio',
    lastName: 'Palladino',
    email: 'fabio.palladino@example.com',
    phone: '030-87654321',
    mobile: '0170-87654321',
    position: 'Vertriebsmitarbeiter',
    department: 'Vertrieb',
    hireDate: '2021-03-01',
  },
]

export default function EmployeePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [employee, setEmployee] = useState<Employee | null>(null)

  useEffect(() => {
    // In a real application, this would be an API call
    const fetchedEmployee = mockEmployees.find(e => e.id === parseInt(params.id))
    setEmployee(fetchedEmployee || null)
  }, [params.id])

  if (!employee) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Mitarbeiter nicht gefunden</h1>
          <p className="mt-2 text-gray-600">Der angeforderte Mitarbeiter existiert nicht.</p>
          <Button 
            onClick={() => router.back()}
            variant="outline"
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Übersicht
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zur Übersicht
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{`${employee.firstName} ${employee.lastName}`}</h1>
          <p className="text-gray-500">{employee.position}</p>
        </div>
      </div>
      <EmployeeDetails employee={employee} />
    </div>
  )
}

