import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RefObject } from "react";

interface WordState {
    currWord: string;
    typedWord: string;
    typedHistory: string[];
    wordList: string[];
    activeWordRefId: number | null;
    caretRefId: string | null;
}

const initialState: WordState = {
    currWord: "",
    typedWord: "",
    typedHistory: [],
    wordList: [],
    activeWordRefId: null,
    caretRefId: null,
};

const wordSlice = createSlice({
    name: "word",
    initialState,
    reducers: {
        setWord(state, action: PayloadAction<string>) {
            state.typedHistory.push(action.payload);
        },
        setChar(state, action: PayloadAction<string>) {
            state.typedWord = action.payload;
        },
        appendTypedHistory(state) {
            const nextIdx = state.typedHistory.length + 1;
            state.currWord = state.wordList[nextIdx];
            state.typedHistory.push(state.typedWord);
            state.typedWord = "";
        },
        backtrackWord(state, action: PayloadAction<boolean>) {
            const prevIdx = state.typedHistory.length - 1;
            state.currWord = state.wordList[prevIdx];
            state.typedWord = action.payload
                ? ""
                : state.typedHistory[prevIdx];
            state.typedHistory = state.typedHistory.slice(0, prevIdx);
        },
        setWordList(state, action: PayloadAction<string[]>) {
            const shuffledList = [...action.payload].sort(
                () => Math.random() - 0.5
            );
            state.wordList = shuffledList;
            state.currWord = shuffledList[0];
            state.typedHistory = [];
            state.typedWord = "";
        },
        setRef(state, action: PayloadAction<RefObject<HTMLDivElement>>) {
            state.activeWordRefId = action.payload;
        },
        setCaretRef(
            state,
            action: PayloadAction<RefObject<HTMLSpanElement>>
        ) {
            state.caretRefId = action.payload;
        },
    },
});

export const {
    setWord,
    setChar,
    appendTypedHistory,
    backtrackWord,
    setWordList,
    setRef,
    setCaretRef,
} = wordSlice.actions;
export default wordSlice.reducer;
