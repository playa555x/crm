import { InventoryItem } from '@/types/inventory'

export const inventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Solar Panel 300W',
    type: 'hardware',
    price: 199.99,
    quantity: 50,
    unit: 'piece',
    minQuantity: 10
  },
  {
    id: '2',
    name: 'Inverter 5kW',
    type: 'hardware',
    price: 999.99,
    quantity: 30,
    unit: 'piece',
    minQuantity: 5
  },
  {
    id: '3',
    name: 'Battery 10kWh',
    type: 'hardware',
    price: 4999.99,
    quantity: 20,
    unit: 'piece',
    minQuantity: 3
  },
  {
    id: '4',
    name: 'Mounting Kit',
    type: 'hardware',
    price: 149.99,
    quantity: 100,
    unit: 'set',
    minQuantity: 20
  },
  {
    id: '5',
    name: 'Installation Service',
    type: 'service',
    price: 500,
    quantity: 999999,
    unit: 'hour',
    minQuantity: 0
  },
  {
    id: '6',
    name: 'Maintenance Service',
    type: 'service',
    price: 100,
    quantity: 999999,
    unit: 'hour',
    minQuantity: 0
  },
]

