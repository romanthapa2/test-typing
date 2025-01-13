import { TypemodeType } from '../../../data/types';
import './Counter.css';

interface Props {
  mode: TypemodeType;
  counter: number;
  wordsLength: number;
}

export default function Counter(props: Props) {
  const { mode, counter, wordsLength } = props;

  const calcSeconds = mode === 'time' && String(counter % 60).padStart(2, '0');

  return (
    <div className='counter'>
      {mode === 'time' ? (
        <p>
          {+counter < 60
            ? calcSeconds
            : `${String(Math.floor(counter / 60)).padStart(2, '0')}:${calcSeconds}`}
        </p>
      ) : wordsLength !== 0 ? (
        <p>
          {counter} / {wordsLength}
        </p>
      ) : (
        <></>
      )}
    </div>
  );
}