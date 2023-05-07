import { createSlice } from '@reduxjs/toolkit'

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('user')
        if (serializedState === null) {
            return undefined
        }
        return JSON.parse(serializedState)
    } catch (err) {
        console.log(err)
        return undefined
    }
}

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state)
        localStorage.setItem('user', serializedState)
    } catch (err) {
        console.log(err)
    }
}


const initialState = loadState() || {
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

userSlice.subscribe(() => {
    saveState(userSlice.getState())
})



export const selectUser = state => state.user.user
export const { loadUser, loggedIn } = userSlice.actions
export default userSlice.reducer
