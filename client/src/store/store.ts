import { configureStore } from "@reduxjs/toolkit";
import timeReducer from "./timeSlice";
import wordReducer from "./wordSlice";
import preferencesReducer from "./preferenceSlice";

export const store = configureStore({
    reducer: {
        time: timeReducer,
        word: wordReducer,
        preferences: preferencesReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
