/* eslint-disable import/prefer-default-export */
import { configureStore } from '@reduxjs/toolkit';
import medicationsReducer from './slices/medications';
import shotsReducer from './slices/shots';

export const store = configureStore({
  reducer: {
    medications: medicationsReducer,
    shots: shotsReducer,
  },
});
