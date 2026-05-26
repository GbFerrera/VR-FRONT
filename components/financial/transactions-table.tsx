'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { Purchase, Sale, Expense } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils/calculations';
import { storage } from '@/lib/utils/storage';

type Transaction = (Purchase | Sale | Expense) & { type: 'compra' | 'venda' | 'despesa' };

interface TransactionsTableProps {
  purchases: Purchase[];
  sales: Sale[];
  expenses: Expense[];
  onUpdate: () => void;
}

export function TransactionsTable({ purchases, sales, expenses, onUpdate }: TransactionsTableProps) {
  const transactions: Transaction[] = [
    ...purchases.map((p) => ({ ...p, type: 'compra' as const })),
    ...sales.map((s) => ({ ...s, type: 'venda' as const })),
    ...expenses.map((e) => ({ ...e, type: 'despesa' as const })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const handleDelete = (transaction: Transaction) => {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) return;

    if (transaction.type === 'compra') {
      const filtered = purchases.filter((p) => p.id !== transaction.id);
      storage.savePurchases(filtered);
    } else if (transaction.type === 'venda') {
      const filtered = sales.filter((s) => s.id !== transaction.id);
      storage.saveSales(filtered);
    } else {
      const filtered = expenses.filter((e) => e.id !== transaction.id);
      storage.saveExpenses(filtered);
    }

    onUpdate();
  };

  const getTransactionDetails = (transaction: Transaction) => {
    if (transaction.type === 'compra') {
      const purchase = transaction as Purchase;
      return {
        description: `${purchase.productName} - ${purchase.supplier}`,
        amount: -purchase.totalCost,
        badge: 'Compra',
        badgeVariant: 'default' as const,
      };
    } else if (transaction.type === 'venda') {
      const sale = transaction as Sale;
      return {
        description: `${sale.productName}${sale.customer ? ` - ${sale.customer}` : ''}`,
        amount: sale.totalRevenue,
        badge: 'Venda',
        badgeVariant: 'default' as const,
      };
    } else {
      const expense = transaction as Expense;
      return {
        description: expense.description,
        amount: -expense.amount,
        badge: expense.category,
        badgeVariant: 'secondary' as const,
      };
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Nenhuma transação registrada ainda.</p>
        <p className="text-sm mt-2">Comece adicionando compras, vendas ou despesas.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const details = getTransactionDetails(transaction);
            return (
              <TableRow key={`${transaction.type}-${transaction.id}`}>
                <TableCell className="font-medium">
                  {formatDate(transaction.date)}
                </TableCell>
                <TableCell>
                  <Badge variant={details.badgeVariant}>
                    {details.badge}
                  </Badge>
                </TableCell>
                <TableCell>{details.description}</TableCell>
                <TableCell className={`text-right font-semibold ${
                  details.amount >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(details.amount)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleDelete(transaction)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
