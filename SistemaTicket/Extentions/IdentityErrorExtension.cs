using Microsoft.AspNetCore.Identity;

namespace SistemaTicket.Extentions;

public static class IdentityErrorExtension
{
    public static string ToFieldName(this IdentityError error)
    {
        return error.Code switch
        {
            "DuplicateEmail" or "InvalidEmail" => "Email",

            "PasswordTooShort" or "PasswordRequiresDigit" or
            "PasswordRequiresUpper" or "PasswordRequiresLower" or
            "PasswordRequiresNonAlphanumeric" or "PasswordRequiresUniqueChars" or
            "PasswordMismatch" or "UserAlreadyHasPassword" => "Password",

            "InvalidUserName" or "DuplicateUserName" => "Username",

            "InvalidRoleName" or "DuplicateRoleName" or
            "UserAlreadyInRole" or "UserNotInRole" => "Role",

            "InvalidToken" or "RecoveryCodeRedemptionFailed" or
            "UserLockoutNotEnabled" => "Security_auth",

            "ConcurrencyFailure" => "System_concurrency",
            "LoginAlreadyAssociated" => "External_account",

            _ => "General"
        };
    }
}
