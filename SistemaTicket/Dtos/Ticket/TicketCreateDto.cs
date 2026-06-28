using SistemaTicket.Enums;
using System.ComponentModel.DataAnnotations;

namespace SistemaTicket.Dtos.Ticket;

public class TicketCreateDto
{
    [Required(ErrorMessage = "O título é obrigatório.")]
    [StringLength(200, MinimumLength = 5, ErrorMessage = "O título deve ter entre 5 e 200 caracteres.")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "A descrição é obrigatória.")]
    [MinLength(10, ErrorMessage = "A descrição deve ter no mínimo 10 caracteres.")]
    public string Description { get; set; } = string.Empty;

    [EnumDataType(typeof(TicketPriority), ErrorMessage = "A prioridade informada é inválida.")]
    public TicketPriority? Priority { get; set; }

    public string? AssignedToId { get; set; }
}