import { Loading } from 'assets/svgs';
import classNames from 'classnames';
import React, { forwardRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import 'styles/NButton.module.css';
import { omit } from 'util/index';
export interface BaseButtonProps {
  type?: ButtonType;
  icon?: React.ReactNode;
  shape?: ButtonShape;
  size?: 'x-small' | 'small' | 'middle' | 'large' | 'x-large';
  isLoading?: boolean;
  prefixCls?: string;
  className?: string;
  outline?: boolean;
  dashed?: boolean;
  danger?: boolean;
  block?: boolean;
  children?: React.ReactNode;
  ref: React.ForwardedRef<any>;
  htmlType: ButtonHTMLType;
}

const ButtonStyle = styled.div`
  &.button {
    min-width: 182px;
    font-size: 15px;
    font-weight: 500;
    line-height: 18px;
    letter-spacing: 0.15px;
    padding: 8px 10px;
    text-align: center;
    border: 2px solid transparent;
    border-radius: 5px;
    transition: all 0.4s ease;
    position: relative;
    display: inline-block;
    vertical-align: top;

    @media (max-width: 767px) {
      min-width: 160px;
    }

    @media (max-width: 480px) {
      min-width: 120px;
    }

    .star {
      #Layer_1 {
        path {
          fill: transparent;
        }
      }

      #Layer_2 {
        path {
          fill: #fff;
        }
      }
    }

    &.btn-disabled {
      pointer-events: none;
    }

    &.button-loading {
      .text-button {
        padding-left: 25px;
      }
    }

    .loading-icon {
      width: 0;
      transition: all 0.4s ease;
    }

    .icon-url {
      width: 27px;
      height: 27px;
      top: 50%;
      left: 8px;
      border-radius: 50%;
      position: absolute;
      border: 1px solid #fff;
      -webkit-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
      background: #7bd6f7;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    .icon-edit {
      width: 27px;
      height: 27px;
      top: 50%;
      left: 8px;
      border-radius: 50%;
      position: absolute;
      padding: 2px;
      color: white;
      border: 1px solid #fff;
      -webkit-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
      background: var(--pallete-text-main-250);
    }

    .text {
      display: inline-block;
      vertical-align: middle;
      transition: all 0.4s ease;
    }

    .text-button {
      display: inline-block;
      vertical-align: middle;
      transition: padding 0.4s ease;
    }

    .img {
      display: inline-block;
      vertical-align: middle;
    }

    .custom-icon {
      width: 20px;
      display: inline-block;
      vertical-align: top;
      margin: 0 10px 0 0;

      svg {
        max-width: 100%;
        height: auto;
      }
    }

    &:disabled {
      opacity: 0.7;
      pointer-events: none;
    }

    &.button-small {
      min-width: 104px;
    }

    &.button-sm {
      font-size: 13px;
      line-height: 18px;
      padding: 6px 10px;
      min-width: 135px;
      border: 1px solid transparent;

      svg {
        max-width: 14px;
        max-height: 14px;
      }
    }

    &.button-xs {
      font-size: 12px;
      line-height: 14px;
      padding: 5px 10px;
      border: 1px solid transparent;
      min-width: 58px;
    }

    &.button-lg {
      font-size: 18px;
      line-height: 20px;
      padding: 10px 20px;
      border: 1px solid transparent;

      svg {
        max-width: 24px;
        height: auto;
        margin: -5px 5px 0 0;
      }
    }

    &.button-xl {
      font-size: 22px;
      line-height: 26px;
      padding: 14px 10px;
      border: 1px solid transparent;

      svg {
        max-width: 30px;
        max-height: 30px;
      }
    }

    .plus {
      display: inline-block;
      vertical-align: middle;
      width: 14px;
      height: 14px;
      background: var(--pallete-background-default);
      border-radius: 100%;
      position: relative;
      font-size: 8px;
      line-height: 14px;
      color: var(--pallete-primary-main);
      font-weight: 700;
      margin: 0 10px 0 0;
    }

    + .button {
      margin-left: 14px;
    }

    svg {
      display: inline-block;
      vertical-align: middle;
      margin: -3px 5px 0 0;
    }

    &:hover {
      background: none;
      color: #fff;
      border-color: #fff;
    }

    &.button-dashed {
      background: none;
      border-style: dashed;

      &:hover {
        background: var(--colors-indigo-200);
        color: #fff;
        border-color: var(--colors-indigo-200);
      }
    }

    &.button-outline {
      background: none;
      color: #acacac;
      border-color: #353535;

      &:hover {
        background: none;
        border-color: #fff;
        color: #fff;
      }
    }

    &.bg-blue {
      background: var(--pallete-primary-main);

      &:hover {
        background: var(--colors-indigo-200);
      }

      path {
        fill: currentColor;
      }
    }
  }

  &.button-primary {
    background: var(--pallete-primary-main);
    color: #fff;

    &.button-dashed,
    &.button-outline {
      border-color: var(--pallete-primary-main);
      color: var(--pallete-primary-main);
    }

    &.button-danger {
      background: #f00;

      &:hover {
        background: #940b0b;
      }
    }
  }

  &.button-default {
    background: #ebeef1;
    color: #72777d;

    &.button-dashed,
    &.button-outline {
      color: var(--pallete-text-main-250);
      border-color: var(--pallete-colors-border);
    }
  }

  &.button-secondary {
    background: #7ccf78;
    color: #fff;

    &.button-dashed,
    &.button-outline {
      border-color: #7ccf78;
      color: #7ccf78;
    }
  }

  &.button-info {
    background: #d4d4d4;
    color: #fff;

    .sp_dark & {
      background: #333;
    }

    &.button-dashed,
    &.button-outline {
      border-color: #d4d4d4;
      color: #d4d4d4;
    }
  }

  &.button-circle {
    border-radius: 50px;

    .loading-icon {
      margin: 0 5px -1px;
    }
  }

  &.button-block {
    display: block;
    width: 100%;
  }

  &.button-text {
    background: none;
    border: none;
    outline: none;

    .sp_dark & {
      color: currentColor;
    }

    &:hover {
      color: var(--colors-indigo-200);
      background: none;

      .sp_dark & {
        color: #fff;
      }
    }
  }

  &.button-link {
    background: none;
    border: none;
    outline: none;
    color: var(--pallete-primary-main);

    &:hover {
      background: none;
      color: var(--colors-indigo-200);
    }
  }

  &.button-icon-only {
    width: 32px;
    height: 32px;
    padding: 2px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    min-width: inherit;

    /* .sp_dark & { */
    color: var(--pallete-text-main);
    background: var(--pallete-colors-border);

    &:hover {
      background: var(--pallete-primary-light);
      border-color: var(--pallete-primary-light);
    }
    /* } */

    .loading-icon {
      width: auto;
    }

    .text-button {
      display: none;
    }

    svg {
      margin: 0;
      max-width: 26px;
      max-height: 26px;
    }

    &.button-xs {
      width: 27px;
      height: 27px;
      min-width: inherit;
      padding: 2px;

      svg {
        max-width: 20px;
        max-height: 20px;
      }
    }

    &.button-sm {
      width: 30px;
      height: 30px;
      padding: 2px;

      svg {
        max-width: 22px;
        max-height: 22px;
      }
    }

    &.button-lg {
      width: 36px;
      height: 36px;
      padding: 2px;

      svg {
        max-width: 30px;
        max-height: 30px;
      }
    }
    &.button-xl {
      width: 40px;
      height: 40px;
      padding: 2px;

      svg {
        max-width: 30px;
        max-height: 30px;
      }
    }

    &.button-round {
      width: auto;
      padding: 2px 12px;
    }
  }

  &.social-btn {
    padding: 12px 10px;

    svg {
      margin: 0 15px 0 0;
    }
  }

  .loading-icon {
    display: inline-block;
    vertical-align: middle;
    margin: 0 5px;
  }

  .anticon-spin {
    border: 2px solid transparent;
    border-radius: 50%;
    border-top: 2px solid currentColor;
    border-right: 2px solid currentColor;
    width: 16px;
    height: 16px;
    -webkit-animation: rotation 2s infinite linear;
    animation: rotation 2s infinite linear;
    display: inline-block;
    vertical-align: middle;
    margin: -1px 0 0;

    svg {
      margin: 0;
      display: none;
    }
  }

  .anticon-spin svg {
    margin: 0;
  }
`;

export type ButtonType =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'dashed'
  | 'link'
  | 'text'
  | 'outline';
export type ButtonShape = 'circle' | 'round';
export type ButtonHTMLType = 'submit' | 'button' | 'reset';

export type AnchorButtonProps = {
  href: string;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
} & BaseButtonProps &
  Omit<React.AnchorHTMLAttributes<any>, 'type' | 'onClick'>;

export type NativeButtonProps = {
  htmlType?: ButtonHTMLType;
  onClick?: React.MouseEventHandler<HTMLElement>;
} & BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<any>, 'type' | 'onClick'>;

export type ButtonProps = Partial<AnchorButtonProps & NativeButtonProps>;

const Button: React.FC<ButtonProps> = forwardRef((props, ref) => {
  const {
    isLoading = false,
    prefixCls: customPrefixCls,
    type,
    danger,
    shape,
    size: customizeSize,
    className,
    children,
    htmlType,
    icon,
    outline = false,
    dashed = false,
    block = false,
    ...rest
  } = props;

  const handleClick = (e: any) => {
    const { onClick, disabled } = props;
    if (isLoading || disabled) {
      e.preventDefault();
      return;
    }
    (
      onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
    )?.(e);
  };

  let sizeCls = '';
  switch (customizeSize) {
    case 'x-large':
      sizeCls = 'xl';
      break;
    case 'large':
      sizeCls = 'lg';
      break;
    case 'small':
      sizeCls = 'sm';
      break;
    case 'x-small':
      sizeCls = 'xs';
      break;
    default:
      break;
  }

  const prefixCls = customPrefixCls || 'button';
  const iconType = isLoading ? 'loading' : icon;
  const classes = classNames(
    prefixCls,
    {
      [`${prefixCls}-${type || 'default'}`]: type || 'default',
      [`${prefixCls}-${shape}`]: shape,
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [`${prefixCls}-icon-only`]: !children && children !== 0 && !!iconType,
      [`${prefixCls}-has-icon`]: icon,
      [`${prefixCls}-loading`]: isLoading,
      [`${prefixCls}-outline`]: outline,
      [`${prefixCls}-dashed`]: dashed,
      [`${prefixCls}-block`]: block,
      [`${prefixCls}-dangerous`]: !!danger,
    },
    className,
  );

  const iconNode =
    icon && !isLoading ? (
      icon
    ) : (
      <>
        {isLoading && (
          <span className="loading-icon">
            <span
              role="img"
              aria-label="loading"
              className="anticon anticon-loading anticon-spin"
            >
              <Loading />
            </span>
          </span>
        )}
      </>
    );

  const linkButtonRestProps = omit(
    rest as AnchorButtonProps & { navigate: any },
    ['navigate'],
  );
  if (linkButtonRestProps.href !== undefined) {
    return (
      <ButtonStyle
        as="a"
        {...linkButtonRestProps}
        className={classes}
        onClick={handleClick}
        ref={ref}
      >
        {iconNode}
        <span className="text-button">{children}</span>
      </ButtonStyle>
    );
  }

  return (
    <ButtonStyle
      as="button"
      {...(rest as NativeButtonProps)}
      type={htmlType || 'button'}
      className={classes}
      onClick={handleClick}
      ref={ref}
    >
      {iconNode}
      <span className="text-button">{children}</span>
    </ButtonStyle>
  );
});

export const ButtonSkeleton: React.FC<{
  size: 'x-large' | 'large' | 'small' | 'x-small';
}> = ({ size }) => {
  const height = (() => {
    switch (size) {
      case 'x-large':
        return 60;
      case 'large':
        return 50;
      case 'small':
        return 40;
      case 'x-small':
        return 30;
      default:
        return 50;
    }
  })();
  return <Skeleton height={height} />;
};

export default Button;
