import { Avatar, AvatarFallback } from './ui/avatar';

interface CustomAvatarPrps {
  name: string;
}

export function CustomAvatar({ name }: CustomAvatarPrps) {
  const parts = name.split(' ');

  const firstName = parts[0];
  const lastName = parts[parts.length - 1];
  return (
    <Avatar className="h-8 w-8">
      <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
        {firstName[0]}
        {lastName[0]}
      </AvatarFallback>
    </Avatar>
  );
}
