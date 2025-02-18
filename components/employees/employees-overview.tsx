'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Employee } from "@/types/employee"
import { MoreHorizontal, Plus, Search } from 'lucide-react'
import Link from "next/link"
import { AddEmployeeDialog } from "./add-employee-dialog"

const pastelColors = {
  sage: '#D0E0C0',
  skyBlue: '#B0E0E6',
  lilac: '#DCD0FF',
  apricot: '#FFE5B4',
  rosyBrown: '#FFC0CB',
};

export const employees: Employee[] = [
  {
    id: 1,
    personnelNumber: "EMP001",
    firstName: "Emir",
    lastName: "Keco",
    email: "emir.keco@example.com",
    phone: "030-12345678",
    mobile: "0170-12345678",
    position: "Verkaufsleiter",
    department: "Vertrieb",
    hireDate: "2020-01-15",
    status: "active",
    role: "Vertriebsleiter",
    performance: {
      deals: 45,
      revenue: 250000,
      commission: 25000,
      target: 300000,
      achievement: 83
    },
    statistics: {
      closedDeals: 45,
      activeDeals: 12,
      successRate: 75,
      averageDealValue: 5555,
      monthlyCommission: [2100, 2300, 2800, 2400, 2900, 3100],
      conversionRate: 68,
      receivedLeads: 120,
      processedLeads: 105,
      projectTypes: {
        largeInstallations: 8,
        singleFamilyHomes: 25,
        openAreaSystems: 3,
        roofLeasing: 6,
        electricityContracts: 15
      },
      leadProcessingTime: 3,
      customerSatisfaction: 4.7
    },
    recentActivities: [
      {
        id: 1,
        type: "deal",
        description: "Großauftrag abgeschlossen - Solar GmbH",
        date: "2024-01-05"
      }
    ]
  },
  {
    id: 2,
    personnelNumber: "EMP002",
    firstName: "Fabio",
    lastName: "Palladino",
    email: "fabio.palladino@example.com",
    phone: "030-87654321",
    mobile: "0170-87654321",
    position: "Vertriebsmitarbeiter",
    department: "Vertrieb",
    hireDate: "2021-03-01",
    status: "active",
    role: "Vertriebler",
    performance: {
      deals: 28,
      revenue: 150000,
      commission: 15000,
      target: 200000,
      achievement: 75
    },
    statistics: {
      closedDeals: 28,
      activeDeals: 8,
      successRate: 70,
      averageDealValue: 5357,
      monthlyCommission: [1500, 1800, 1600, 1900, 2100, 1700],
      conversionRate: 65,
      receivedLeads: 90,
      processedLeads: 80,
      projectTypes: {
        largeInstallations: 5,
        singleFamilyHomes: 18,
        openAreaSystems: 2,
        roofLeasing: 3,
        electricityContracts: 10
      },
      leadProcessingTime: 4,
      customerSatisfaction: 4.5
    },
    recentActivities: [
      {
        id: 1,
        type: "meeting",
        description: "Kundenpräsentation - Neue Solartechnik",
        date: "2024-01-04"
      }
    ]
  }
]

export function EmployeesOverview() {
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEmployees = employees.filter(employee => 
    employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.personnelNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4 p-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mitarbeiter</h2>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Mitarbeiter und deren Leistungen
          </p>
        </div>
        <Button onClick={() => setIsAddEmployeeOpen(true)} style={{ backgroundColor: pastelColors.sage, color: 'black' }}>
          <Plus className="mr-2 h-4 w-4" /> Mitarbeiter hinzufügen
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Mitarbeiter suchen..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gesamtumsatz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">400.000 €</div>
            <p className="text-xs text-muted-foreground">
              +20.1% gegenüber Vormonat
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Durchschn. Provision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.350 €</div>
            <p className="text-xs text-muted-foreground">
              +15% gegenüber Vormonat
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktive Mitarbeiter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 seit letztem Monat
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Erfolgsquote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              +5% gegenüber Vormonat
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mitarbeiterübersicht</CardTitle>
          <CardDescription>
            Eine Übersicht aller Mitarbeiter und deren wichtigsten Kennzahlen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Personalnummer</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Abteilung</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Leistung</TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback>
                          {employee.firstName[0]}{employee.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{`${employee.firstName} ${employee.lastName}`}</div>
                        <div className="text-sm text-muted-foreground">{employee.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.personnelNumber}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                      {employee.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2"
                          style={{ width: `${employee.performance.achievement}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {employee.performance.achievement}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Menü öffnen</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link 
                            href={`/employees/${employee.id}`}
                            className="flex items-center px-2 py-2 text-sm"
                          >
                            Profil anzeigen
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link 
                            href={`/employees/${employee.id}/dashboard`}
                            className="flex items-center px-2 py-2 text-sm"
                          >
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <span className="flex items-center px-2 py-2 text-sm">
                            Bearbeiten
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <span className="flex items-center px-2 py-2 text-sm">
                            Deaktivieren
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddEmployeeDialog 
        open={isAddEmployeeOpen} 
        onOpenChange={setIsAddEmployeeOpen} 
      />
    </div>
  )
}

