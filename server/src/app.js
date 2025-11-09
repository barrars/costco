import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import corsMiddleware from './middleware/corsMiddleware.js';
import dataRoutes from './routes/dataRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json());

// Routes
app.use('/api', dataRoutes);
app.use('/api/analytics', analyticsRoutes);

// Serve static files from the React app build directory
const clientBuildPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientBuildPath));

// Catch all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

export default app;