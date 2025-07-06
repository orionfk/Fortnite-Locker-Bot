import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { startAuthFlow, checkAuthStatus } from './epicAuth.js';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

app.get('/auth/start', async (req, res) => {
  const { discordId } = req.query;
  if (!discordId) return res.status(400).send('Missing discordId');

  const response = await startAuthFlow(discordId);
  res.json(response);
});

app.get('/auth/check', async (req, res) => {
  const { deviceCode, discordId } = req.query;
  if (!deviceCode || !discordId) return res.status(400).send('Missing params');

  const result = await checkAuthStatus(deviceCode, discordId);
  res.json(result);
});

app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));
