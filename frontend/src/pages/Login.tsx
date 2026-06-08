import { Button } from '#components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#components/ui/card';
import { Input } from '#components/ui/input';
import { Label } from '#components/ui/label';
import { Eye, EyeOff, Ticket } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldGroup } from '#components/ui/field';

const loginSchema = z.object({
  email: z
    .email('Digite um email válido')
    .max(256, 'Email deve ter no máximo 256 caracteres'),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(60, 'Senha deve ter no máximo 60 caracteres')
    .regex(/[A-Z]/, 'A senha deve ter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'A senha deve ter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'A senha deve ter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'A senha deve ter pelo menos um caractere especial'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export function Login() {
  const { login } = useAuth();
  const [showPassword, setShowPassord] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    await login(data.email, data.password);
  };

  return (
    <main className="h-screen flex items-center justify-center">
      <Card className="w-full max-w-md px-4">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-foreground">
            <Ticket className="h-6 w-6 text-background" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Bem-vindo de volta
          </CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <FieldGroup className="flex flex-col gap-6">
                <Field className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    autoComplete="email"
                    {...register('email')}
                  />
                  <FieldError>{errors.email?.message}</FieldError>
                </Field>
                <Field className="grid gap-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Sua senha"
                      autoComplete="current-password"
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
              </FieldGroup>
            </fieldset>
            <Button
              type="submit"
              className="mt-6 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Entrando...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
