import { Badge } from '#components/ui/badge';
import { Shield } from 'lucide-react';
import { USER_ROLE, type UserRole } from '../../types/role';
import { cn } from '#lib/utils.ts';

type Variant = 'small' | 'normal';

interface RoleBadgeProps {
  role: UserRole;
  variant?: Variant;
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

export function RoleBadge({ role, variant = 'normal' }: RoleBadgeProps) {
  const config = roleConfig[role];

  return (
    <Badge
      variant="outline"
      className={cn(
        variant === 'small' && 'px-1.5 py-0 text-[10px]',
        config.className,
      )}
    >
      <Shield
        className={variant === 'small' ? 'mr-0.5 size-1' : 'mr-1 size-3'}
      />
      {config.label}
    </Badge>
  );
}
