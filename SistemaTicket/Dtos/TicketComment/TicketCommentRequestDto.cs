using System.ComponentModel.DataAnnotations;

namespace SistemaTicket.Dtos.TicketComment;

public class TicketCommentRequestDto
{
    [Required(ErrorMessage = "A mensagem é obrigatória.")]
    [MinLength(10, ErrorMessage = "A mensagem deve ter no mínimo 10 caracteres.")]
    public string Message { get; set; } = string.Empty;
}