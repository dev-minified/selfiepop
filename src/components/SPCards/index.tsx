import classNames from 'classnames';
import NewButton from 'components/NButton';
import { DashedLine } from 'components/Typography';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
export interface SPCardProps {
  icon?: ReactNode;
  title?: ReactNode | string;
  subtitle?: ReactNode | string;
  onClose?: Function;
  children?: ReactNode | undefined;
  showFooter?: boolean;
  showClose?: boolean;
  headerStyle?: any;
  type?: 'main' | 'sub-card';
  iconStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  extra?: React.ReactElement;
  classes?: { header?: string; card?: string };
  footer?: React.ReactElement;
  onCancel?: any;
  onSave?: any;
  className?: string;
  isloading?: boolean;
  bodyClass?: string;
  showDashedLine?: boolean;
  showCaption?: boolean;
  okButtonText?: string;
}

function Index({
  icon,
  title,
  onClose,
  children,
  iconStyle,
  headerStyle,
  titleStyle,
  extra,
  showFooter = true,
  showClose = true,
  classes = {},
  footer,
  onCancel,
  onSave,
  className,
  type,
  isloading,
  bodyClass,
  showDashedLine = true,
  showCaption = true,
  subtitle,
  okButtonText = 'Save',
}: SPCardProps) {
  const { header: headerClass, card: cardClass } = classes;
  const handleClose = () => {
    onClose && onClose();
  };
  return (
    <div
      className={classNames('sp__card', cardClass, className, {
        show__footer: showFooter,
        show__close: showClose,
        [`type-${type}`]: type,
      })}
    >
      <div className="pop-top-content">
        <div className={`header ${headerClass}`} style={headerStyle}>
          {icon && (
            <span className="icon" style={iconStyle}>
              {icon}
            </span>
          )}
          <div className="header-right">
            <div className="description-holder">
              <div className="title" style={titleStyle}>
                {title}
              </div>
              {showCaption && <div className="caption">{subtitle}</div>}
            </div>
            <div className="extras">{extra}</div>
          </div>
          {showClose && (
            <span className="btn-close" onClick={handleClose}>
              <span className="icon-clearclose"></span>
            </span>
          )}
        </div>
        {showDashedLine && <DashedLine className="dashed" />}
        {children && <div className={`body ${bodyClass}`}>{children}</div>}
      </div>
      {showFooter && (
        <>
          {footer || (
            <footer className="footer-card">
              <div className="footer-links">
                <NewButton
                  type="default"
                  size="large"
                  onClick={onCancel}
                  shape="circle"
                >
                  Cancel
                </NewButton>

                <NewButton
                  htmlType="submit"
                  type="primary"
                  size="large"
                  shape="circle"
                  onClick={onSave}
                  isLoading={isloading}
                >
                  {okButtonText}
                </NewButton>
              </div>
            </footer>
          )}
        </>
      )}
    </div>
  );
}

export default styled(Index)`
  border-radius: 0;
  background: var(--pallete-background-gray);
  // margin-bottom: 20px;
  overflow: hidden;

  &.advertise-card {
    border: 1px solid var(--pallete-colors-border);
    border-radius: 10px;
    .main--card--header {
      .icon {
        width: 100px;
        height: 100px;
        border: none;
      }
    }
    .header {
      .header-right {
        display: block;
      }
    }

    .body {
      border-top: 1px solid #e5e5e5;
      border-bottom: none;
      padding: 0;
    }

    .dashed {
      display: none;
    }
  }

  &.type-sub-card {
    border: 1px solid #dbeaf9;
    border-radius: 4px;
    overflow: visible;

    .body {
      padding: 20px 20px 0;

      @media (max-width: 480px) {
        padding: 20px 15px 0;
      }
    }

    .form-field {
      border: none;
      padding: 0;
    }

    .header {
      border-radius: 4px 4px 0 0;

      .icon {
        width: 24px;
        height: 24px;
        min-width: 24px;
        margin-right: 10px;

        svg {
          width: 12px;
          min-width: 12px;
        }
      }
    }

    .title {
      font-size: 15px;
    }

    .__add {
      .button {
        @media (max-width: 480px) {
          min-width: 100px;
        }
      }
    }

    .footer-card {
      border-radius: 0 0 4px 4px;
    }
  }

  .header {
    position: relative;
    display: flex;
    align-items: center;
    padding: 15px 25px 15px 19px;
    background: var(--pallete-background-default);

    .header-right {
      flex-grow: 1;
      flex-basis: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      .drag-dots {
        color: #b1b6b9;
        cursor: grabbing;

        &:hover {
          color: var(--pallete-primary-main);
        }
      }
    }

    .toggle-switch {
      .switcher {
        .sp_dark & {
          background: #333 !important;
        }
      }

      input:checked {
        + .switcher {
          .sp_dark & {
            background: #333 !important;
          }
        }
      }
    }

    > .icon {
      width: 54px;
      height: 54px;
      min-width: 52px;
      border: 2px solid var(--pallete-colors-border);
      border-radius: 100%;
      font-size: 19px;
      font-weight: 700;
      color: var(--pallete-primary-darker);
      background: var(--pallete-background-default);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 18px 0 0;
      position: relative;
      z-index: 1;

      svg {
        min-width: 25px;
        height: auto;

        &.img-chat {
          max-width: 30px;
        }
      }
      .img {
        width: 100%;
        height: 100%;
      }
    }

    .btn-close {
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      right: 20px;
      height: 24px;
      width: 24px;
      background-color: #a3a6a8;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 100%;
      color: white;
      transition: all 0.4s ease;
      cursor: pointer;

      @media (max-width: 767px) {
        right: 10px;
      }
    }
  }

  .description-holder {
    flex-grow: 1;
    flex-basis: 0;
  }

  .extras {
    > div {
      display: flex;
      align-items: center;
    }

    .button {
      margin: 0 0 0 10px;
    }

    label {
      margin: 0 0 0 10px;
    }
  }

  .pop-top-content {
    border-bottom: none;
    border-radius: 10px 10px 0px 0px;
    font-weight: 400;
  }

  .title {
    font-weight: 400;
    font-size: 20px;
  }

  .caption {
    font-weight: 400;
    color: var(--pallete-text-main-500);
    font-size: 13px;
  }

  .header .btn-close:hover {
    background: #000;
  }

  .body {
    padding: 33px 42px 17px;
    border-bottom: 1px solid var(--pallete-colors-border);

    @media (max-width: 767px) {
      padding: 20px 15px 15px;
    }
  }

  .label-area {
    .label-title {
      font-size: 15px;
      line-height: 18px;
      margin: 0 0 5px;
    }
  }

  .materialized-input.text-input {
    &.input-active {
      label {
        top: -8px;
      }
    }

    .form-control {
      color: var(--pallete-text-main);
    }

    label {
      background: none;
      z-index: 2;
      transform: none;

      &:before {
        position: absolute;
        left: 0;
        right: 0;
        top: 8px;
        content: '';
        height: 1px;
        background: var(--pallete-background-default);
      }

      span {
        position: relative;
        z-index: 3;
      }
    }
  }

  .form-field {
    border-bottom: 1px solid var(--pallete-colors-border);
    padding: 20px;
  }

  .lower-from .btn {
    flex-grow: 1;
    flex-basis: 0;
  }

  .custom-thumb-pop {
    border: none;
    padding: 10px 0;
  }

  .__add {
    margin: 0 0 20px;

    &.compact {
      .title {
        color: #4d5a69;
        font-weight: 500;
      }

      .has__error {
        .react-select__single-value {
          color: #f00;
        }
      }
    }
  }

  .price_variation_weidgt__wrap {
    margin: 0 -42px;

    @media (max-width: 767px) {
      margin: 0 -20px;
    }

    .social-ad-header-title {
      font-size: 15px;
      line-height: 18px;
      color: var(--pallete-text-main);
      font-weight: 500;
      margin: 0 0 5px;
    }

    .social-ad-header-desc {
      font-size: 14px;
    }

    .content {
      padding: 20px 40px;

      @media (max-width: 767px) {
        padding: 20px;
      }
    }

    // .rc-header {
    //   padding: 0;
    // }

    // .rc-according {
    //   .rc-header {
    //     padding: 11px 40px 11px 35px;
    //   }
    // }
  }

  .row-holder {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 0 -10px;

    .col-25 {
      width: 29%;
      padding: 0 10px;

      @media (max-width: 480px) {
        width: 100%;
      }
    }

    .col-75 {
      padding: 0 10px;
      flex-grow: 1;
      flex-basis: 0;
    }
  }

  .footer-card {
    padding: 30px 10px;
    background: var(--pallete-background-default);

    .sp_dark & {
      background: none;
    }
  }

  .footer-links {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .show__close .header {
    padding-right: 60px !important;

    @media (max-width: 767px) {
      padding-right: 40px !important;
    }
  }

  .lower-from:empty {
    padding: 0;
  }

  @media (max-width: 767px) {
    .header {
      padding: 10px;

      .icon {
        background: var(--pallete-background-default);
      }
    }

    .form-field,
    .lower-from {
      padding: 20px 0;
    }
  }

  .rc-card-header-large {
    .compact {
      &.social_variation_twitter {
        .header {
          .icon {
            color: #55acee;
          }
        }
      }

      &.social_variation_facebook {
        .header {
          .icon {
            color: #1877f2;
          }
        }
      }

      &.social_variation_youtube {
        .header {
          .icon {
            color: #f00;
          }
        }
      }

      &.social_variation_tiktok {
        .header {
          .icon {
            color: var(--pallete-text-main);
          }
        }
      }

      &.social_variation_onlyfans {
        .header {
          .icon {
            color: #00aff0;
          }
        }
      }

      .header {
        background: var(--pallete-background-default);

        .icon {
          min-width: 36px;
          width: 36px;
          height: auto;
          border-radius: 0;
          color: #724293;

          svg {
            width: 100%;
            height: auto;
          }
        }
      }

      .sub-item {
        .select-wrap {
          &.mb-30 {
            margin-bottom: 15px !important;
          }
        }

        .header {
          .icon {
            width: 24px;
            height: 24px;
            min-width: 24px;
            border-radius: 100%;

            svg {
              width: 12px;
              min-width: 12px;
            }
          }

          .title {
            text-transform: uppercase;
          }
        }
      }
    }

    .header {
      background: #f4f4f4;
      padding: 15px;
      border-bottom: 1px solid var(--pallete-colors-border);

      .icon {
        border: none;
        background: none;

        img {
          max-width: 100%;
          height: auto;
          vertical-align: top;
        }
      }
    }

    .dashed {
      display: none;
    }

    .body {
      border: none;
      padding: 20px 15px;
    }
  }

  &.paid-promotion {
    border: 1px solid var(--pallete-colors-border);
    border-radius: 6px;
    margin: 0 0 20px;
    background: var(--pallete-background-default);

    .compact {
      &.social_variation_twitter {
        .header {
          .icon {
            color: #55acee;
          }
        }
      }

      &.social_variation_facebook {
        .header {
          .icon {
            color: #1877f2;
          }
        }
      }

      &.social_variation_youtube {
        .header {
          .icon {
            color: #f00;
          }
        }
      }

      &.social_variation_tiktok {
        .header {
          .icon {
            color: var(--pallete-text-main);
          }
        }
      }

      &.social_variation_onlyfans {
        .header {
          .icon {
            color: #00aff0;
          }
        }
      }

      .header {
        background: var(--pallete-background-default);

        .icon {
          min-width: 36px;
          width: 36px;
          height: auto;
          border-radius: 0;
          color: #724293;

          svg {
            width: 100%;
            height: auto;
          }
        }
      }

      .sub-item {
        .select-wrap {
          &.mb-30 {
            margin-bottom: 15px !important;
          }
        }

        .header {
          .icon {
            width: 24px;
            height: 24px;
            min-width: 24px;
            border-radius: 100%;

            svg {
              width: 12px;
              min-width: 12px;
            }
          }

          .title {
            text-transform: uppercase;
          }
        }
      }
    }

    .header {
      background: var(--pallete-background-light);
      padding: 15px;
      border-bottom: 1px solid var(--pallete-colors-border);

      .icon {
        border: none;
        background: none;

        img {
          max-width: 100%;
          height: auto;
          vertical-align: top;
        }
      }
    }

    .dashed {
      display: none;
    }

    .body {
      border: none;
      padding: 20px 15px;
    }

    .__add {
      /* margin: 0; */
    }

    .actions-area {
      display: flex;
      flex-direction: row;
      align-items: flex-start;

      @media (max-width: 767px) {
        flex-wrap: wrap;
      }

      .button {
        width: 155px;
        min-width: 155px;
        margin: 0 20px 0 0;
        padding-left: 35px;
        padding-right: 15px;
        text-align: center;
        color: var(--pallete-text-main);
        border-color: #000;
        border-width: 1px;
        height: 40px;

        @media (max-width: 767px) {
          width: 100%;
          margin: 0 0 15px;
        }

        &:hover {
          color: #fff;
          border-color: var(--colors-indigo-200);
          background: var(--colors-indigo-200);
        }

        svg {
          position: absolute;
          left: 8px;
          top: 50%;
          transform: translate(0, -50%);
          margin: 0;
        }
      }

      .default {
        flex-grow: 1;
        flex-basis: 0;
        margin: 0;

        @media (max-width: 767px) {
          flex: inherit;
        }
      }
    }
  }

  .schedule-block {
    > .addition__art {
      &.shoutout-block {
        padding: 0;
      }
    }

    .shoutout-block {
      .rc-card-header {
        margin: 0;
        padding: 15px 42px;
      }

      .shoutout-block__body-area {
        padding: 30px 42px;
        position: relative;
        background: var(--pallete-background-gray);
      }

      .dashed-line {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
      }
    }
  }
`;
