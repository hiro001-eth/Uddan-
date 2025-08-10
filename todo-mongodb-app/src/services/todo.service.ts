class TodoService {
    private todos: any[] = [];

    constructor() {
        // Initialize with some dummy data if needed
        this.todos = [];
    }

    public addTodo(todo: any): void {
        this.todos.push(todo);
    }

    public getAllTodos(): any[] {
        return this.todos;
    }

    public updateTodo(id: string, updatedTodo: any): boolean {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            this.todos[index] = { ...this.todos[index], ...updatedTodo };
            return true;
        }
        return false;
    }

    public deleteTodo(id: string): boolean {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            this.todos.splice(index, 1);
            return true;
        }
        return false;
    }
}