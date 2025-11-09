import cors from 'cors';

const corsOptions = {
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true,
};

export default cors(corsOptions);