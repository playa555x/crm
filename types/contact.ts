export interface Contact {
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
  companyContactPerson: {
    firstName: string
    lastName: string
    email: string
    phone: string
    mobile: string
  }
  preferredContactMethod: "email" | "phone" | "mobile"
  preferredContactPerson: "main" | "companyContact"
  lastContact?: string
  nextFollowUp?: string
  invoices: Invoice[]
  customerNumber: string
}

export interface Invoice {
  id: string
  number: string
  date: string
  dueDate: string
  items: InvoiceItem[]
  totalAmount: number
  status: "draft" | "sent" | "paid" | "overdue"
}

export interface InvoiceItem {
  id: string
  name: string
  quantity: number
  price: number
}

export interface Company {
  id: string
  name: string
  industry: string
  employees: number
  revenue: string
  description: string
}

export interface Deal {
  id: string
  name: string
  value: number
  status: string
}

export interface MediaItem {
  id: string
  name: string
  type: string
  url: string
  folderId: string
}

export interface Note {
  id: string
  content: string
  isPublic: boolean
  createdAt: string
}

