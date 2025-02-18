'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Role, Permission } from '@/types/employee'

const initialRoles: Role[] = [
  { id: '1', name: 'Admin', permissions: ['all'] },
  { id: '2', name: 'Vertriebsleiter', permissions: ['view_all_leads', 'view_all_contacts', 'view_all_deals', 'use_all_filters'] },
  { id: '3', name: 'Vertriebler', permissions: ['view_own_leads', 'view_own_contacts', 'view_own_deals', 'view_own_calendar'] },
  { id: '4', name: 'Innendienst', permissions: [] },
  { id: '5', name: 'Monteur-AC', permissions: [] },
  { id: '6', name: 'Monteur-DC', permissions: [] },
  { id: '7', name: 'Planer', permissions: [] },
  { id: '8', name: 'Geschäftsführer', permissions: ['all'] },
]

const permissions: Permission[] = [
  { id: 'view_all_leads', name: 'Alle Leads sehen', description: 'Kann alle Leads im System sehen', category: 'Leads' },
  { id: 'view_own_leads', name: 'Eigene Leads sehen', description: 'Kann nur eigene oder zugewiesene Leads sehen', category: 'Leads' },
  { id: 'edit_all_leads', name: 'Alle Leads bearbeiten', description: 'Kann alle Leads im System bearbeiten', category: 'Leads' },
  { id: 'edit_own_leads', name: 'Eigene Leads bearbeiten', description: 'Kann nur eigene oder zugewiesene Leads bearbeiten', category: 'Leads' },
  { id: 'view_all_contacts', name: 'Alle Kontakte sehen', description: 'Kann alle Kontakte im System sehen', category: 'Kontakte' },
  { id: 'view_own_contacts', name: 'Eigene Kontakte sehen', description: 'Kann nur eigene oder zugewiesene Kontakte sehen', category: 'Kontakte' },
  { id: 'edit_all_contacts', name: 'Alle Kontakte bearbeiten', description: 'Kann alle Kontakte im System bearbeiten', category: 'Kontakte' },
  { id: 'edit_own_contacts', name: 'Eigene Kontakte bearbeiten', description: 'Kann nur eigene oder zugewiesene Kontakte bearbeiten', category: 'Kontakte' },
  { id: 'view_all_deals', name: 'Alle Geschäfte sehen', description: 'Kann alle Geschäfte im System sehen', category: 'Geschäfte' },
  { id: 'view_own_deals', name: 'Eigene Geschäfte sehen', description: 'Kann nur eigene oder zugewiesene Geschäfte sehen', category: 'Geschäfte' },
  { id: 'edit_all_deals', name: 'Alle Geschäfte bearbeiten', description: 'Kann alle Geschäfte im System bearbeiten', category: 'Geschäfte' },
  { id: 'edit_own_deals', name: 'Eigene Geschäfte bearbeiten', description: 'Kann nur eigene oder zugewiesene Geschäfte bearbeiten', category: 'Geschäfte' },
  { id: 'view_all_calendar', name: 'Alle Termine sehen', description: 'Kann alle Termine im Kalender sehen', category: 'Kalender' },
  { id: 'view_own_calendar', name: 'Eigene Termine sehen', description: 'Kann nur eigene oder zugewiesene Termine im Kalender sehen', category: 'Kalender' },
  { id: 'edit_all_calendar', name: 'Alle Termine bearbeiten', description: 'Kann alle Termine im Kalender bearbeiten', category: 'Kalender' },
  { id: 'edit_own_calendar', name: 'Eigene Termine bearbeiten', description: 'Kann nur eigene oder zugewiesene Termine im Kalender bearbeiten', category: 'Kalender' },
  { id: 'use_all_filters', name: 'Alle Filter verwenden', description: 'Kann alle Filtermöglichkeiten in der Suche verwenden', category: 'Suche' },
  { id: 'view_all_employees', name: 'Alle Mitarbeiter sehen', description: 'Kann alle Mitarbeiter im System sehen', category: 'Mitarbeiter' },
  { id: 'edit_all_employees', name: 'Alle Mitarbeiter bearbeiten', description: 'Kann alle Mitarbeiter im System bearbeiten', category: 'Mitarbeiter' },
  { id: 'manage_roles', name: 'Rollen verwalten', description: 'Kann Rollen erstellen, bearbeiten und löschen', category: 'Rollen' },
  { id: 'all', name: 'Alle Rechte', description: 'Hat Zugriff auf alle Funktionen des Systems', category: 'System' },
]

export function RolesAndPermissions() {
  const [roles, setRoles] = useState<Role[]>(initialRoles)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [newRoleName, setNewRoleName] = useState('')

  const handleRoleSelect = (roleId: string) => {
    const role = roles.find(r => r.id === roleId)
    setSelectedRole(role || null)
  }

  const handlePermissionToggle = (permissionId: string) => {
    if (!selectedRole) return

    setSelectedRole(prevRole => {
      const updatedPermissions = prevRole.permissions.includes(permissionId)
        ? prevRole.permissions.filter(id => id !== permissionId)
        : [...prevRole.permissions, permissionId]

      return { ...prevRole, permissions: updatedPermissions }
    })

    setRoles(prevRoles => 
      prevRoles.map(role => 
        role.id === selectedRole.id 
          ? { ...role, permissions: selectedRole.permissions.includes(permissionId)
              ? role.permissions.filter(id => id !== permissionId)
              : [...role.permissions, permissionId] }
          : role
      )
    )
  }

  const handleAddRole = () => {
    if (newRoleName.trim() === '') return

    const newRole: Role = {
      id: (roles.length + 1).toString(),
      name: newRoleName,
      permissions: []
    }

    setRoles([...roles, newRole])
    setNewRoleName('')
  }

  const canManageRoles = selectedRole?.permissions.includes('all') || selectedRole?.permissions.includes('manage_roles')

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Rollen und Berechtigungen</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rollen</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={handleRoleSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Rolle auswählen" />
              </SelectTrigger>
              <SelectContent>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {canManageRoles && (
              <div className="mt-4">
                <Label htmlFor="new-role">Neue Rolle hinzufügen</Label>
                <div className="flex mt-2">
                  <Input
                    id="new-role"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="Rollenname"
                    className="mr-2"
                  />
                  <Button onClick={handleAddRole}>Hinzufügen</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {selectedRole && (
          <Card>
            <CardHeader>
              <CardTitle>Berechtigungen für {selectedRole.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(permissions.reduce((acc, permission) => {
                  if (!acc[permission.category]) {
                    acc[permission.category] = []
                  }
                  acc[permission.category].push(permission)
                  return acc
                }, {} as Record<string, Permission[]>)).map(([category, categoryPermissions]) => (
                  <div key={category}>
                    <h3 className="font-semibold mb-2">{category}</h3>
                    {categoryPermissions.map(permission => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.id}
                          checked={selectedRole.permissions.includes(permission.id)}
                          onCheckedChange={() => handlePermissionToggle(permission.id)}
                        />
                        <Label htmlFor={permission.id}>{permission.name}</Label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

