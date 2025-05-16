import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { Alert } from 'react-native';
import { navigationRef } from './navigationService';

// Create axios instance with base URL
// API configuration
// const navigation = useNavigation<NavigationProp>();
// const dispatch = useDispatch<AppDispatch>();
const API_BASE_URL = 'http://192.168.109.128:3000/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios interceptor to add token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken'); // key must match AsyncStorage usage
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

// Response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  response => response,
  async (error) => {
    // const originalRequest = error.config;

    if (error.response?.status === 401) {
      console.warn('Unauthorized, logging out...');

      // Clear storage and Redux auth state
      await AsyncStorage.multiRemove(['userToken', 'userData']);
      // store.dispatch(logout());

      // Optional alert
      Alert.alert('Session Expired', 'Please log in again.');

      // Navigate to login screen
      navigationRef.current?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    }

    return Promise.reject(error);
  }
);

export default api; 