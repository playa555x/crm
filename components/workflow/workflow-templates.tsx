'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Clock, Bell, CheckCircle, Calendar, Users, FileText, Phone, MessageSquare, Building2, Sun, Battery, Coins, PenToolIcon as Tool, BarChartIcon as ChartBar, FileSpreadsheet } from 'lucide-react'

const automationCategories = [
  {
    title: "Vertriebsautomatisierung",
    icon: Coins,
    templates: [
      "Neukunden-Begrüßungssequenz",
      "Angebotsnachverfolgung",
      "Lead-Qualifizierung",
      "Verkaufsabschluss-Workflow"
    ]
  },
  {
    title: "Technische Workflows",
    icon: Sun,
    templates: [
      "Installationsplanung",
      "Wartungsintervalle",
      "Leistungsüberwachung",
      "Störungsmeldung-Workflow"
    ]
  },
  {
    title: "Kundenservice",
    icon: Users,
    templates: [
      "Kundenfeedback-Prozess",
      "Support-Ticket-Workflow",
      "Beschwerdemanagement",
      "Kundenzufriedenheitsumfrage"
    ]
  },
  {
    title: "Dokumentenmanagement",
    icon: FileText,
    templates: [
      "Vertragserstellung",
      "Förderungsantrag-Workflow",
      "Dokumentenprüfung",
      "Archivierungsprozess"
    ]
  },
  {
    title: "Energiemanagement",
    icon: Battery,
    templates: [
      "Ertragsberichtserstellung",
      "Verbrauchsanalyse",
      "Optimierungsvorschläge",
      "Speicherauslastung"
    ]
  },
  {
    title: "Kommunikation",
    icon: MessageSquare,
    templates: [
      "Newsletter-Automation",
      "SMS-Benachrichtigungen",
      "Terminerinnerungen",
      "Statusupdates"
    ]
  }
]

const popularTemplates = [
  {
    title: "Wartungsintervall-Planung",
    description: "Automatische Planung und Benachrichtigung für Wartungsarbeiten an Solaranlagen",
    icon: Tool,
    steps: ["Trigger", "Bedingung", "Kalendereintrag", "Benachrichtigung"],
    category: "Service"
  },
  {
    title: "Solaranlagen-Leistungsanalyse",
    description: "Automatische Erstellung und Versand von Leistungsberichten an Kunden",
    icon: ChartBar,
    steps: ["Datensammlung", "Analyse", "Bericht erstellen", "E-Mail"],
    category: "Reporting"
  },
  {
    title: "Förderungsantrag-Workflow",
    description: "Begleitung des Kunden durch den Förderungsantragsprozess für Solaranlagen",
    icon: FileSpreadsheet,
    steps: ["Trigger", "Dokumente", "Prüfung", "Bestätigung"],
    category: "Förderung"
  },
  {
    title: "Kundenrückgewinnung Solar",
    description: "Automatisierte Kampagne zur Rückgewinnung inaktiver Solarkunden",
    icon: Users,
    steps: ["Segmentierung", "E-Mail-Sequenz", "Angebot", "Nachverfolgung"],
    category: "Vertrieb"
  },
  {
    title: "Energiespeicher-Optimierung",
    description: "Workflow zur Optimierung der Nutzung von Energiespeichersystemen",
    icon: Battery,
    steps: ["Datenanalyse", "Optimierungsvorschläge", "Benachrichtigung", "Umsetzung"],
    category: "Energiemanagement"
  },
  {
    title: "Solar-Upgrade-Kampagne",
    description: "Gezielte Kampagne für Bestandskunden zur Erweiterung ihrer Solaranlage",
    icon: Sun,
    steps: ["Kundensegmentierung", "Angebotserstellung", "E-Mail", "Terminvereinbarung"],
    category: "Vertrieb"
  }
]

export function WorkflowTemplates() {
  return (
    <div className="space-y-8">
      {/* Automatisierungskategorien */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {automationCategories.map((category, index) => (
          <Card key={index} className="border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <category.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {category.templates.map((template, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    <span className="text-sm">{template}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-4" variant="outline">
                Automatisierung erstellen
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Beliebte Vorlagen */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Beliebte Vorlagen</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {popularTemplates.map((template, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <template.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full mt-4" 
                  onClick={() => window.location.href = '/workflow/new'}
                >
                  Vorlage verwenden
                </Button>
                <div className="flex items-center gap-2 mb-4">
                  {template.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground">
                        {step === "Trigger" && <Bell className="h-4 w-4" />}
                        {step === "E-Mail" && <Mail className="h-4 w-4" />}
                        {step === "Kalendereintrag" && <Calendar className="h-4 w-4" />}
                        {step === "Benachrichtigung" && <Bell className="h-4 w-4" />}
                        {step === "Datensammlung" && <FileText className="h-4 w-4" />}
                        {step === "Analyse" && <ChartBar className="h-4 w-4" />}
                        {step === "Bericht erstellen" && <FileText className="h-4 w-4" />}
                        {step === "Dokumente" && <FileText className="h-4 w-4" />}
                        {step === "Prüfung" && <CheckCircle className="h-4 w-4" />}
                        {step === "Bestätigung" && <CheckCircle className="h-4 w-4" />}
                        {step === "Segmentierung" && <Users className="h-4 w-4" />}
                        {step === "E-Mail-Sequenz" && <Mail className="h-4 w-4" />}
                        {step === "Angebot" && <FileText className="h-4 w-4" />}
                        {step === "Nachverfolgung" && <Phone className="h-4 w-4" />}
                        {step === "Datenanalyse" && <ChartBar className="h-4 w-4" />}
                        {step === "Optimierungsvorschläge" && <Sun className="h-4 w-4" />}
                        {step === "Umsetzung" && <Tool className="h-4 w-4" />}
                        {step === "Kundensegmentierung" && <Users className="h-4 w-4" />}
                        {step === "Angebotserstellung" && <FileText className="h-4 w-4" />}
                        {step === "Terminvereinbarung" && <Calendar className="h-4 w-4" />}
                        {step === "Bedingung" && <ArrowRight className="h-4 w-4" />}
                      </div>
                      {stepIndex < template.steps.length - 1 && (
                        <div className="w-4 h-px bg-border mx-1" />
                      )}
                    </div>
                  ))}
                </div>
                <Button className="w-full">Vorlage verwenden</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

