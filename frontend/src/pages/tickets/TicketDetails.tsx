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
import { tickets as inicitialTickets } from '#lib/mock';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '#components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#components/ui/tabs';
import { Separator } from '#components/ui/separator';
import { Textarea } from '#components/ui/textarea';
import { ModalTicket } from '#components/ModalTicket';
import { CustomAvatar } from '#components/CustomAvatar';
import { StatusBadge } from '#components/badges/StatusBadge';
import { PriorityBadge } from '#components/badges/PriorityBadge';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(
    inicitialTickets.find((it) => it.id === id),
  );
  const [isModelOpen, setIsModelOpen] = useState(false);

  if (!ticket) {
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
                Id: {ticket.id}
              </span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
            <h1 className="text-2xl font-bold">{ticket.title}</h1>
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
              {ticket.description}
            </CardContent>
          </Card>
          <Card>
            <Tabs defaultValue="comments">
              <CardHeader>
                <TabsList>
                  <TabsTrigger value="comments">
                    <MessageSquare className="h-4 w-4" />
                    Comentários ({ticket.comments.length})
                  </TabsTrigger>
                  <TabsTrigger value="activity">
                    <History className="h-4 w-4" />
                    Atividades ({ticket.activities.length})
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="comments" className="space-y-4">
                  {ticket.comments.length == 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhum comentário ainda. Seja o primeiro a comentar!
                    </p>
                  ) : (
                    <div className="space-y-2 mt-4">
                      {ticket.comments.map((c) => (
                        <div key={c.id}>
                          <div className="flex items-center gap-2">
                            <CustomAvatar name={c.author.name} />
                            <span className="font-medium">{c.author.name}</span>
                            <span className="text-muted-foreground text-xs">
                              {formatDate(c.createdAt)}
                            </span>
                          </div>
                          <div className="py-1 px-9">
                            <p>{c.content}</p>
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
                <TabsContent value="activity" className="space-y-7">
                  {ticket.activities.map((a, index) => (
                    <div key={a.id} className="flex gap-2 mt-4">
                      <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {index < ticket.activities.length - 1 && (
                          <div className="absolute top-9 h-full border border-border" />
                        )}
                      </div>
                      <div className="space-x-1">
                        <span className="font-medium">{a.author.name}</span>
                        <span className="text-muted-foreground">
                          {a.action}
                        </span>
                        {a.details && (
                          <span className="font-medium">{a.details}</span>
                        )}
                        <span className="block text-xs text-muted-foreground">
                          {formatDate(a.createdAt)}
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
                  <StatusBadge status={ticket.status} />
                </div>
                <Separator />
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm font-medium">
                    Prioridade
                  </span>
                  <PriorityBadge priority={ticket.priority} />
                </div>
                <Separator />
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm font-medium">
                    Criado por
                  </span>
                  <div className="flex items-center gap-2">
                    <CustomAvatar name={ticket.author.name} />
                    <span className="text-sm">{ticket.author.name}</span>
                  </div>
                </div>
                <Separator />
                {ticket.assignee && (
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-sm font-medium">
                      Atribuido para
                    </span>
                    <div className="flex items-center gap-2">
                      <CustomAvatar name={ticket.assignee.name} />
                      <span className="text-sm">{ticket.assignee.name}</span>
                    </div>
                  </div>
                )}
                <Separator />
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm font-medium">
                    Criado em
                  </span>
                  <span className="text-sm">
                    {formatDate(ticket.createdAt)}
                  </span>
                </div>
                <Separator />
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm font-medium">
                    Atualizado em
                  </span>
                  <span className="text-sm">
                    {formatDate(ticket.updatedAt)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ModalTicket
        open={isModelOpen}
        onOpenChange={setIsModelOpen}
        ticket={ticket}
      />
    </div>
  );
}
