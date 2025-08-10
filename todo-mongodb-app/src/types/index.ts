export interface Todo {
    id: string;
    title: string;
    description: string;
    completed: boolean;
}

export interface TodoInput {
    title: string;
    description: string;
    completed?: boolean;
}