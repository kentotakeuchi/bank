import React from 'react';

import './Input.scss';

const input = props => {
  // console.log(`props`, props);

  return (
    <div className="input">
      {props.label && <label htmlFor={props.id}>{props.label}</label>}
      {props.control === 'input' && (
        <input
          className={[
            !props.valid ? 'invalid' : 'valid',
            props.touched ? 'touched' : 'untouched'
          ].join(' ')}
          type={props.type}
          id={props.id}
          required={props.required}
          value={props.value}
          placeholder={props.placeholder}
          onChange={e => props.onChange(props.type, e.target.value)}
          onBlur={props.onBlur}
        />
      )}
      {props.control === 'textarea' && (
        <textarea
          className={[
            !props.valid ? 'invalid' : 'valid',
            props.touched ? 'touched' : 'untouched'
          ].join(' ')}
          id={props.id}
          rows={props.rows}
          required={props.required}
          value={props.value}
          onChange={e => props.onChange(props.id, e.target.value)}
          onBlur={props.onBlur}
          disabled={props.isDisabled ? `disabled` : false}
        />
      )}
    </div>
  )
};

export default input;
