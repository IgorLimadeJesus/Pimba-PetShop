using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PimbaPetAPI.Models
{
    [Table("Dono")]
    public class DonoModel
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        // Informações do Dono
        [Column("nome")]
        public string? Nome { get; set; }

        [Column("cpf")]
        public string? CPF { get; set; }

        [Column("telefone")]
        public string? Telefone { get; set; }
    }
}