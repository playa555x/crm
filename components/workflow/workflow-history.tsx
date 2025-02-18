'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const historyItems = [
  {
    id: 1,
    workflow: "Folgeaktivität zu Deals",
    trigger: "Deal in Phase 'Qualifiziert' verschoben",
    action: "E-Mail gesendet",
    timestamp: "2024-01-05 14:30",
    status: "success"
  },
  {
    id: 2,
    workflow: "Neue Leads begrüßen",
    trigger: "Neuer Lead erstellt",
    action: "Willkommens-E-Mail gesendet",
    timestamp: "2024-01-05 13:15",
    status: "success"
  },
  {
    id: 3,
    workflow: "Deal Nachverfolgung",
    trigger: "Deal 3 Tage inaktiv",
    action: "Erinnerung gesendet",
    timestamp: "2024-01-05 12:00",
    status: "failed"
  },
]

export function WorkflowHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ausführungsverlauf</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <p className="font-medium">{item.workflow}</p>
                <p className="text-sm text-muted-foreground">
                  Trigger: {item.trigger}
                </p>
                <p className="text-sm text-muted-foreground">
                  Aktion: {item.action}
                </p>
              </div>
              <div className="text-right space-y-1">
                <Badge
                  variant={item.status === "success" ? "default" : "destructive"}
                >
                  {item.status === "success" ? "Erfolgreich" : "Fehlgeschlagen"}
                </Badge>
                <p className="text-sm text-muted-foreground">{item.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

