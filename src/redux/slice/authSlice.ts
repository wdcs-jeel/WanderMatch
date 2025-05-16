import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { AuthState, User } from '../type';
import { Alert } from 'react-native';


const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password ,navigation}: { email: string; password: string ;navigation:any},{ rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if(response){
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        navigation.navigate('MainApp');
        return response.data;
      }
    } catch (err: any) {
        const message = err?.response?.data?.message || 'Invalid email or password';
        return rejectWithValue(message); 
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: any, thunkAPI) => {
    try {
      const formatted = {
        ...userData,
        lookingFor: userData.lookingFor.join(','),
        travelStyle: userData.travelStyle.join(','),
        languages: userData.languages.join(','),
      };
      const response = await api.post('/auth/register', formatted);
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.multiRemove(['userToken', 'userData']);
});

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (updatedData: Partial<User>, { getState, rejectWithValue }) => {
      const state = getState() as { auth: AuthState };
      try {
        const { data } = await api.put('/profile/update', updatedData);
        const updatedUser = { ...state.auth.user, ...data };
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
        Alert.alert('Success', 'Profile updated successfully');
        return updatedUser;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Profile update failed');
      }
    }
  );

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => { state.isLoading = true; })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.token = payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
      })

      .addCase(register.pending, state => { state.isLoading = true; })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.token = payload.token;
        state.error = null;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
      })

      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.token = null;
        state.isLoading = false;
        state.error = null;
      })

      .addCase(updateProfile.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });
  }
});

export default authSlice.reducer;
