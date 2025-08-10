# README.md

# Todo SQLite App

This project is a simple Todo application that utilizes SQLite for data storage. It allows users to perform CRUD (Create, Read, Update, Delete) operations on todo items.

## Project Structure

- **src/Database**
  - `TodoDatabase.cs`: Manages the SQLite database connection and CRUD operations for `TodoItem` objects.
  - `Constants.cs`: Defines constants used throughout the application, such as database file names and table names.

- **src/Models**
  - `TodoItem.cs`: Represents a single todo item with properties like `Id`, `Title`, `Description`, and `IsCompleted`.

- **src/Services**
  - `ITodoService.cs`: Declares the `ITodoService` interface, defining methods for CRUD operations on `TodoItem` objects.
  - `TodoService.cs`: Implements the `ITodoService` interface, providing the logic for managing todo items.

- **src/ViewModels**
  - `TodoViewModel.cs`: Acts as a bridge between the view and the model, handling the logic for displaying and managing todo items.

- **src/Views**
  - `TodoPage.xaml`: Defines the user interface for displaying and interacting with todo items.

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd todo-sqlite-app
   ```

3. Restore the dependencies:
   ```
   dotnet restore
   ```

4. Run the application:
   ```
   dotnet run
   ```

## Features

- Add new todo items
- View existing todo items
- Update todo item details
- Delete todo items

## License

This project is licensed under the MIT License. See the LICENSE file for details.