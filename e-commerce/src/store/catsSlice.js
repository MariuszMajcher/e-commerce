import { createSlice } from '@reduxjs/toolkit'

const initialState = []


const catsSlice = createSlice({
    name: 'cats',
    initialState,
    reducers: {
        clearCats(state, action) {
            return []
        },
        loadCats(state, action) {
          return state.concat(action.payload)
        }
    }
    })

export const selectAllCats = state => state
export const { clearCats, loadCats } = catsSlice.actions
export default catsSlice.reducer