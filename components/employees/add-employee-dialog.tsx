import { useState } from "react"
import { useForm } from "react-hook-form"
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
import { addEmployee } from "@/lib/supabase/employees"
import { toast } from "@/components/ui/use-toast"
import { Database } from "@/types/supabase"

interface AddEmployeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type EmployeeFormData = {
  personnel_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
}

export function AddEmployeeDialog({ open, onOpenChange }: AddEmployeeDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<EmployeeFormData>()

  const onSubmit = async (data: EmployeeFormData) => {
    setIsLoading(true)
    try {
      console.log('Form data being submitted:', data)
      console.log('Sending invitation to:', data.email)

      const response = await fetch("/api/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          role: data.position === "manager" ? "admin" : "user",
          userData: {
            personnel_number: data.personnel_number,
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.phone,
            position: data.position,
            department: data.department,
          },
        }),
      })

      const responseData = await response.json()
      console.log('Server response:', responseData)

      if (!response.ok) {
        throw new Error(responseData.error || "Fehler beim Senden der Einladung")
      }

      await addEmployee(data)
      toast({
        title: "Mitarbeiter hinzugefügt",
        description: "Der neue Mitarbeiter wurde erfolgreich hinzugefügt.",
      })
      reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error details:', error)
      toast({
        title: "Fehler",
        description: "Beim Hinzufügen des Mitarbeiters ist ein Fehler aufgetreten.",
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
            Fügen Sie einen neuen Mitarbeiter zum System hinzu
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="personnel_number" className="text-right">
                Personalnummer
              </Label>
              <Input
                id="personnel_number"
                placeholder="z.B. EMP003"
                className="col-span-3"
                {...register("personnel_number", { required: true })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="first_name" className="text-right">
                Vorname
              </Label>
              <Input
                id="first_name"
                className="col-span-3"
                {...register("first_name", { required: true })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_name" className="text-right">
                Nachname
              </Label>
              <Input
                id="last_name"
                className="col-span-3"
                {...register("last_name", { required: true })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                E-Mail
              </Label>
              <Input
                id="email"
                type="email"
                className="col-span-3"
                {...register("email", { required: true })}
              />
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
              {isLoading ? "Wird hinzugefügt..." : "Mitarbeiter hinzufügen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}