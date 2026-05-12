import { Button } from '#components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#components/ui/card';
import { getStatusBadge, getPriorityBadge } from '#lib/badges';
import { tickets } from '#lib/mock';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  Ticket,
} from 'lucide-react';
import { Link } from 'react-router';

export function Dashboard() {
  const dataCards = [
    {
      title: 'Total de Tickets',
      value: 8, // vai vir da api
      icon: Ticket,
      description: 'Todos os tickets',
      color: 'text-muted-foreground',
    },
    {
      title: 'Abertos',
      value: 4, // vai vir da api
      icon: AlertCircle,
      description: 'Todos os tickets',
      color: 'text-amber-600',
    },
    {
      title: 'Em Progresso',
      value: 2, // vai vir da api
      icon: Clock,
      description: 'Sendo resolvidos',
      color: 'text-blue-600',
    },
    {
      title: 'Fechados',
      value: 2, // vai vir da api
      icon: CheckCircle,
      description: 'Resolvidos',
      color: 'text-emerald-600',
    },
  ];
  const recentTickets = tickets.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema</p>
        </div>
        <Button asChild>
          <Link to="/tickets">
            Ver todos os tickets
            <ArrowRight className="ml-2 h-4 w-4" />{' '}
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dataCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <span className="text-3xl font-bold">{card.value}</span>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle>Tickets Recentes</CardTitle>
            <CardDescription className="text-muted-foreground">
              Últimos tickets criados no sistema
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/tickets">Ver todos</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentTickets.map((ticket) => (
            <Link
              key={ticket.id}
              to={`/tickets/${ticket.id}`}
              className="flex items-center justify-between border border-border rounded-lg p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex-1 min-w-0 ">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Id: {ticket.id}
                  </span>
                  {getStatusBadge(ticket.status)}
                  {getPriorityBadge(ticket.priority)}
                </div>
                <p className="truncate">{ticket.title}</p>
                <p className="text-sm text-muted-foreground truncate">
                  Criado por {ticket.author.name} •{' '}
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
              </div>
              <ArrowRight className="m-4 h-4 text-muted-foreground" />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
