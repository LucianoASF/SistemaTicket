using Microsoft.EntityFrameworkCore;
using SistemaTicket.Entities;

namespace SistemaTicket.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Ticket> Tickets { get; set; }
    public DbSet<TicketComment> TicketComments { get; set; }
    public DbSet<TicketHistory> TicketHistories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TicketComment>()
            .HasOne(tc => tc.User)
            .WithMany()
            .HasForeignKey(tc => tc.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<TicketHistory>()
            .HasOne(th => th.ChangeBy)
            .WithMany()
            .HasForeignKey(th => th.ChangeById)
            .OnDelete(DeleteBehavior.NoAction);
    }

}
