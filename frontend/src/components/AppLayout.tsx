import { useState } from 'react';
import { AppNavbar } from './AppNavbar';
import { AppSidebar } from './AppSidebar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSideBarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-background">
      {sidebarOpen && (
        <div
          className="fixed insert-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSideBarOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AppSidebar />
      </div>
      <div className="flex-1 flex-col overflow-hidden">
        <AppNavbar onMenuClick={() => setSideBarOpen} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
