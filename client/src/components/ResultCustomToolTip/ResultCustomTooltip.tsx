
import { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import './ResultCustomTooltip.css';

type Props = TooltipProps<ValueType, NameType>;

export default function ResultCustomTooltip(props: Props) {
  const { active, payload, label } = props;

  if (active && payload && payload.length) {
    return (
      <div className="container">
        <p className="label">{label}</p>
        <div>
          {payload.map((pld) => (
            <div key={pld.dataKey} className="item">
              <div
                className="item__color-block"
                style={{ backgroundColor: pld.color }}
              />
              <p className="item__text">
                <span>{pld.dataKey}: </span>
                <span className="item__value">{pld.value}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
