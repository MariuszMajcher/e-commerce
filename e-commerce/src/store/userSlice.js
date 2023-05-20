import { createSlice } from '@reduxjs/toolkit'



const initialState =  {
    user: {},
    loggedIn: false,
    userExists: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loadUser(state, action) {
            state.user = action.payload
        },
        logIn(state, action) {
            state.loggedIn = true
        },
        logOut(state, action) {
            console.log('logging out')
            state.user = {}
            state.loggedIn = false
        },
        setUserExists(state, action) {
            state.userExists = action.payload
        }
    }
    })




export const selectUser = state => state.user.user
export const selectLoggedIn = state => state.user.loggedIn
export const selectUserExists = state => state.user.userExists
export const { loadUser, logIn, logOut, setUserExists } = userSlice.actions
export default userSlice.reducer
