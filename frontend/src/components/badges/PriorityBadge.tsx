import { Badge } from '#components/ui/badge';

type Priority = 'low' | 'medium' | 'high';

interface PriorityBadgeProps {
  priority: Priority;
}

const priorityConfig = {
  low: {
    label: 'Baixa',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  medium: {
    label: 'Média',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  high: {
    label: 'Alta',
    className: 'bg-red-100 text-red-700 border-red-200',
  },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
