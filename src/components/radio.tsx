import classNames from 'classnames';
import React, { CSSProperties, HTMLAttributes, ReactElement } from 'react';
import styled from 'styled-components';
import ImageModifications from './ImageModifications';

const RadioBoxStyle = styled.div`
  &.radio.type-primary label {
    padding: 0;
    font-size: 17px;
    line-height: 21px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 61px;
  }

  &.radio.type-primary .custom-input-holder {
    display: none;
  }

  &.radio.type-primary .label-text {
    padding: 19px 15px;
    background: var(--pallete-background-default);
    display: block;
    text-align: center;
    border-radius: 5px;
    min-height: inherit;
    width: 100%;
    transition: all 0.4s ease;

    .sp_dark & {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    &:after {
      .sp_dark & {
        display: none;
      }
    }
  }

  &.radio.type-primary.with-icon .label-text {
    padding-left: 42px;
  }

  &.radio.type-primary .icon {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translate(0, -50%);
    color: #8889a3;
    max-width: 42px;
  }

  &.radio.type-primary.only-icon .icon {
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.4s ease;
  }

  &.radio.type-primary .icon svg {
    min-width: 30px;
    height: auto;
  }

  &.radio.type-primary [type='radio']:checked ~ .label-text {
    background: var(--pallete-primary-main);
    color: #fff;
  }

  &.radio.type-primary [type='radio']:checked + .icon {
    color: #fff;
  }

  &.radio.type-primary .label-text:after {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border: 1px solid var(--pallete-primary-main);
    opacity: 1;
    transition: all 0.4s ease;
  }

  &.radio.type-primary:hover .label-text:after {
    border-width: 2px;
  }
  .icon img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }
`;

export interface IStyles {
  main?: CSSProperties;
  label?: CSSProperties;
  input?: CSSProperties;
}
export interface IClasses {
  main?: string;
  label?: string;
}
export interface IRadio extends HTMLAttributes<HTMLInputElement> {
  value?: string;
  label?: string | React.ReactNode;
  checked?: boolean | undefined;
  name?: string;
  border?: boolean;
  classes?: { main?: string; label?: string };
  styles?: IStyles;
  className?: string;
  small?: boolean;
  alt?: boolean;
  type?: 'default' | 'primary' | 'secondary';
  inlineBlock?: boolean;
  render?: (prop: Partial<IRadio>) => React.ReactNode;
  icon?: string | ReactElement;
  activeIcon?: string | ReactElement;
  fallbackUrl?: string;
  imgSettings?: ImageSizesProps['settings'];
}

const radio = ({
  onBlur,
  defaultChecked,
  label,
  checked,
  value,
  border = false,
  alt = false,
  small = false,
  onChange,
  name,
  classes = {},
  className,
  render,
  styles = {},
  type = 'default',
  inlineBlock,
  icon,
  activeIcon = '',
  fallbackUrl = '',
  imgSettings = {
    onlyMobile: true,
  },

  ...rest
}: IRadio) => {
  const { main: mainClass, label: labelClass } = classes;
  const { main: mainStyle, label: labelStyle, input: inputStyle } = styles;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e);
  };
  const handleBlur = (e: any) => {
    onBlur && onBlur(e);
  };

  const iClasses = classNames('radio', {
    alt,
    'inline-block': inlineBlock,
    [`type-${type}`]: type,
    short: small,
    'radio-border': border || alt,
    'with-icon': icon && label,
    'only-icon': icon && !label,
  });
  return (
    <RadioBoxStyle
      className={`${render ? `radio-box ${mainClass}` : className || iClasses}`}
      style={mainStyle}
    >
      <label className={labelClass} style={labelStyle}>
        <input
          type="radio"
          name={name}
          style={{ display: 'none', ...inputStyle }}
          onChange={handleChange}
          onBlur={handleBlur}
          defaultChecked={defaultChecked}
          checked={checked}
          value={value}
          {...rest}
        />
        {render ? (
          render({ checked, name })
        ) : (
          <>
            {icon && (
              <span className="icon">
                {typeof icon === 'string' ? (
                  <ImageModifications
                    src={icon}
                    alt="icon"
                    imgeSizesProps={imgSettings}
                    fallbackUrl={fallbackUrl}
                  />
                ) : (
                  icon
                )}
              </span>
            )}
            <span className="custom-input-holder">
              <span
                className={`custom-input ${activeIcon ? 'active_icon' : ''}`}
              >
                {checked ? activeIcon : ''}
              </span>
            </span>
            <span className="label-text">{label}</span>
          </>
        )}
      </label>
    </RadioBoxStyle>
  );
};

export default radio;
