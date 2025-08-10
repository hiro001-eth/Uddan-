using System.Collections.ObjectModel;
using System.Windows.Input;
using Xamarin.Forms;
using System.Threading.Tasks;
using YourNamespace.Services; // Update with your actual namespace
using YourNamespace.Models; // Update with your actual namespace

namespace YourNamespace.ViewModels // Update with your actual namespace
{
    public class TodoViewModel : BaseViewModel
    {
        private readonly ITodoService _todoService;
        public ObservableCollection<TodoItem> TodoItems { get; }
        public ICommand AddTodoCommand { get; }
        public ICommand LoadTodosCommand { get; }

        public TodoViewModel(ITodoService todoService)
        {
            _todoService = todoService;
            TodoItems = new ObservableCollection<TodoItem>();
            AddTodoCommand = new Command(async () => await AddTodo());
            LoadTodosCommand = new Command(async () => await LoadTodos());
        }

        private async Task LoadTodos()
        {
            var todos = await _todoService.GetAllTodosAsync();
            TodoItems.Clear();
            foreach (var todo in todos)
            {
                TodoItems.Add(todo);
            }
        }

        private async Task AddTodo()
        {
            var newTodo = new TodoItem
            {
                Title = "New Todo",
                Description = "Description here",
                IsCompleted = false
            };
            await _todoService.AddTodoAsync(newTodo);
            await LoadTodos();
        }
    }
}