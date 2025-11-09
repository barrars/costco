import cors from 'cors';

const corsMiddleware = cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
});

export default corsMiddleware;