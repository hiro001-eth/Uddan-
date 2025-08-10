using System.Collections.Generic;
using System.Threading.Tasks;
using todo_sqlite_app.Models;

namespace todo_sqlite_app.Services
{
    public interface ITodoService
    {
        Task<List<TodoItem>> GetAllTodosAsync();
        Task<TodoItem> GetTodoByIdAsync(int id);
        Task<bool> AddTodoAsync(TodoItem todoItem);
        Task<bool> UpdateTodoAsync(TodoItem todoItem);
        Task<bool> DeleteTodoAsync(int id);
    }
}