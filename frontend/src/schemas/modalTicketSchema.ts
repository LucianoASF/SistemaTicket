import z from 'zod';
import { USER_ROLE } from '../types/role';
import { TICKET_STATUS, TICKET_PRIORITY } from '../types/ticket';

const ticketObject = z.object({
  userRole: z.enum(USER_ROLE),
  isEditing: z.boolean(),
  title: z
    .string()
    .min(5, 'O Título deve ter no mínimo 5 caracteres')
    .max(200, 'O Título deve ter no máximo 200 caracteres'),
  description: z
    .string()
    .min(10, 'A descrição deve ter no mínimo 10 caracteres'),
  assignedToId: z.string().nullable().optional(),
  status: z.enum(TICKET_STATUS, { message: 'Status inválido' }).optional(),
  priority: z
    .enum(TICKET_PRIORITY, { message: 'Prioridade inválida' })
    .optional(),
});

type TicketData = z.infer<typeof ticketObject>;

function validateStatusOnCreation(data: TicketData, ctx: z.RefinementCtx) {
  if (data.status !== undefined) {
    ctx.addIssue({
      code: 'custom',
      message: 'O status não pode ser definido manualmente ao criar o ticket.',
      path: ['status'],
    });
  }
}

function checkIfStatusIsUndefined(data: TicketData, ctx: z.RefinementCtx) {
  if (data.status !== undefined) {
    ctx.addIssue({
      code: 'custom',
      message: 'Você não tem permissão para definir o status.',
      path: ['status'],
    });
  }
}

function checkIfPriorityIsUndefined(data: TicketData, ctx: z.RefinementCtx) {
  if (data.priority !== undefined) {
    ctx.addIssue({
      code: 'custom',
      message: 'Você não tem permissão para definir a prioridade.',
      path: ['priority'],
    });
  }
}

function checkIfAssignedToIdIsUndefined(
  data: TicketData,
  ctx: z.RefinementCtx,
) {
  if (data.assignedToId !== undefined) {
    ctx.addIssue({
      code: 'custom',
      message: 'Você não tem permissão para definir quem vai ser atribuído.',
      path: ['assignedToId'],
    });
  }
}

function checkIfStatusIsFilledIn(data: TicketData, ctx: z.RefinementCtx) {
  if (data.status === undefined) {
    ctx.addIssue({
      code: 'custom',
      message: 'O status é obrigatório.',
      path: ['status'],
    });
  }
}
function checkIfPriorityIsFilledIn(data: TicketData, ctx: z.RefinementCtx) {
  if (data.priority === undefined) {
    ctx.addIssue({
      code: 'custom',
      message: 'A prioridade é obrigatória.',
      path: ['priority'],
    });
  }
}

function validade(data: TicketData, ctx: z.RefinementCtx) {
  if (data.isEditing) {
    if (data.userRole === USER_ROLE.USER) {
      checkIfStatusIsUndefined(data, ctx);
      checkIfPriorityIsUndefined(data, ctx);
      checkIfAssignedToIdIsUndefined(data, ctx);
    } else if (data.userRole === USER_ROLE.SUPPORT) {
      checkIfAssignedToIdIsUndefined(data, ctx);
      checkIfStatusIsFilledIn(data, ctx);
      checkIfPriorityIsFilledIn(data, ctx);
    } else {
      checkIfStatusIsFilledIn(data, ctx);
      checkIfPriorityIsFilledIn(data, ctx);
    }
  } else {
    validateStatusOnCreation(data, ctx);
    if (data.userRole === USER_ROLE.USER) {
      checkIfPriorityIsUndefined(data, ctx);
      checkIfAssignedToIdIsUndefined(data, ctx);
    } else if (data.userRole === USER_ROLE.SUPPORT) {
      checkIfAssignedToIdIsUndefined(data, ctx);
    }
  }
}

export const modalTicketSchema = ticketObject.superRefine((data, ctx) => {
  validade(data, ctx);
});

export type ModalTicketFormInputs = z.infer<typeof modalTicketSchema>;
