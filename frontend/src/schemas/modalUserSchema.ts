import z from 'zod';
import { USER_ROLE } from '../types/role';

const userObject = z.object({
  userRole: z.enum(USER_ROLE),
  isEditing: z.boolean(),
  id: z.string().optional(),
  name: z
    .string()
    .min(5, 'O nome deve ter no mínimo 5 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  email: z
    .email('Digite um email válido')
    .max(256, 'Email deve ter no máximo 256 caracteres'),
  password: z
    .string()
    .min(6, 'A Senha deve ter pelo menos 6 caracteres')
    .max(60, 'A Senha deve ter no máximo 60 caracteres')
    .regex(/[A-Z]/, 'A senha deve ter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'A senha deve ter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'A senha deve ter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'A senha deve ter pelo menos um caractere especial')
    .optional(),
  role: z.enum(USER_ROLE).nullable().optional(),
});

type UserData = z.infer<typeof userObject>;

function checkIfRoleIsUndefined(data: UserData, ctx: z.RefinementCtx) {
  if (data.role !== undefined) {
    ctx.addIssue({
      code: 'custom',
      message: 'Você não tem permissão para definir o seu papel.',
      path: ['role'],
    });
  }
}
function checkIfIdIsUndefined(data: UserData, ctx: z.RefinementCtx) {
  if (data.id !== undefined) {
    ctx.addIssue({
      code: 'custom',
      message: 'Na criação do usuário o id não pode estar defininido.',
      path: ['id'],
    });
  }
}
function checkIfIdIsDefined(data: UserData, ctx: z.RefinementCtx) {
  if (data.id === undefined) {
    ctx.addIssue({
      code: 'custom',
      message: 'Na edição do usuário o id deve estar defininido.',
      path: ['id'],
    });
  }
}
function checkIfPassordIsDefined(data: UserData, ctx: z.RefinementCtx) {
  if (data.password === undefined) {
    ctx.addIssue({
      code: 'custom',
      message: 'A senha é obrigatória.',
      path: ['password'],
    });
  }
}

function validade(data: UserData, ctx: z.RefinementCtx) {
  if (data.isEditing) {
    if (data.userRole !== USER_ROLE.ADMIN) {
      checkIfRoleIsUndefined(data, ctx);
    }
    checkIfIdIsDefined(data, ctx);
  } else {
    if (data.userRole !== USER_ROLE.ADMIN) {
      ctx.addIssue({
        code: 'custom',
        message: 'Você não tem permissão para realizar esta ação.',
      });
    }
    checkIfIdIsUndefined(data, ctx);
    checkIfPassordIsDefined(data, ctx);
  }
}

export const modalUserSchema = userObject.superRefine((data, ctx) => {
  validade(data, ctx);
});

export type ModalUserFormInputs = z.infer<typeof modalUserSchema>;
