using System.Collections.Generic;
using System.Threading.Tasks;
using todo_sqlite_app.Models;
using todo_sqlite_app.Database;

namespace todo_sqlite_app.Services
{
    public class TodoService : ITodoService
    {
        private readonly TodoDatabase _database;

        public TodoService()
        {
            _database = new TodoDatabase();
        }

        public async Task<List<TodoItem>> GetAllTodoItemsAsync()
        {
            return await _database.GetTodoItemsAsync();
        }

        public async Task<TodoItem> GetTodoItemAsync(int id)
        {
            return await _database.GetTodoItemAsync(id);
        }

        public async Task<int> AddTodoItemAsync(TodoItem item)
        {
            return await _database.SaveTodoItemAsync(item);
        }

        public async Task<int> UpdateTodoItemAsync(TodoItem item)
        {
            return await _database.UpdateTodoItemAsync(item);
        }

        public async Task<int> DeleteTodoItemAsync(int id)
        {
            return await _database.DeleteTodoItemAsync(id);
        }
    }
}