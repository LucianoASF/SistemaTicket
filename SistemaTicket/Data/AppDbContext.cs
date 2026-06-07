using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SistemaTicket.Entities;

namespace SistemaTicket.Data;

public class AppDbContext : IdentityUserContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    public DbSet<Ticket> Tickets { get; set; }
    public DbSet<TicketComment> TicketComments { get; set; }
    public DbSet<TicketHistory> TicketHistories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TicketComment>()
            .HasOne(tc => tc.User)
            .WithMany()
            .HasForeignKey(tc => tc.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<TicketHistory>()
            .HasOne(th => th.NewAssignedUser)
            .WithMany()
            .HasForeignKey(th => th.NewAssignedToId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<TicketHistory>()
            .HasOne(th => th.OldAssignedUser)
            .WithMany()
            .HasForeignKey(th => th.OldAssignedToId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<TicketHistory>()
            .HasOne(th => th.ChangedBy)
            .WithMany()
            .HasForeignKey(th => th.ChangedById)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.CreatedBy)
            .WithMany(t => t.CreatedTickets)
            .HasForeignKey(t => t.CreatedById)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.AssignedTo)
            .WithMany(t => t.AssignedTickets)
            .HasForeignKey(t => t.AssignedToId)
            .OnDelete(DeleteBehavior.NoAction);
    }

}
