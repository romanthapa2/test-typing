import { useContext, useEffect, useRef, useState } from 'react';
import { TypingContext } from '../../../context/Typing.context';
import { TypingWords } from '../reducer/types';
import Caret from './caret/Caret'
import "./Input.css"

interface Props {
  words: TypingWords;
  wordIndex: number;
  charIndex: number;

  /* Used for the 1v1 mode */
  secondCaret?: { wordIndex: number; charIndex: number };
}

export default function Input(props: Props) {
  const { words, wordIndex, charIndex, secondCaret } = props;

  const { typingStarted, typingFocused, lineHeight, setLineHeight } =
    useContext(TypingContext);
  const [wordsOffset, setWordsOffset] = useState(0);

  const wordWrapperRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>();
  const charRef = useRef<HTMLSpanElement>();
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const secondCaretWordRef = useRef<HTMLDivElement>();
  const secondCaretCharRef = useRef<HTMLSpanElement>();

  useEffect(() => {
    if (typingStarted) hiddenInputRef.current?.focus();
  }, [typingStarted]);

  useEffect(() => {
    if (!wordWrapperRef.current) return;
    const { offsetTop, clientHeight } = wordWrapperRef.current;
    setWordsOffset(Math.max(offsetTop - clientHeight, 0));
  }, [charIndex]);

  const firstWord = words[0]?.chars.join('');

  useEffect(() => {
    setLineHeight((state) => wordWrapperRef.current?.clientHeight || state);

    const interval = setInterval(function () {
      setLineHeight((state) => {
        if (state === 0 || wordWrapperRef.current?.clientHeight !== state) {
          return wordWrapperRef.current?.clientHeight || state;
        }

        clearInterval(interval);
        return state;
      });
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className='wrapper' style={{ height: lineHeight * 3 }}>
      {words.length !== 0  && (
        <Caret
          lineHeight={lineHeight}
          wordIndex={wordIndex}
          charIndex={charIndex}
          wordsOffset={wordsOffset}
          firstWord={firstWord}
          wordRef={wordRef}
          charRef={charRef}
        />
      )}

      {typingStarted && secondCaret && (
        <Caret
          lineHeight={lineHeight}
          wordIndex={secondCaret.wordIndex}
          charIndex={secondCaret.charIndex}
          wordRef={secondCaretWordRef}
          charRef={secondCaretCharRef}
          firstWord={firstWord}
          wordsOffset={wordsOffset}
          className='secondCaret'
        />
      )}

      <input
        type="text"
        className={`hidden-input ${
          typingFocused ? 'hidden-input--nocursor' : ''
        }`}
        autoCapitalize="off"
        ref={hiddenInputRef}
        tabIndex={-1}
      />
      <div
        className='words'
        style={{
          transform:
            secondCaret || typingStarted
              ? `translateY(-${wordsOffset}px)`
              : undefined,
        }}
      >
        {words.map((word, index) => {
          const isCurrentWord = index === wordIndex;
          const isSecondCaretWord = secondCaret && index === secondCaret.wordIndex;

          return (
            <div
              key={index}
              className='wordWrapper'
              ref={isCurrentWord ? wordWrapperRef : undefined}
            >
              <div
                className={`word ${
                  word.isIncorrect ? 'wordIncorrect' : ''
                }`}
                ref={(node) => {
                  if (isCurrentWord) wordRef.current = node || undefined;
                  if (isSecondCaretWord)
                    secondCaretWordRef.current = node || undefined;
                }}
              >
                {word.chars.map((char, index) => (
                  <span
                    key={index}
                    className={`char ${
                      char.type !== 'none' ? `char--${char.type}` : ''
                    }`}
                    ref={(node) => {
                      if (isCurrentWord && index === charIndex) {
                        charRef.current = node || undefined;
                      }
                      if (isSecondCaretWord && index === secondCaret.charIndex) {
                        secondCaretCharRef.current = node || undefined;
                      }
                    }}
                  >
                    {char.content}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}