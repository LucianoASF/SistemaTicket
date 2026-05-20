import { cn } from '#lib/utils';
import { LayoutDashboard, LogOut, Ticket, Users } from 'lucide-react';

import { Link, NavLink } from 'react-router';
import { CustomAvatar } from './CustomAvatar';
import { useAuth } from '../contexts/useAuth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tickets', href: '/tickets', icon: Ticket },
  { name: 'Usuários', href: '/users', icon: Users },
];

export function AppSidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex flex-col justify-between h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex justify-center items-center h-8 w-8 rounded-lg bg-foreground">
          <Ticket className="text-background h-4 w-4" />
        </div>
        <span className="text-lg font-semibold text-sidebar-foreground">
          Sistema de Tickets
        </span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  )
                }
              >
                <Icon />
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <CustomAvatar name={user!.name} />
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.name}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/60">
              {user?.email}
            </p>
          </div>
          <Link
            to="/login"
            className="rounded-lg p-1.5 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
