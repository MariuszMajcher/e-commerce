import { createSlice } from '@reduxjs/toolkit';

const initialState = []

const ShopSlice = createSlice({
    name: 'shop',
    initialState,
    reducers: {
        loadProducts: (state, action) => {
            return action.payload
        }
    }
})

export const { loadProducts } = ShopSlice.actions
export const selectShop = state => state.shop
export default ShopSlice.reducer
