import { PriorityBadge } from '#components/badges/PriorityBadge';
import { StatusBadge } from '#components/badges/StatusBadge';
import { Button } from '#components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#components/ui/card';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  TicketIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { PagedTickets } from '../types/ticket';
import { api } from '../axios/axios';
import { Loading } from '#components/loadings/Loading';
import { AccessDeniedOrNotFound } from '#components/AccessDeniedOrNotFound';
import { USER_ROLE } from '../types/role';
import { useAuth } from '../contexts/useAuth';

export function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PagedTickets>({
    tickets: [],
    total: 0,
    statusCounts: {
      open: 0,
      inProgress: 0,
      closed: 0,
    },
  });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get<PagedTickets>(
          '/tickets?withStatusCounts=true',
          { skip403And404Toast: true },
        );
        setData(response.data);
      } catch {
        return;
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (user?.role === USER_ROLE.USER) {
    return (
      <AccessDeniedOrNotFound
        error="access denied"
        to="/tickets"
        pText="Você não tem permissão para visualizar o dashboard."
        linkText="Ir para tickets"
      />
    );
  }

  if (loading) {
    return <Loading variant="page" />;
  }

  const dataCards = [
    {
      title: 'Total de Tickets',
      value: data.total,
      icon: TicketIcon,
      description: 'Todos os tickets',
      color: 'text-muted-foreground',
    },
    {
      title: 'Abertos',
      value: data.statusCounts.open,
      icon: AlertCircle,
      description: 'Todos os tickets',
      color: 'text-amber-600',
    },
    {
      title: 'Em Progresso',
      value: data.statusCounts.inProgress,
      icon: Clock,
      description: 'Sendo resolvidos',
      color: 'text-blue-600',
    },
    {
      title: 'Fechados',
      value: data.statusCounts.closed,
      icon: CheckCircle,
      description: 'Resolvidos',
      color: 'text-emerald-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            {user?.role === USER_ROLE.SUPPORT
              ? 'Visão geral dos seus Tickets'
              : 'Visão geral do sistema'}
          </p>
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
          {data.tickets.length === 0 ? (
            <div className="h-24 flex justify-center items-center flex-col text-muted-foreground">
              <p className="mb-4 font-semibold">Nenhum ticket encontrado. </p>
              <p>Para Adicionar novos tickets vá para a página tickets</p>
              <p>Para Adicionar novos usuários vá para a página de usuários</p>
            </div>
          ) : (
            data.tickets.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/tickets/${ticket.id}`}
                className="flex items-center justify-between border border-border rounded-lg p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Id: {ticket.id}
                    </span>

                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                  </div>

                  <p className="truncate">{ticket.title}</p>

                  <p className="text-sm text-muted-foreground truncate">
                    Criado por {ticket.createdByName} •{' '}
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <ArrowRight className="m-4 h-4 text-muted-foreground" />
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
