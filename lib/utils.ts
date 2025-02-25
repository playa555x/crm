import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { de } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | null) {
  if (!date) return ""
  return format(new Date(date), "PPpp", { locale: de })
}

// Hilfsfunktion für relative Zeitangaben (z.B. "vor 2 Stunden")
export function formatRelativeDate(date: string | null) {
  if (!date) return ""
  return format(new Date(date), "PPp", { locale: de })
}