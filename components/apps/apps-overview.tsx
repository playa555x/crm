'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
Card,
CardContent,
CardDescription,
CardFooter,
CardHeader,
CardTitle,
} from "@/components/ui/card"
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
Dialog,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, ExternalLink } from 'lucide-react'

// Mock-Daten für Apps
const mockApps = [
{ id: 1, name: 'Salesforce', category: 'CRM', description: 'Customer Relationship Management Software', apiEndpoint: 'https://api.salesforce.com' },
{ id: 2, name: 'Mailchimp', category: 'Email Marketing', description: 'Email Marketing Platform', apiEndpoint: 'https://api.mailchimp.com' },
{ id: 3, name: 'Slack', category: 'Communication', description: 'Team Communication Tool', apiEndpoint: 'https://api.slack.com' },
{ id: 4, name: 'Trello', category: 'Project Management', description: 'Project Management Software', apiEndpoint: 'https://api.trello.com' },
{ id: 5, name: 'QuickBooks', category: 'Accounting', description: 'Accounting Software', apiEndpoint: 'https://api.quickbooks.com' },
]

const categories = ['Alle', 'CRM', 'Email Marketing', 'Communication', 'Project Management', 'Accounting']

interface App {
id: number
name: string
category: string
description: string
apiEndpoint: string
}

const pastelGreen = '#C1E1C1';

const AppSearch = ({ onSearch }: { onSearch: (term: string) => void }) => (
<div className="relative">
  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
  <Input
    placeholder="Apps durchsuchen..."
    className="pl-8"
    onChange={(e) => onSearch(e.target.value)}
  />
</div>
)

const AppFilters = ({ onCategoryChange }: { onCategoryChange: (category: string) => void }) => (
<Select onValueChange={onCategoryChange}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Kategorie" />
  </SelectTrigger>
  <SelectContent>
    {categories.map((category) => (
      <SelectItem key={category} value={category}>{category}</SelectItem>
    ))}
  </SelectContent>
</Select>
)

const AppCard = ({ app }: { app: App }) => (
<Card>
  <CardHeader>
    <CardTitle>{app.name}</CardTitle>
    <CardDescription>{app.description}</CardDescription>
  </CardHeader>
  <CardContent>
    <Badge>{app.category}</Badge>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline" style={{ backgroundColor: pastelGreen, color: 'black' }}>Details</Button>
    <Button style={{ backgroundColor: pastelGreen, color: 'black' }}>Anbinden</Button>
  </CardFooter>
</Card>
)

const AppGrid = ({ apps }: { apps: App[] }) => (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {apps.map((app) => (
    <AppCard key={app.id} app={app} />
  ))}
</div>
)

const AddAppDialog = ({ onAddApp }: { onAddApp: (app: Omit<App, 'id'>) => void }) => {
const [newApp, setNewApp] = useState<Omit<App, 'id'>>({
  name: '',
  category: '',
  description: '',
  apiEndpoint: '',
})

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  onAddApp(newApp)
  setNewApp({ name: '', category: '', description: '', apiEndpoint: '' })
}

return (
  <Dialog>
    <DialogTrigger asChild>
      <Button style={{ backgroundColor: pastelGreen, color: 'black' }}><Plus className="mr-2 h-4 w-4" /> App hinzufügen</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Neue App hinzufügen</DialogTitle>
        <DialogDescription>
          Fügen Sie hier die Details der neuen App hinzu.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={newApp.name}
              onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Kategorie
            </Label>
            <Input
              id="category"
              value={newApp.category}
              onChange={(e) => setNewApp({ ...newApp, category: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Beschreibung
            </Label>
            <Input
              id="description"
              value={newApp.description}
              onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiEndpoint" className="text-right">
              API-Endpunkt
            </Label>
            <Input
              id="apiEndpoint"
              value={newApp.apiEndpoint}
              onChange={(e) => setNewApp({ ...newApp, apiEndpoint: e.target.value })}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" style={{ backgroundColor: pastelGreen, color: 'black' }}>App hinzufügen</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
)
}

export function AppsOverview() {
const [apps, setApps] = useState<App[]>(mockApps)
const [filteredApps, setFilteredApps] = useState<App[]>(mockApps)

const handleSearch = (term: string) => {
  const filtered = apps.filter(app => 
    app.name.toLowerCase().includes(term.toLowerCase()) ||
    app.description.toLowerCase().includes(term.toLowerCase())
  )
  setFilteredApps(filtered)
}

const handleCategoryChange = (category: string) => {
  if (category === 'Alle') {
    setFilteredApps(apps)
  } else {
    const filtered = apps.filter(app => app.category === category)
    setFilteredApps(filtered)
  }
}

const handleAddApp = (newApp: Omit<App, 'id'>) => {
  const appWithId = { ...newApp, id: apps.length + 1 }
  setApps([...apps, appWithId])
  setFilteredApps([...apps, appWithId])
}

return (
  <div className="container mx-auto py-8">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">App-Verwaltung</h1>
      <AddAppDialog onAddApp={handleAddApp} />
    </div>
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <AppSearch onSearch={handleSearch} />
      <AppFilters onCategoryChange={handleCategoryChange} />
    </div>
    <AppGrid apps={filteredApps} />
  </div>
)
}

