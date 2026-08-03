import { EyeOff, Eye } from 'lucide-react';
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
import { useState } from 'react';
import type { User, UserForm } from '../../types/user';
import { useAuth } from '../../contexts/useAuth';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  modalUserSchema,
  type ModalUserFormInputs,
} from '../../schemas/modalUserSchema';
import { USER_ROLE } from '../../types/role';
import { api } from '../../axios/axios';
import { toast } from 'sonner';

interface ModalUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserForm;
  onSuccess: (user: User) => void;
}

export function ModalUser({
  open,
  onOpenChange,
  user,
  onSuccess,
}: ModalUserProps) {
  const isEditing = !!user;

  const [showPassword, setShowPassord] = useState(false);

  const auth = useAuth();
  const userRole = auth.user!.role;
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ModalUserFormInputs>({
    resolver: zodResolver(modalUserSchema),
    values: setValues(),
  });

  function setValues() {
    const baseValues = {
      isEditing: isEditing,
      userRole: userRole,
      name: user?.name || '',
      email: user?.email || '',
      password: user?.password || '',
    };
    if (user?.role === USER_ROLE.ADMIN) {
      return {
        ...baseValues,
        role: user?.role || '',
      };
    }
    return baseValues;
  }

  function handleCancel() {
    reset();
    onOpenChange(false);
  }

  async function onSubmit(data: ModalUserFormInputs) {
    const dataToSend: Omit<ModalUserFormInputs, 'isEditing' | 'userRole'> = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    };

    try {
      if (isEditing) {
        const response = await api.patch<User>(`/users/${data.id}`, dataToSend);
        onSuccess(response.data);
        toast.success('Usuário editado com sucesso', { position: 'top-right' });
      } else {
        const response = await api.post<User>('/users', dataToSend);
        onSuccess(response.data);
        toast.success('Usuário criado com sucesso', { position: 'top-right' });
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
            {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações para{' '}
            {isEditing ? 'editar o' : 'criar um novo'} usuário.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nome</FieldLabel>
                <Input
                  id="name"
                  placeholder="Digite o nome do usuário"
                  {...register('name')}
                />
                <FieldError>{errors.name?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  placeholder="Digite o email do usuário"
                  type="email"
                  {...register('email')}
                />
                <FieldError>{errors.email?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    {...register('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassord((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <FieldError>{errors.password?.message}</FieldError>
              </Field>

              <>
                {!isEditing && (
                  <Field>
                    <FieldLabel id="role">Função</FieldLabel>
                    <Controller
                      name="role"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value ?? ''}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="">
                            <SelectValue placeholder="Função" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={USER_ROLE.USER}>
                              Usuário
                            </SelectItem>
                            <SelectItem value={USER_ROLE.SUPPORT}>
                              Suporte
                            </SelectItem>
                            <SelectItem value={USER_ROLE.ADMIN}>
                              Administrador
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError>{errors.userRole?.message}</FieldError>
                  </Field>
                )}
              </>
            </FieldGroup>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button disabled={isSubmitting}>
                {isEditing ? 'Salvar Alterações' : 'Criar Usuário'}
              </Button>
            </DialogFooter>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
}
