import { Badge } from '#components/ui/badge';
import { TICKET_PRIORITY, type TicketPriority } from '../../types/ticket';

interface PriorityBadgeProps {
  priority: TicketPriority;
}

const priorityConfig = {
  [TICKET_PRIORITY.LOW]: {
    label: 'Baixa',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  [TICKET_PRIORITY.MEDIUM]: {
    label: 'Média',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  [TICKET_PRIORITY.HIGH]: {
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
