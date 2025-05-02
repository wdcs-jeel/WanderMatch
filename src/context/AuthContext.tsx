import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// API configuration
const API_BASE_URL = Platform.OS === 'ios' ? 'http://localhost:5000/api' : 'http://10.0.2.2:5000/api';

export interface User {
  _id: string;
  email: string;
  fullName: string;
  dateOfBirth?: string;
  bio?: string;
  interests: string[];
  travelType?: 'Solo Traveler' | 'Group Seeker' | 'Travel Funder' | 'Nomad';
  lookingFor?: ('Romance' | 'Friendship' | 'Adventure Partners' | 'Local Guides')[];
  travelStyle?: ('Luxury' | 'Budget' | 'Adventure' | 'Cultural' | 'Relaxation' | 'Foodie')[];
  topDestinations?: string[];
  languages?: string[];
  identityVerified: boolean;
  profilePhotos: string[];
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  token: string | null;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  token: null,
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('userData');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          console.log('Initializing with user:', parsedUser);
          setState({
            user: parsedUser,
            token,
            isLoading: false,
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      console.log('Attempting login with:', credentials.email);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      console.log('Login response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (!data.token || !data.user) {
        throw new Error('Invalid response from server');
      }
      
      // First update AsyncStorage
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(data.user));
      
      // Then update state
      setState({
        user: data.user,
        token: data.token,
        isLoading: false,
      });

      console.log('Login successful, user:', data.user);
    } catch (error: any) {
      console.error('Login error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      throw new Error(error.message || 'Failed to login');
    }
  }, []);

  const logout = useCallback(async () => {
    console.log('Logging out...');
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // First clear AsyncStorage
      await AsyncStorage.multiRemove(['userToken', 'userData']);
      console.log('AsyncStorage cleared');
      
      // Then reset state
      setState(initialState);
      console.log('State reset to initial');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if there's an error, we should reset the state
      setState(initialState);
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (userData: Partial<User>) => {
    if (!state.token || !state.user) {
      console.error('Update profile failed: No token or user found');
      throw new Error('No authentication token or user found');
    }

    setState(prev => ({ ...prev, isLoading: true }));
    try {
      console.log('Updating profile with data:', userData);
      console.log('Using token:', state.token);
      console.log('API URL:', `${API_BASE_URL}/profile/update`);

      const response = await fetch(`${API_BASE_URL}/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
        body: JSON.stringify(userData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        console.error('Profile update failed:', data);
        throw new Error(data.message || 'Failed to update profile');
      }

      // Verify the response contains the updated user data
      if (!data._id || !data.fullName) {
        console.error('Invalid response data:', data);
        throw new Error('Invalid response from server');
      }

      // Update both state and AsyncStorage with the complete user data
      const updatedUser = { ...state.user, ...data };
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      
      setState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
      }));

      console.log('Profile updated successfully:', updatedUser);
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      console.error('Profile update error:', error);
      if (!error.response && error.message === 'Network request failed') {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }
      throw error;
    }
  }, [state.token, state.user]);

  const value = React.useMemo(() => ({
    user: state.user,
    isLoading: state.isLoading,
    login,
    logout,
    updateProfile,
  }), [state.user, state.isLoading, login, logout, updateProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 