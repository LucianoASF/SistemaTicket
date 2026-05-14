import { cn } from '#lib/utils.ts';
import { Avatar, AvatarFallback } from './ui/avatar';

interface CustomAvatarPrps {
  name: string;
  large?: boolean;
  secondary?: boolean;
}

export function CustomAvatar({
  name,
  large = false,
  secondary = false,
}: CustomAvatarPrps) {
  const parts = name.split(' ');

  const firstName = parts[0];
  const lastName = parts[parts.length - 1];
  return (
    <Avatar className={large ? 'h-16 w-16' : 'h-8 w-8'}>
      <AvatarFallback
        className={cn(
          secondary
            ? 'bg-secondary text-secondary-foreground'
            : 'bg-sidebar-primary text-sidebar-primary-foreground',
          large ? 'text-xl' : 'text=xs',
        )}
      >
        {firstName[0]}
        {lastName[0]}
      </AvatarFallback>
    </Avatar>
  );
}
