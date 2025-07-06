import axios from 'axios';
import User from './models/User.js';

const EPIC_TOKEN_URL = 'https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token';
const headers = {
  Authorization: 'basic ' + Buffer.from(`${process.env.EPIC_CLIENT_ID}:${process.env.EPIC_CLIENT_SECRET}`).toString('base64'),
  'Content-Type': 'application/x-www-form-urlencoded'
};

export async function startAuthFlow(discordId) {
  const form = new URLSearchParams({
    grant_type: 'device_auth'
  });

  const { data } = await axios.post(EPIC_TOKEN_URL, form, { headers });
  return {
    verification_uri: 'https://www.epicgames.com/id/activate',
    user_code: data.user_code,
    device_code: data.device_code,
    expires_in: data.expires_in
  };
}

export async function checkAuthStatus(deviceCode, discordId) {
  const form = new URLSearchParams({
    grant_type: 'device_code',
    device_code: deviceCode
  });

  try {
    const { data } = await axios.post(EPIC_TOKEN_URL, form, { headers });

    const { access_token, refresh_token, account_id, displayName, expires_in } = data;

    await User.findOneAndUpdate(
      { discordId },
      {
        discordId,
        epicAccountId: account_id,
        displayName,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: Date.now() + expires_in * 1000
      },
      { upsert: true }
    );

    return { success: true, displayName };
  } catch (err) {
    return { success: false, error: err.response?.data?.error_description || 'Unknown error' };
  }
}
