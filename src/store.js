/* eslint-disable import/prefer-default-export */
import { configureStore } from '@reduxjs/toolkit';
import medicationsReducer from './slices/medications';

export const store = configureStore({
  reducer: {
    medications: medicationsReducer,
  },
});
