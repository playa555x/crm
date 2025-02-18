import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DetailedOfferTemplate } from "../templates/detailed-offer-template"
import { sampleProducts } from "@/data/sampleProducts"

interface OfferPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  offer?: any // We would typically define a proper type here
}

export function OfferPreviewDialog({
  open,
  onOpenChange,
  offer
}: OfferPreviewDialogProps) {
  if (!offer) {
    return null;
  }

  // Transform the offer data to match the template format
  const transformedOfferData = {
    id: offer.id,
    date: offer.date,
    validUntil: new Date(new Date(offer.date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days validity
    customer: {
      name: offer.customerName,
      company: offer.customerCompany || '',
      street: offer.customerStreet || "Musterstraße 1", // Fallback values for demo
      postalCode: offer.customerPostalCode || "12345",
      city: offer.customerCity || "Musterstadt",
      email: offer.customerEmail || "kunde@example.com"
    },
    items: (offer.items || []).map((item: any, index: number) => {
      const productDetails = sampleProducts.find(p => p.id === item.inventoryItemId) || {};
      return {
        position: index + 1,
        description: item?.description || productDetails.name || '',
        detailedDescription: productDetails.description || '',
        quantity: item?.quantity || 0,
        unit: item?.unit || "Stück",
        unitPrice: item?.unitPrice || productDetails.price || 0,
        total: item?.total || 0,
        image: productDetails.image || '/placeholder.svg?height=64&width=64',
        vatRate: productDetails.vatRate || 19,
        wattage: productDetails.wattage,
        category: productDetails.category
      };
    }),
    total: offer.total || 0,
    notes: offer.notes || ''
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Angebotsvorschau - {offer.id}</DialogTitle>
        </DialogHeader>
        <DetailedOfferTemplate offerData={transformedOfferData} />
      </DialogContent>
    </Dialog>
  )
}

