import { useState } from "react"
import { useForm } from "react-hook-form"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Database } from "@/types/supabase"

interface AddEmployeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type EmployeeFormData = Database['public']['Tables']['employees']['Insert'] & {
  role: string
}

export function AddEmployeeDialog({ open, onOpenChange }: AddEmployeeDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<EmployeeFormData>()
  const supabase = createClientComponentClient()

  const onSubmit = async (data: EmployeeFormData) => {
    setIsLoading(true)
    try {
      // 1. Sende Einladung über die API
      const response = await fetch("/api/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          role: data.position === "manager" ? "admin" : "user",
          userData: {
            personnelNumber: data.personnelNumber,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            position: data.position,
            department: data.department,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Fehler beim Senden der Einladung")
      }

      // 2. Erstelle den Mitarbeiter-Eintrag in der employees Tabelle
      const { error: employeeError } = await supabase
        .from("employees")
        .insert([{
          ...data,
          status: "pending",
        }])

      if (employeeError) throw employeeError

      toast({
        title: "Einladung gesendet",
        description: `Eine Einladung wurde an ${data.email} gesendet.`,
      })
      reset()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Fehler",
        description: error instanceof Error ? error.message : "Ein Fehler ist aufgetreten.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Neuen Mitarbeiter hinzufügen</DialogTitle>
          <DialogDescription>
            Fügen Sie einen neuen Mitarbeiter hinzu. Eine Einladungs-E-Mail wird automatisch versendet.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="personnelNumber" className="text-right">
                Personalnummer
              </Label>
              <Input
                id="personnelNumber"
                placeholder="z.B. EMP003"
                className="col-span-3"
                {...register("personnelNumber", { required: true })}
              />
              {errors.personnelNumber && (
                <p className="col-span-3 col-start-2 text-sm text-red-500">
                  Personalnummer ist erforderlich
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                Vorname
              </Label>
              <Input
                id="firstName"
                className="col-span-3"
                {...register("firstName", { required: true })}
              />
              {errors.firstName && (
                <p className="col-span-3 col-start-2 text-sm text-red-500">
                  Vorname ist erforderlich
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Nachname
              </Label>
              <Input
                id="lastName"
                className="col-span-3"
                {...register("lastName", { required: true })}
              />
              {errors.lastName && (
                <p className="col-span-3 col-start-2 text-sm text-red-500">
                  Nachname ist erforderlich
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                E-Mail
              </Label>
              <Input
                id="email"
                type="email"
                className="col-span-3"
                {...register("email", { 
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i 
                })}
              />
              {errors.email && (
                <p className="col-span-3 col-start-2 text-sm text-red-500">
                  Gültige E-Mail-Adresse ist erforderlich
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Telefon
              </Label>
              <Input
                id="phone"
                type="tel"
                className="col-span-3"
                {...register("phone", { required: true })}
              />
              {errors.phone && (
                <p className="col-span-3 col-start-2 text-sm text-red-500">
                  Telefonnummer ist erforderlich
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Position
              </Label>
              <Select onValueChange={(value) => setValue("position", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Position auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Vertriebsmitarbeiter</SelectItem>
                  <SelectItem value="manager">Verkaufsleiter</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Abteilung
              </Label>
              <Select onValueChange={(value) => setValue("department", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Abteilung auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Vertrieb</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="admin">Administration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Wird eingeladen..." : "Mitarbeiter einladen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}