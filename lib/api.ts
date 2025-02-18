import { InventoryItem } from '@/types/inventory'
import { sampleProducts } from '@/data/sampleProducts'

export async function fetchInventoryItems(): Promise<InventoryItem[]> {
  // In a real application, this would be an API call
  // For now, we'll return the sample products
  return sampleProducts.map(product => ({
    ...product,
    type: 'hardware',
    quantity: 50,
    unit: 'Stück',
    minQuantity: 10,
    weight: 0,
    size: '',
  }));
}

