import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  discordId: String,
  epicAccountId: String,
  displayName: String,
  accessToken: String,
  refreshToken: String,
  expiresAt: Number
});

export default mongoose.model('User', userSchema);
