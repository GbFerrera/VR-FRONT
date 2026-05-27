'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { StockNotifications } from '@/components/dashboard/stock-notifications';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SindicatoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Desktop começa aberto
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // Mobile começa fechado

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Desktop - Sempre Visível (Colapsável) */}
      <div className={`hidden lg:block transition-all duration-300 flex-shrink-0 ${sidebarOpen ? 'lg:w-[240px]' : 'lg:w-[70px]'}`}>
        <div className={`fixed left-0 top-0 h-screen ${sidebarOpen ? 'overflow-y-auto' : 'overflow-hidden'}`}>
          <Sidebar collapsed={!sidebarOpen} />
        </div>
      </div>

      {/* Sidebar Mobile - Overlay */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${mobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black/50"
          onClick={() => setMobileSidebarOpen(false)}
        />
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 w-[240px] bg-white overflow-y-auto transition-transform duration-300 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar collapsed={false} />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full min-w-0 relative">
        {/* Header com Notificações */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              {/* Toggle Button Desktop */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex items-center justify-center p-2 bg-green-700 text-white rounded-lg shadow hover:bg-green-800 transition-colors"
              >
                {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>

              {/* Menu Button Mobile */}
              <button
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="lg:hidden p-2 bg-green-700 text-white rounded-lg shadow hover:bg-green-800 transition-colors"
              >
                {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <h1 className="text-xl font-semibold text-gray-900">Vitrine Rural</h1>
            </div>

            <StockNotifications />
          </div>
        </div>
        
        {children}
      </main>
    </div>
  );
}
