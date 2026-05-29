import { Ticket } from 'lucide-react';
import { Spinner } from '../ui/spinner';

export function LoadingAuth() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="size-10 rounded-lg bg-foreground flex items-center justify-center">
            <Ticket color="white" />
          </div>
          <span className="text-xl font-semibold text-foreground">
            Sistema de Tickets
          </span>
        </div>
        <Spinner className="size-6 text-primary" />
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}
