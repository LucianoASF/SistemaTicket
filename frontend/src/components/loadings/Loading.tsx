import { Spinner } from '#components/ui/spinner';
import { cn } from '#lib/utils.ts';

type Variant = 'page' | 'inline';

interface LoadingProps {
  variant?: Variant;
}

export function Loading({ variant = 'inline' }: LoadingProps) {
  return (
    <div
      className={cn(
        'flex justify-center items-center gap-2 text-muted-foreground',
        variant === 'page' && 'h-full',
      )}
    >
      <Spinner className={variant === 'page' ? 'size-6' : 'size-4'} />
      <p className={variant === 'page' ? 'text-md' : 'text-sm'}>
        {variant === 'page' ? 'Carregando Página...' : 'Carregando...'}
      </p>
    </div>
  );
}
