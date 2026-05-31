import { Button } from '#components/ui/button';
import {
  ArrowLeft,
  Clock,
  Edit,
  History,
  MessageSquare,
  Send,
} from 'lucide-react';
import { Link, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '#components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#components/ui/tabs';
import { Separator } from '#components/ui/separator';
import { Textarea } from '#components/ui/textarea';
import { ModalTicket } from '#components/ModalTicket';
import { CustomAvatar } from '#components/CustomAvatar';
import { StatusBadge } from '#components/badges/StatusBadge';
import { PriorityBadge } from '#components/badges/PriorityBadge';
import { api } from '#lib/axios.ts';
import {
  TICKET_PRIORITY,
  TICKET_STATUS,
  type TicketDetails,
} from '../../types/ticket';
import { formatDate } from '#lib/utils.ts';

const priorityConfig = {
  [TICKET_PRIORITY.LOW]: 'baixa',
  [TICKET_PRIORITY.MEDIUM]: 'média',
  [TICKET_PRIORITY.HIGH]: 'alta',
};
const statusConfig = {
  [TICKET_STATUS.OPEN]: 'aberto',
  [TICKET_STATUS.INPROGRESS]: 'em progresso',
  [TICKET_STATUS.CLOSED]: 'fechado',
};

export function TicketDetails() {
  const { id } = useParams();
  const [ticketDetails, setTicketDetails] = useState<TicketDetails>();
  const [isModelOpen, setIsModelOpen] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      const response = await api.get<TicketDetails>(`/tickets/${id}`);
      setTicketDetails(response.data);
    };
    fetchTicket();
  }, [id]);

  if (!ticketDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-bold text-foreground">
          Ticket não encontrado
        </h1>
        <p className="mt-2 text-muted-foreground">
          O ticket que você está procurando não existe.
        </p>
        <Button asChild className="mt-4">
          <Link to="/tickets">Voltar para tickets</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/tickets">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="space-y-1">
            <div className="flex gap-2">
              <span className="text-sm text-muted-foreground">
                Id: {ticketDetails.ticket.id}
              </span>
              <StatusBadge status={ticketDetails.ticket.status} />
              <PriorityBadge priority={ticketDetails.ticket.priority} />
            </div>
            <h1 className="text-2xl font-bold">{ticketDetails.ticket.title}</h1>
          </div>
        </div>
        <Button variant="outline" onClick={() => setIsModelOpen(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Descrição</CardTitle>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap">
              {ticketDetails.ticket.description}
            </CardContent>
          </Card>
          <Card>
            <Tabs defaultValue="comments">
              <CardHeader>
                <TabsList>
                  <TabsTrigger value="comments">
                    <MessageSquare className="h-4 w-4" />
                    Comentários ({ticketDetails.ticketComments.length})
                  </TabsTrigger>
                  <TabsTrigger value="histories">
                    <History className="h-4 w-4" />
                    Histórico ({ticketDetails.ticketHistories.length})
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="comments" className="space-y-4">
                  {ticketDetails.ticketComments.length == 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhum comentário ainda. Seja o primeiro a comentar!
                    </p>
                  ) : (
                    <div className="space-y-2 mt-4">
                      {ticketDetails.ticketComments.map((c) => (
                        <div key={c.id}>
                          <div className="flex items-center gap-2">
                            <CustomAvatar name={c.userName} />
                            <span className="font-medium">{c.userName}</span>
                            <span className="text-muted-foreground text-xs">
                              {formatDate(c.createdAt)}
                            </span>
                          </div>
                          <div className="py-1 px-9">
                            <p className="font-light">{c.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Separator />
                  <Textarea placeholder="Escreva um comentário..." rows={3} />
                  <div className="text-end">
                    <Button>
                      <Send className="mr-2 h-4 w-4" /> Enviar comentário
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="histories" className="space-y-7 mt-4">
                  {ticketDetails.ticketHistories.map((th, index) => (
                    <div key={th.id} className="flex gap-2">
                      <div className="relative flex w-8 justify-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted z-10">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>

                        {index < ticketDetails.ticketHistories.length - 1 && (
                          <div className="absolute top-8 -bottom-7 w-px bg-border" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium block">
                          {th.changedByName}
                        </span>
                        <div className="text-muted-foreground text-sm flex flex-col">
                          {th.oldAssignedUserName && th.newAssignedUserName && (
                            <span>
                              Atribuição alterada de {th.oldAssignedUserName}{' '}
                              para {th.newAssignedUserName}
                            </span>
                          )}

                          {th.oldAssignedUserName &&
                            !th.newAssignedUserName && (
                              <span>
                                O(A) {th.newAssignedUserName} não esta mais
                                atribuído no ticket
                              </span>
                            )}

                          {!th.oldAssignedUserName &&
                            th.newAssignedUserName && (
                              <span>
                                O(A) {th.newAssignedUserName} esta atribuído no
                                ticket
                              </span>
                            )}

                          {th.oldStatus && th.newStatus && (
                            <span>
                              Status alterado de {statusConfig[th.oldStatus]}{' '}
                              para {statusConfig[th.newStatus]}
                            </span>
                          )}

                          {th.oldPriority && th.newPriority && (
                            <span>
                              Prioridade alterada de{' '}
                              {priorityConfig[th.oldPriority]} para{' '}
                              {priorityConfig[th.newPriority]}
                            </span>
                          )}
                        </div>
                        <span className="block text-xs text-muted-foreground">
                          {formatDate(th.changedAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Detalhes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm font-medium">
                    Status
                  </span>
                  <StatusBadge status={ticketDetails.ticket.status} />
                </div>
                <Separator />
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm font-medium">
                    Prioridade
                  </span>
                  <PriorityBadge priority={ticketDetails.ticket.priority} />
                </div>
                <Separator />
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm font-medium">
                    Criado por
                  </span>
                  <div className="flex items-center gap-2">
                    <CustomAvatar name={ticketDetails.ticket.createdByName} />
                    <span className="text-sm">
                      {ticketDetails.ticket.createdByName}
                    </span>
                  </div>
                </div>
                <Separator />
                {ticketDetails.ticket.assignedToName && (
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-sm font-medium">
                      Atribuido para
                    </span>
                    <div className="flex items-center gap-2">
                      <CustomAvatar
                        name={ticketDetails.ticket.assignedToName}
                        secondary
                      />
                      <span className="text-sm">
                        {ticketDetails.ticket.assignedToName}
                      </span>
                    </div>
                  </div>
                )}
                <Separator />
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm font-medium">
                    Criado em
                  </span>
                  <span className="text-sm">
                    {formatDate(ticketDetails.ticket.createdAt)}
                  </span>
                </div>
                <Separator />
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm font-medium">
                    Atualizado em
                  </span>
                  {ticketDetails.ticketHistories.length > 0 && (
                    <span className="text-sm">
                      {formatDate(ticketDetails.ticketHistories[0].changedAt)}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ModalTicket
        open={isModelOpen}
        onOpenChange={setIsModelOpen}
        ticket={ticketDetails.ticket}
      />
    </div>
  );
}
