using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PimbaPetAPI.data;
using PimbaPetAPI.Models;

namespace PimbaPetAPI.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class PetController : ControllerBase
    {
        private readonly PetShopDBContext _dbContext;

        public PetController(PetShopDBContext petShopDBContext)
        {
            _dbContext = petShopDBContext;
        }

        [HttpPost("Pets")]
        public async Task<ActionResult> AdicionarPet([FromBody] PetModel petModel)
        {
            try
            {
                await _dbContext.Pets.AddAsync(petModel);
                await _dbContext.SaveChangesAsync();

                return Ok(new { Sucess = true, Message = "Pet Cadastrado com sucesso." });
            }
            catch
            {
                return BadRequest("Erro ao cadastrar Pet.");
            }
        }

        [HttpGet("Pets")]
        public async Task<ActionResult<List<PetModel>>> PegarPets()
        {
            try
            {
                return await _dbContext.Pets.ToListAsync();
            }
            catch
            {
                return BadRequest("Erro ao buscar os pets.");
            }
        }

        [HttpDelete("Pets/{id}")]
        public async Task<ActionResult> DeletarPet(int id)
        {
            try
            {
                var pet = await _dbContext.Pets.FindAsync(id);
                if (pet == null)
                {
                    return NotFound("Pet não encontrado.");
                }

                _dbContext.Pets.Remove(pet);
                await _dbContext.SaveChangesAsync();

                return Ok(new { Success = true, Message = "Pet deletado com sucesso." });
            }
            catch
            {
                return BadRequest("Erro ao deletar Pet.");
            }
        }
    }
}