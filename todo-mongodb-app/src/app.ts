import express from 'express';
import mongoose from 'mongoose';
import todoRoutes from './routes/todo.routes';
import { dbConfig } from './config/db.config';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/todos', todoRoutes);

mongoose.connect(dbConfig.connectionString, dbConfig.options)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });