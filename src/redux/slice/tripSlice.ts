import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { Trip, TripState } from '../type';


const initialState: TripState = {
  trips: [],
  isLoading: false,
  error: null,
  tripAdded:false
};

export const syncPlace = createAsyncThunk(
  'trips/syncPlace',
  async (userId: any, thunkAPI) => {
    try {
      const { data } = await api.get(`/sync/${userId}`);
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to sync');
    }
  }
);

export const deletePlace = createAsyncThunk(
  'trips/deletePlace',
  async (tripId: number, thunkAPI) => {
    try {
      await api.delete(`/sync/delete/${tripId}`);
      return tripId;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete');
    }
  }
);

export const addPlace = createAsyncThunk(
    'trips/addPlace',
    async (placeData: Trip[], thunkAPI) => {
      try {
        const response = await api.post('/sync',{ places: placeData });
        console.log("new place data",response.data.trips)
        return response.data.trips; // Assuming response returns the new trip
      } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to add place');
      }
    }
  );

const tripSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    setTripAdded(state, action: PayloadAction<boolean>) {
      state.tripAdded = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(syncPlace.pending, state => { state.isLoading = true; })
      .addCase(syncPlace.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.trips = payload;
      })
      .addCase(syncPlace.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
      })

      .addCase(deletePlace.fulfilled, (state, { payload }) => {
        state.trips = state.trips.filter(trip => trip._id !== payload);
      })

      .addCase(addPlace.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addPlace.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.trips.push(payload); // add the new trip
      })
      .addCase(addPlace.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
      });

  }
});
export const { setTripAdded } = tripSlice.actions;
export default tripSlice.reducer;
