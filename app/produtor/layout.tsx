'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProducerSidebar } from '@/components/dashboard/producer-sidebar';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Menu, X } from 'lucide-react';

export default function ProdutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    } else if (!loading && isAuthenticated && user?.role !== 'PRODUCER') {
      router.push('/sindicato/dashboard');
    }
  }, [isAuthenticated, loading, user, router]);

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

  if (!isAuthenticated || user?.role !== 'PRODUCER') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block">
        <ProducerSidebar />
      </div>

      {/* Sidebar Mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 w-[240px] bg-white">
          <ProducerSidebar />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full min-w-0">
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-[#2d5016] text-white rounded-lg shadow-lg hover:bg-[#3d6020] transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {children}
      </main>
    </div>
  );
}
