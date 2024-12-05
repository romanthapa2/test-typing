import './Loading.css';

interface Props {
  type: 'spinner' | 'dot-flashing';
  className?: string;
}

export default function Loading(props: Props) {
  const { type, className } = props;

  return (
    <div className={className || ''}>
      <div className={type} />
    </div>
  );
}