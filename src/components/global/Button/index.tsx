import React from 'react';
import classNames from 'classnames';

interface Props extends React.HTMLAttributes<HTMLElement> {
  color?: string;
  outline?: boolean;
  active?: boolean;
  disabled?: boolean;
  link?: string;
  size?: 'sm' | 'md' | 'lg' | 'block';
}

const Button: React.FC<Props> = (props) => {
  const classes = classNames(
    'button',
    `button--${props.color}`,
    {
      'button-sm': props.size == 'sm',
      'button-md': props.size == 'md',
      'button-lg': props.size == 'lg',
      'button--block': props.block == 'block',
    },
    {
      'button--active': props.active,
    },
    {
      'disabled': props.disabled,
    },
    {
      'button-outline': props.outline,
    },
  );

  return (
    <button className={classes}>
      {props.children}
    </button>
  );
};

export default Button;
