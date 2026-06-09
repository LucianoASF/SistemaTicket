import { Controller, useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import {
  TICKET_PRIORITY,
  TICKET_STATUS,
  type Ticket,
  type TicketDetails,
} from '../../types/ticket';
import {
  type ModalTicketFormInputs,
  modalTicketSchema,
} from '../../schemas/modalTicketSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../contexts/useAuth';
import { api } from '../../axios/axios';
import { toast } from 'sonner';
import { USER_ROLE } from '../../types/role';
import { UserCombobox } from '#components/UserCombobox';
import { useEffect, useState } from 'react';
import type { User } from '../../types/user';

interface ModalTicketProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket?: Ticket;
  onSuccess: (ticket: Ticket | TicketDetails) => void;
}

export function ModalTicket({
  open,
  onOpenChange,
  ticket,
  onSuccess,
}: ModalTicketProps) {
  const [users, setUsers] = useState<User[]>([]);
  const isEditing = !!ticket;
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ModalTicketFormInputs>({
    resolver: zodResolver(modalTicketSchema),
    values: setValues(),
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (user?.role !== USER_ROLE.ADMIN) return;
        setLoading(true);
        const response = await api.get<User[]>('/users/options', {
          params: {
            searchQuery: searchQuery || undefined,
          },
        });
        setUsers(response.data);
      } catch {
        return;
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [searchQuery, user?.role]);

  function setValues() {
    const baseValues = {
      isEditing: isEditing,
      userRole: user!.role,
      title: ticket?.title || '',
      description: ticket?.description || '',
    };
    if (user?.role === USER_ROLE.ADMIN) {
      return {
        ...baseValues,
        status: ticket?.status,
        priority: ticket?.priority,
        assignedToId: ticket?.assignedToId,
      };
    }
    if (user?.role === USER_ROLE.SUPPORT) {
      return {
        ...baseValues,
        status: ticket?.status,
        priority: ticket?.priority,
      };
    }
    if (user?.role === USER_ROLE.USER) {
      return baseValues;
    }
  }

  function handleCancel() {
    reset();
    onOpenChange(false);
    setSearchQuery('');
  }

  async function onSubmit(data: ModalTicketFormInputs) {
    const dataToSend: Omit<ModalTicketFormInputs, 'isEditing' | 'userRole'> = {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assignedToId: data.assignedToId,
    };

    try {
      if (isEditing) {
        const response = await api.patch<TicketDetails>(
          `/tickets/${ticket.id}`,
          dataToSend,
        );
        onSuccess(response.data);
        toast.success('Ticket editado com sucesso', { position: 'top-right' });
      } else {
        const response = await api.post<Ticket>('/tickets', dataToSend);
        onSuccess(response.data);
        toast.success('Ticket criado com sucesso', { position: 'top-right' });
      }
      handleCancel();
    } catch {
      return;
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Ticket' : 'Novo Ticket'}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações para{' '}
            {isEditing ? 'editar o Ticket' : 'criar novo Ticket'}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Título</FieldLabel>
                <Input
                  id="title"
                  placeholder="Descreva o problema brevemente"
                  {...register('title')}
                />
                <FieldError>{errors.title?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Descrição</FieldLabel>
                <Textarea
                  id="description"
                  placeholder="Forneça mais detalhes sobre o problema..."
                  cols={4}
                  {...register('description')}
                />
                <FieldError>{errors.description?.message}</FieldError>
              </Field>
              {user?.role !== USER_ROLE.USER && (
                <div className={isEditing ? 'grid sm:grid-cols-2 gap-3' : ''}>
                  {isEditing && (
                    <Field>
                      <FieldLabel id="status">Status</FieldLabel>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value ?? ''}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={TICKET_STATUS.OPEN}>
                                Aberto
                              </SelectItem>
                              <SelectItem value={TICKET_STATUS.INPROGRESS}>
                                Em Progresso
                              </SelectItem>
                              <SelectItem value={TICKET_STATUS.CLOSED}>
                                Fechado
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </Field>
                  )}
                  <Field>
                    <FieldLabel id="priority">Prioridade</FieldLabel>
                    <Controller
                      name="priority"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value ?? ''}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Prioridade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={TICKET_PRIORITY.LOW}>
                              Baixa
                            </SelectItem>
                            <SelectItem value={TICKET_PRIORITY.MEDIUM}>
                              Média
                            </SelectItem>
                            <SelectItem value={TICKET_PRIORITY.HIGH}>
                              Alta
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                </div>
              )}
              {user?.role === USER_ROLE.ADMIN && (
                <Field>
                  <FieldLabel id="assignedToId">Usuário atribuído</FieldLabel>
                  <Controller
                    name="assignedToId"
                    control={control}
                    render={({ field }) => (
                      <UserCombobox
                        users={users}
                        value={field.value}
                        loading={loading}
                        searchQuery={searchQuery}
                        onSelectChange={field.onChange}
                        setSearchQuery={setSearchQuery}
                      />
                    )}
                  />
                  <FieldError>{errors.assignedToId?.message}</FieldError>
                </Field>
              )}
            </FieldGroup>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button disabled={isSubmitting}>
                {isEditing ? 'Editar' : 'Criar'} Ticket
              </Button>
            </DialogFooter>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
}
