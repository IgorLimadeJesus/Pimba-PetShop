using PimbaPetAPI.Models;
using Microsoft.AspNetCore.Mvc;
using PimbaPetAPI.data;
using Microsoft.EntityFrameworkCore;

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
    }
}