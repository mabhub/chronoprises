import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {};

export const shotsSlice = createSlice({
  name: 'shots',
  initialState,
  reducers: {
    /* eslint-disable no-param-reassign */
    createShot: (state, action) => {
      const newId = uuidv4();
      state[newId] = {
        ...action.payload,
        uuid: newId,
      };
    },
    editShot: (state, action) => {
      if (!action.payload.uuid) return;

      state[action.payload.uuid] = {
        ...action.payload,
      };
    },
    deleteShot: (state, action) => {
      delete state[action.payload];
    },
    initShots: (state, { payload }) => {
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const k in state) {
        delete state?.[k];
      }

      payload.forEach(shot => {
        state[shot.uuid] = shot;
      });
    },
    /* eslint-enable no-param-reassign */
  },
});

// Action creators are generated for each case reducer function
export const {
  createShot,
  editShot,
  deleteShot,
  initShots,
} = shotsSlice.actions;

export default shotsSlice.reducer;
