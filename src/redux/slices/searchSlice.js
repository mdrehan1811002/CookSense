import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  recentSearches: ['Pasta', 'Chicken', 'Healthy', 'Dessert', 'Breakfast'],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    addSearchTerm: (state, action) => {
      const term = action.payload.trim();
      if (!term) return;
      
      // Remove if exists to move to top
      state.recentSearches = state.recentSearches.filter(
        (item) => item.toLowerCase() !== term.toLowerCase()
      );
      
      // Add to start and limit to 10
      state.recentSearches = [term, ...state.recentSearches].slice(0, 10);
    },
    removeSearchTerm: (state, action) => {
      state.recentSearches = state.recentSearches.filter(
        (item) => item !== action.payload
      );
    },
    clearSearchHistory: (state) => {
      state.recentSearches = [];
    },
  },
});

export const { addSearchTerm, removeSearchTerm, clearSearchHistory } = searchSlice.actions;
export default searchSlice.reducer;
