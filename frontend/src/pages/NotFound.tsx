import { Button } from '#components/ui/button';
import { FileQuestion, LogIn, Monitor, Ticket } from 'lucide-react';
import { useAuth } from '../contexts/useAuth';
import { Link } from 'react-router';
import { USER_ROLE } from '../types/role';

export function NotFound() {
  const { user } = useAuth();
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-6 items-center text-center max-w-md px-5">
        <div className="flex items-center gap-2">
          <div className="bg-foreground rounded-lg size-10 flex items-center justify-center">
            <Ticket className="text-background" />
          </div>
          <span className="font-semibold text-xl">Sistema de Tickets</span>
        </div>
        <div className="bg-muted size-24 rounded-full flex items-center justify-center">
          <FileQuestion className="size-12 text-muted-foreground" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold">404</h1>
          <h2 className="text-xl font-semibold">Página não encontrada</h2>
          <p className="text-muted-foreground">
            Ops! A página que você está procurando não existe ou foi movida.
            Verifique o endereço ou volte para a página inicial.
          </p>
        </div>
        <Button className="w-[75%]" asChild>
          {user ? (
            user.role === USER_ROLE.USER ? (
              <Link to={`/users/${user.id}`} replace>
                <Monitor /> Ir Para o Início
              </Link>
            ) : (
              <Link to="/dashboard" replace>
                <Monitor /> Ir Para o Início
              </Link>
            )
          ) : (
            <Link to="/login" replace>
              <LogIn />
              Fazer Login
            </Link>
          )}
        </Button>
      </div>
    </div>
  );
}
