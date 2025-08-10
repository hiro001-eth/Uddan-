using System;
using Xamarin.Forms;

namespace TodoSQLiteApp
{
    public partial class AppShell : Shell
    {
        public AppShell()
        {
            InitializeComponent();
            Routing.RegisterRoute(nameof(TodoPage), typeof(TodoPage));
        }

        private async void OnTodoItemSelected(object sender, SelectedItemChangedEventArgs e)
        {
            if (e.SelectedItem is TodoItem todoItem)
            {
                // Navigate to the TodoPage with the selected TodoItem
                await Shell.Current.GoToAsync($"{nameof(TodoPage)}?id={todoItem.Id}");
            }
        }
    }
}