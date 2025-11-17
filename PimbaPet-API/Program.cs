using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PimbaPet_API.Services;
using PimbaPet_API.Services.Interface;
using PimbaPetAPI.data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var connectionString = "server=localhost;user=root;password=;database=pimbapet";

// Read allowed frontend origins from env (comma-separated) or default to localhost:3000
var allowedOriginsEnv = builder.Configuration["FRONTEND_ORIGINS"] ?? "http://localhost:3000";
var allowedOrigins = allowedOriginsEnv.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? string.Empty))
        };
    });

var serverVersion = new MySqlServerVersion(new Version(10, 4, 32));

builder.Services.AddDbContext<PetShopDBContext>(
    dbContextOptions => dbContextOptions
    .UseMySql(connectionString, serverVersion)
    .LogTo(Console.WriteLine, LogLevel.Information)
    .EnableSensitiveDataLogging()
    .EnableDetailedErrors()
);

builder.Services.AddCors(options =>
{
    // Use an explicit origins list (safer) and allow credentials if needed
    options.AddPolicy("PermitirTudo", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .WithExposedHeaders("Content-Type", "Authorization");
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Lightweight middleware to ensure CORS preflight and helpful headers are present
// This helps in development when some requests fail before the CORS middleware runs
app.Use(async (context, next) =>
{
    // Ensure preflight gets a proper response. In development, echo the incoming Origin to avoid
    // CORS mismatches when the dev server is accessed via different hostnames/IPs (e.g. LAN IP).
    if (!context.Response.Headers.ContainsKey("Access-Control-Allow-Origin"))
    {
        var origin = context.Request.Headers["Origin"].ToString();
        if (app.Environment.IsDevelopment())
        {
            if (!string.IsNullOrEmpty(origin))
                context.Response.Headers["Access-Control-Allow-Origin"] = origin;
            else
                context.Response.Headers["Access-Control-Allow-Origin"] = allowedOrigins.FirstOrDefault() ?? "*";
        }
        else
        {
            // In production, only echo allowed origins from configuration
            if (!string.IsNullOrEmpty(origin) && allowedOrigins.Contains(origin, StringComparer.OrdinalIgnoreCase))
            {
                context.Response.Headers["Access-Control-Allow-Origin"] = origin;
            }
            else
            {
                context.Response.Headers["Access-Control-Allow-Origin"] = allowedOrigins.FirstOrDefault() ?? "*";
            }
        }
    }

    if (!context.Response.Headers.ContainsKey("Access-Control-Allow-Headers"))
        context.Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
    if (!context.Response.Headers.ContainsKey("Access-Control-Allow-Methods"))
        context.Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
    // Support Private Network Access (PNA) preflight responses for browsers.
    // If the browser sent an Access-Control-Request-Private-Network header, echo the permission header.
    if (context.Request.Headers.ContainsKey("Access-Control-Request-Private-Network") &&
        !context.Response.Headers.ContainsKey("Access-Control-Allow-Private-Network"))
    {
        context.Response.Headers["Access-Control-Allow-Private-Network"] = "true";
    }

    if (string.Equals(context.Request.Method, "OPTIONS", StringComparison.OrdinalIgnoreCase))
    {
        context.Response.StatusCode = 200;
        await context.Response.CompleteAsync();
        return;
    }

    await next();
});

// Health endpoint for quick verification
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.UseCors("PermitirTudo");

app.MapGet("/", () => "API is listening");

// Disable HTTPS redirection in development
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();

app.Run();