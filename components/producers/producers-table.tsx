'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronRight, Filter, TrendingUp, TrendingDown, Minus, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User } from '@/lib/api';

interface ProducersTableProps {
  producers: User[];
  onEdit?: (producer: User) => void;
  onDelete?: (id: string) => void;
  onRowClick?: (producer: User) => void;
}

export function ProducersTable({ producers, onEdit, onDelete, onRowClick }: ProducersTableProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      ativo: 'bg-green-100 text-green-700 hover:bg-green-200',
      inativo: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      pendente: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
    };
    
    const labels = {
      ativo: 'Ativo',
      inativo: 'Inativo',
      pendente: 'Pendente',
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getProductionBadge = (production: string) => {
    const config = {
      alta: { icon: TrendingUp, text: 'Alta', className: 'text-green-600' },
      media: { icon: Minus, text: 'Média', className: 'text-orange-600' },
      baixa: { icon: TrendingDown, text: 'Baixa', className: 'text-red-600' },
    };

    const { icon: Icon, text, className } = config[production as keyof typeof config];

    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{text}</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Todos os Produtores</CardTitle>
          <div className="flex items-center gap-2">
            <Select defaultValue="todos">
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Status: Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="todas">
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Produção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Produção: Todas</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produtor</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead className="text-center">Produtos</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Produção</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {producers.map((producer) => (
              <TableRow 
                key={producer.id} 
                className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(producer)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-green-100 text-green-700">
                        {producer.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800">{producer.name}</p>
                      <p className="text-sm text-gray-500">{producer.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span>📞</span> {producer.phone}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span>✉️</span> {producer.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      {new Date(producer.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-xs text-gray-500">cadastrado</p>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge className="bg-green-100 text-green-700">Ativo</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-gray-500">-</span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    {onEdit && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(producer);
                        }}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(producer.id);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">
            Mostrando {producers.length} produtor{producers.length !== 1 ? 'es' : ''}
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
            <Button variant="ghost" size="sm">4</Button>
            <Button variant="ghost" size="sm">5</Button>
            <span className="px-2">...</span>
            <Button variant="ghost" size="sm">22</Button>
            <Button variant="ghost" size="sm">
              &gt;
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
