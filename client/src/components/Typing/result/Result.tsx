import { useContext, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Label,
  Tooltip as RechartsTooltip,
  Legend,
  Line,
} from 'recharts';
import { TypingContext } from '../../../context/Typing.context';
import { TypingResult } from '../../../types';
import { addColorOpacity, getTimeSince } from '../../../helper';
import  ButtonRounded  from '../../UI/ButtomRounded/ButtomRounded';
import PercentCircleChart from '../../UI/PercentCircleChart/PercentCircleChart';
import Tooltip from '../../UI/Tooltip';
import ResultCustomTooltip from '../ResultCustomToolTip/ResultCustomTooltip';
import "./Result.css"

export type ResultOptions = {
  includeDate?: boolean;
};

interface Props extends ResultOptions {
  result: TypingResult;
  onRestart?: () => void;
  onRepeat?: () => void;
  onGoBack?: () => void;
}

export default function Result(props: Props) {
  const { result, includeDate, onRestart, onRepeat, onGoBack } = props;

  const { onTypingEnded } = useContext(TypingContext);

  useEffect(() => {
    onTypingEnded();
  }, [onTypingEnded]);

  const textColorFromCSS = window
    .getComputedStyle(document.body)
    .getPropertyValue('--clr-text');
  const config = {
    colorWpm: textColorFromCSS,
    colorAccuracy: window
      .getComputedStyle(document.body)
      .getPropertyValue('--clr-char-incorrect'),
    colorRaw: addColorOpacity(textColorFromCSS, 0.6),
    labelOffset: -40,
    labelFontSize: 14,
  };

  const {
    wpm,
    raw,
    accuracy,
    second: timeTook,
  } = result.timeline[result.timeline.length - 1];

  return (
    <div className='result__wrapper'>
      {includeDate && result.date && (
        <Tooltip text={result.date.toLocaleString()} position="top" showOnHover>
          <div className='date'>{getTimeSince(result.date)}</div>
        </Tooltip>
      )}
      <div className='result'>
        <div className='wpm-accuracy-container'>
          <div className='wpm'>
            <p>WPM</p>
            <p className='wpm__num'>{wpm}</p>
          </div>
          <div className='accuracy'>
            <p>Accuracy</p>
            <PercentCircleChart
              percentage={accuracy}
              className='percentage-circle'
            />
          </div>
        </div>
        <div className='chart'>
          <ResponsiveContainer className='chart'>
            <LineChart data={result.timeline}>
              <XAxis dataKey="second" />
              <YAxis dataKey="raw" yAxisId="left">
                <Label
                  value="Words per Minute"
                  angle={-90}
                  fill={config.colorWpm}
                  fontSize={config.labelFontSize}
                  position="right"
                  offset={config.labelOffset}
                  className='label'
                />
              </YAxis>
              <YAxis
                domain={[0, 100]}
                dataKey="accuracy"
                yAxisId="right"
                orientation="right"
              >
                <Label
                  value="Accuracy"
                  angle={-90}
                  fill={config.colorAccuracy}
                  fontSize={config.labelFontSize}
                  position="left"
                  offset={config.labelOffset}
                  className='label'
                />
              </YAxis>
              <CartesianGrid className='cartesianGrid' />
              <RechartsTooltip content={<ResultCustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="wpm"
                yAxisId="left"
                dot={{
                  stroke: config.colorWpm,
                  strokeWidth: 5,
                  r: 1,
                }}
                strokeWidth={2}
                stroke={config.colorWpm}
              />
              <Line
                type="monotone"
                dataKey="raw"
                yAxisId="left"
                strokeWidth={2}
                dot={{
                  stroke: config.colorRaw,
                  strokeWidth: 5,
                  r: 1,
                }}
                stroke={config.colorRaw}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                yAxisId="right"
                strokeWidth={2}
                dot={{
                  stroke: config.colorAccuracy,
                  strokeWidth: 5,
                  r: 1,
                }}
                stroke={config.colorAccuracy}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className='more-and-restart'>
        <div className='more'>
          {result.testType && (
            <div className='item'>
              <p className='item__heading raw-heading'>
                test type
              </p>
              <p className='item__value'>{result.testType}</p>
            </div>
          )}
          <div className='item'>
            <p className='item__heading raw-heading'>
              raw
            </p>
            <p className='item__value'>{raw}</p>
          </div>
          <div className='item'>
            <p
              className={`item__heading error-heading ${
                result.errors === 0 ? 'error-heading--noerrors' : ''
              }`}
            >
              errors
            </p>
            <p className='item__value'>{result.errors}</p>
          </div>
          <div className='item'>
            <p className='item__heading'>time</p>
            <p className='item__value'>{timeTook}s</p>
          </div>
          {result.quoteAuthor && (
            <div className='item'>
              <p className='item__heading'>quote author</p>
              <p
                className='item__value quote-author-value'
              >
                {result.quoteAuthor}
              </p>
            </div>
          )}
        </div>
        <div className='buttons-wrapper'>
          {onRestart && (
            <ButtonRounded onClick={onRestart} className='btn'>
              <img src="/keyboard_arrow_left" alt="keyboard_arrow_left"
                className='btn__icon btn__icon--arrow'
              />
              <span>Next Test</span>
            </ButtonRounded>
          )}
          {onRepeat && (
            <ButtonRounded onClick={onRepeat} className='btn'>
              <img src='/loop' alt='loop' className='btn__icon' />
              <span>Repeat</span>
            </ButtonRounded>
          )}
          {onGoBack && (
            <ButtonRounded onClick={onGoBack} className='btn'>
              <img src='keyboard_arrow_left' alt='keyboard_arrow_left'
                className='btn__icon btn__icon--arrow'
              />
              <span>Go Back</span>
            </ButtonRounded>
          )}
        </div>
      </div>
    </div>
  );
}