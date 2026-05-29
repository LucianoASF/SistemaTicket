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
  UserPlus,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { CustomAvatar } from '#components/CustomAvatar';
import { ModalUser } from '#components/ModalUser';
import { api } from '#lib/axios.ts';
import type { PagedUsers } from '../../types/user';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#components/ui/select';
import { USER_ROLE, type UserRole } from '../../types/role';
import { RoleBadge } from '#components/badges/RoleBadge';
import { UseUpdateParams } from '#hooks/useUpdateParams';
import { Loading } from '#components/loadings/Loading';

export function Users() {
  const [searchParams, setSearchParams] = useSearchParams();
  const roleFilter = searchParams.get('role') || '';
  const searchQuery = searchParams.get('searchQuery') || '';
  const currentPage = Number(searchParams.get('page') || 1);
  const inactives = searchParams.get('inactives') || '';

  const [data, setData] = useState<PagedUsers>({
    users: [],
    roleCounts: { admin: 0, support: 0, user: 0 },
    total: 0,
  });
  const [inputQuery, setInputQuery] = useState('');

  const [isModelOpen, setIsModelOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await api.get<PagedUsers>('/users', {
        params: {
          page: currentPage,
          searchQuery: searchQuery || undefined,
          role: roleFilter === 'all' ? undefined : roleFilter || undefined,
          inactives: inactives === 'all' ? undefined : inactives || undefined,
        },
      });
      setData(response.data);
      setLoading(false);
    };
    fetchUsers();
  }, [currentPage, inactives, roleFilter, searchQuery]);

  const updateParams = UseUpdateParams({ setLoading, setSearchParams });

  useEffect(() => {
    if (inputQuery === searchQuery) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const timeout = setTimeout(() => {
      updateParams({
        page: '1',
        searchQuery: inputQuery,
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, [setSearchParams, inputQuery, searchQuery, updateParams]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputQuery(searchQuery);
  }, [searchQuery]);

  const dataCards = [
    {
      title: 'Total de Usuários',
      value: data.total,
    },
    {
      title: 'Administradores',
      value: data.roleCounts.admin,
    },
    {
      title: 'Suporte',
      value: data.roleCounts.support,
    },
    {
      title: 'Usuários',
      value: data.roleCounts.user,
    },
  ];

  const totalPages = Math.ceil(data.total / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários do sistema
          </p>
        </div>
        <Button onClick={() => setIsModelOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-muted-foreground absolute top-1/2 left-5 -translate-1/2" />
          <Input
            className="pl-9"
            placeholder="Buscar por nome, ID, email..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3 min-w-0">
          <Select
            value={roleFilter}
            onValueChange={(v: UserRole | 'all') => {
              updateParams({ role: v, page: '1' });
            }}
          >
            <SelectTrigger className="flex-1 truncate md:min-w-50">
              <SelectValue placeholder="Função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as funções</SelectItem>
              <SelectItem value={USER_ROLE.ADMIN}>Admin</SelectItem>
              <SelectItem value={USER_ROLE.SUPPORT}>Support</SelectItem>
              <SelectItem value={USER_ROLE.USER}>User</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={inactives}
            onValueChange={(v) => {
              updateParams({ inactives: v, page: '1' });
            }}
          >
            <SelectTrigger className="flex-1 truncate md:min-w-50">
              <SelectValue placeholder="Usuários" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas os usuários</SelectItem>
              <SelectItem value="false">Ativo</SelectItem>
              <SelectItem value="true">Inativo</SelectItem>
            </SelectContent>
          </Select>
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
              {loading ? (
                <Loading />
              ) : (
                <div className="text-3xl font-bold">{data.value}</div>
              )}
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24">
                  <Loading />
                </TableCell>
              </TableRow>
            ) : data.users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              data.users.map((user) => (
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
                    <RoleBadge role={user.role} />
                  </TableCell>

                  <TableCell>
                    <Button className="px-0" variant="ghost" size="sm" asChild>
                      <Link to={`/users/${user.id}`}>Ver detalhes</Link>
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
            {Math.min(currentPage * ITEMS_PER_PAGE, data.users.length)} de{' '}
            {data.users.length} usuários
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
      <ModalUser open={isModelOpen} onOpenChange={setIsModelOpen} />
    </div>
  );
}
