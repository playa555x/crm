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

type EmployeeFormData = Database['public']['Tables']['employees']['Insert']

export function AddEmployeeDialog({ open, onOpenChange }: AddEmployeeDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<EmployeeFormData>()

  const onSubmit = async (data: EmployeeFormData) => {
    setIsLoading(true)
    try {
      await addEmployee(data)
      toast({
        title: "Mitarbeiter hinzugefügt",
        description: "Der neue Mitarbeiter wurde erfolgreich hinzugefügt.",
      })
      reset()
      onOpenChange(false)
    } catch (error) {
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
              <Label htmlFor="personnelNumber" className="text-right">
                Personalnummer
              </Label>
              <Input
                id="personnelNumber"
                placeholder="z.B. EMP003"
                className="col-span-3"
                {...register("personnelNumber", { required: true })}
              />
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