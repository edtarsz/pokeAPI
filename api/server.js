import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import teamsRoutes from './src/routes/team.routes.js';
import { errorHandler } from './src/middleware/errorHandler.middleware.js';

export const app = express();
const PORT = process.env.PORT || 3000;

// Seguridad básica
app.use(helmet());
app.use(express.json());

// Limitador de peticiones de 15 minutos para prevenir ataques
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use('/teams', teamsRoutes);

app.get('/', (req, res) => {
  res.send('PokeDex API está funcionando!');
});

// Middleware de manejo de errores
app.use(errorHandler);

export const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});