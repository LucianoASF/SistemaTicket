import { Badge } from '#components/ui/badge';

type Status = 'open' | 'in-progress' | 'closed';

interface StatusBadgeProps {
  status: Status;
}

const statusConfig = {
  open: {
    label: 'Aberto',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  'in-progress': {
    label: 'Em Progresso',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  closed: {
    label: 'Fechado',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
