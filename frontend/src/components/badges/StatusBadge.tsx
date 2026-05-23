import { Badge } from '#components/ui/badge';
import { TICKET_STATUS, type TicketStatus } from '../../types/ticket';

interface StatusBadgeProps {
  status: TicketStatus;
}

const statusConfig = {
  [TICKET_STATUS.OPEN]: {
    label: 'Aberto',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  [TICKET_STATUS.INPROGRESS]: {
    label: 'Em Progresso',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  [TICKET_STATUS.CLOSED]: {
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
