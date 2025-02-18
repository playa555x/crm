'use client'

import { Employee } from "@/types/employee"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Mail, Phone } from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

interface EmployeeDashboardProps {
  employee: Employee
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export function EmployeeDashboard({ employee }: EmployeeDashboardProps) {
  if (!employee || !employee.statistics) {
    return <div>Keine Daten verfügbar</div>
  }

  const commissionData = employee.statistics.monthlyCommission?.map((value, index) => ({
    month: new Date(2024, index).toLocaleString('de-DE', { month: 'short' }),
    commission: value
  })) || []

  const projectTypeData = [
    { name: 'Großanlagen', value: employee.statistics.projectTypes?.largeInstallations || 0 },
    { name: 'Einfamilienhäuser', value: employee.statistics.projectTypes?.singleFamilyHomes || 0 },
    { name: 'Freiflächen', value: employee.statistics.projectTypes?.openAreaSystems || 0 },
    { name: 'Dachpacht', value: employee.statistics.projectTypes?.roofLeasing || 0 },
    { name: 'Stromverträge', value: employee.statistics.projectTypes?.electricityContracts || 0 },
  ];

  const leadData = [
    { name: 'Bearbeitete Leads', value: employee.statistics.processedLeads || 0 },
    { name: 'Offene Leads', value: (employee.statistics.receivedLeads || 0) - (employee.statistics.processedLeads || 0) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={employee.avatar} />
                <AvatarFallback>{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{`${employee.firstName} ${employee.lastName}`}</CardTitle>
                <CardDescription>{employee.position}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>Eingestellt am {new Date(employee.hireDate).toLocaleDateString('de-DE')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Abgeschlossene Geschäfte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employee.statistics.closedDeals}</div>
              <div className="text-xs text-muted-foreground">
                {employee.statistics.activeDeals} aktive Geschäfte
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Erfolgsquote
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employee.statistics.successRate}%</div>
              <div className="text-xs text-muted-foreground">
                Ø Geschäftswert: {employee.statistics.averageDealValue.toLocaleString('de-DE')} €
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Umsatz
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employee.performance.revenue.toLocaleString('de-DE')} €</div>
              <div className="text-xs text-muted-foreground">
                Ziel: {employee.performance.target.toLocaleString('de-DE')} €
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Provision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employee.performance.commission.toLocaleString('de-DE')} €</div>
              <div className="text-xs text-muted-foreground">
                +12% gegenüber Vormonat
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Leistung</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="projects">Projekte</TabsTrigger>
          <TabsTrigger value="activities">Aktivitäten</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Provisionsübersicht</CardTitle>
                <CardDescription>Monatliche Provision der letzten 6 Monate</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={commissionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="commission" fill="#adfa1d" name="Provision" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Zielerfüllung</CardTitle>
                <CardDescription>Fortschritt zum Jahresziel</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Erreicht', value: employee.performance.revenue },
                        { name: 'Verbleibend', value: employee.performance.target - employee.performance.revenue }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {[0, 1].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Leistungskennzahlen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Konversionsrate</h4>
                  <div className="text-2xl font-bold">{employee.statistics.conversionRate}%</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Kundenzufriedenheit</h4>
                  <div className="text-2xl font-bold">{employee.statistics.customerSatisfaction}/5</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leads" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Lead-Übersicht</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Erhaltene Leads</h4>
                    <div className="text-2xl font-bold">{employee.statistics.receivedLeads}</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Bearbeitete Leads</h4>
                    <div className="text-2xl font-bold">{employee.statistics.processedLeads}</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Durchschnittliche Bearbeitungszeit</h4>
                    <div className="text-2xl font-bold">{employee.statistics.leadProcessingTime} Tage</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Lead-zu-Kunde Konversionsrate</h4>
                    <div className="text-2xl font-bold">{employee.statistics.conversionRate}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead-Bearbeitungsstatus</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {leadData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Projekttypen</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {projectTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projektdetails</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {projectTypeData.map((project, index) => (
                    <div key={index}>
                      <h4 className="text-sm font-medium mb-2">{project.name}</h4>
                      <div className="text-2xl font-bold">{project.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Letzte Aktivitäten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employee.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

