import { createSlice } from '@reduxjs/toolkit'

const initialState = []


const catsSlice = createSlice({
    name: 'cats',
    initialState,
    reducers: {
        clearCats(state, action) {
            state = []
        },
        loadCat(state, action) {
          state = action.payload
        }
    }
    })

export const selectAllCats = state => state
export const { clearCats, loadCat } = catsSlice.actions
export default catsSlice.reducer