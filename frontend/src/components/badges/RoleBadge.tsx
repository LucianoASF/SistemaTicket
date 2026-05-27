import { Badge } from '#components/ui/badge';
import { Shield } from 'lucide-react';
import { USER_ROLE, type UserRole } from '../../types/role';

interface RoleBadgeProps {
  role: UserRole;
}

const roleConfig = {
  [USER_ROLE.ADMIN]: {
    label: 'Administrador',
    className: 'bg-red-100 text-red-700 border-red-200',
  },
  [USER_ROLE.SUPPORT]: {
    label: 'Suporte',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  [USER_ROLE.USER]: {
    label: 'Usuário',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
};

export function RoleBadge({ role }: RoleBadgeProps) {
  const config = roleConfig[role];

  return (
    <Badge variant="outline" className={config.className}>
      <Shield className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  );
}
