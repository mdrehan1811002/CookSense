import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER 
} from 'redux-persist';
import { apiSlice } from './api/apiSlice';
import { reduxStorage } from '../services/storage';
import userReducer from './slices/userSlice';
import notificationReducer from './slices/notificationSlice';
import searchReducer from './slices/searchSlice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: reduxStorage,
  // Adding 'api' to whitelist for persistent offline caching of recipes
  whitelist: ['user', 'notifications', 'search', 'api'], 
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  user: userReducer,
  notifications: notificationReducer,
  search: searchReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);

export default { store, persistor };
