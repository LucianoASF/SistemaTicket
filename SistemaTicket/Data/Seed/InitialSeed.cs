using Microsoft.AspNetCore.Identity;
using SistemaTicket.Entities;
using SistemaTicket.Enums;

namespace SistemaTicket.Data.Seed;

public static class SeedData
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        await SeedAdminAsync(userManager);
    }
    private static async Task SeedAdminAsync(UserManager<ApplicationUser> userManager)
    {
        var adminEmail = "admin@system.com";
        var supportEmail = "support@system.com";
        var userEmail = "user@system.com";

        var admin = await userManager.FindByEmailAsync(adminEmail);
        var support = await userManager.FindByEmailAsync(supportEmail);
        var user = await userManager.FindByEmailAsync(userEmail);

        if (admin == null)
        {
            admin = new ApplicationUser
            {
                UserName = adminEmail,
                Name = "SystemAdmin",
                Email = adminEmail,
                EmailConfirmed = true,
                Role = UserRole.Admin,
                CreatedAt = DateTimeOffset.UtcNow,
            };

            var result = await userManager.CreateAsync(admin, "Admin@123");
        }
        if (support == null)
        {
            support = new ApplicationUser
            {
                UserName = supportEmail,
                Name = "SystemSupport",
                Email = supportEmail,
                EmailConfirmed = true,
                Role = UserRole.Support,
                CreatedAt = DateTimeOffset.UtcNow,
            };

            var result = await userManager.CreateAsync(support, "Support@123");
        }
        if (user == null)
        {
            user = new ApplicationUser
            {
                UserName = userEmail,
                Name = "SystemUser",
                Email = userEmail,
                EmailConfirmed = true,
                Role = UserRole.User,
                CreatedAt = DateTimeOffset.UtcNow,
            };

            var result = await userManager.CreateAsync(user, "User@123");
        }
    }
}