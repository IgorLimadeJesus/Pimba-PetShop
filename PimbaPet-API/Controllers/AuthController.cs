using Microsoft.AspNetCore.Mvc;
using PimbaPetAPI.data;
using PimbaPetAPI.Objects.DTOs;
using PimbaPetAPI.Objects.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PimbaPet_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly PetShopDBContext _dbContext;

        public AuthController(PetShopDBContext petShopDBContext)
        {
            _dbContext = petShopDBContext;
        }

        [HttpPost("/register")]
        public async Task<ActionResult> Register([FromBody] UserDTO dto)
        {
            try
            {
                if (_dbContext.Users.Any(u => u.email == dto.email))
                    return BadRequest("Email já cadastrado");

                var SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.senha);

                var user = new UserModel
                {
                    nome = dto.nome,
                    email = dto.email,
                    senha = SenhaHash
                };

                await _dbContext.Users.AddAsync(user);
                await _dbContext.SaveChangesAsync();

                return Ok(user);
            } catch (Exception ex) 
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("/login")]
        public async Task<ActionResult> Logar()
        {
            throw new NotImplementedException();
        }

    }
}
