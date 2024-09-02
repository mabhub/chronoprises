import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {};

export const medicationsSlice = createSlice({
  name: 'medications',
  initialState,
  reducers: {
    /* eslint-disable no-param-reassign */
    createMedic: (state, action) => {
      const newId = uuidv4();
      state[newId] = {
        ...action.payload,
        uuid: newId,
      };
    },
    editMedic: (state, action) => {
      if (!action.payload.uuid) return;

      state[action.payload.uuid] = {
        ...action.payload,
      };
    },
    deleteMedic: (state, action) => {
      delete state[action.payload];
    },
    initMedications: (state, { payload }) => {
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const k in state) {
        delete state?.[k];
      }

      payload.forEach(medication => {
        state[medication.uuid] = medication;
      });
    },
    /* eslint-enable no-param-reassign */
  },
});

// Action creators are generated for each case reducer function
export const {
  createMedic,
  editMedic,
  deleteMedic,
  initMedications,
} = medicationsSlice.actions;

export default medicationsSlice.reducer;
