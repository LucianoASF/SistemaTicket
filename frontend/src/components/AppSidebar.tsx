import { cn } from '#lib/utils';
import {
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Ticket,
  Users,
} from 'lucide-react';

import { Link, NavLink } from 'react-router';
import { Avatar, AvatarFallback } from './ui/avatar';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tickets', href: '/tickets', icon: Ticket },
  { name: 'Projetos', href: '/dashboard/projects', icon: FolderKanban },
  { name: 'Usuários', href: '/dashboard/users', icon: Users },
];

export function AppSidebar() {
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
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
              RA
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              Rogerio Andrade
            </p>
            <p className="truncate text-xs text-sidebar-foreground/60">
              rogerioandrade@email.com
            </p>
          </div>
          <Link
            to="/login"
            className="rounded-lg p-1.5 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
