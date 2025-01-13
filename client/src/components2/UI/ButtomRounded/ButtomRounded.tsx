import { forwardRef } from 'react';
import Loading from '../Loading/Loading';
import './ButtonRounded.css';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: '1' | '2';
  loading?: boolean;
  active?: boolean;
}
type Ref = HTMLButtonElement;

export default forwardRef<Ref, Props>(function ButtonRounded(props, ref) {
  const {
    variant = '1',
    loading,
    className,
    children,
    disabled,
    active,
    ...restProps
  } = props;

  return (
    <button
      className={`button button--${variant} ${active ? 'active' : ''} ${
        disabled || loading ? 'button--disabled' : ''
      } ${loading ? 'button--loading' : ''} ${className || ''}`}
      disabled={disabled || loading}
      {...restProps}
      ref={ref}
    >
      {loading && <Loading type="spinner" className="loadingSpinner" />}
      {children}
    </button>
  );
});
