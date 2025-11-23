using PimbaPetAPI.Models;
using Microsoft.AspNetCore.Mvc;
using PimbaPetAPI.data;
using Microsoft.EntityFrameworkCore;

// Model Donos
namespace PimbaPetAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class DonoController : ControllerBase
    {
        private readonly PetShopDBContext _dbContext;

        public DonoController(PetShopDBContext petShopDBContext)
        {
            _dbContext = petShopDBContext;
        }

        [HttpPost("Donos")]
        public async Task<ActionResult> AdicionarDono([FromBody] DonoModel donoModel)
        {
            try
            {
                await _dbContext.Donos.AddAsync(donoModel);
                await _dbContext.SaveChangesAsync();

                return Ok(new { Sucess = true, Message = "Dono Cadastrado com sucesso." });
            }
            catch
            {
                return BadRequest("Erro ao cadastrar Dono.");
            }
        }

        [HttpGet("Donos")]
        public async Task<ActionResult<List<DonoModel>>> PegarDonos()
        {
            try
            {
                return await _dbContext.Donos.ToListAsync();
            }
            catch
            {
                return BadRequest("Erro ao buscar os donos.");
            }
        }

        [HttpDelete("Donos/{id}")]
        public async Task<ActionResult> DeletarDono(int id)
        {
            try
            {
                var dono = await _dbContext.Donos.FindAsync(id);
                if (dono == null)
                {
                    return NotFound("Dono não encontrado.");
                }

                // Delete all pets associated with this dono first
                var petsDoDono = await _dbContext.Pets.Where(p => p.Dono_id == id).ToListAsync();
                _dbContext.Pets.RemoveRange(petsDoDono);

                // Then delete the dono
                _dbContext.Donos.Remove(dono);
                await _dbContext.SaveChangesAsync();

                return Ok(new { Success = true, Message = "Dono e pets associados deletados com sucesso." });
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao deletar Dono: {ex.Message}");
            }
        }
    }
}