import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { users as inicitialUsers, tickets } from '#lib/mock';
import { Button } from '#components/ui/button';
import { ArrowLeft, Edit, Mail, Shield, Ticket, User } from 'lucide-react';
import { CustomAvatar } from '#components/CustomAvatar';
import { Badge } from '#components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '#components/ui/card';
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
import { ModalUser } from '#components/ModalUser';

const roleLabels = {
  admin: {
    label: 'Administrador',
    className: 'bg-red-100 text-red-700 border-red-200',
  },
  support: {
    label: 'Suporte',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  user: {
    label: 'Usuário',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function UserDetails() {
  const { id } = useParams();
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [user, setUser] = useState(inicitialUsers.find((iu) => iu.id === id));
  const roleConfig = roleLabels[user.role];

  // Tickets criados pelo usuario
  const createdTickets = tickets.filter((t) => t.author.id === id);

  // Tickets atribuidos ao usuario
  const assignedTickets = tickets.filter((t) => t.assignee?.id === id);

  // Estatisticas do usuario
  const userStats = {
    ticketsCriados: createdTickets.length,
    ticketsAtribuidos: assignedTickets.length,
    ticketsAbertos: createdTickets.filter((t) => t.status === 'open').length,
    ticketsFechados: createdTickets.filter((t) => t.status === 'closed').length,
  };

  if (!user) {
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
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/users">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <CustomAvatar name={user.name} large={true} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-2xl">{user.name}</h1>
              <Badge variant="outline" className={roleConfig.className}>
                <Shield className="mr-1 h-3 w-3" />
                {roleConfig.label}
              </Badge>
            </div>
            <span className="text-muted-foreground flex items-center">
              <Mail className="h-4 w-4 mr-2" /> {user.email}
            </span>
          </div>
        </div>
        <Button variant="outline" onClick={() => setIsModelOpen(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tickets Criados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userStats.ticketsCriados}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tickets Atribuídos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {userStats.ticketsAtribuidos}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tickets Abertos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              {userStats.ticketsAbertos}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tickets Fechados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {userStats.ticketsFechados}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <Tabs defaultValue="created">
              <CardHeader>
                <TabsList>
                  <TabsTrigger value="created">
                    <Ticket className="h-4 w-4" />
                    Criados ({userStats.ticketsCriados})
                  </TabsTrigger>
                  <TabsTrigger value="assigned">
                    <User className="h-4 w-4" />
                    Atribuídos ({userStats.ticketsAtribuidos})
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="created">
                  {createdTickets.length === 0 ? (
                    <p className="py-8 text-center text-muted-foreground">
                      Este usuário ainda não criou nenhum ticket.
                    </p>
                  ) : (
                    <div className="rounded-lg border border-border">
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
                          {createdTickets.map((ticket) => (
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
                  {assignedTickets.length === 0 ? (
                    <p className="py-8 text-center text-muted-foreground">
                      Este usuário não possui tickets atribuídos.
                    </p>
                  ) : (
                    <div className="rounded-lg border border-border">
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
                          {assignedTickets.map((ticket) => (
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
                                    name={ticket.author.name}
                                    secondary
                                  />
                                  <span>{ticket.author.name}</span>
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
                <span className="text-sm">{user.id}</span>
              </div>
              <Separator />
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm font-medium">
                  Nome completo
                </span>
                <span className="text-sm">{user.name}</span>
              </div>
              <Separator />
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm font-medium">
                  Email
                </span>
                <span className="text-sm">{user.email}</span>
              </div>
              <Separator />
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm font-medium">
                  Função
                </span>
                <span className="text-sm">
                  <Badge className={roleConfig.className}>
                    {roleConfig.label}
                  </Badge>
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo de Atividades</CardTitle>
              <CardDescription>Visão geral dos tickets</CardDescription>
              <CardContent className="space-y-3 px-0 pt-3">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">Total Criados</p>
                  <span>{userStats.ticketsCriados}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">
                    Total Atribuídos
                  </p>
                  <span>{userStats.ticketsAtribuidos}</span>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      </div>
      <ModalUser user={user} open={isModelOpen} onOpenChange={setIsModelOpen} />
    </div>
  );
}
