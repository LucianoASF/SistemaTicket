import { useEffect, useState } from 'react';
import { api } from '../axios/axios';
import type { User } from '../types/user';
import { useAuth } from '../contexts/useAuth';
import { USER_ROLE } from '../types/role';
import type { Params } from '../types/params';

export function useUserSearch(
  url: string,
  searchQueryName: string = 'searchQuery',
  specificParams?: Params,
) {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!user) return;
        setLoading(true);
        if (
          USER_ROLE.ADMIN === user.role ||
          (user.id === specificParams?.assignedToId &&
            user.role === USER_ROLE.SUPPORT) ||
          specificParams?.createdById == user.id
        ) {
          console.log('teste');
          const response = await api.get<User[]>(url, {
            params: {
              [searchQueryName]: searchQuery || undefined,
              ...specificParams,
            },
          });
          setUsers(response.data);
        }
      } catch {
        return;
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [searchQuery, searchQueryName, specificParams, url, user]);

  return { users, loading, searchQuery, setSearchQuery };
}
