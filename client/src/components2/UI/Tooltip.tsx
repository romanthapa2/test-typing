import './Tooltip.css';


interface Props {
  text: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  show?: boolean;
  showOnHover?: boolean;
  offset?: number;
  width?: number;
  className?: string;
  style?: React.CSSProperties;
  classNamePopup?: string;
  backgroundColor?: string;
  pointerEvents?: boolean;
  children?: React.ReactNode;
}

export default function Tooltip(props: Props) {
  const {
    text,
    position = 'bottom',
    show,
    showOnHover,
    offset = 6,
    width = 'auto',
    className,
    style,
    classNamePopup,
    backgroundColor,
    pointerEvents,
    children,
  } = props;

  const textStyle = {
    '--offset': `${offset}px`,
    backgroundColor: backgroundColor,
    width,
  } as React.CSSProperties;

  return (
    <div
    className={`wrapper ${showOnHover ? 'wrapper--hover' : ''} ${
      show ? 'wrapper--show' : ''
    } ${className}`}
    style={style}
  >
    {children}

    <div
      className={`text text--${position} ${pointerEvents ? 'pointerEvents' : ''} ${classNamePopup}`}
      style={textStyle}
    >
      {text}
    </div>
  </div>
  );
}