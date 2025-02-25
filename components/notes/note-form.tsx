"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import type { Note } from "@/types/note"

const formSchema = z.object({
  title: z.string().min(1, "Titel ist erforderlich"),
  content: z.string().optional(),
  contactId: z.string().optional(),
})

interface NoteFormProps {
  note?: Note
  contactId?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NoteForm({ note, contactId, open, onOpenChange }: NoteFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: note?.title || "",
      content: note?.content || "",
      contactId: contactId || note?.contactId || undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const response = await fetch(
        note ? `/api/notes/${note.id}` : "/api/notes",
        {
          method: note ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      )

      if (!response.ok) {
        throw new Error("Fehler beim Speichern der Notiz")
      }

      router.refresh()
      onOpenChange(false)
      toast({
        title: note ? "Notiz aktualisiert" : "Notiz erstellt",
        description: note
          ? "Die Notiz wurde erfolgreich aktualisiert."
          : "Die Notiz wurde erfolgreich erstellt.",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Beim Speichern der Notiz ist ein Fehler aufgetreten.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{note ? "Notiz bearbeiten" : "Neue Notiz"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titel</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inhalt</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Speichern..." : "Speichern"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}