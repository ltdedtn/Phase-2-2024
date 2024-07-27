using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using backend.Data;
using backend.Repositories;
using Microsoft.OpenApi.Models;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables from .env file
Env.Load();

// Retrieve environment variables
var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");
var jwtToken = Environment.GetEnvironmentVariable("JWT_TOKEN");

// Build connection string
var connectionString = $"Server=192.168.1.4,1433;Database=Phase 2;User Id=Ben;Password={dbPassword};Connect Timeout=30;Encrypt=True;TrustServerCertificate=True;";

// Configure services
builder.Services.AddControllers();
builder.Services.AddDbContext<BackendContext>(options =>
    options.UseSqlServer(connectionString));

// Register repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IStoryRepository, StoryRepository>();
builder.Services.AddScoped<IScreenshotRepository, ScreenshotRepository>();
builder.Services.AddScoped<ICharacterRepository, CharacterRepository>();
builder.Services.AddScoped<IStoryPartRepository, StoryPartRepository>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:3000")
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Configure additional services
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1"));
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// Enable CORS
app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
