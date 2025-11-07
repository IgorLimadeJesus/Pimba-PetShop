using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

//Models PETS
namespace PimbaPetAPI.Models
{
    [Table("Pet")]
    public class PetModel
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        // Informações do Pet
        [Column("nome")]
        public string? Nome { get; set; }

        [Column("tipo")]
        public string? Tipo { get; set; }

        [Column("raca")]
        public string? Raca { get; set; }

        [Column("dono_id")]
        public int Dono_id { get; set; }
    }
}