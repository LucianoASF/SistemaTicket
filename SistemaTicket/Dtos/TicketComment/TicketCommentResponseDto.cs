namespace SistemaTicket.Dtos.TicketComment;

public class TicketCommentResponseDto
{
    public int Id { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int TicketId { get; set; }

}
