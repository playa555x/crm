"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpDown, Search } from "lucide-react"
import Link from "next/link"
import { MoreHorizontal, Edit, Eye, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { OfferPreviewDialog } from "./offers/offer-preview-dialog"

interface Item {
  id: string
  customerName: string
  title: string
  date: string
  status: string
  total: number
  items?: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
    unit: string
  }>
}

const OffersOrdersInvoices: React.FC = () => {
  const { hasPermission } = useAuth()
  const [activeTab, setActiveTab] = useState<"offers" | "orders" | "invoices">("offers")
  const [items, setItems] = useState<Item[]>([])
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortConfig, setSortConfig] = useState<{ key: keyof Item; direction: "asc" | "desc" } | null>(null)
  const [previewItem, setPreviewItem] = useState<Item | null>(null)

  useEffect(() => {
    // Fetch data based on activeTab
    // This is a mock implementation. In a real app, you'd fetch from an API
    const mockData: Item[] =
      activeTab === "offers"
        ? [
            {
              id: "AN0001",
              customerName: "Max Mustermann",
              title: "Solaranlage 5kW",
              date: "2023-06-01",
              status: "sent",
              total: 15000,
              items: [
                { description: "Solarmodul 400W", quantity: 12, unitPrice: 250, total: 3000, unit: "Stück" },
                { description: "Wechselrichter 5kW", quantity: 1, unitPrice: 1500, total: 1500, unit: "Stück" },
                { description: "Montage", quantity: 1, unitPrice: 2000, total: 2000, unit: "Pauschal" },
              ],
            },
            {
              id: "AN0002",
              customerName: "Anna Schmidt",
              title: "Batteriespeicher 10kWh",
              date: "2023-06-02",
              status: "accepted",
              total: 8000,
              items: [],
            },
            {
              id: "AN0003",
              customerName: "Firma XYZ GmbH",
              title: "Solarcarport",
              date: "2023-06-03",
              status: "draft",
              total: 12000,
              items: [],
            },
          ]
        : activeTab === "orders"
          ? [
              {
                id: "AB0001",
                customerName: "Max Mustermann",
                title: "Solaranlage 5kW",
                date: "2023-06-15",
                status: "in_progress",
                total: 15000,
                items: [],
              },
              {
                id: "AB0002",
                customerName: "Anna Schmidt",
                title: "Batteriespeicher 10kWh",
                date: "2023-06-20",
                status: "completed",
                total: 8000,
                items: [],
              },
              {
                id: "AB0003",
                customerName: "Erika Musterfrau",
                title: "Wartungsauftrag",
                date: "2023-06-25",
                status: "scheduled",
                total: 500,
                items: [],
              },
            ]
          : [
              {
                id: "RE0001",
                customerName: "Max Mustermann",
                title: "Solaranlage 5kW",
                date: "2023-07-01",
                status: "paid",
                total: 15000,
                items: [],
              },
              {
                id: "RE0002",
                customerName: "Anna Schmidt",
                title: "Batteriespeicher 10kWh",
                date: "2023-07-05",
                status: "sent",
                total: 8000,
                items: [],
              },
              {
                id: "RE0003",
                customerName: "Erika Musterfrau",
                title: "Wartungsauftrag",
                date: "2023-07-10",
                status: "overdue",
                total: 500,
                items: [],
              },
            ]
    setItems(mockData)
  }, [activeTab])

  useEffect(() => {
    let result = items

    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.customerName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter)
    }

    if (sortConfig !== null) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredItems(result)
  }, [items, searchTerm, statusFilter, sortConfig])

  const handleSort = (key: keyof Item) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const getStatusOptions = () => {
    switch (activeTab) {
      case "offers":
        return ["sent", "accepted", "rejected", "draft"]
      case "orders":
        return ["in_progress", "completed", "scheduled", "cancelled"]
      case "invoices":
        return ["paid", "sent", "overdue"]
      default:
        return []
    }
  }

  const handleEditItem = (item: Item) => {
    // This would open the editor with the selected item
    console.log("Edit item:", item)
  }

  const handleDeleteItem = (id: string) => {
    // This would delete the item after confirmation
    if (window.confirm("Sind Sie sicher, dass Sie diesen Eintrag löschen möchten?")) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="offers">Angebote</TabsTrigger>
          <TabsTrigger value="orders">Aufträge</TabsTrigger>
          <TabsTrigger value="invoices">Rechnungen</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>
            {activeTab === "offers" ? "Angebote" : activeTab === "orders" ? "Aufträge" : "Rechnungen"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Suche..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                {getStatusOptions().map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <Button variant="ghost" onClick={() => handleSort("id")}>
                    ID <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("customerName")}>
                    Kunde <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("title")}>
                    Titel <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("date")}>
                    Datum <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("status")}>
                    Status <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => handleSort("total")}>
                    Betrag <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <Button variant="link" onClick={() => setPreviewItem(item)}>
                      {item.id}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Link href={`/contacts/${item.id}`}>
                      <Button variant="link">{item.customerName}</Button>
                    </Link>
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell className="text-right">
                    {item.total.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setPreviewItem(item)}>
                          <Eye className="mr-2 h-4 w-4" />
                          {activeTab === "offers"
                            ? "Angebot anzeigen"
                            : activeTab === "orders"
                              ? "Auftrag anzeigen"
                              : "Rechnung anzeigen"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditItem(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          {activeTab === "offers" ? "Angebot" : activeTab === "orders" ? "Auftrag" : "Rechnung"}{" "}
                          bearbeiten
                        </DropdownMenuItem>
                        {hasPermission("admin") && (
                          <DropdownMenuItem onClick={() => handleDeleteItem(item.id)} className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            {activeTab === "offers" ? "Angebot" : activeTab === "orders" ? "Auftrag" : "Rechnung"}{" "}
                            löschen
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <OfferPreviewDialog
        open={previewItem !== null}
        onOpenChange={(open) => !open && setPreviewItem(null)}
        offer={previewItem || undefined}
      />
    </div>
  )
}

export default OffersOrdersInvoices

