import { TypingResult } from "../types";
import { TypingWords } from "./types";

export type TypingResultReducer = TypingResult & { showResult: boolean };

export type TypingState = {
    wordIndex: number;
    charIndex: number;
    words: TypingWords;
    mistype: number;
    typed: number;
    typedCorrectly: number;
    result: TypingResultReducer;
    dateTypingStarted: number | null;
  };