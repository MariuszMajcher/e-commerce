import { createSlice } from '@reduxjs/toolkit'

const initialState = []
    

const buyingCatSlice = createSlice({
    name: 'buyingCat',
    initialState,
    reducers: {
        loadBuy: (state, action) => {
            state = action.payload
            return state
        }
    }
})

export const selectBuyingCat = state => state.buy
export const { loadBuy } = buyingCatSlice.actions
export default buyingCatSlice.reducer


