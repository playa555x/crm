'use client'

import { EmployeeDashboard } from "@/components/employees/employee-dashboard"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { useRouter } from "next/navigation"

// Sample data - in a real app, this would come from an API
const employee = {
  id: 1,
  firstName: "Emir",
  lastName: "Keco",
  email: "emir.keco@example.com",
  phone: "030-12345678",
  mobile: "0170-12345678",
  position: "Verkaufsleiter",
  department: "Vertrieb",
  hireDate: "2020-01-15",
  status: "active",
  role: "manager",
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
    },
    {
      id: 2,
      type: "meeting",
      description: "Kundenpräsentation - Neue Solartechnik",
      date: "2024-01-04"
    },
    {
      id: 3,
      type: "note",
      description: "Folge-up Call mit Interessent für Freiflächen-Anlage",
      date: "2024-01-03"
    }
  ]
}

export default function EmployeeDashboardPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  if (!employee) {
    return <div>Mitarbeiter nicht gefunden</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zur Übersicht
        </Button>
      </div>
      <EmployeeDashboard employee={employee} />
    </div>
  )
}

