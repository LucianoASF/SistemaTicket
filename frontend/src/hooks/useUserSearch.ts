import { useEffect, useState } from 'react';
import { api } from '../axios/axios';
import type { User } from '../types/user';
import { useAuth } from '../contexts/useAuth';
import type { Params } from '../types/params';
import { USER_ROLE } from '../types/role';
import type { SetURLSearchParams } from 'react-router';

type GetById = 'createdById' | 'assignedToId';

export function useUserSearch(
  url?: string,
  searchQueryName: string = 'searchQuery',
  specificParams?: Params,
  getById?: GetById,
  SetSearchParams?: SetURLSearchParams,
) {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (
          !user ||
          !url ||
          (url === '/users/options' && user.role !== USER_ROLE.ADMIN) ||
          (url === '/users/ticket-related-users-creators' &&
            (!specificParams?.assignedToId ||
              specificParams?.assignedToId !== user.id) &&
            user.role !== USER_ROLE.ADMIN) ||
          (url === '/users/ticket-related-users-assigneds' &&
            (!specificParams?.createdById ||
              specificParams?.createdById !== user.id) &&
            user.role !== USER_ROLE.ADMIN)
        )
          return;
        setLoading(true);
        const isById =
          (getById === 'createdById' && specificParams?.createdById) ||
          (getById === 'assignedToId' && specificParams?.assignedToId);

        if (isById && users.length === 0) {
          const response = await api.get<User>(url);
          setUsers([response.data]);
        } else {
          const response = await api.get<User[]>(url, {
            params: {
              [searchQueryName]: searchQuery || undefined,
              ...specificParams,
            },
          });

          if (Array.isArray(response.data)) {
            setUsers(response.data);
          } else {
            setUsers([response.data]);
          }
        }
      } catch {
        if (SetSearchParams) SetSearchParams(new URLSearchParams());
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [
    SetSearchParams,
    getById,
    searchQuery,
    searchQueryName,
    specificParams,
    url,
    user,
    users.length,
  ]);

  return { users, loading, searchQuery, setSearchQuery };
}
