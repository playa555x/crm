"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  LayoutDashboard,
  DollarSign,
  Users,
  Mail,
  Calendar,
  Users2,
  Grid,
  Menu,
  Workflow,
  CheckSquare,
  Shield,
  Boxes,
  FileText,
  Home,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const sidebarCategories = [
  {
    name: "Übersicht",
    items: [{ icon: LayoutDashboard, label: "Dashboard", href: "/" }],
  },
  {
    name: "Vertrieb",
    items: [
      { icon: DollarSign, label: "Geschäfte", href: "/deals" },
      { icon: Users, label: "Kontakte", href: "/contacts" },
      { icon: FileText, label: "Angebote & Aufträge", href: "/offers-orders-invoices" },
    ],
  },
  {
    name: "Planung",
    items: [
      { icon: Calendar, label: "Kalender", href: "/calendar" },
      { icon: Workflow, label: "Workflow", href: "/workflow" },
      { icon: CheckSquare, label: "Aufgaben", href: "/tasks" },
    ],
  },
  {
    name: "Kommunikation",
    items: [
      { icon: Mail, label: "E-Mail", href: "/email" },
      { icon: FileText, label: "Templates", href: "/templates" },
    ],
  },
  {
    name: "Verwaltung",
    items: [
      { icon: Users2, label: "Mitarbeiter", href: "/employees" },
      { icon: Shield, label: "Rollen und Rechte", href: "/roles-and-permissions" },
      { icon: Boxes, label: "Lager", href: "/inventory" },
    ],
  },
  {
    name: "Tools",
    items: [
      { icon: Home, label: "Dachplaner", href: "/roof-planner" },
      { icon: Grid, label: "Apps", href: "/apps" },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarCollapsed")
      return saved ? JSON.parse(saved) : true
    }
    return true
  })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed))
  }, [isCollapsed])

  const toggleCategory = (categoryName: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }))
  }

  const SidebarContent = () => (
    <div className="flex flex-col flex-grow py-2 overflow-y-auto">
      <nav className="flex-grow space-y-2">
        {sidebarCategories.map((category, categoryIndex) => (
          <Collapsible
            key={categoryIndex}
            open={!isCollapsed && openCategories[category.name]}
            onOpenChange={() => !isCollapsed && toggleCategory(category.name)}
          >
            <CollapsibleTrigger
              className={cn(
                "flex items-center w-full p-2 text-sm font-semibold text-left",
                isCollapsed && "justify-center",
              )}
            >
              {!isCollapsed &&
                (openCategories[category.name] ? (
                  <ChevronDown className="w-4 h-4 mr-1" />
                ) : (
                  <ChevronRight className="w-4 h-4 mr-1" />
                ))}
              {!isCollapsed && category.name}
            </CollapsibleTrigger>
            <CollapsibleContent className={cn("space-y-1", isCollapsed ? "hidden" : "pl-4")}>
              {category.items.map((item, itemIndex) => (
                <Tooltip key={itemIndex}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "justify-start w-full",
                        pathname === item.href ? "bg-muted hover:bg-muted" : "hover:bg-muted/50",
                        "flex items-center",
                        isCollapsed && "justify-center",
                      )}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {!isCollapsed && <span className="text-sm">{item.label}</span>}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </nav>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40 md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <TooltipProvider>
      <div
        className={cn(
          "fixed left-0 top-14 z-30 flex h-[calc(100vh-3.5rem)] flex-col bg-background border-r transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
        )}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        <SidebarContent />
      </div>
    </TooltipProvider>
  )
}

