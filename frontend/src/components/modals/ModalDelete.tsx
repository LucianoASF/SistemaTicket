import { Button } from '#components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#components/ui/dialog';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface ModalDeleteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  deleteFunction: () => void;
}

export function ModalDelete({
  open,
  onOpenChange,
  title,
  deleteFunction,
}: ModalDeleteProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center size-12 rounded-full bg-destructive/10">
            <AlertTriangle className="size-6 text-destructive" />
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground text-center">
            Tem certeza que deseja excluir este item? Esta acao nao pode ser
            desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              deleteFunction();
              onOpenChange(false);
            }}
          >
            <Trash2 /> Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
