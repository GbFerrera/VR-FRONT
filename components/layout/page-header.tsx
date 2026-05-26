'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  searchPlaceholder?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, searchPlaceholder = 'Search...', actions }: PageHeaderProps) {
  return (
    <header className="bg-white border-b px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {actions}

          <button className="relative p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l">
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
  );
}
