import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

interface OfferTemplateProps {
  offerData: {
    id: string
    date: string
    validUntil: string
    customer: {
      name: string
      company?: string
      street: string
      postalCode: string
      city: string
      email: string
    }
    items: Array<{
      position: number
      description: string
      detailedDescription: string
      quantity: number
      unit: string
      unitPrice: number
      total: number
      image?: string
      vatRate: number
      wattage?: number
      category?: string
    }>
    total: number
    notes?: string
  }
}

// Company data would typically come from your system configuration
const companyData = {
  name: "Solar Solutions GmbH",
  street: "Sonnenallee 123",
  postalCode: "12345",
  city: "Solarstadt",
  phone: "+49 123 456789",
  email: "info@solar-solutions.de",
  website: "www.solar-solutions.de",
  taxId: "DE123456789",
  bankName: "Sparkasse Solarstadt",
  iban: "DE89 3704 0044 0532 0130 00",
  bic: "SOLADEXXXX"
}

export function DetailedOfferTemplate({ offerData }: OfferTemplateProps) {
  // Calculate total system wattage for solar modules
  const totalSystemWattage = offerData.items
    .filter(item => item.category === 'Solarmodule' && item.wattage)
    .reduce((total, item) => total + (item.wattage || 0) * item.quantity, 0);

  // Calculate subtotal and VAT
  const subtotal = offerData.items.reduce((sum, item) => sum + item.total, 0);
  const vatAmounts = offerData.items.reduce((acc, item) => {
    const vatRate = item.vatRate;
    if (!acc[vatRate]) acc[vatRate] = 0;
    acc[vatRate] += (item.total * vatRate) / 100;
    return acc;
  }, {} as Record<number, number>);

  const total = subtotal + Object.values(vatAmounts).reduce((sum, amount) => sum + amount, 0);

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white">
      <CardContent className="p-8">
        {/* Header with company logo and information */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary">{companyData.name}</h1>
            <p className="text-sm text-muted-foreground">{companyData.street}</p>
            <p className="text-sm text-muted-foreground">{companyData.postalCode} {companyData.city}</p>
          </div>
          <div className="text-right">
            <p className="text-sm">Tel: {companyData.phone}</p>
            <p className="text-sm">Email: {companyData.email}</p>
            <p className="text-sm">Web: {companyData.website}</p>
          </div>
        </div>

        {/* Customer Address */}
        <div className="mb-8">
          <div className="border-l-4 border-primary pl-4">
            <p className="font-bold">{offerData.customer.name}</p>
            {offerData.customer.company && (
              <p>{offerData.customer.company}</p>
            )}
            <p>{offerData.customer.street}</p>
            <p>{offerData.customer.postalCode} {offerData.customer.city}</p>
          </div>
        </div>

        {/* Offer Details */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Angebot {offerData.id}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Datum: {offerData.date}</p>
              <p className="text-sm text-muted-foreground">Gültig bis: {offerData.validUntil}</p>
            </div>
          </div>
        </div>

        {/* Introduction Text */}
        <div className="mb-8">
          <p className="mb-4">
            Sehr geehrte(r) {offerData.customer.name},
          </p>
          <p className="mb-4">
            vielen Dank für Ihr Interesse an unseren Produkten. Gerne unterbreiten wir Ihnen folgendes Angebot:
          </p>
          {totalSystemWattage > 0 && (
            <p className="mb-4 font-medium">
              Die Gesamtleistung der Anlage beträgt {(totalSystemWattage / 1000).toLocaleString('de-DE', { maximumFractionDigits: 2 })} kWp
            </p>
          )}
        </div>

        {/* Items Table */}
        <Table className="mb-8">
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Bild</TableHead>
              <TableHead>Produkt</TableHead>
              <TableHead className="text-right">Menge</TableHead>
              <TableHead className="text-right">Einheit</TableHead>
              <TableHead className="text-right">Einzelpreis</TableHead>
              <TableHead className="text-right">MwSt.</TableHead>
              <TableHead className="text-right">Gesamt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offerData.items.map((item) => (
              <TableRow key={item.position}>
                <TableCell className="align-top">
                  <img
                    src={item.image}
                    alt={item.description}
                    className="w-24 h-24 object-cover rounded-md"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg?height=96&width=96';
                    }}
                  />
                </TableCell>
                <TableCell className="align-top">
                  <div className="font-medium">{item.description}</div>
                  {item.detailedDescription && (
                    <div className="text-sm text-muted-foreground mt-1">{item.detailedDescription}</div>
                  )}
                </TableCell>
                <TableCell className="text-right align-top">{item.quantity}</TableCell>
                <TableCell className="text-right align-top">{item.unit}</TableCell>
                <TableCell className="text-right align-top">
                  {item.unitPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                </TableCell>
                <TableCell className="text-right">{item.vatRate}%</TableCell>
                <TableCell className="text-right align-top">
                  {item.total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>


        {/* Total Amount */}
        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span>Nettobetrag:</span>
              <span>{subtotal.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
            </div>
            {Object.entries(vatAmounts).map(([rate, amount]) => (
              <div key={rate} className="flex justify-between text-sm">
                <span>zzgl. {rate}% MwSt.:</span>
                <span>{amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Gesamtbetrag:</span>
              <span>{total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {offerData.notes && (
          <div className="mb-8">
            <p className="text-sm">{offerData.notes}</p>
          </div>
        )}

        {/* Footer Text */}
        <div className="mb-8">
          <p className="mb-4">
            Wir würden uns freuen, wenn unser Angebot Ihr Interesse findet. Bei Fragen stehen wir Ihnen gerne zur Verfügung.
          </p>
          <p>
            Mit freundlichen Grüßen,<br />
            Ihr {companyData.name}-Team
          </p>
        </div>

        <Separator className="my-8" />

        {/* Company Footer */}
        <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
          <div>
            <p>{companyData.name}</p>
            <p>{companyData.street}</p>
            <p>{companyData.postalCode} {companyData.city}</p>
          </div>
          <div>
            <p>Tel: {companyData.phone}</p>
            <p>Email: {companyData.email}</p>
            <p>Web: {companyData.website}</p>
          </div>
          <div>
            <p>USt-IdNr.: {companyData.taxId}</p>
            <p>{companyData.bankName}</p>
            <p>IBAN: {companyData.iban}</p>
            <p>BIC: {companyData.bic}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

