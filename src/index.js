import express from 'express';
import { PORT } from './config/config.js';
import indexRoutes from './routes/index.route.js'

const app = express()

// Middlewares
app.use(express.json())

// Routes
app.use('/api/v1', indexRoutes);

/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({'message': err.message});
    
    return;
});
  
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})