using PimbaPetAPI.Objects.Models;

namespace PimbaPet_API.Services.Interface
{
    public interface ITokenService
    {
        string GerarToken(UserModel user);
    }
}
