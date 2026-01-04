import dotenv from 'dotenv';

dotenv.config();

export const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
export const PORT = process.env.PORT || 3001;
