import { createSlice } from '@reduxjs/toolkit';

interface changeMemberShipModalState {
  isOpen?: boolean;
  isModalOpen?: boolean;
}

// Define the initial state using that type
const initialState: changeMemberShipModalState = {
  isModalOpen: false,
};

export const changeMemberShipModalSlice = createSlice({
  name: 'membershipModel',
  initialState,
  reducers: {
    onToggleModal: (state, action) => {
      state.isModalOpen = action.payload.isModalOpen;
    },
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = changeMemberShipModalSlice;

export const { onToggleModal } = actions;

// Other code such as selectors can use the imported `RootState` type

export default reducer;
