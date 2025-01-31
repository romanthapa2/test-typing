import { forwardRef, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import "../styleSheets/test.css";

const Test =forwardRef<HTMLDivElement>((props,ref)=> {
    const {
        word: { typedWord, currWord, wordList, typedHistory },
        time: { timer },
    } = useSelector((state: RootState) => state);
    const extraLetters = typedWord.slice(currWord.length).split("");
    const caretRef = useRef<HTMLSpanElement>(null);

    return (
        <div className="test">
            <div className="timer">{timer}</div>
            <div className="box">
                {wordList.map((word, idx) => {
                    const isActive =
                        currWord === word && typedHistory.length === idx;
                    return (
                        <div
                            key={word + idx}
                            className="word"
                            ref={isActive ? ref : null}>
                            {isActive ? (
                                <span
                                    ref={caretRef}
                                    id="caret"
                                    className="blink"
                                    style={{
                                        left: typedWord.length * 14.5833,
                                    }}>
                                    |
                                </span>
                            ) : null}
                            {word.split("").map((char, charId) => {
                                return <span key={char + charId}>{char}</span>;
                            })}
                            {isActive
                                ? extraLetters.map((char, charId) => {
                                      return (
                                          <span
                                              key={char + charId}
                                              className="wrong extra">
                                              {char}
                                          </span>
                                      );
                                  })
                                : typedHistory[idx]
                                ? typedHistory[idx]
                                      .slice(wordList[idx].length)
                                      .split("")
                                      .map((char, charId) => {
                                          return (
                                              <span
                                                  key={char + charId}
                                                  className="wrong extra">
                                                  {char}
                                              </span>
                                          );
                                      })
                                : null}
                        </div>
                    );
                })}
            </div>
        </div>
    );
})

export default Test;