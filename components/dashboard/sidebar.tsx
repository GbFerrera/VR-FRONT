'use client';

import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Truck,
  BarChart3,
  Settings,
  LogOut,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';

const adminMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/sindicato/dashboard' },
  { icon: Users, label: 'Produtores', href: '/sindicato/producers' },
  { icon: Building2, label: 'Empresas', href: '/sindicato/empresas' },
  { icon: Package, label: 'Produtos', href: '/sindicato/products' },
  { icon: ShoppingCart, label: 'Pedidos', href: '/sindicato/pedidos' },
  { icon: DollarSign, label: 'Preço Caixa', href: '/sindicato/preco-caixa' },
  { icon: TrendingUp, label: 'Venda Inteligente', href: '/sindicato/venda-inteligente' },
  { icon: Truck, label: 'Logística', href: '/sindicato/logistica' },
  { icon: BarChart3, label: 'Financeiro', href: '/sindicato/financeiro-antigo' },
  { icon: FileText, label: 'Relatórios', href: '/sindicato/relatorios' },
  { icon: Settings, label: 'Configurações', href: '/sindicato/configuracoes' },
];

const producerMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/sindicato/dashboard' },
  { icon: Package, label: 'Meus Produtos', href: '/sindicato/products' },
  { icon: ShoppingCart, label: 'Pedidos', href: '/sindicato/pedidos' },
  { icon: DollarSign, label: 'Preço Caixa', href: '/sindicato/preco-caixa' },
  { icon: BarChart3, label: 'Relatórios', href: '/sindicato/relatorios' },
  { icon: Settings, label: 'Configurações', href: '/sindicato/configuracoes' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  
  const menuItems = user?.role === 'ADMIN' ? adminMenuItems : producerMenuItems;

  return (
    <aside className="w-[240px] bg-[#2d5016] min-h-screen text-white flex flex-col">
      <div className="py-8 px-4 border-b border-white/10">
        <div className="flex items-center justify-center">
          <img 
            src="/logo.png" 
            alt="Vitrine Rural - Niquelândia" 
            className="w-full h-auto object-contain max-h-32"
          />
        </div>
      </div>

      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-6 py-3 text-sm transition-colors',
                isActive
                  ? 'bg-white/10 border-l-4 border-white text-white'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        {user && (
          <div className="px-2 py-2 mb-2">
            <p className="text-xs text-white/50">Logado como</p>
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-white/70">{user.role === 'ADMIN' ? 'Administrador' : 'Produtor'}</p>
          </div>
        )}
        <button 
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
