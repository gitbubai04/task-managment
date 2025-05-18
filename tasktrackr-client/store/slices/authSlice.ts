import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
    isLoggedIn: boolean
    role: string | null
}

const initialState: AuthState = {
    isLoggedIn: false,
    role: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, action: PayloadAction<{ role: string }>) {
            state.isLoggedIn = true
            state.role = action.payload.role
        },
        authClear(state) {
            state.isLoggedIn = false
            state.role = null
        }
    },
})

export const { setAuth, authClear } = authSlice.actions
export default authSlice.reducer
