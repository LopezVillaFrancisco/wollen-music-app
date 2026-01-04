import express from 'express';
import cors from 'cors';
import path from 'path';
import lastfmRoutes from './routes/lastfm.routes.js';
import { LASTFM_API_KEY, PORT } from './config/env.js';

const app = express();

if (!LASTFM_API_KEY) {
  console.error('Error: LASTFM_API_KEY');
  process.exit(1);
}

console.log('API Key configurada:');

app.use(cors());
app.use(express.json());

app.use('/api', lastfmRoutes);

const __dirname = path.resolve(); 
app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
