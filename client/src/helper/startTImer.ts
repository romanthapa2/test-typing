import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTimerId, timerDecrement } from "../store/wordSlice";

const useStartTimer = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const timerId = setInterval(() => {
            dispatch(timerDecrement());
        }, 1000);

        dispatch(setTimerId(timerId));

        return () => clearInterval(timerId);
    }, [dispatch]);
};

export default useStartTimer;
