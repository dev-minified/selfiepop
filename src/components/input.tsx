import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export default function Input(props: any) {
  const hasIcon = !!props.hasIcon;
  const hasLabel = props.hasLabel === undefined && true;

  const inputBlurred = (e: any) => {
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  const onChange = (e: any) => {
    if (props.onChange) {
      props.onChange(e);
    }
  };

  let classes = 'text-input mb-20';
  if (hasIcon) classes += ' ico-input';
  if (props.inputClasses) classes += ` ${props.inputClasses}`;
  return (
    <div className={classes}>
      {hasIcon && (
        <div className="icon">
          <span className={`icon-${props.icon}`}></span>
        </div>
      )}
      {hasLabel && (
        <label htmlFor={props.id} className={props.labelClasses}>
          {props.label}
        </label>
      )}
      <input
        {...props}
        id={props.id}
        name={props.name}
        className={`form-control ${props.class || ''}`}
        onChange={onChange}
        style={{ ...props.style }}
        onBlur={inputBlurred}
        value={props.value}
        placeholder={props?.placeholder}
        ref={props?.formRef}
      />
      {props.touched && props.error && (
        <>
          <div
            id="title-error"
            style={{
              paddingBottom: 5,
              width: '100%',
              textAlign: 'right',
            }}
            className="error-msg is-invalid d-block"
          >
            <div>
              <FontAwesomeIcon
                style={{ marginRight: 3 }}
                icon={faExclamationCircle}
              />
              {props.error}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
