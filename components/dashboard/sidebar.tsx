'use client';

import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  ShoppingCart,
  DollarSign,
  BarChart3,
  LogOut,
  FileText,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';

const adminMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/sindicato/dashboard' },
  { icon: Users, label: 'Produtores', href: '/sindicato/producers' },
  { icon: MapPin, label: 'Fazendas', href: '/sindicato/fazendas' },
  { icon: Package, label: 'Produtos', href: '/sindicato/products' },
  { icon: ShoppingCart, label: 'Pedidos', href: '/sindicato/pedidos' },
  { icon: DollarSign, label: 'Preço Ceasa', href: '/sindicato/preco-caixa' },
];

const producerMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/sindicato/dashboard' },
  { icon: Package, label: 'Meus Produtos', href: '/sindicato/products' },
  { icon: ShoppingCart, label: 'Pedidos', href: '/sindicato/pedidos' },
  { icon: DollarSign, label: 'Preço Ceasa', href: '/sindicato/preco-caixa' },
];

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  
  const menuItems = user?.role === 'ADMIN' ? adminMenuItems : producerMenuItems;

  return (
    <aside className={cn(
      "bg-[#2d5016] min-h-screen text-white flex flex-col transition-all duration-300 overflow-x-hidden",
      collapsed ? "w-[70px]" : "w-[240px]"
    )}>
      <div className={cn(
        "py-8 border-b border-white/10",
        collapsed ? "px-2" : "px-4"
      )}>
        <div className="flex items-center justify-center">
          {collapsed ? (
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#2d5016] font-bold text-xl">V</span>
            </div>
          ) : (
            <img 
              src="/logo.png" 
              alt="Vitrine Rural - Niquelândia" 
              className="w-full h-auto object-contain max-h-32"
            />
          )}
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
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 py-3 text-sm transition-colors relative group',
                collapsed ? 'px-4 justify-center' : 'px-6',
                isActive
                  ? 'bg-white/10 border-l-4 border-white text-white'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
              {!collapsed && <span>{item.label}</span>}
              
              {collapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={cn(
        "border-t border-white/10 space-y-2",
        collapsed ? "p-2" : "p-4"
      )}>
        {user && !collapsed && (
          <div className="px-2 py-2 mb-2">
            <p className="text-xs text-white/50">Logado como</p>
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-white/70">{user.role === 'ADMIN' ? 'Administrador' : 'Produtor'}</p>
          </div>
        )}
        <button 
          onClick={logout}
          title={collapsed ? "Sair" : undefined}
          className={cn(
            "w-full bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
            collapsed ? "py-2 px-2 justify-center" : "py-2 px-4 justify-center"
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
