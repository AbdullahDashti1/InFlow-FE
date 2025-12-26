import api from './apiService';
import { jwtDecode } from 'jwt-decode';

// Auth endpoints are usually on the root or /auth depending on backend.
// Following the legacy pattern which used /sign-up and /sign-in relative to base.
// Explicitly defining the URL here as requested.
const BASE_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

const signUp = async (formData) => {
  try {
    const res = await api.post(`${BASE_URL}/sign-up`, formData);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      return jwtDecode(res.data.token);
    }
    return res.data;
  } catch (error) {
    console.error("Sign-up error:", error);
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      if (Array.isArray(detail)) {
        // Flatten Pydantic validation errors
        throw detail.map(err => err.msg).join(', ');
      }
      throw detail;
    }
    throw error.message || "An unexpected error occurred";
  }
};

const signIn = async (formData) => {
  try {
    const res = await api.post(`${BASE_URL}/sign-in`, formData);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      return jwtDecode(res.data.token);
    }
    return res.data;
  } catch (error) {
    console.error("Sign-in error:", error);
    if (error.response?.data?.detail) {
      throw error.response.data.detail;
    }
    throw error.message || "An unexpected error occurred";
  }
};

export { signUp, signIn };