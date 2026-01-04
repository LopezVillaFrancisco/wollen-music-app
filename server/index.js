import express from 'express';
import cors from 'cors';
import lastfmRoutes from './routes/lastfm.routes.js';
import { LASTFM_API_KEY, PORT } from './config/env.js';

const app = express();

if (!LASTFM_API_KEY) {
  console.error('Error: LASTFM_API_KEY no está configurada en el archivo .env');
  process.exit(1);
}

console.log('API Key configurada:');

app.use(cors());
app.use(express.json());

app.use('/api', lastfmRoutes);

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
