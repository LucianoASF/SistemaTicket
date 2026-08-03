using Microsoft.AspNetCore.Identity;
using SistemaTicket.Entities;
using SistemaTicket.Enums;

namespace SistemaTicket.Data.Seed;

public static class SeedData
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var context = serviceProvider.GetRequiredService<AppDbContext>();

        await SeedDataAsync(userManager, context);
    }
    private static async Task SeedDataAsync(
     UserManager<ApplicationUser> userManager,
     AppDbContext context)
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
                Name = "System Admin",
                Email = adminEmail,
                EmailConfirmed = true,
                Role = UserRole.Admin,
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-30),
                IsActive = true
            };

            await userManager.CreateAsync(admin, "Admin@123");
        }

        if (support == null)
        {
            support = new ApplicationUser
            {
                UserName = supportEmail,
                Name = "João Suporte",
                Email = supportEmail,
                EmailConfirmed = true,
                Role = UserRole.Support,
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-25),
                IsActive = true
            };

            await userManager.CreateAsync(support, "Support@123");
        }

        if (user == null)
        {
            user = new ApplicationUser
            {
                UserName = userEmail,
                Name = "Maria Usuária",
                Email = userEmail,
                EmailConfirmed = true,
                Role = UserRole.User,
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-20),
                IsActive = true
            };

            await userManager.CreateAsync(user, "User@123");
        }

        // Atualiza as referências
        admin = await userManager.FindByEmailAsync(adminEmail);
        support = await userManager.FindByEmailAsync(supportEmail);
        user = await userManager.FindByEmailAsync(userEmail);

        if (context.Tickets.Any())
            return;

        var tickets = new List<Ticket>
    {
        new()
        {
            Title = "Erro ao realizar login",
            Description = "Após informar usuário e senha, a aplicação retorna erro 500.",
            Status = TicketStatus.Open,
            Priority = TicketPriority.High,
            CreatedAt = DateTimeOffset.UtcNow.AddDays(-10),
            CreatedById = user!.Id,
            AssignedToId = support!.Id
        },
        new()
        {
            Title = "Botão salvar não funciona",
            Description = "O botão salvar permanece carregando indefinidamente.",
            Status = TicketStatus.InProgress,
            Priority = TicketPriority.Medium,
            CreatedAt = DateTimeOffset.UtcNow.AddDays(-8),
            CreatedById = user.Id,
            AssignedToId = support.Id
        },
        new()
        {
            Title = "Solicitação de nova funcionalidade",
            Description = "Adicionar exportação para PDF.",
            Status = TicketStatus.Open,
            Priority = TicketPriority.Low,
            CreatedAt = DateTimeOffset.UtcNow.AddDays(-6),
            CreatedById = user.Id
        },
        new()
        {
            Title = "Erro na geração de relatório",
            Description = "O relatório financeiro apresenta valores incorretos.",
            Status = TicketStatus.Closed,
            Priority = TicketPriority.High,
            CreatedAt = DateTimeOffset.UtcNow.AddDays(-15),
            CreatedById = user.Id,
            AssignedToId = support.Id
        },
        new()
        {
            Title = "Tela de usuários lenta",
            Description = "A listagem demora aproximadamente 10 segundos para carregar.",
            Status = TicketStatus.Closed,
            Priority = TicketPriority.Medium,
            CreatedAt = DateTimeOffset.UtcNow.AddDays(-18),
            CreatedById = admin!.Id,
            AssignedToId = support.Id
        }
    };

        context.Tickets.AddRange(tickets);
        await context.SaveChangesAsync();

        context.TicketComments.AddRange(
            new TicketComment
            {
                TicketId = tickets[0].Id,
                UserId = user.Id,
                Message = "O problema acontece em todos os navegadores.",
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-10)
            },
            new TicketComment
            {
                TicketId = tickets[0].Id,
                UserId = support.Id,
                Message = "Consegui reproduzir o erro. Estou investigando.",
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-9)
            },
            new TicketComment
            {
                TicketId = tickets[1].Id,
                UserId = support.Id,
                Message = "Verifiquei que o problema ocorre apenas em produção.",
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-7)
            },
            new TicketComment
            {
                TicketId = tickets[3].Id,
                UserId = support.Id,
                Message = "Correção aplicada e validada.",
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-13)
            }
        );

        context.TicketHistories.AddRange(
            new TicketHistory
            {
                TicketId = tickets[0].Id,
                OldAssignedToId = null,
                NewAssignedToId = support.Id,
                ChangedById = admin.Id,
                ChangedAt = DateTimeOffset.UtcNow.AddDays(-10)
            },
            new TicketHistory
            {
                TicketId = tickets[1].Id,
                OldStatus = TicketStatus.Open,
                NewStatus = TicketStatus.InProgress,
                ChangedById = support.Id,
                ChangedAt = DateTimeOffset.UtcNow.AddDays(-7)
            },
            new TicketHistory
            {
                TicketId = tickets[3].Id,
                OldStatus = TicketStatus.Open,
                NewStatus = TicketStatus.InProgress,
                ChangedById = support.Id,
                ChangedAt = DateTimeOffset.UtcNow.AddDays(-14)
            },
            new TicketHistory
            {
                TicketId = tickets[3].Id,
                OldStatus = TicketStatus.InProgress,
                NewStatus = TicketStatus.Closed,
                ChangedById = support.Id,
                ChangedAt = DateTimeOffset.UtcNow.AddDays(-13)
            },
            new TicketHistory
            {
                TicketId = tickets[4].Id,
                OldStatus = TicketStatus.InProgress,
                NewStatus = TicketStatus.Closed,
                ChangedById = admin.Id,
                ChangedAt = DateTimeOffset.UtcNow.AddDays(-16)
            }
        );

        await context.SaveChangesAsync();
    }
}