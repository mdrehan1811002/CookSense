import { createSlice } from '@reduxjs/toolkit';

/**
 * User Slice - Manages user preferences, favorites, and location data.
 */
const userSlice = createSlice({
  name: 'user',
  initialState: {
    favorites: [],
    location: null,
    region: 'American', // Default region
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const index = state.favorites.findIndex(item => item.idMeal === action.payload.idMeal);
      if (index >= 0) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(action.payload);
      }
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setRegion: (state, action) => {
      state.region = action.payload;
    },
    clearFavorites: (state) => {
      state.favorites = [];
    }
  },
});


export const { toggleFavorite, setLocation, setRegion, clearFavorites } = userSlice.actions;
export default userSlice.reducer;
