import React from 'react';
import './PercentCircleChart.css';

interface Props {
  percentage: number;
  className?: string;
}

export default function PercentCircleChart(props: Props) {
  const { percentage, className } = props;

  const style = { '--percent': `${percentage}` } as React.CSSProperties;

  return (
    <div className={`circle ${className || ''}`} style={style}>
      <div className="circle__empty" />
      <div className="circle__filled" />
      <div className="circle__middle">
        <p
          className={`circle__text ${
            percentage >= 75 ? 'circle__text--success' : 'circle__text--fail'
          }`}
        >
          {percentage}%
        </p>
      </div>
    </div>
  );
}
