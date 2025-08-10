import { Router } from 'express';
import TodoService from '../services/todo.service';

const router = Router();
const todoService = new TodoService();

// Create a new todo
router.post('/', async (req, res) => {
    try {
        const todo = await todoService.create(req.body);
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all todos
router.get('/', async (req, res) => {
    try {
        const todos = await todoService.getAll();
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a todo
router.put('/:id', async (req, res) => {
    try {
        const updatedTodo = await todoService.update(req.params.id, req.body);
        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
    try {
        await todoService.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;