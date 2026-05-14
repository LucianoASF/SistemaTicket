import { Button } from '#components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '#components/ui/card';
import { Input } from '#components/ui/input';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '#components/ui/table';
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  Search,
  Shield,
  UserPlus,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { users as inicitialUsers } from '#lib/mock';
import { Badge } from '#components/ui/badge';
import { CustomAvatar } from '#components/CustomAvatar';

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

export function Users() {
  const [users, setUsers] = useState(inicitialUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const ITEMS_PER_PAGE = 5;
  const dataCards = [
    {
      title: 'Total de Usuários',
      value: 8, // vai vir da api
    },
    {
      title: 'Administradores',
      value: 4, // vai vir da api
    },
    {
      title: 'Suporte',
      value: 2, // vai vir da api
    },
    {
      title: 'Usuários',
      value: 2, // vai vir da api
    },
  ];

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === '' ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedTickets = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários do sistema
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-muted-foreground absolute top-1/2 left-5 -translate-1/2" />
          <Input
            className="pl-9"
            placeholder="Buscar por nome, ID, email ou função..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dataCards.map((data) => (
          <Card key={data.title} className="pb-8">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {data.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Funções</TableHead>

              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTickets.map((user) => {
                const roleConfig = roleLabels[user.role];
                return (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 max-w-75 sm:max-w-100  md:max-w-175 truncate">
                        <CustomAvatar name={user.name} />
                        {user.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 text-muted-foreground items-center">
                        <Mail className="h-4 w-4" /> {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={roleConfig.className}>
                        <Shield className="mr-1 h-3 w-3" />
                        {roleConfig.label}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Button
                        className="px-0"
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <Link to={`/usuarios/${user.id}`}>Ver detalhes</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center border-t border-border px-4 py-3 text-sm text-muted-foreground">
          <p>
            {' '}
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} de{' '}
            {filteredUsers.length} usuários
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
    </div>
  );
}
