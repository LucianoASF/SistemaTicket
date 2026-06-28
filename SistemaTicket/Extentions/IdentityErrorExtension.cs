using Microsoft.AspNetCore.Identity;

namespace SistemaTicket.Extentions;

public static class IdentityErrorExtension
{
    public static string ToPortugueseMessage(this IdentityError error)
    {
        return error.Code switch
        {
            "DuplicateEmail" => "Este email já está em uso.",
            "InvalidEmail" => "O email informado é inválido.",

            "PasswordTooShort" => "A senha é muito curta.",
            "PasswordRequiresDigit" => "A senha deve conter pelo menos um número.",
            "PasswordRequiresUpper" => "A senha deve conter pelo menos uma letra maiúscula.",
            "PasswordRequiresLower" => "A senha deve conter pelo menos uma letra minúscula.",
            "PasswordRequiresNonAlphanumeric" => "A senha deve conter pelo menos um caractere especial.",
            "PasswordRequiresUniqueChars" => "A senha deve conter caracteres únicos suficientes.",
            "PasswordMismatch" => "A senha informada está incorreta.",
            "UserAlreadyHasPassword" => "O usuário já possui uma senha cadastrada.",

            "InvalidUserName" => "O email informado é inválido.",
            "DuplicateUserName" => "Este email já está em uso.",

            "InvalidRoleName" => "O nome da função é inválido.",
            "DuplicateRoleName" => "Já existe uma função com esse nome.",
            "UserAlreadyInRole" => "O usuário já pertence a essa função.",
            "UserNotInRole" => "O usuário não pertence a essa função.",

            "InvalidToken" => "O token informado é inválido.",
            "RecoveryCodeRedemptionFailed" => "O código de recuperação é inválido ou já foi utilizado.",
            "UserLockoutNotEnabled" => "O bloqueio de usuário não está habilitado.",

            "ConcurrencyFailure" => "O registro foi alterado por outro usuário. Tente novamente.",
            "LoginAlreadyAssociated" => "Este login externo já está associado a outra conta.",

            "DefaultError" => "Ocorreu um erro ao processar a solicitação.",

            _ => error.Description
        };
    }

}

