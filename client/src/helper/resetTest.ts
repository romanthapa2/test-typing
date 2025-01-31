import { useDispatch, useSelector } from "react-redux";
import { setWordList } from "../store/wordSlice";
import { setTimerId,timerSet } from "../store/timeSlice";
import { RootState } from "../store/store";

const useResetTest = () => {
    const dispatch = useDispatch();
    const { timerId, timeLimit, type } = useSelector((state:RootState) => ({
        timerId: state.time.timerId,
        timeLimit: state.preferences.timeLimit,
        type: state.preferences.type,
    }));

    const resetTest = async () => {
        document
            .querySelectorAll(".wrong, .right")
            .forEach((el) => el.classList.remove("wrong", "right"));


        if (timerId) {
            clearInterval(timerId);
            dispatch(setTimerId(null));
        }

        // const words = await import(`wordlists/${type}.json`);
        // dispatch(setWordList(words.default));


        dispatch(timerSet(timeLimit));
    };

    return resetTest;
};

export default useResetTest;
