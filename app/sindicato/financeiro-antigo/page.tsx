'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Wallet,
  Calendar as CalendarIcon,
  BarChart3,
  Menu,
  X,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { StatsCard } from '@/components/financial/stats-card';
import { PurchaseForm } from '@/components/financial/purchase-form';
import { SaleForm } from '@/components/financial/sale-form';
import { ExpenseForm } from '@/components/financial/expense-form';
import { TransactionsTable } from '@/components/financial/transactions-table';
import { DateRangePicker } from '@/components/financial/date-range-picker';
import { storage } from '@/lib/utils/storage';
import { calculateFinancialSummary, formatCurrency } from '@/lib/utils/calculations';
import { Purchase, Sale, Expense } from '@/lib/types';
import { DateRange } from 'react-day-picker';

export default function FinanceiroAntigo() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPurchases(storage.getPurchases());
    setSales(storage.getSales());
    setExpenses(storage.getExpenses());
  };

  const summary = calculateFinancialSummary(
    purchases,
    sales,
    expenses,
    dateRange?.from && dateRange?.to
      ? { from: dateRange.from, to: dateRange.to }
      : undefined
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  L&A Vegetal
                </h1>
                <p className="text-xs text-muted-foreground">Gestão Financeira</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <PurchaseForm onPurchaseAdded={loadData} />
              <SaleForm onSaleAdded={loadData} />
              <ExpenseForm onExpenseAdded={loadData} />
            </div>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  <PurchaseForm onPurchaseAdded={loadData} />
                  <SaleForm onSaleAdded={loadData} />
                  <ExpenseForm onExpenseAdded={loadData} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatsCard
            title="Receita Total"
            value={formatCurrency(summary.totalSales)}
            icon={TrendingUp}
            colorClass="text-green-600"
            description="Vendas realizadas"
          />
          <StatsCard
            title="Compras"
            value={formatCurrency(summary.totalPurchases)}
            icon={ShoppingCart}
            colorClass="text-blue-600"
            description="Investimento em estoque"
          />
          <StatsCard
            title="Despesas"
            value={formatCurrency(summary.totalExpenses)}
            icon={TrendingDown}
            colorClass="text-red-600"
            description="Custos operacionais"
          />
          <StatsCard
            title="Lucro Líquido"
            value={formatCurrency(summary.profit)}
            icon={DollarSign}
            colorClass={summary.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}
            description={`Margem: ${summary.profitMargin.toFixed(1)}%`}
          />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Resumo Financeiro
                </CardTitle>
                <CardDescription>
                  Visão geral das suas transações
                </CardDescription>
              </div>
              <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-800">Total de Vendas</p>
                <p className="text-2xl font-bold text-green-600">{sales.length}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800">Total de Compras</p>
                <p className="text-2xl font-bold text-blue-600">{purchases.length}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm font-medium text-red-800">Total de Despesas</p>
                <p className="text-2xl font-bold text-red-600">{expenses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Transações</CardTitle>
            <CardDescription>
              Todas as suas compras, vendas e despesas em um só lugar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionsTable
              purchases={purchases}
              sales={sales}
              expenses={expenses}
              onUpdate={loadData}
            />
          </CardContent>
        </Card>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p> 2026 L&A Vegetal - Sistema de Gestão Financeira</p>
        </div>
      </footer>
    </div>
  );
}
