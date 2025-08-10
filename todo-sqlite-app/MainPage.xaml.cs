using System;
using System.Collections.Generic;
using Xamarin.Forms;

namespace TodoSQLiteApp
{
    public partial class MainPage : ContentPage
    {
        private readonly TodoViewModel _viewModel;

        public MainPage()
        {
            InitializeComponent();
            _viewModel = new TodoViewModel();
            BindingContext = _viewModel;
        }

        protected override async void OnAppearing()
        {
            base.OnAppearing();
            await _viewModel.LoadTodosAsync();
        }

        private async void OnAddTodoClicked(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new TodoPage());
        }

        private async void OnTodoSelected(object sender, SelectedItemChangedEventArgs e)
        {
            if (e.SelectedItem is TodoItem selectedTodo)
            {
                await Navigation.PushAsync(new TodoPage(selectedTodo));
            }
        }
    }
}