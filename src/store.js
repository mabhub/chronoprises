/* eslint-disable import/prefer-default-export */
import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import medicationsReducer from './slices/medications';
import shotsReducer from './slices/shots';
import uiReducer from './slices/ui';

const reducer = persistReducer(
  {
    key: 'root',
    version: 1,
    storage,
  },
  combineReducers({
    medications: medicationsReducer,
    shots: shotsReducer,
    ui: uiReducer,
  }),
);

const middleware = getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  });

export const store = configureStore({
  reducer,
  middleware,
});
