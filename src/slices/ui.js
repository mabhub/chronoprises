import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  editMode: false,
  showModal: false,
  shotToEdit: null,
  medicViewMode: 'list',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /* eslint-disable no-param-reassign */
    set: (state, action) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        state[key] = value;
      });
    },
    /* eslint-enable no-param-reassign */
  },
});

// Action creators are generated for each case reducer function
export const {
  set,
} = uiSlice.actions;

export default uiSlice.reducer;
