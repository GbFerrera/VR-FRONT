'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Bell, Menu } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  sidebar: React.ReactNode;
}

export function MobileHeader({ title, subtitle, actions, sidebar }: MobileHeaderProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Header - Green Background */}
      <header className="lg:hidden bg-gradient-to-r from-[#2d5016] to-[#3d6b1f] text-white shadow-md">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-3 mb-3">
            {/* Mobile Menu Button */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 text-white hover:bg-white/10">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[240px]">
                {sidebar}
              </SheetContent>
            </Sheet>

            {/* User Info */}
            <div className="flex items-center gap-2">
              <button className="relative p-2 hover:bg-white/10 rounded-lg shrink-0">
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              
              <Avatar className="shrink-0 border-2 border-white/20">
                <AvatarFallback className="bg-white/20 text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'P'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Mobile Title */}
          <div className="mb-1">
            <h1 className="text-xl font-bold text-white">{title}</h1>
            {subtitle && <p className="text-sm text-white/80 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        {/* Actions Section */}
        {actions && (
          <div className="px-4 pb-3">
            {actions}
          </div>
        )}
      </header>

      {/* Desktop Header - White Background */}
      <header className="hidden lg:block bg-white border-b px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            {actions}
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l">
              <Avatar>
                <AvatarFallback className="bg-green-600 text-white">
                  {user?.name?.charAt(0).toUpperCase() || 'P'}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-semibold text-gray-800">{user?.name || 'Produtor'}</p>
                <p className="text-xs text-gray-500">Produtor</p>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
