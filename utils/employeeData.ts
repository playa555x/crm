import { Employee } from '@/types/employee'

// This is a mock function that would typically fetch data from an API or database
export async function getEmployees(): Promise<Employee[]> {
  // In a real application, this would be an API call
  return [
    { id: '1', firstName: 'Max', lastName: 'Mustermann', email: 'max.mustermann@example.com', position: 'Verkaufsleiter' },
    { id: '2', firstName: 'Anna', lastName: 'Schmidt', email: 'anna.schmidt@example.com', position: 'Vertriebsmitarbeiter' },
    { id: '3', firstName: 'Tom', lastName: 'Müller', email: 'tom.mueller@example.com', position: 'Kundenberater' },
  ]
}

