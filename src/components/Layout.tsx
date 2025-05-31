
import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Toaster } from "@/components/ui/sonner";
import { useAdmin } from '@/hooks/use-admin';
import AuthStatusChecker from './auth/AuthStatusChecker';

const Layout = () => {
  const { isAdmin } = useAdmin();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AuthStatusChecker />
      
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Mobile Sidebar - you can implement a mobile drawer here if needed */}
      <div className="lg:hidden">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              Sistema de Musicoterapia
            </h1>
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                  Admin
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          }>
            <Outlet />
          </Suspense>
        </main>
      </div>
      
      <Toaster />
    </div>
  );
};

export default Layout;
