import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PreferencesState {
    theme: string;
    timeLimit: number;
    type: string;
}

const initialState: PreferencesState = {
    theme: "",
    timeLimit: 0,
    type: "",
};

const preferencesSlice = createSlice({
    name: "preferences",
    initialState,
    reducers: {
        setTheme(state, action: PayloadAction<string>) {
            state.theme = action.payload;
        },
        setTime(state, action: PayloadAction<number>) {
            state.timeLimit = action.payload;
        },
        setType(state, action: PayloadAction<string>) {
            state.type = action.payload;
        },
    },
});

export const { setTheme, setTime, setType } = preferencesSlice.actions;
export default preferencesSlice.reducer;
