'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Purchase, OilProduct } from '@/lib/types';
import { storage } from '@/lib/utils/storage';

interface PurchaseFormProps {
  onPurchaseAdded: () => void;
}

export function PurchaseForm({ onPurchaseAdded }: PurchaseFormProps) {
  const [open, setOpen] = useState(false);
  const [products] = useState<OilProduct[]>(storage.getProducts());
  const [selectedProduct, setSelectedProduct] = useState<OilProduct | null>(null);
  const [quantity, setQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [supplier, setSupplier] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !quantity || !pricePerUnit || !supplier) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const quantityNum = parseFloat(quantity);
    const priceNum = parseFloat(pricePerUnit);
    const totalCost = quantityNum * priceNum;

    const newPurchase: Purchase = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity: quantityNum,
      unit: selectedProduct.unit,
      pricePerUnit: priceNum,
      totalCost,
      supplier,
      date,
      notes: notes || undefined,
    };

    const purchases = storage.getPurchases();
    storage.savePurchases([...purchases, newPurchase]);

    setOpen(false);
    resetForm();
    onPurchaseAdded();
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setQuantity('');
    setPricePerUnit('');
    setSupplier('');
    setDate(new Date());
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Compra
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Compra de Óleo</DialogTitle>
          <DialogDescription>
            Adicione uma nova compra de óleo vegetal ao sistema
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Produto *</Label>
            <Select
              value={selectedProduct?.id}
              onValueChange={(value) => {
                const product = products.find((p) => p.id === value);
                setSelectedProduct(product || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o produto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} ({product.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preço/Unidade *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="R$ 0.00"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier">Fornecedor *</Label>
            <Input
              id="supplier"
              placeholder="Nome do fornecedor"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Data da Compra *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, 'PPP', { locale: ptBR })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Informações adicionais..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {quantity && pricePerUnit && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">Total da Compra</p>
              <p className="text-2xl font-bold text-primary">
                R$ {(parseFloat(quantity) * parseFloat(pricePerUnit)).toFixed(2)}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar Compra
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
