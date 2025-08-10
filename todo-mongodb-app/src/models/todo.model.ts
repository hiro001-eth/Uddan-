class Todo {
    title: string;
    description: string;
    completed: boolean;

    constructor(title: string, description: string, completed: boolean = false) {
        this.title = title;
        this.description = description;
        this.completed = completed;
    }

    // Method to mark the todo as completed
    markAsCompleted() {
        this.completed = true;
    }

    // Method to update the todo details
    updateDetails(title: string, description: string) {
        this.title = title;
        this.description = description;
    }
}

export default Todo;