import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash, MoreHorizontal } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Article, Stock, InventoryItem } from '@/types/inventory'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { sampleProducts } from "@/data/sampleProducts"

const initialInventory: InventoryItem[] = sampleProducts.map(product => ({
  ...product,
  type: 'hardware',
  category: 'Solarkomponenten',
  unit: 'Stück',
  weight: 0,
  size: '',
  includeInOffer: false,
  offerPriority: 50,
  vatRate: 19,
  wattage: undefined,
  stock: {
    articleId: product.id,
    quantity: 50,
    minQuantity: 10
  }
}))

const initialCategories: Category[] = [
  { id: '1', name: 'Wechselrichter' },
  { id: '2', name: 'Speicher' },
  { id: '3', name: 'Solarmodul' },
  { id: '4', name: 'Unterkonstruktion' },
  { id: '5', name: 'Sonstiges' },
]

export function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({
    name: '',
    type: 'hardware',
    category: '',
    price: 0,
    unit: '',
    weight: 0,
    size: '',
    description: '',
    datasheet: undefined,
    image: undefined,
    includeInOffer: false,
    offerPriority: 50,
    vatRate: 19,
    wattage: undefined,
    stock: {
      articleId: '',
      quantity: 0,
      minQuantity: 0
    }
  })
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [isEditItemOpen, setIsEditItemOpen] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)

  const filteredInventory = inventory.filter(item =>
    (selectedCategory === 'all' || item.category === selectedCategory) &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddItem = () => {
    const id = Math.max(...inventory.map(p => parseInt(p.id))) + 1
    const newInventoryItem: InventoryItem = {
      ...newItem,
      id: id.toString(),
      stock: {
        ...newItem.stock,
        articleId: id.toString()
      }
    }
    setInventory([...inventory, newInventoryItem])
    setNewItem({
      name: '',
      type: 'hardware',
      category: '',
      price: 0,
      unit: '',
      weight: 0,
      size: '',
      description: '',
      datasheet: undefined,
      image: undefined,
      includeInOffer: false,
      offerPriority: 50,
      vatRate: 19,
      wattage: undefined,
      stock: {
        articleId: '',
        quantity: 0,
        minQuantity: 0
      }
    })
    setIsAddItemOpen(false)
  }

  const handleEditItem = () => {
    if (editingItem) {
      setInventory(inventory.map(item => item.id === editingItem.id ? editingItem : item))
      setEditingItem(null)
      setIsEditItemOpen(false)
    }
  }

  const handleDeleteItem = (id: string) => {
    setInventory(inventory.filter(p => p.id !== id))
  }

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const id = Math.max(...categories.map(c => parseInt(c.id))) + 1
      setCategories([...categories, { id: id.toString(), name: newCategory.trim() }])
      setNewCategory('')
      setIsAddCategoryOpen(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inventar</h2>
        <div className="space-x-2">
          <Button onClick={() => setIsAddItemOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Artikel hinzufügen
          </Button>
          <Button onClick={() => setIsAddCategoryOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Kategorie hinzufügen
          </Button>
        </div>
      </div>

      <div className="flex space-x-2">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Kategorie wählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Suche Artikel..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bild</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Typ</TableHead>
            <TableHead>Kategorie</TableHead>
            <TableHead>Preis</TableHead>
            <TableHead>MwSt.</TableHead>
            <TableHead>Watt</TableHead>
            <TableHead>Bestand</TableHead>
            <TableHead>Mindestbestand</TableHead>
            <TableHead>Einheit</TableHead>
            <TableHead>Im Angebot</TableHead>
            <TableHead>Priorität</TableHead>
            <TableHead>Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInventory.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {item.image && (
                  <img src={typeof item.image === 'string' ? item.image : URL.createObjectURL(item.image)} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                )}
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.type === 'hardware' ? 'Hardware' : 'Dienstleistung'}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</TableCell>
              <TableCell>{item.vatRate}%</TableCell>
              <TableCell>{item.category === 'Solarmodul' ? `${item.wattage || '-'} W` : '-'}</TableCell>
              <TableCell>{item.stock.quantity}</TableCell>
              <TableCell>{item.stock.minQuantity}</TableCell>
              <TableCell>{item.unit}</TableCell>
              <TableCell>
                <Checkbox
                  checked={item.includeInOffer}
                  onCheckedChange={(checked) => {
                    setInventory(inventory.map(i =>
                      i.id === item.id ? { ...i, includeInOffer: checked as boolean } : i
                    ))
                  }}
                />
              </TableCell>
              <TableCell>{item.offerPriority}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Menü öffnen</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      setEditingItem(item)
                      setIsEditItemOpen(true)
                    }}>
                      <Edit className="mr-2 h-4 w-4" />
                      Bearbeiten
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteItem(item.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Löschen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
        <DialogContent className="max-w-[900px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Neuen Artikel hinzufügen</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(80vh-8rem)] pr-4">
            <div className="grid gap-6 py-4">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Grundinformationen</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="Artikelname eingeben"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Typ</Label>
                    <Select
                      value={newItem.type}
                      onValueChange={(value) => setNewItem({ ...newItem, type: value as 'hardware' | 'service' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Typ wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hardware">Hardware</SelectItem>
                        <SelectItem value="service">Dienstleistung</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Kategorie</Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Kategorie wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Einheit</Label>
                    <Input
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      placeholder="z.B. Stück, Set, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Pricing and Stock Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Preis & Bestand</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Preis (€)</Label>
                    <Input
                      type="number"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Aktueller Bestand</Label>
                    <Input
                      type="number"
                      value={newItem.stock.quantity}
                      onChange={(e) => setNewItem({ ...newItem, stock: { ...newItem.stock, quantity: parseInt(e.target.value) } })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mindestbestand</Label>
                    <Input
                      type="number"
                      value={newItem.stock.minQuantity}
                      onChange={(e) => setNewItem({ ...newItem, stock: { ...newItem.stock, minQuantity: parseInt(e.target.value) } })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>MwSt. (%)</Label>
                    <Input
                      type="number"
                      value={newItem.vatRate}
                      onChange={(e) => setNewItem({ ...newItem, vatRate: parseInt(e.target.value) })}
                      placeholder="19"
                    />
                  </div>
                </div>
              </div>

              {/* Physical Properties Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Physische Eigenschaften</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Gewicht (kg)</Label>
                    <Input
                      type="number"
                      value={newItem.weight || ''}
                      onChange={(e) => setNewItem({ ...newItem, weight: parseFloat(e.target.value) })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Abmessungen</Label>
                    <Input
                      value={newItem.size || ''}
                      onChange={(e) => setNewItem({ ...newItem, size: e.target.value })}
                      placeholder="z.B. 100x50x25 cm"
                    />
                  </div>
                </div>
              </div>

              {newItem.category === 'Solarmodul' && (
                <div className="space-y-2">
                  <Label>Leistung (Watt)</Label>
                  <Input
                    type="number"
                    value={newItem.wattage || ''}
                    onChange={(e) => setNewItem({ ...newItem, wattage: parseInt(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              )}

              {/* Media Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Medien & Dokumente</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-4 text-center space-y-2">
                      <Label htmlFor="product-image" className="block">
                        Produktbild
                      </Label>
                      {newItem.image ? (
                        <div className="relative aspect-square w-full">
                          <img
                            src={typeof newItem.image === 'string' ? newItem.image : URL.createObjectURL(newItem.image)}
                            alt="Produktvorschau"
                            className="rounded-lg object-cover w-full h-full"
                          />
                          <Button
                            variant="secondary"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setNewItem({ ...newItem, image: undefined })}
                          >
                            Entfernen
                          </Button>
                        </div>
                      ) : (
                        <div className="aspect-square flex items-center justify-center bg-muted rounded-lg">
                          <Input
                            id="product-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                setNewItem({ ...newItem, image: file })
                              }
                            }}
                          />
                          <Label
                            htmlFor="product-image"
                            className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                          >
                            Bild auswählen oder hierher ziehen
                          </Label>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-4 text-center space-y-2">
                      <Label htmlFor="datasheet" className="block">
                        Datenblatt (PDF)
                      </Label>
                      {newItem.datasheet ? (
                        <div className="relative p-4 bg-muted rounded-lg">
                          <p className="text-sm font-medium">
                            {typeof newItem.datasheet === 'string'
                              ? newItem.datasheet
                              : newItem.datasheet.name}
                          </p>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="mt-2"
                            onClick={() => setNewItem({ ...newItem, datasheet: undefined })}
                          >
                            Entfernen
                          </Button>
                        </div>
                      ) : (
                        <div className="aspect-[3/2] flex items-center justify-center bg-muted rounded-lg">
                          <Input
                            id="datasheet"
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                setNewItem({ ...newItem, datasheet: file })
                              }
                            }}
                          />
                          <Label
                            htmlFor="datasheet"
                            className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                          >
                            PDF auswählen oder hierher ziehen
                          </Label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Beschreibung</h3>
                <Textarea
                  value={newItem.description || ''}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Detaillierte Beschreibung des Artikels..."
                  className="min-h-[150px]"
                />
              </div>

              {/* Offer Settings Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Angebotseinstellungen</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-in-offer"
                    checked={newItem.includeInOffer}
                    onCheckedChange={(checked) => setNewItem({ ...newItem, includeInOffer: checked as boolean })}
                  />
                  <Label htmlFor="include-in-offer">Standardmäßig im Angebot enthalten</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="offer-priority">Priorität im Angebot (1-100)</Label>
                  <Input
                    id="offer-priority"
                    type="number"
                    min="1"
                    max="100"
                    value={newItem.offerPriority}
                    onChange={(e) => setNewItem({ ...newItem, offerPriority: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
          <div className="flex justify-end pt-4 border-t mt-4">
            <Button variant="outline" className="mr-2" onClick={() => setIsAddItemOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleAddItem}>
              Artikel hinzufügen
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditItemOpen} onOpenChange={setIsEditItemOpen}>
        <DialogContent className="max-w-[900px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Artikel bearbeiten</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(80vh-8rem)] pr-4">
            {editingItem && (
              <div className="grid gap-6 py-4">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Grundinformationen</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        placeholder="Artikelname eingeben"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Typ</Label>
                      <Select
                        value={editingItem.type}
                        onValueChange={(value) => setEditingItem({ ...editingItem, type: value as 'hardware' | 'service' })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Typ wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hardware">Hardware</SelectItem>
                          <SelectItem value="service">Dienstleistung</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Kategorie</Label>
                      <Select
                        value={editingItem.category}
                        onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Kategorie wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Einheit</Label>
                      <Input
                        value={editingItem.unit}
                        onChange={(e) => setEditingItem({ ...editingItem, unit: e.target.value })}
                        placeholder="z.B. Stück, Set, etc."
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing and Stock Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Preis & Bestand</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Preis (€)</Label>
                      <Input
                        type="number"
                        value={editingItem.price}
                        onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Aktueller Bestand</Label>
                      <Input
                        type="number"
                        value={editingItem.stock.quantity}
                        onChange={(e) => setEditingItem({ ...editingItem, stock: { ...editingItem.stock, quantity: parseInt(e.target.value) } })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mindestbestand</Label>
                      <Input
                        type="number"
                        value={editingItem.stock.minQuantity}
                        onChange={(e) => setEditingItem({ ...editingItem, stock: { ...editingItem.stock, minQuantity: parseInt(e.target.value) } })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>MwSt. (%)</Label>
                      <Input
                        type="number"
                        value={editingItem.vatRate}
                        onChange={(e) => setEditingItem({ ...editingItem, vatRate: parseInt(e.target.value) })}
                        placeholder="19"
                      />
                    </div>
                  </div>
                </div>

                {/* Physical Properties Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Physische Eigenschaften</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Gewicht (kg)</Label>
                      <Input
                        type="number"
                        value={editingItem.weight || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, weight: parseFloat(e.target.value) })}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Abmessungen</Label>
                      <Input
                        value={editingItem.size || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, size: e.target.value })}
                        placeholder="z.B. 100x50x25 cm"
                      />
                    </div>
                  </div>
                </div>

                {editingItem.category === 'Solarmodul' && (
                  <div className="space-y-2">
                    <Label>Leistung (Watt)</Label>
                    <Input
                      type="number"
                      value={editingItem.wattage || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, wattage: parseInt(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                )}

                {/* Media Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Medien & Dokumente</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="border-2 border-dashed rounded-lg p-4 text-center space-y-2">
                        <Label htmlFor="product-image" className="block">
                          Produktbild
                        </Label>
                        {editingItem.image ? (
                          <div className="relative aspect-square w-full">
                            <img
                              src={typeof editingItem.image === 'string' ? editingItem.image : URL.createObjectURL(editingItem.image)}
                              alt="Produktvorschau"
                              className="rounded-lg object-cover w-full h-full"
                            />
                            <Button
                              variant="secondary"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => setEditingItem({ ...editingItem, image: undefined })}
                            >
                              Entfernen
                            </Button>
                          </div>
                        ) : (
                          <div className="aspect-square flex items-center justify-center bg-muted rounded-lg">
                            <Input
                              id="product-image"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setEditingItem({ ...editingItem, image: file })
                                }
                              }}
                            />
                            <Label
                              htmlFor="product-image"
                              className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                            >
                              Bild auswählen oder hierher ziehen
                            </Label>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed rounded-lg p-4 text-center space-y-2">
                        <Label htmlFor="datasheet" className="block">
                          Datenblatt (PDF)
                        </Label>
                        {editingItem.datasheet ? (
                          <div className="relative p-4 bg-muted rounded-lg">
                            <p className="text-sm font-medium">
                              {typeof editingItem.datasheet === 'string'
                                ? editingItem.datasheet
                                : editingItem.datasheet.name}
                            </p>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="mt-2"
                              onClick={() => setEditingItem({ ...editingItem, datasheet: undefined })}
                            >
                              Entfernen
                            </Button>
                          </div>
                        ) : (
                          <div className="aspect-[3/2] flex items-center justify-center bg-muted rounded-lg">
                            <Input
                              id="datasheet"
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setEditingItem({ ...editingItem, datasheet: file })
                                }
                              }}
                            />
                            <Label
                              htmlFor="datasheet"
                              className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                            >
                              PDF auswählen oder hierher ziehen
                            </Label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Beschreibung</h3>
                  <Textarea
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    placeholder="Detaillierte Beschreibung des Artikels..."
                    className="min-h-[150px]"
                  />
                </div>

                {/* Offer Settings Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Angebotseinstellungen</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-in-offer"
                      checked={editingItem.includeInOffer}
                      onCheckedChange={(checked) => setEditingItem({ ...editingItem, includeInOffer: checked as boolean })}
                    />
                    <Label htmlFor="include-in-offer">Standardmäßig im Angebot enthalten</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="offer-priority">Priorität im Angebot (1-100)</Label>
                    <Input
                      id="offer-priority"
                      type="number"
                      min="1"
                      max="100"
                      value={editingItem.offerPriority}
                      onChange={(e) => setEditingItem({ ...editingItem, offerPriority: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
          <div className="flex justify-end pt-4 border-t mt-4">
            <Button variant="outline" className="mr-2" onClick={() => setIsEditItemOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleEditItem}>
              Änderungen speichern
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neue Kategorie hinzufügen</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-category" className="text-right">
                Kategoriename
              </Label>
              <Input
                id="new-category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleAddCategory}>Kategorie hinzufügen</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

