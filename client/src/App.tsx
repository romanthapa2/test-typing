import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/Header";
import Test from "./components/Test";
import Result from "./components/Result";
import { RootState } from "./store/store";
// import { State } from "store/reducer";
// import { setTimerId } from "store/actions";
import { setTimerId } from "./store/timeSlice";
import  {recordTest}  from "./helper/recordTest";
import "./styleSheets/themes.css"
import CommandPallet from "./components/CommandPallet";
import { useRef } from "react";

export default function App() {
    const {
        time: { timerId, timer },
        word: { currWord, typedWord },
    } = useSelector((state: RootState) => state);
    const dispatch = useDispatch();
    const [showPallet, setShowPallet] = useState(false);
    const activeWordRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.onkeydown = (e) => {
            if (e.ctrlKey && e.key === "k") {
                setShowPallet((s) => !s);
                e.preventDefault();
            } else if (
                e.key.length === 1 ||
                e.key === "Backspace" ||
                e.key === "Tab"
            ) {
                recordTest(e.key, e.ctrlKey);
                e.preventDefault();
            }
        };
        return () => {
            document.onkeydown = null;
        };
    }, [dispatch]);

    useEffect(() => {
        let idx = typedWord.length - 1;
        const currWordEl = activeWordRef.current;
        if (currWordEl && currWordEl.children) {
            const child = currWordEl.children[idx + 1] as HTMLElement;
            if (child) {
                child.classList.add(
                    currWord[idx] !== typedWord[idx] ? "wrong" : "right"
                );
            }
        }
    }, [currWord, typedWord]);

    useEffect(() => {
        let idx = typedWord.length;
        const currWordEl = activeWordRef.current;
        if (currWordEl && idx < currWord.length) {
            const child = currWordEl.children[idx + 1] as HTMLElement;
            if (child) {
                child.classList.remove("wrong", "right");
            }
        }
    }, [currWord.length, typedWord]);

    useEffect(() => {
        if (!timer && timerId) {
            clearInterval(timerId);
            dispatch(setTimerId(null));
        }
    }, [dispatch, timer, timerId]);

    return (
        <>
            <Header />
            {showPallet && <CommandPallet setShowPallet={setShowPallet} />}
            {timer ? <Test ref={activeWordRef}/> : <Result />}
        </>
    );
}
