'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, ChevronDown, TrendingUp } from 'lucide-react';

export default function VendaInteligente() {
  return (
    <>
        <header className="bg-white border-b px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <h1 className="text-2xl font-bold text-gray-800">Venda Inteligente</h1>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar..."
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-green-600 text-white">A</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">Admin</p>
                  <p className="text-xs text-gray-500">Administrador</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Venda Inteligente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <TrendingUp className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Nenhum dado disponível
                </h3>
                <p className="text-gray-500 max-w-md">
                  Configure suas análises de vendas para visualizar insights e tendências.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
    </>
  );
}
