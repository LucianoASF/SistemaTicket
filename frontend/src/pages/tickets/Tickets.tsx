import { PriorityBadge } from '#components/badges/PriorityBadge';
import { StatusBadge } from '#components/badges/StatusBadge';
import { ModalTicket } from '#components/ModalTicket';
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
import { tickets as inicitialTickets } from '#lib/mock';
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

const ITEMS_PER_PAGE = 5;

export function Tickets() {
  const [tickets, setTickets] = useState(inicitialTickets);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModelOpen, setIsModelOpen] = useState(false);

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus =
      statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority =
      priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesSearch =
      searchQuery === '' ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3 min-w-0">
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="flex-1 truncate md:min-w-50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="open">Aberto</SelectItem>
              <SelectItem value="in-progress">Em Progresso</SelectItem>
              <SelectItem value="closed">Fechado</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={priorityFilter}
            onValueChange={(v) => {
              setPriorityFilter(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="flex-1 truncate md:min-w-50">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as prioridades</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
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
            {paginatedTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum ticket encontrado.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTickets.map((ticket) => (
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
                    {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
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
            {' '}
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredTickets.length)} de{' '}
            {filteredTickets.length} tickets
          </p>
          <div className="flex gap-2 items-center justify-center">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              {' '}
              <ChevronLeft className="h4 w-4 text-foreground" />
            </Button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h4 w-4 text-foreground" />
            </Button>
          </div>
        </div>
      </div>
      <ModalTicket open={isModelOpen} onOpenChange={setIsModelOpen} />
    </div>
  );
}
