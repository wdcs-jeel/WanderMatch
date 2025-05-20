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
  async (formData: FormData, { rejectWithValue }) => {
    try {
      console.log('Sending registration request to backend...', formData);
      const response = await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        transformRequest: (data, headers) => {
          return data; // Don't transform the FormData
        },
      });
      
      console.log('Registration response:', response.data);
      
      // Store token and user data
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
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
        // Create FormData if there's an identity document to upload
        let formData = new FormData();
        let hasFile = false;

        console.log('Checking identity document:', updatedData.identityDocument);

        // Check if we have a new identity document
        if (updatedData.identityDocument) {
          console.log('Identity document type:', typeof updatedData.identityDocument);
          
          // Check if it's a FormData object with _parts
          const identityDoc = updatedData.identityDocument as any;
          if (identityDoc._parts) {
            const parts = identityDoc._parts;
            const identityDocPart = parts.find((part: any) => part[0] === 'identityDocument');
            
            if (identityDocPart && identityDocPart[1]) {
              const fileData = identityDocPart[1];
              console.log('Found file data:', fileData);
              
              if (fileData.uri) {
                // Create a proper file object
                const fileToUpload = {
                  uri: fileData.uri,
                  type: fileData.type || 'image/jpeg',
                  name: fileData.name || 'identity-document.jpg'
                };
                console.log('Uploading file:---------------', fileToUpload);
                formData.append('identityDocument', fileToUpload as any);
                hasFile = true;
                delete updatedData.identityDocument; // Remove from regular data
              } else {
                console.log('No uri found in file data');
              }
            } else {
              console.log('No identity document part found in FormData');
            }
          } else {
            console.log('Not a FormData object with _parts');
          }
        } else {
          console.log('No identity document in update data');
        }

        // Add all other fields to FormData
        Object.entries(updatedData).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            // Send arrays as JSON strings
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined) {
            formData.append(key, value.toString());
          }
        });

        // Log the data being sent (excluding the file)
        console.log('Sending update data:', {
          hasFile,
          fields: {
            ...updatedData,
            identityDocument: hasFile ? 'File included' : 'No file'
          }
        });

        // Add retry logic for network errors
        const maxRetries = 3;
        let retryCount = 0;
        let lastError = null;

        while (retryCount < maxRetries) {
          try {
            const { data } = await api.put('/profile/update', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
              },
              transformRequest: (data, headers) => {
                return data; // Don't transform FormData
              },
              timeout: 30000, // 30 second timeout
            });

            // Handle the response data
            const updatedUser = { ...state.auth.user, ...data };
            
            // If there's an identity document in the response, ensure it's properly formatted
            if (updatedUser.identityDocument && updatedUser.identityDocument.data) {
              updatedUser.identityDocument = {
                data: updatedUser.identityDocument.data,
                contentType: updatedUser.identityDocument.contentType
              };
            } else if (hasFile && updatedData.identityDocument) {
              // If we sent a file but didn't get one back, use the original file data
              const identityDoc = updatedData.identityDocument as any;
              if (identityDoc._parts) {
                const parts = identityDoc._parts;
                const identityDocPart = parts.find((part: any) => part[0] === 'identityDocument');
                if (identityDocPart && identityDocPart[1]) {
                  updatedUser.identityDocument = identityDocPart[1];
                }
              }
            }

            await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
            Alert.alert('Success', 'Profile updated successfully');
            return updatedUser;
          } catch (error: any) {
            lastError = error;
            if (error.message === 'Network Error') {
              retryCount++;
              if (retryCount < maxRetries) {
                console.log(`Retrying update (attempt ${retryCount + 1}/${maxRetries})...`);
                // Wait for 2 seconds before retrying
                await new Promise<void>((resolve) => setTimeout(resolve, 2000));
                continue;
              }
            }
            throw error;
          }
        }

        // If we've exhausted all retries, throw the last error
        throw lastError;
      } catch (error: any) {
        console.error('Profile update error:', error.response?.data || error);
        let errorMessage = 'Profile update failed';
        
        if (error.message === 'Network Error') {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        Alert.alert('Error', errorMessage);
        return rejectWithValue(errorMessage);
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
