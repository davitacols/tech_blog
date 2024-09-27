// src/services/auth.js
import axios from 'axios';

// Refresh the access token using the refresh token
export const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) return;

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
      refresh,
    });
    localStorage.setItem('access_token', response.data.access); // Update the access token
  } catch (err) {
    console.error('Failed to refresh token:', err);
  }
};
