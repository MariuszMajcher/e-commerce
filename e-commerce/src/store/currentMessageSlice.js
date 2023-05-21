import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const currentMessageSlice = createSlice({
    name: 'currentMessage',
    initialState,
    reducers: {
        loadCurrentMessage(state, action) {
            return action.payload;
        }
    }
});

export const selectCurrentMessage = state => state.current;
export const { loadCurrentMessage } = currentMessageSlice.actions;
export default currentMessageSlice.reducer;
