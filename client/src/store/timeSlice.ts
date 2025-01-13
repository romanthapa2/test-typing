import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TimeState {
    timer: number;
    timerId: NodeJS.Timer | null;
}

const initialState: TimeState = {
    timer: 0,
    timerId: null,
};

const timeSlice = createSlice({
    name: "time",
    initialState,
    reducers: {
        timerDecrement(state) {
            state.timer -= 1;
        },
        timerSet(state, action: PayloadAction<number>) {
            state.timer = action.payload;
        },
        setTimerId(state, action: PayloadAction<NodeJS.Timer | null>) {
            state.timerId = action.payload;
        },
    },
});

export const { timerDecrement, timerSet, setTimerId } = timeSlice.actions;
export default timeSlice.reducer;
