import React from 'react';
import { Link } from 'react-router-dom';

import './Button.scss';


const button = props =>
  !props.link ? (
    <button
      className={[
        'button__admin',
        `button__admin--${props.design}`,
        `button__admin--${props.mode}`
      ].join(' ')}
      onClick={props.onClick}
      disabled={props.disabled || props.loading}
      type={props.type}
    >
      {props.loading ? 'Loading...' : props.children}
    </button>
  ) : (
    <Link
      className={[
        'button__admin',
        `button__admin--${props.design}`,
        `button__admin--${props.mode}`
      ].join(' ')}
      to={`/${props.route}/${props.link}`}
    >
      {props.children}
    </Link>
  );

export default button;
