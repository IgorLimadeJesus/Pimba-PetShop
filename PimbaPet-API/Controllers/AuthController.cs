using Microsoft.AspNetCore.Mvc;
using PimbaPet_API.Services;
using PimbaPet_API.Services.Interface;
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
        private readonly ITokenService _tokenService;

        public AuthController(PetShopDBContext petShopDBContext, ITokenService tokenService)
        {
            _dbContext = petShopDBContext;
            _tokenService = tokenService;
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
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("/login")]
        public async Task<ActionResult> Logar([FromBody] LoginDTO dto)
        {
            var user = _dbContext.Users.FirstOrDefault(u => u.email == dto.email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.senha, user.senha))
            {
                return Unauthorized("Credenciais inválidas");
            }

            var token = _tokenService.GerarToken(user);

            return Ok(new { token });
        }

    }
}
