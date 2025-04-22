import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://192.168.109.128:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      console.log('Adding token to request:', token);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    try {
      console.log('Register API call with:', userData);
      const response = await api.post('/auth/register', userData);
      console.log('Register API response:', response.data);
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Register API error:', error.response?.data || error);
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  login: async (credentials) => {
    try {
      console.log('Login API call with:', credentials);
      const response = await api.post('/auth/login', credentials);
      console.log('Login API response:', response.data);
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login API error:', error.response?.data || error);
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },
};

// Profile API
export const profileAPI = {
  updateProfile: async (profileData) => {
    try {
      console.log('Update profile API call with:', profileData);
      const response = await api.put('/profile/update', profileData);
      console.log('Update profile API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update profile API error:', error.response?.data || error);
      throw error.response?.data || { message: 'Profile update failed' };
    }
  },

  uploadIdentity: async (documentUrl) => {
    try {
      const response = await api.post('/profile/upload-identity', { documentUrl });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Identity upload failed' };
    }
  },

  uploadPhotos: async (photoUrls) => {
    try {
      const response = await api.post('/profile/upload-photos', { photoUrls });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Photo upload failed' };
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/profile/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get profile' };
    }
  },
};

export default api; 