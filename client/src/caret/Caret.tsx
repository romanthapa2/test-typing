import { useContext, useEffect, useState } from "react";
import { TypingContext } from "../context/Typing.context";
import "./Caret.css"

interface Props {
  lineHeight: number;
  wordIndex: number;
  charIndex: number;
  wordsOffset: number;
  firstWord: string;
  wordRef: React.MutableRefObject<HTMLDivElement | undefined>;
  charRef: React.MutableRefObject<HTMLSpanElement | undefined>;
  className?: string;
}

export default function Caret(props: Props) {
  const {
    lineHeight,
    wordIndex,
    charIndex,
    wordsOffset,
    firstWord,
    wordRef,
    charRef,
    className,
  } = props;

  const { typingStarted } = useContext(TypingContext);
  const [caretPos, setCaretPos] = useState({ x: 0, y: 0 });
  const [charWidth, setCharWidth] = useState(0);

  // const { caretStyle, fontSize, smoothCaret } = profile.customize;

  useEffect(() => {
    if (!wordRef.current) return;
    const {
      offsetLeft: wordOffsetLeft,
      offsetTop: wordOffsetTop,
      offsetWidth: wordOffsetWidth,
    } = wordRef.current;

    if (!charRef.current) {
      return setCaretPos({
        x: wordOffsetLeft + wordOffsetWidth,
        y: wordOffsetTop - wordsOffset,
      });
    }

    const { offsetLeft: charOffsetLeft } = charRef.current;
    setCaretPos({
      x: wordOffsetLeft + charOffsetLeft,
      y: wordOffsetTop - wordsOffset,
    });
  }, [
    wordIndex,
    charIndex,
    wordsOffset,
    firstWord,
    wordRef,
    charRef,
    lineHeight,
  ]);

  useEffect(() => {
    setCharWidth(charRef.current?.clientWidth || 0);
  }, [lineHeight]);

  const sizingStyle = ({
          width: charWidth / 9,
          height: lineHeight - 7 * 0.4,
          left: 0,
          top: 1,
        }
  ) as React.CSSProperties;


return (
  <div
    className={`caret caret--line smooth blink-smooth ${
      !typingStarted
          ? 'blink-smooth'
        : ''
    } ${className || ""}`}
    style={{
      transform: `translate(${caretPos.x}px, ${caretPos.y}px)`,
      ...sizingStyle,
    }}
  />
);
}
