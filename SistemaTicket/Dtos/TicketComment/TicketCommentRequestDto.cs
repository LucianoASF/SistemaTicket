using System.ComponentModel.DataAnnotations;

namespace SistemaTicket.Dtos.TicketComment;

public class TicketCommentRequestDto
{
    [Required]
    [MinLength(10)]
    public string Message { get; set; } = string.Empty;
}
