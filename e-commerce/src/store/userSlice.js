import { createSlice } from '@reduxjs/toolkit'



const initialState =  {
    user: {},
    loggedIn: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loadUser(state, action) {
            state.user = action.payload
        },
        loggedIn(state, action) {
            state.loggedIn = action.payload
        }
    }
    })




export const selectUser = state => state.user.user
export const { loadUser, loggedIn } = userSlice.actions
export default userSlice.reducer
