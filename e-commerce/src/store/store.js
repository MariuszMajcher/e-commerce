import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import catsReducer from "./catsSlice";
import userReducer from "./userSlice";
import buyingCatSlice from "./buyingCatSlice";
import messagesSlice from "./messagesSlice";
import currentMessageSlice from "./currentMessageSlice";

const localStorageMiddleware = store => next => action => {
    const result = next(action);
    localStorage.clear()
    localStorage.setItem('reduxState', JSON.stringify(store.getState()));
    return result;
  };
  
  const getLocalStorageState = () => {
    try {
      const serializedState = localStorage.getItem('reduxState');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      return undefined;
    }
  };

const store = configureStore({
    reducer: {
        cats: catsReducer,
        user: userReducer,
        buy: buyingCatSlice,
        messages: messagesSlice,
        current: currentMessageSlice
    }, preloadedState: getLocalStorageState(),
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(localStorageMiddleware)
});

store.subscribe(() => {
    localStorage.setItem('reduxState', JSON.stringify(store.getState()));
    });
    

export default store;