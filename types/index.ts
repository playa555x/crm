export interface Contact {
  id: number
  id: string
  name: string
  email: string
  phone: string
  company: string
  position: string
  street: string
  houseNumber: string
  postcode: string
  city: string
  website: string
  notes: string
  responsibleEmployee: string
  deals?: Deal[]
  lastContact?: string
  nextFollowUp?: string
}

export interface Deal {
  id: string
  name: string
  value: string
  status: string
  contactId: number
}

export interface Project {
  id: string
  name: string
  customer: Contact
  status: string
  roofPlan: RoofPlan
  economicCalculation: EconomicCalculation
  offer: Offer
  protocol: Protocol
  tasks: Task[]
}

export interface RoofPlan {
  id: string
  address: string
  area: number
  angle: number
  orientation: string
  image: string
}

export interface EconomicCalculation {
  id: string
  investmentCost: number
  annualProduction: number
  annualSavings: number
  paybackPeriod: number
  roi: number
}

export interface Offer {
  id: string
  createdAt: string
  totalPrice: number
  items: OfferItem[]
  status: 'draft' | 'sent' | 'accepted' | 'rejected'
  signature?: string
}

export interface OfferItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
}

export interface Protocol {
  id: string
  createdAt: string
  updatedAt: string
  content: string
  responsiblePerson: string
}

export interface Task {
  id: string
  title: string
  description: string
  assignedTo: string
  dueDate: string
  status: 'todo' | 'in_progress' | 'done'
}

export interface Inventory {
  id: string
  name: string
  quantity: number
  unit: string
  minQuantity: number
}

export interface TrainingModule {
  id: string
  title: string
  content: string
  type: 'customer' | 'sales' | 'installer'
}

export interface GridOperator {
  id: string
  name: string
  postcode: string
  contactPerson: string
  email: string
  phone: string
}

