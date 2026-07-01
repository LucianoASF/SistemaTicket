import { Link } from 'react-router';
import { Button } from './ui/button';
import { cn } from '#lib/utils.ts';

type ErrorType = 'access denied' | 'not found';

interface AccessDeniedOrNotFoundProps {
  error: ErrorType;
  to: string;
  pText: string;
  linkText: string;
  notFoundMessage?: string;
}

export function AccessDeniedOrNotFound({
  error,
  pText,
  to,
  linkText,
  notFoundMessage,
}: AccessDeniedOrNotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1
        className={cn(
          'text-2xl font-bold',
          error === 'access denied' && 'text-destructive',
        )}
      >
        {error === 'access denied'
          ? 'Acesso negado'
          : error === 'not found'
            ? notFoundMessage
            : 'Não encontrado'}
      </h1>
      <p className="mt-2 text-muted-foreground">{pText}</p>
      <Button asChild className="mt-4">
        <Link to={to}>{linkText}</Link>
      </Button>
    </div>
  );
}
