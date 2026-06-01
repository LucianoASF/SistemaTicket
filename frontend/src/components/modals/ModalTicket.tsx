import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Field, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';

interface ModalTicketProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket?: object;
}

export function ModalTicket({ open, onOpenChange, ticket }: ModalTicketProps) {
  const isEditing = !!ticket;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Ticket' : 'Novo Ticket'}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações para criar um novo ticket.
          </DialogDescription>
        </DialogHeader>
        <form>
          <fieldset>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Título</FieldLabel>
                <Input
                  id="tiitle"
                  placeholder="Descreva o problema brevemente"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Descrição</FieldLabel>
                <Textarea
                  id="description"
                  placeholder="Forneça mais detalhes sobre o problema..."
                  cols={4}
                />
              </Field>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field>
                  <FieldLabel id="status">Status</FieldLabel>
                  <Select>
                    <SelectTrigger className="">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Aberto</SelectItem>
                      <SelectItem value="in-progress">Em Progresso</SelectItem>
                      <SelectItem value="closed">Fechado</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel id="priority">Prioridade</FieldLabel>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </FieldGroup>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button>Criar Ticket</Button>
            </DialogFooter>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
}
