'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, ChevronRight, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ProductWithStock {
  id: string;
  name: string;
  unit: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface StockTableProps {
  products: ProductWithStock[];
  onEdit?: (product: any) => void;
  onDelete?: (id: string) => void;
}

export function StockTable({ products, onEdit, onDelete }: StockTableProps) {
  const getStatusBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge className="bg-red-100 text-red-700">Sem Estoque</Badge>;
    } else if (stock < 100) {
      return <Badge className="bg-orange-100 text-orange-700">Baixo</Badge>;
    } else if (stock < 500) {
      return <Badge className="bg-yellow-100 text-yellow-700">Médio</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-700">Normal</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Estoque por Produto</CardTitle>
          <div className="flex items-center gap-2">
            <Select defaultValue="todos-produtores">
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Produtores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos-produtores">Todos os Produtores</SelectItem>
                <SelectItem value="joao">João Silva</SelectItem>
                <SelectItem value="maria">Maria Oliveira</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="todos-produtos">
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Produtos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos-produtos">Todos os Produtos</SelectItem>
                <SelectItem value="abobora">Abóbora</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead className="text-center">Estoque Disponível</TableHead>
              <TableHead className="text-center">Cadastrado em</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.unit}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div>
                      <p className="text-lg font-bold text-gray-800">
                        {product.stock.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-xs text-gray-500">{product.unit}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <p className="text-sm text-gray-600">
                      {new Date(product.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(product.stock)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      {onEdit && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onEdit(product)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onDelete(product.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">
            Mostrando {products.length} produto{products.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" disabled>
              &lt;
            </Button>
            <Button variant="default" size="sm" className="bg-green-700 hover:bg-green-800">
              1
            </Button>
            <Button variant="ghost" size="sm">2</Button>
            <Button variant="ghost" size="sm">3</Button>
            <span className="px-2">...</span>
            <Button variant="ghost" size="sm">6</Button>
            <Button variant="ghost" size="sm">
              &gt;
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
