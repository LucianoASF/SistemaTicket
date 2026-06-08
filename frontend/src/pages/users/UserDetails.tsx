import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Button } from '#components/ui/button';
import { ArrowLeft, Edit, Mail, Ticket, UserIcon } from 'lucide-react';
import { CustomAvatar } from '#components/CustomAvatar';
import { Card, CardHeader, CardTitle, CardContent } from '#components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#components/ui/table';
import { StatusBadge } from '#components/badges/StatusBadge';
import { PriorityBadge } from '#components/badges/PriorityBadge';
import { Separator } from '#components/ui/separator';
import { ModalUser } from '#components/modals/ModalUser';
import { api } from '../../axios/axios';
import type { UserWithTickets } from '../../types/user';
import { RoleBadge } from '#components/badges/RoleBadge';
import { cn, formatDate } from '#lib/utils.ts';
import { useAuth } from '../../contexts/useAuth';
import { Loading } from '#components/loadings/Loading';

export function UserDetails() {
  const { user } = useAuth();
  const { id } = useParams();
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [data, setData] = useState<UserWithTickets>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<UserWithTickets>(`/users/${id}`);
        setData(response.data);
        setLoading(false);
      } catch {
        return;
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <Loading variant="page" />;
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-bold text-foreground">
          Usuário não encontrado
        </h1>
        <p className="mt-2 text-muted-foreground">
          O usuário que você está procurando não existe.
        </p>
        <Button asChild className="mt-4">
          <Link to="/users">Voltar para usuários</Link>
        </Button>
      </div>
    );
  }

  const ticketsStats = [
    {
      title: 'Total de Tickets',
      createdData: data.createdTicketsCount,
      assignedData: data.assignedTicketsCount,
      className: '',
    },
    {
      title: 'Tickets Abertos',
      createdData: data.createdTicketsStatusCounts.open,
      assignedData: data.assignedTicketsStatusCounts.open,
      className: 'text-red-600',
    },
    {
      title: 'Tickets em Andamento',
      createdData: data.createdTicketsStatusCounts.inProgress,
      assignedData: data.assignedTicketsStatusCounts.inProgress,
      className: 'text-amber-600',
    },
    {
      title: 'Tickets Fechados',
      createdData: data.createdTicketsStatusCounts.closed,
      assignedData: data.assignedTicketsStatusCounts.closed,
      className: 'text-emerald-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/users">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <CustomAvatar name={data.user.name} large={true} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-2xl">{data.user.name}</h1>
              <RoleBadge role={data.user.role} />
            </div>
            <span className="text-muted-foreground flex items-center">
              <Mail className="h-4 w-4 mr-2" /> {data.user.email}
            </span>
          </div>
        </div>
        <Button variant="outline" onClick={() => setIsModelOpen(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ticketsStats.map((t) => (
          <Card key={t.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  'text-3xl font-bold flex justify-around items-center h-14 text-center',
                  t.className,
                )}
              >
                <div>
                  <span>{t.createdData}</span>
                  <p className="text-muted-foreground text-sm">Criados</p>
                </div>
                <Separator orientation="vertical" />
                <div>
                  <span>{t.assignedData}</span>
                  <p className="text-muted-foreground text-sm">Atribuídos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 min-w-0">
          <Card>
            <Tabs defaultValue="created">
              <CardHeader className="flex justify-between">
                <TabsList>
                  <TabsTrigger value="created">
                    <Ticket className="h-4 w-4" />
                    Criados ({data.createdTicketsCount})
                  </TabsTrigger>
                  <TabsTrigger value="assigned">
                    <UserIcon className="h-4 w-4" />
                    Atribuídos ({data.assignedTicketsCount})
                  </TabsTrigger>
                </TabsList>
                <Button variant="outline">
                  <Link className="flex gap-2" to={`/tickets`}>
                    <UserIcon className="size-4" />
                    {user?.id === id
                      ? 'Ver todos os seus tickets'
                      : 'Ver todos os tickets do usuário'}
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <TabsContent value="created">
                  {data.createdTickets.length === 0 ? (
                    <p className="py-8 text-center text-muted-foreground">
                      Este usuário ainda não criou nenhum ticket.
                    </p>
                  ) : (
                    <div className="rounded-lg border border-border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Ticket</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Prioridade</TableHead>
                            <TableHead>Criado em</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.createdTickets.map((ticket) => (
                            <TableRow key={ticket.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium max-w-75 sm:max-w-100  md:max-w-175 truncate">
                                    {ticket.title}
                                  </p>
                                  <div>
                                    <span className="text-xs text-muted-foreground mr-2">
                                      {ticket.id}
                                    </span>
                                    <Link
                                      to={`/tickets/${ticket.id}`}
                                      className="text-muted-foreground font-medium  hover:text-primary hover:underline"
                                    >
                                      Ver mais
                                    </Link>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <StatusBadge status={ticket.status} />
                              </TableCell>
                              <TableCell>
                                <PriorityBadge priority={ticket.priority} />
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {formatDate(ticket.createdAt)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="assigned">
                  {data.assignedTickets.length === 0 ? (
                    <p className="py-8 text-center text-muted-foreground">
                      Este usuário não possui tickets atribuídos.
                    </p>
                  ) : (
                    <div className="rounded-lg border border-border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Ticket</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Prioridade</TableHead>
                            <TableHead>Autor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.assignedTickets.map((ticket) => (
                            <TableRow key={ticket.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium max-w-75 sm:max-w-100  md:max-w-175 truncate">
                                    {ticket.title}
                                  </p>
                                  <div>
                                    <span className="text-xs text-muted-foreground mr-2">
                                      {ticket.id}
                                    </span>
                                    <Link
                                      to={`/tickets/${ticket.id}`}
                                      className="text-muted-foreground font-medium  hover:text-primary hover:underline"
                                    >
                                      Ver mais
                                    </Link>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <StatusBadge status={ticket.status} />
                              </TableCell>
                              <TableCell>
                                <PriorityBadge priority={ticket.priority} />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <CustomAvatar
                                    name={ticket.createdByName}
                                    secondary
                                  />
                                  <span>{ticket.createdByName}</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm font-medium">
                  ID do Usuário
                </span>
                <span className="text-sm">{data.user.id}</span>
              </div>
              <Separator />
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm font-medium">
                  Nome completo
                </span>
                <span className="text-sm">{data.user.name}</span>
              </div>
              <Separator />
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm font-medium">
                  Email
                </span>
                <span className="text-sm">{data.user.email}</span>
              </div>
              <Separator />
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm font-medium">
                  Função
                </span>
                <span className="text-sm">
                  <RoleBadge role={data.user.role} />
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ModalUser
        user={data.user}
        open={isModelOpen}
        onOpenChange={setIsModelOpen}
      />
    </div>
  );
}
