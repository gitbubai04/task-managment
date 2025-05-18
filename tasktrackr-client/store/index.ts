import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import { loadState, saveState } from './store';

const rootReducer = {
    authUser: authReducer,
};

export type RootState = {
    [K in keyof typeof rootReducer]: ReturnType<(typeof rootReducer)[K]>;
};

export const store = configureStore({
    reducer: rootReducer,
    preloadedState: loadState() as RootState
});

store.subscribe(() => {
    saveState(store.getState());
});

export default store;

