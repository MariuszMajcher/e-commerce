import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    cats: {}
}

const catsSlice = createSlice({
    name: 'cats',
    initialState,
    reducers: {
        loadAllCats(state, action) {
            state.cats = action.payload
        }
    }
    })

export const { loadAllCats } = catsSlice.actions
export default catsSlice.reducer