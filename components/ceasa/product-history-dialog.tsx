'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  Download,
  FileText,
  BarChart3,
  Activity
} from 'lucide-react';
import { ceasaService, CeasaProduct } from '@/lib/api';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Image from 'next/image';

interface ProductHistoryDialogProps {
  product: CeasaProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface HistoryData {
  date: string;
  commonPrice: number;
  maxPrice: number;
  minPrice: number;
  pricePerKg: number;
  name: string;
  unit: string;
}

export function ProductHistoryDialog({ product, open, onOpenChange }: ProductHistoryDialogProps) {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryData[]>([]);

  useEffect(() => {
    if (open && product) {
      loadHistory();
    }
  }, [open, product]);

  const loadHistory = async () => {
    if (!product) return;

    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const data = await ceasaService.getPriceHistory(
        product.code,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );

      setHistory(data as any);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  };

  const calculatePriceChange = () => {
    if (history.length < 2) return { value: 0, percentage: 0 };
    
    const latest = history[history.length - 1];
    const previous = history[history.length - 2];
    const change = latest.pricePerKg - previous.pricePerKg;
    const percentage = (change / previous.pricePerKg) * 100;
    
    return { value: change, percentage };
  };

  const priceChange = calculatePriceChange();

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] h-[90vh] overflow-hidden p-0 gap-0 bg-white">
        <DialogHeader className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-500 to-green-600"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMjBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          
          <div className="relative px-8 pt-8 pb-6">
            <div className="flex items-start gap-6">
              {product.imageUrl ? (
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-white shadow-2xl border-4 border-white/50 flex-shrink-0 ring-4 ring-white/30">
                  <Image
                    src={`http://localhost:3333${product.imageUrl}`}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-2xl border-4 border-white/50 ring-4 ring-white/30">
                  <BarChart3 className="w-14 h-14 text-white drop-shadow-lg" />
                </div>
              )}
              
              <div className="flex-1 pt-2">
                <DialogTitle className="text-3xl font-bold text-white drop-shadow-lg mb-3">
                  {product.name}
                </DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 shadow-lg">
                    <span className="font-semibold">{product.category}</span>
                  </Badge>
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 shadow-lg">
                    Código: {product.code}
                  </Badge>
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 shadow-lg">
                    {product.unit}
                  </Badge>
                  <Badge className="bg-white text-green-700 border-white/50 hover:bg-white/90 shadow-lg font-bold text-base px-3 py-1">
                    {formatPrice(product.pricePerKg)}/kg
                  </Badge>
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(95vh-200px)] px-8 py-6 bg-white">

        <Tabs defaultValue="chart" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chart" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Gráfico
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Estatísticas
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Detalhes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="mt-6">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-[400px] w-full" />
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                </div>
              </div>
            ) : history.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-center">
                    Nenhum histórico disponível para este produto
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="mb-6 border-2 border-green-100 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-100">
                    <CardTitle className="text-lg font-bold text-green-800 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-600" />
                      Evolução de Preços (Últimos 30 dias)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={450}>
                      <AreaChart data={history}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={formatDate}
                          stroke="#6b7280"
                          style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                          tickFormatter={(value: number) => `R$ ${value.toFixed(2)}`}
                          stroke="#6b7280"
                          style={{ fontSize: '12px' }}
                        />
                        <Tooltip 
                          formatter={(value: number) => formatPrice(value)}
                          labelFormatter={(label: string) => new Date(label).toLocaleDateString('pt-BR')}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="maxPrice" 
                          stroke="#dc2626" 
                          fill="url(#colorMax)"
                          strokeWidth={2}
                          name="Preço Máximo"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="pricePerKg" 
                          stroke="#16a34a" 
                          fill="url(#colorPrice)"
                          strokeWidth={3}
                          name="Preço/Kg"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="minPrice" 
                          stroke="#2563eb" 
                          fill="url(#colorMin)"
                          strokeWidth={2}
                          name="Preço Mínimo"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-green-600 to-green-700 border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                          <DollarSign className="w-8 h-8 text-white drop-shadow-lg" />
                        </div>
                        <div className="w-full">
                          <p className="text-sm text-white/90 font-semibold mb-2">Preço Atual</p>
                          <p className="text-3xl font-bold text-white drop-shadow-lg break-words">
                            {formatPrice(product.pricePerKg)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`bg-gradient-to-br ${priceChange.value >= 0 ? 'from-orange-500 to-red-500' : 'from-green-500 to-green-600'} border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                          {priceChange.value >= 0 ? (
                            <TrendingUp className="w-8 h-8 text-white drop-shadow-lg" />
                          ) : (
                            <TrendingDown className="w-8 h-8 text-white drop-shadow-lg" />
                          )}
                        </div>
                        <div className="w-full">
                          <p className="text-sm text-white/90 font-semibold mb-2">
                            Variação
                          </p>
                          <p className="text-3xl font-bold text-white drop-shadow-lg">
                            {priceChange.percentage >= 0 ? '+' : ''}{priceChange.percentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                          <Calendar className="w-8 h-8 text-white drop-shadow-lg" />
                        </div>
                        <div className="w-full">
                          <p className="text-sm text-white/90 font-semibold mb-2">Registros</p>
                          <p className="text-3xl font-bold text-white drop-shadow-lg">
                            {history.length} dias
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <div className="grid grid-cols-2 gap-6">
              <Card className="border-2 border-green-100 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-100">
                  <CardTitle className="text-lg font-bold text-green-800 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Informações de Preço
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-6">
                  <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                    <span className="text-gray-700 font-medium">Preço Comum</span>
                    <span className="font-bold text-green-700 text-lg">{formatPrice(product.commonPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                    <span className="text-gray-700 font-medium">Preço Máximo</span>
                    <span className="font-bold text-red-600 text-lg">{formatPrice(product.maxPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                    <span className="text-gray-700 font-medium">Preço Mínimo</span>
                    <span className="font-bold text-blue-600 text-lg">{formatPrice(product.minPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-200">
                    <span className="text-gray-800 font-bold">Preço por Kg</span>
                    <span className="font-bold text-xl text-green-700">{formatPrice(product.pricePerKg)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-100 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-100">
                  <CardTitle className="text-lg font-bold text-green-800 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Informações do Produto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-6">
                  <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span className="text-gray-700 font-medium">Embalagem</span>
                    <Badge variant="secondary" className="text-base px-3 py-1">{product.unit}</Badge>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span className="text-gray-700 font-medium">Qtd/Embalagem</span>
                    <span className="font-bold text-gray-800">{product.quantityPerPackage}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span className="text-gray-700 font-medium">Classificação</span>
                    <Badge className="text-base px-3 py-1">{product.classification}</Badge>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-200">
                    <span className="text-gray-800 font-bold">Data</span>
                    <span className="font-bold text-green-700">
                      {new Date(product.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {history.length > 0 && (
              <Card className="mt-6 border-2 border-gray-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b-2 border-gray-200">
                  <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Histórico Detalhado
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[300px] overflow-y-auto">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-gradient-to-r from-gray-100 to-slate-100 border-b-2 border-gray-300 shadow-sm">
                        <tr className="text-left text-sm font-bold text-gray-700">
                          <th className="py-3 px-4">Data</th>
                          <th className="py-3 px-4 text-right">Comum</th>
                          <th className="py-3 px-4 text-right">Máximo</th>
                          <th className="py-3 px-4 text-right">Mínimo</th>
                          <th className="py-3 px-4 text-right">R$/Kg</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {history.map((item, index) => (
                          <tr key={index} className="border-b border-gray-200 hover:bg-green-50 transition-colors">
                            <td className="py-3 px-4 font-medium text-gray-700">
                              {new Date(item.date).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="py-3 px-4 text-right font-semibold text-green-600">{formatPrice(item.commonPrice)}</td>
                            <td className="py-3 px-4 text-right font-semibold text-red-600">{formatPrice(item.maxPrice)}</td>
                            <td className="py-3 px-4 text-right font-semibold text-blue-600">{formatPrice(item.minPrice)}</td>
                            <td className="py-3 px-4 text-right font-bold text-green-700 text-base">
                              {formatPrice(item.pricePerKg)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="details" className="mt-6">
            <div className="space-y-6">
              <Card className="border-2 border-green-100 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-b-2 border-green-100">
                  <CardTitle className="text-lg font-bold text-green-800 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Documentação
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {product.pdfUrl ? (
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 shadow-xl">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMjBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                            <FileText className="w-8 h-8 text-white drop-shadow-lg" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-lg drop-shadow-lg">PDF Original CEASA</p>
                            <p className="text-sm text-white/90 font-medium mt-1">
                              Cotação de {new Date(product.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <Button asChild className="bg-white text-green-700 hover:bg-white/90 shadow-xl font-bold">
                          <a href={`http://localhost:3333${product.pdfUrl}`} target="_blank" rel="noopener noreferrer" className="gap-2">
                            <Download className="w-5 h-5" />
                            Baixar PDF
                          </a>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-center">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">PDF não disponível</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-2 border-green-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-b-2 border-green-100">
                  <CardTitle className="text-lg font-bold text-green-800 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Informações Completas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <dl className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 sm:col-span-1 p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                      <dt className="text-sm font-bold text-gray-600 mb-2">Código do Produto</dt>
                      <dd className="text-base text-gray-900 font-bold">{product.code}</dd>
                    </div>
                    <div className="col-span-2 sm:col-span-1 p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                      <dt className="text-sm font-bold text-gray-600 mb-2">Nome</dt>
                      <dd className="text-base text-gray-900 font-semibold">{product.name}</dd>
                    </div>
                    <div className="col-span-2 sm:col-span-1 p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                      <dt className="text-sm font-bold text-gray-600 mb-2">Categoria</dt>
                      <dd className="mt-1">
                        <Badge variant="outline" className="text-base px-3 py-1">{product.category}</Badge>
                      </dd>
                    </div>
                    <div className="col-span-2 sm:col-span-1 p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                      <dt className="text-sm font-bold text-gray-600 mb-2">Tipo de Embalagem</dt>
                      <dd className="mt-1">
                        <Badge variant="secondary" className="text-base px-3 py-1">{product.unit}</Badge>
                      </dd>
                    </div>
                    <div className="col-span-2 sm:col-span-1 p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                      <dt className="text-sm font-bold text-gray-600 mb-2">Embalagem</dt>
                      <dd className="text-base text-gray-900 font-semibold">{product.packaging}</dd>
                    </div>
                    <div className="col-span-2 sm:col-span-1 p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                      <dt className="text-sm font-bold text-gray-600 mb-2">Quantidade por Embalagem</dt>
                      <dd className="text-base text-gray-900 font-semibold">{product.quantityPerPackage}</dd>
                    </div>
                    <div className="col-span-2 sm:col-span-1 p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                      <dt className="text-sm font-bold text-gray-600 mb-2">Classificação</dt>
                      <dd className="mt-1">
                        <Badge className="text-base px-3 py-1">{product.classification}</Badge>
                      </dd>
                    </div>
                    <div className="col-span-2 sm:col-span-1 p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                      <dt className="text-sm font-bold text-gray-600 mb-2">Data da Cotação</dt>
                      <dd className="text-base text-gray-900 font-bold">
                        {new Date(product.date).toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
