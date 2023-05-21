import { createSlice } from "@reduxjs/toolkit";

const initialState = []

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    loadAllMessages(state, action) {
        return action.payload;
      
      }
  }
});

export const selectMessages = state => state.messages;
export const { loadAllMessages } = messagesSlice.actions;
export default messagesSlice.reducer;