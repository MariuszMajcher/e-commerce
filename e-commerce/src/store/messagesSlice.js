import { createSlice } from "@reduxjs/toolkit";

const initialState = []
   
const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        loadMessages(state, action) {
            return action.payload
        }
    }
})

export const selectMessages = state => state.messages
export const { loadMessages } = messagesSlice.actions
export default messagesSlice.reducer
