import { PriorityBadge } from '#components/badges/PriorityBadge';
import { StatusBadge } from '#components/badges/StatusBadge';
import { ModalTicket } from '#components/modals/ModalTicket';
import { Button } from '#components/ui/button';
import { Input } from '#components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#components/ui/table';
import { api } from '../../axios/axios';
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import {
  TICKET_PRIORITY,
  TICKET_STATUS,
  type TicketPriority,
  type Ticket,
  type TicketStatus,
  type PagedTickets,
} from '../../types/ticket';
import { UseUpdateParams } from '#hooks/useUpdateParams';
import { Loading } from '#components/loadings/Loading';

const ITEMS_PER_PAGE = 5;

export function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get('page') || 1);
  const searchQuery = searchParams.get('querySearch') || '';
  const statusFilter = searchParams.get('status') || 'all';
  const priorityFilter = searchParams.get('priority') || 'all';

  const [inputValue, setInputValue] = useState(searchQuery);

  const [loading, setLoading] = useState(true);
  const [isModelOpen, setIsModelOpen] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const request = await api.get<PagedTickets>('/tickets', {
          params: {
            page: currentPage,
            searchQuery: searchQuery || undefined,
            status: statusFilter === 'all' ? undefined : statusFilter,
            priority: priorityFilter === 'all' ? undefined : priorityFilter,
          },
        });
        setTickets(request.data.tickets);
        setTotal(request.data.total);
      } catch {
        return;
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [currentPage, statusFilter, priorityFilter, searchQuery]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const updateParams = UseUpdateParams({ setLoading, setSearchParams });

  useEffect(() => {
    if (inputValue === searchQuery) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const timeout = setTimeout(() => {
      updateParams({
        page: '1',
        querySearch: inputValue,
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, [setSearchParams, inputValue, searchQuery, updateParams]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputValue(searchQuery);
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tickets</h1>
          <p className="text-muted-foreground">
            Gerencie todos os tickets do sistema
          </p>
        </div>
        <Button onClick={() => setIsModelOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Ticket
        </Button>
      </div>
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-muted-foreground absolute top-1/2 left-5 -translate-1/2" />
          <Input
            className="pl-9"
            placeholder="Buscar por título ou ID..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <div className="flex gap-3 min-w-0">
          <Select
            value={statusFilter}
            onValueChange={(v: TicketStatus | 'all') => {
              updateParams({ status: v, page: '1' });
            }}
          >
            <SelectTrigger className="flex-1 truncate md:min-w-50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value={TICKET_STATUS.OPEN}>Aberto</SelectItem>
              <SelectItem value={TICKET_STATUS.INPROGRESS}>
                Em Progresso
              </SelectItem>
              <SelectItem value={TICKET_STATUS.CLOSED}>Fechado</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={priorityFilter}
            onValueChange={(v: TicketPriority | 'all') =>
              updateParams({ priority: v, page: '1' })
            }
          >
            <SelectTrigger className="flex-1 truncate md:min-w-50">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as prioridades</SelectItem>
              <SelectItem value={TICKET_PRIORITY.LOW}>Baixa</SelectItem>
              <SelectItem value={TICKET_PRIORITY.MEDIUM}>Média</SelectItem>
              <SelectItem value={TICKET_PRIORITY.HIGH}>Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24">
                  <Loading />
                </TableCell>
              </TableRow>
            ) : tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum ticket encontrado.
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>
                    <div className="max-w-75 sm:max-w-100  md:max-w-175 truncate">
                      {ticket.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={ticket.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={ticket.priority} />
                  </TableCell>

                  <TableCell>
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button className="px-0" variant="ghost" size="sm" asChild>
                      <Link to={`/tickets/${ticket.id}`}>Ver detalhes</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center border-t border-border px-4 py-3 text-sm text-muted-foreground">
          <p>
            Mostrando {total === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}{' '}
            a {Math.min(currentPage * ITEMS_PER_PAGE, total)} de {total} tickets
          </p>
          <div className="flex gap-2 items-center justify-center">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                updateParams({ page: Math.max(1, currentPage - 1).toString() })
              }
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h4 w-4 text-foreground" />
            </Button>
            <span>
              Página {currentPage} de {totalPages === 0 ? 1 : totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                updateParams({
                  page: Math.min(totalPages, currentPage + 1).toString(),
                })
              }
              disabled={currentPage >= totalPages || totalPages === 0}
            >
              <ChevronRight className="h4 w-4 text-foreground" />
            </Button>
          </div>
        </div>
      </div>
      <ModalTicket
        open={isModelOpen}
        onOpenChange={setIsModelOpen}
        onSuccess={(ticket) => handleTicketCreate(ticket as Ticket)}
      />
    </div>
  );
  function handleTicketCreate(ticket: Ticket) {
    if (
      (ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toString().includes(searchQuery)) &&
      (statusFilter === 'all' || statusFilter === ticket.status) &&
      (priorityFilter === 'all' || priorityFilter === ticket.priority) &&
      currentPage === 1
    ) {
      setTickets((prev) => {
        const newLIst = [ticket, ...prev];
        if (newLIst.length > ITEMS_PER_PAGE) {
          return newLIst.slice(0, -1);
        }
        return newLIst;
      });
      setTotal((prev) => prev + 1);
    } else {
      setSearchParams({});
    }
  }
}
