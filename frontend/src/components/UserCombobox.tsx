import { useState } from 'react';
import type { User } from '../types/user';
import { RoleBadge } from './badges/RoleBadge';
import { CustomAvatar } from './CustomAvatar';
import { Loading } from './loadings/Loading';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { ChevronsUpDown, X } from 'lucide-react';
import { cn } from '#lib/utils.ts';

interface UserComboboxProps {
  users: User[];
  value?: string;
  loading: boolean;
  searchQuery: string;
  onSelectChange: (userId: string | null) => void;
  setSearchQuery: (searchQuery: string) => void;
}

export function UserCombobox({
  users,
  value,
  loading,
  searchQuery,
  onSelectChange,
  setSearchQuery,
}: UserComboboxProps) {
  const [open, setOpen] = useState(false);
  const [selectedUser, SetSelectedUser] = useState<User | null>(
    users.find((u) => u.id === value) || null,
  );

  function handleSelect(userId: string) {
    if (userId === value) {
      onSelectChange(null);
      SetSelectedUser(null);
    } else {
      onSelectChange(userId);
      SetSelectedUser(users.find((u) => u.id === userId) || null);
    }
    setOpen(false);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onSelectChange(null);
    SetSelectedUser(null);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-between',
            !selectedUser && 'text-muted-foreground',
          )}
        >
          {selectedUser ? (
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center gap-2">
                <CustomAvatar name={selectedUser.name} />
                <span>{selectedUser.name}</span>
              </div>

              <div className="flex items-center gap-1">
                <span onClick={handleClear}>
                  <X />
                </span>
                <ChevronsUpDown />
              </div>
            </div>
          ) : (
            <div className="w-full  flex items-center justify-between">
              Selecionar Usuário...
              <ChevronsUpDown />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            onValueChange={setSearchQuery}
            value={searchQuery}
            placeholder="Buscar usuário..."
          />
          <CommandList>
            <CommandEmpty>
              {loading ? <Loading /> : 'Nenhum usuário encontrado!'}
            </CommandEmpty>
            {users.map((user) => (
              <CommandItem
                key={user.id}
                onSelect={handleSelect}
                value={user.id}
              >
                <CustomAvatar name={user.name} />
                <div className="flex flex-col gap-1">
                  <div className="flex gap-2 items-center justify-center">
                    <span>{user.name}</span>
                    <RoleBadge variant="small" role={user.role} />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
