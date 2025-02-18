export interface Article {
  id: string;
  name: string;
  type: 'hardware' | 'service';
  category: string;
  price: number;
  unit: string;
  weight?: number;
  size?: string;
  description?: string;
  datasheet?: File | string;
  image?: string;
  includeInOffer: boolean;
  offerPriority: number;
  vatRate: number;
  wattage?: number;
}

export interface Stock {
  articleId: string;
  quantity: number;
  minQuantity: number;
}

export type InventoryItem = Article & { stock: Stock };

