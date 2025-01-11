import { useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { TypingContext } from '../../context/Typing.context';
import { TypemodeContext } from '../../context/TypeMode.context';
import { getRandomQuoteByLength } from '../../services/Quoteable';
import { TypingResult } from '../../types';
import { getRandomWords, getTypingWords } from '../../helper/index';
import lock from "../../../public/lock.svg"
import  useSound  from '../../hooks/useSound';
import typewriterSound from '@/assets/audio/typewriter.wav';
import typingReducer, {initialState}  from './reducer/typing.reducer';
import  Loading  from '../UI/Loading/Loading';
import Input from './Input';
import Restart from './Restart/Restart';
import Counter from './Counter/Counter';
import LoadingError from './LoadingError';
import counterStyles from './Counter/Counter.module.scss';
import styles from './typing.css';
import Result from './result/Result';

interface Props {
  testText?: string;
  secondCaret?: { wordIndex: number; charIndex: number };
  oneVersusOne?: boolean;
  typeModeCustom?: string;
  onCaretPositionChange?: (wordIndex: number, charIndex: number) => void;
  onResult?: (result: TypingResult) => void;
}

// Used to abort previous fetch call if new one is called
let quoteAbortController: AbortController | null = null;

export default function Typing(props: Props) {
  const {
    testText,
    secondCaret,
    oneVersusOne,
    typeModeCustom,
    onCaretPositionChange,
    onResult,
  } = props;

  const {
    typingDisabled,
    typingStarted,
    typingFocused,
    onUpdateTypingFocus,
    onTypingStarted,
    onTypingEnded,
    setTypemodeVisible,
  } = useContext(TypingContext);
  const [state, dispatch] = useReducer(typingReducer, initialState);
  const {
    mode,
    words,
    time,
    quote,
    numbers,
    punctuation,
    quoteTags,
    quoteTagsMode,
  } = useContext(TypemodeContext);
  const [isCapsLock, setIsCapsLock] = useState(false);
  const [timeCountdown, setTimeCountdown] = useState<number>(time);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<404 | 500 | null>(null);
  const playTypingSound = useSound(typewriterSound, 0.3);

  const isTypingDisabled =
    typingDisabled || isLoading || loadingError || (oneVersusOne && !typingStarted);

  useEffect(() => {
    const handleMouseMove = () => {
      onUpdateTypingFocus(false);
    };

    if (typingFocused) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [typingFocused]);

  useEffect(() => {
    const typeHandler = (event: KeyboardEvent) => {
      const { key } = event;

      if (key === 'Escape') {
        onUpdateTypingFocus(false);
      }

      if (event.getModifierState && event.getModifierState('CapsLock')) {
        setIsCapsLock(true);
      } else {
        setIsCapsLock(false);
      }
      if (event.ctrlKey && key === 'Backspace') {
        onUpdateTypingFocus(true);
        return dispatch({ type: 'DELETE_WORD' });
      }
      if (key === 'Backspace') {
        onUpdateTypingFocus(true);
        return dispatch({ type: 'DELETE_KEY' });
      }
      if (key === ' ') {
        event.preventDefault();
        onUpdateTypingFocus(true);
        return dispatch({ type: 'NEXT_WORD' });
      }
      if (key.length === 1) {
        if (!typingStarted && !oneVersusOne) {
          onTypingStarted();
        }
        onUpdateTypingFocus(true);
        return dispatch({ type: 'TYPE', payload: key });
      }
    };
    if (state.result.showResult || isTypingDisabled) {
      document.removeEventListener('keydown', typeHandler);
    } else document.addEventListener('keydown', typeHandler);

    return () => document.removeEventListener('keydown', typeHandler);
  }, [
    typingStarted,
    onTypingStarted,
    state.result.showResult,
    mode,
    quote,
    time,
    words,
    isTypingDisabled,
    playTypingSound,
    oneVersusOne,
  ]);

  useEffect(() => {
    if (typingStarted) {

      dispatch({
        type: 'START',
        payload:
          typeModeCustom ||
          `${mode} ${mode === 'time' ? time : mode === 'words' ? words : quote}`,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typingStarted]);

  const onRestart = useCallback(() => {
    onTypingEnded();
    onUpdateTypingFocus(false);

    quoteAbortController?.abort();
    quoteAbortController = new AbortController();
    setIsLoading(false);
    setLoadingError(null);

    if (testText !== undefined) {
      if (!testText.trim().length) {
        setIsLoading(true);
      } else {
        dispatch({ type: 'RESTART', payload: getTypingWords(testText.split(' ')) });
        setIsLoading(false);
      }
    }

    if (!oneVersusOne) {
      if (mode === 'time') {
        dispatch({
          type: 'RESTART',
          payload: getRandomWords(50, punctuation, numbers),
        });
        setTimeCountdown(time);
      } else if (mode === 'words') {
        dispatch({
          type: 'RESTART',
          payload: getRandomWords(words, punctuation, numbers),
        });
      } else {
        dispatch({ type: 'RESTART', payload: [] });

        setIsLoading(true);

        const tags =
          quoteTagsMode === 'only selected' && quoteTags.length
            ? quoteTags.filter((tag) => tag.isSelected).map((tag) => tag.name)
            : undefined;

        getRandomQuoteByLength(quote, tags, quoteAbortController).then((data) => {
          if (
            (data.statusCode && data.statusCode === 404) ||
            data.statusCode === 500
          ) {
            setLoadingError(data.statusCode);
            setIsLoading(false);
            return;
          }

          dispatch({
            type: 'NEW_WORDS',
            payload: {
              words: getTypingWords(
                data.content.replace(/—/g, '-').replace(/…/g, '...').split(' ')
              ),
              author: data.author,
            },
          });

          setIsLoading(false);
          setLoadingError(null);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    time,
    mode,
    words,
    quote,
    testText,
    oneVersusOne,
    numbers,
    punctuation,
    quoteTagsMode,
  ]);

  const onRepeat = () => {
    onTypingEnded();
    onUpdateTypingFocus(false);
    dispatch({ type: 'RESTART' });

    if (mode === 'time') {
      setTimeCountdown(time);
    }
  };

  useEffect(() => {
    if (!state.words.length || (mode === 'time' && !oneVersusOne)) return;

    const lastWordCorrect =
      state.wordIndex === state.words.length - 1 &&
      state.words[state.wordIndex].chars.every((char) => char.type === 'correct');

    if (state.wordIndex === state.words.length || lastWordCorrect) {
      dispatch({ type: 'RESULT' });
      onUpdateTypingFocus(false);
    }
  }, [mode, state.words, state.charIndex, state.wordIndex, oneVersusOne]);

  useEffect(() => {
    if (oneVersusOne) return;

    if (mode === 'time') {
      if ((state.wordIndex + 1) % 10 === 0) {
        dispatch({
          type: 'ADD_WORDS',
          payload: getRandomWords(10, punctuation, numbers),
        });
      }
    }
  }, [mode, state.wordIndex, oneVersusOne]);

  useEffect(() => {
    onRestart();

    return () => {
      quoteAbortController?.abort();
    };
  }, [onRestart]);

  useEffect(() => {
    let interval: NodeJS.Timer;

    if (typingStarted) {
      interval = setInterval(() => {
        dispatch({ type: 'TIMELINE' });

        if (mode === 'time' && !oneVersusOne)
          setTimeCountdown((prevState) => prevState - 1);
      }, 1000);
    } else {
      clearInterval(interval!);
    }

    return () => clearInterval(interval);
  }, [typingStarted, mode, oneVersusOne]);

  useEffect(() => {
    if (timeCountdown === 0) {
      dispatch({ type: 'RESULT', payload: time });
      onUpdateTypingFocus(false);
    }
  }, [timeCountdown, time]);

  useEffect(() => {
    if (state.result.showResult) {
      onTestsCompletedUpdate(state.result);

      if (onResult) {
        onResult(state.result);
        onTypingEnded();
      }

      setTypemodeVisible(false);
    } else {
      setTypemodeVisible(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.result.showResult]);

  useEffect(() => {
    if (onCaretPositionChange) {
      onCaretPositionChange(state.wordIndex, state.charIndex);
    }
  }, [state.wordIndex, state.charIndex, onCaretPositionChange]);

  const timelineLatest = state.result.timeline[state.result.timeline.length - 1];

  return (
    <div className={styles.typing}>
      {!state.result.showResult || oneVersusOne ? (
        <>
          <div className={styles.liveResult}>
            
              <div className={styles.liveResultItem}>
                <span>wpm</span>
                <span>{timelineLatest?.wpm || '-'}</span>
              </div>
            
            
              <div className={styles.liveResultItem}>
                <span>accuracy</span>
                <span>{timelineLatest?.accuracy || '-'}</span>
              </div>
            
          </div>

          <div
            className={styles['typing__container']}
            style={{ width: 5 * 0.95 + '%' }}
          >
            {oneVersusOne && state.result.showResult ? (
              <div className={counterStyles.counter}>
                Waiting for your opponent to finish...
              </div>
            ) : (
              <Counter
                mode={oneVersusOne ? 'quote' : mode}
                counter={
                  mode === 'time' && !oneVersusOne ? timeCountdown : state.wordIndex
                }
                wordsLength={state.words.length}
              />
            )}

            {isCapsLock && (
              <div className={styles.capslock}>
                <img src={lock} className={styles.icon} />
                <p>CAPS LOCK</p>
              </div>
            )}
            {loadingError && state.words.length === 0 ? (
              <LoadingError status={loadingError} />
            ) : (
              <Input
                words={state.words}
                wordIndex={state.wordIndex}
                charIndex={state.charIndex}
                secondCaret={secondCaret}
              />
            )}
            {!oneVersusOne && (
              <Restart onRestart={onRestart} className={styles.restart} />
            )}
          </div>
        </>
      ) : (
        <Result result={state.result} onRestart={onRestart} onRepeat={onRepeat} />
      )}

      {isLoading && <Loading type="spinner" className={styles['loading-spinner']} />}
    </div>
  );
}