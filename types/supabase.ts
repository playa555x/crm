export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      employees: {
        Row: {
          id: number
          personnelNumber: string
          firstName: string
          lastName: string
          email: string
          phone: string
          position: string
          department: string
          created_at: string
        }
        Insert: {
          personnelNumber: string
          firstName: string
          lastName: string
          email: string
          phone: string
          position: string
          department: string
        }
        Update: {
          personnelNumber?: string
          firstName?: string
          lastName?: string
          email?: string
          phone?: string
          position?: string
          department?: string
        }
      }
      contacts: {
        Row: {
          id: string
          firstName: string
          lastName: string
          email: string
          phone: string
          mobile: string
          company: string
          position: string
          street: string
          houseNumber: string
          postcode: string
          city: string
          website: string
          notes: string
          responsibleEmployee: string
          category: "customer" | "employee" | "technician"
          projectDescription?: string
          companyContactPerson: Json
          preferredContactMethod: "email" | "phone" | "mobile"
          preferredContactPerson: "main" | "companyContact"
          lastContact?: string
          nextFollowUp?: string
          customerNumber: string
          created_at: string
        }
        Insert: {
          firstName: string
          lastName: string
          email: string
          phone: string
          mobile: string
          company: string
          position: string
          street: string
          houseNumber: string
          postcode: string
          city: string
          website: string
          notes: string
          responsibleEmployee: string
          category: "customer" | "employee" | "technician"
          projectDescription?: string
          companyContactPerson: Json
          preferredContactMethod: "email" | "phone" | "mobile"
          preferredContactPerson: "main" | "companyContact"
          lastContact?: string
          nextFollowUp?: string
          customerNumber: string
        }
        Update: {
          firstName?: string
          lastName?: string
          email?: string
          phone?: string
          mobile?: string
          company?: string
          position?: string
          street?: string
          houseNumber?: string
          postcode?: string
          city?: string
          website?: string
          notes?: string
          responsibleEmployee?: string
          category?: "customer" | "employee" | "technician"
          projectDescription?: string
          companyContactPerson?: Json
          preferredContactMethod?: "email" | "phone" | "mobile"
          preferredContactPerson?: "main" | "companyContact"
          lastContact?: string
          nextFollowUp?: string
          customerNumber?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}