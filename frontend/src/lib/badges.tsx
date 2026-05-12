import { Badge } from '#components/ui/badge';

export function getStatusBadge(status: string) {
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
  const config = statusConfig[status as keyof typeof statusConfig];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

export function getPriorityBadge(priority: string) {
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
  const config = priorityConfig[priority as keyof typeof priorityConfig];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
