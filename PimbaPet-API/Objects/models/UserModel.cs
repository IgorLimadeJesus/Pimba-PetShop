using System.ComponentModel.DataAnnotations.Schema;

namespace PimbaPetAPI.Objects.Models
{
    [Table("usuarios")]
    public class UserModel
    {
        public int id { get; set; }
        public string nome { get; set; }
        public string email { get; set; }
        public string senha { get; set; }
    }
}