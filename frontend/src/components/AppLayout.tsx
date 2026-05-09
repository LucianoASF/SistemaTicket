import { useState } from 'react';
import { AppNavbar } from './AppNavbar';
import { AppSidebar } from './AppSidebar';
import { Outlet } from 'react-router';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AppSidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
