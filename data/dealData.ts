import { PipelineCategory, Deal } from '@/types/deal'
import { customers } from './customerData'

// Helper function to generate a random date within the last 30 days
const randomRecentDate = () => {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * 30))
  return date.toISOString().split('T')[0]
}

// Helper function to generate a random deal
const generateRandomDeal = (id: number): Deal => {
  const customer = customers[Math.floor(Math.random() * customers.length)]
  return {
    id: `deal${id}`,
    name: `Projekt für ${customer.company}`,
    value: Math.floor(Math.random() * 50000) + 5000,
    contactId: customer.id.toString(),
    description: `Solaranlage für ${customer.company}`,
    status: ['Lead', 'Qualifiziert', 'Angebot', 'Verhandlung', 'Abgeschlossen'][Math.floor(Math.random() * 5)],
    paymentStatus: {
      invoiced: 0,
      paid: 0
    },
    lastPaymentDate: randomRecentDate()
  }
}

// Generate 10 random deals
const randomDeals: Deal[] = Array.from({ length: 10 }, (_, i) => generateRandomDeal(i + 1))

// Distribute deals randomly across stages
const distributeDealsToPipelines = (deals: Deal[], pipelineCategories: PipelineCategory[]): PipelineCategory[] => {
  const updatedCategories = JSON.parse(JSON.stringify(pipelineCategories)) as PipelineCategory[]

  deals.forEach(deal => {
    const randomCategoryIndex = Math.floor(Math.random() * updatedCategories.length)
    const randomPipelineIndex = Math.floor(Math.random() * updatedCategories[randomCategoryIndex].pipelines.length)
    const randomStageIndex = Math.floor(Math.random() * updatedCategories[randomCategoryIndex].pipelines[randomPipelineIndex].stages.length)
    
    updatedCategories[randomCategoryIndex].pipelines[randomPipelineIndex].stages[randomStageIndex].deals.push(deal)
  })

  return updatedCategories
}

// Export the function to get pipeline categories with distributed deals
export const getPipelineCategoriesWithDeals = (initialCategories: PipelineCategory[]): PipelineCategory[] => {
  return distributeDealsToPipelines(randomDeals, initialCategories)
}

// Define the invoice steps
export const invoiceSteps = [
  { percentage: 10, description: 'Nach Netzanfrage' },
  { percentage: 50, description: 'Nach Netzbestätigung' },
  { percentage: 90, description: 'Nach Warenversand' },
  { percentage: 100, description: 'Nach Montage abgeschlossen und Doku-Versand' }
]

// Helper function to update deal status based on stage
export const updateDealStatus = (deal: Deal, stageName: string): Deal => {
  const updatedDeal = { ...deal }

  switch (stageName) {
    case 'Netzanfrage':
      updatedDeal.paymentStatus.invoiced = deal.value * 0.1
      break
    case 'Netzbestätigung':
      updatedDeal.paymentStatus.invoiced = deal.value * 0.5
      break
    case 'Warenversand':
      updatedDeal.paymentStatus.invoiced = deal.value * 0.9
      break
    case 'Montage abgeschlossen':
      updatedDeal.paymentStatus.invoiced = deal.value
      break
  }

  return updatedDeal
}

