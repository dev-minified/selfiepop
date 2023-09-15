// import { toast } from 'components/toaster';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
// import AddMessage, { AddMessageView } from 'pages/schedule-messaging/components/RightView/AddMessage';
import { AddMessageView } from 'pages/schedule-messaging/components/RightView/AddMessage';
import React, { useState } from 'react';
import { setMessage, setPrice } from 'store/reducer/chat';
import styled from 'styled-components';
interface Props {
  onCloseTabs(): void;
  customButton?: React.ReactElement;
  onSend?: (message?: string, price?: number) => void | Promise<any>;
  onSubmit?: (
    files: any[],
    message?: string,
    price?: number,
    messageKey?: string,
  ) => void;
  defaultType?: 'pay-to-view' | 'standard';
  media?: ChatMessage['messageMedia'];
  managedAccountId?: string;
  hasPaid?: boolean;
  isSending?: boolean;
  files?: ChatMessage['messageMedia'];
  onFileChange?: (...args: any) => void;
  onComplete?: (...args: any) => void | Promise<any>;
  onChangeView?: (type: 'pay-to-view' | 'standard') => void;
  className?: string;
}

const FreePaidMessageInput: React.FC<Props> = (props) => {
  const {
    hasPaid = true,
    onCloseTabs,
    // onSubmit: onSubmitCb,
    // media,
    files: defaultFiles,
    customButton,
    // managedAccountId,
    // onComplete,
    onFileChange,
    defaultType = 'standard',
    isSending,
    onChangeView,
    onSend,
    className,
  } = props;
  const [selectedMessageType, setselectedMessageType] = useState<
    'pay-to-view' | 'standard'
  >(defaultType);
  const dispatch = useAppDispatch();
  const message = useAppSelector((state) => state.chat.message);
  const price = useAppSelector((state) => state.chat.price || 0);
  return (
    <div className={className}>
      <AddMessageView
        // showTemplate={false}
        customButton={customButton}
        onFileChange={onFileChange}
        hasPaid={hasPaid}
        className="sub-tabs-holder"
        showTimingHeader={false}
        type={selectedMessageType}
        onChangeView={(val: 'pay-to-view' | 'standard') => {
          onChangeView?.(val);
          setselectedMessageType(val);
        }}
        isSending={isSending}
        onSend={onSend}
        showClose
        onCloseTabs={onCloseTabs}
        price={price}
        message={message}
        files={defaultFiles}
        defaultFiles={defaultFiles}
        // validateFiles={(files:any) => {
        //   if (!message?.trim().length) {
        //     toast.error('Please enter a message');
        //     return false;
        //   }
        //   if (files.findIndex((i:any) => i.isPaidType) !== -1 && !files.length) {
        //     toast.error('Please add at least one media');
        //     return false;
        //   }
        //   if (files.findIndex((i:any) => i.isPaidType) !== -1 && price < 1) {
        //     toast.error('Price should be at least $1');
        //     return false;
        //   }

        //   return true;
        // }}

        preivewMessage={
          selectedMessageType === 'standard' ? 'Create Your Message' : undefined
        }
        preivewSubMessage={
          selectedMessageType === 'standard'
            ? 'You can attach multiple media your message.'
            : undefined
        }
        onPriceChange={(price) => dispatch(setPrice(price))}
        onMessageChange={(message: string) => dispatch(setMessage(message))}
      />
      {/* <AddMessage
        showTemplate={false}
        customButton={customButton}
        onFileChange={onFileChange}
        hasPaid={hasPaid}
        className="sub-tabs-holder"
        selectedMessageType={selectedMessageType}
        setSelectedMessageType={(val: 'pay-to-view' | 'standard') => {
          onChangeView?.(val);
          setselectedMessageType(val);
        }}
        isSending={isSending}
        onSend={onComplete}
        showChooseTabsOptions={false}
        showClose
        onCloseTabs={onCloseTabs}
        onSubmitCb={onSubmitCb}
        price={price}
        message={message}
        media={media}
        validateFiles={(files) => {
          if (!message?.trim().length) {
            toast.error('Please enter a message');
            return false;
          }
          if (files.findIndex((i) => i.isPaidType) !== -1 && !files.length) {
            toast.error('Please add at least one media');
            return false;
          }
          if (files.findIndex((i) => i.isPaidType) !== -1 && price < 1) {
            toast.error('Price should be at least $1');
            return false;
          }

          return true;
        }}
        files={defaultFiles}
        preivewMessage={
          selectedMessageType === 'standard' ? 'Create Your Message' : undefined
        }
        preivewSubMessage={
          selectedMessageType === 'standard'
            ? 'You can attach multiple media your message.'
            : undefined
        }
        onPriceChange={(price) => dispatch(setPrice(price))}
        onMessageChange={(message: string) => dispatch(setMessage(message))}
        managedAccountId={managedAccountId}
      /> */}
    </div>
  );
};

export default styled(FreePaidMessageInput)`
  padding: 15px 20px;
  position: relative;
  /* max-width: 900px; */
  /* margin: 0 auto; */

  /* .emoji-mart {
    position: absolute;
    bottom: 100%;
    left: 0;
    margin: 0 0 15px;
  } */
  .title {
    color: var(--pallete-text-light-50);
    font-size: 18px;
    line-height: 22px;
    font-weight: 500;
    margin: 0 0 25px;
    display: block;
  }

  .button {
    margin: 0 0 18px;
    font-size: 16px;
    line-height: 19px;
    padding: 13px 10px;
    font-weight: 500;

    + .button {
      margin-left: 0;
    }

    svg {
      margin-right: 15px;
    }

    &.btn-pay {
      border-color: var(--pallete-primary-main);
      color: var(--pallete-primary-main);

      &:hover {
        background: var(--pallete-primary-main);
        border-color: var(--pallete-primary-main);
      }
    }

    &.btn-message {
      color: #6f93b0;
      border-color: #6f93b0;

      &:hover {
        background: #6f93b0;
        border-color: #6f93b0;
      }
    }
  }

  .no-messages {
    padding: 60px 0;
    text-align: center;
    color: var(--pallete-primary-main);
    font-size: 14px;
    line-height: 22px;
    font-weight: 500;

    .title {
      color: var(--pallete-primary-main);
      display: block;
      font-size: 18px;
      line-height: 22px;
      font-weight: 500;
      margin: 0 0 2px;
    }

    .img {
      display: block;
      width: 34px;
      margin: 0 auto 8px;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }

      path {
        fill: var(--pallete-primary-main);
        fill-opacity: 1;
      }
    }
  }

  .text-blue {
    color: var(--pallete-primary-main);
  }

  .inputs-field {
    display: flex;
    margin: 0 0 14px;
    /* background: rgba(201, 206, 218, 0.55); */
    border-radius: 30px;
    align-items: center;
    position: relative;

    .text-input {
      margin: 0 !important;
    }

    .paid-active {
      .react-input-emoji--wrapper {
        padding-right: 210px;

        @media (max-width: 767px) {
          padding-right: 165px;
        }
      }
    }

    .message-field {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
      position: relative;

      &.has-check {
        .form-control {
          padding-right: 60px !important;
        }
      }

      .form-control {
        height: 52px;
        border: none;
        border-radius: 60px;
        background: var(--pallete-background-gray-secondary-light);
        font-size: 16px;
        line-height: 19px;
        color: #99729f;
        padding-left: 45px !important;

        &::placeholder {
          color: #99729f;
        }
      }

      .pre-fix {
        width: 22px;
        height: 22px;
        color: #99729f;
        top: 16px;
        left: 15px;
      }

      .img-dollar {
        position: absolute;
        right: 13px;
        top: 50%;
        transform: translate(0, -50%);
        width: 24px;
        cursor: pointer;

        &:hover {
          path {
            fill: rgba(37, 91, 135, 0.4);

            .sp_dark & {
              fill: #fff;
            }
          }
        }

        svg {
          width: 100%;
          height: auto;
          display: block;
        }
      }
    }

    .price-field {
      width: 194px;
      position: absolute;
      right: 7px;
      bottom: 7px;
      background: var(--pallete-background-gray-secondary-300);
      border-radius: 30px;
      padding: 0 0 0 40px;
      z-index: 2;

      .sp_dark & {
        background: #3c3c3c;
      }

      @media (max-width: 1399px) {
        width: 170px;
      }

      @media (max-width: 1199px) {
        width: 150px;
      }

      /* @media (max-width: 767px) {
        width: 150px;
      } */

      .img-close {
        position: absolute;
        left: 9px;
        top: 50%;
        transform: translate(0, -50%);
        width: 26px;
        color: #fff;
        cursor: pointer;

        .sp_dark & {
          color: #000;
        }

        &:hover {
          color: var(--pallete-text-main);

          .sp_dark & {
            color: #333;
          }
        }

        svg {
          width: 100%;
          height: auto;
          vertical-align: top;
        }
      }

      .form-control {
        background: none;
        border: none;
        color: var(--pallete-text-main);
        font-size: 20px;
        line-height: 1;
        font-weight: 500;
        height: 46px;
        padding-right: 60px !important;
        padding-left: 29px !important;

        @media (max-width: 767px) {
          padding-right: 50px !important;
          padding-left: 15px !important;
        }

        &::placeholder {
          color: var(--pallete-text-main);
        }
      }

      .icon {
        width: 46px;
        height: 46px;
        margin: 0;
        position: absolute;
        right: 0;
        top: 0;

        .img-spinner {
          width: 100%;
          height: 100%;
          background: var(--pallete-primary-main);
          padding: 8px;
          border-radius: 100%;
          display: block;
        }
      }

      .pre-fix {
        width: auto;
        color: var(--pallete-text-main);
        left: 8px;
        top: 8px;
        font-size: 20px;
        font-weight: 500;

        @media (max-width: 767px) {
          left: 2px;
        }
      }
    }

    .icon {
      width: 60px;
      height: 60px;
      color: #fff;
      max-width: inherit;
      max-height: inherit;
      top: 9px;
      right: 9px;
      transform: none;
      margin: 0 0 0 10px;

      .send-spinner {
        width: 100%;
        height: 100%;
        background: var(--pallete-primary-main);
        padding: 8px;
        border-radius: 100%;
        display: block;
        position: static;
      }

      .btn-tick {
        cursor: pointer;
        width: 100%;
        height: 100%;

        &.disabled {
          pointer-events: none;

          circle {
            fill: #cccccc;
          }
        }

        svg {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  hr {
    margin: 0 -20px;

    @media (max-width: 767px) {
      margin: 0 -6px;
    }
  }

  .btns-links {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 15px 0 4px;

    &:empty {
      padding: 0;
    }

    .button {
      margin: 0;
      font-size: 12px;
      line-height: 15px;
      color: var(--pallete-primary-main);
      padding: 0;
      border: none;
      min-width: inherit;

      + .button {
        margin-left: 25px;
      }

      &:hover {
        color: #99729f;

        .tooltip-area {
          opacity: 1;
          visibility: visible;
        }
      }

      .tooltip-area {
        background: var(--pallete-primary-main);
        color: #fff;
        position: absolute;
        left: 50%;
        bottom: 100%;
        padding: 5px;
        font-size: 11px;
        line-height: 15px;
        width: 120px;
        transform: translate(-50%, 0);
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s ease;
        z-index: 3;
      }

      svg {
        vertical-align: bottom;
      }

      path {
        fill: currentColor;
        opacity: 1;
      }
    }
  }

  .input-wrap {
    position: relative;
  }

  .emoji-wrapper {
    position: relative;

    .icon {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translate(0, -50%);
      z-index: 3;
      cursor: pointer;
    }
  }

  .has-check {
    .react-emoji {
      .react-input-emoji--wrapper {
        padding-right: 60px;
      }
    }
  }

  .pay-to-view-active {
    .react-emoji {
      .react-input-emoji--wrapper {
        padding-right: 210px;

        @media (max-width: 767px) {
          padding-right: 160px;
        }
      }
    }
  }

  .react-emoji {
    display: block;
    position: relative;

    .react-input-emoji--container {
      margin: 0 !important;
      border: none;
      background: none;
    }

    .react-input-emoji--wrapper {
      background: var(--pallete-background-gray-secondary);
      border-radius: 30px;
      padding: 20px 50px;

      &::placeholder {
      }
    }

    .react-input-emoji--placeholder {
      color: var(--pallete-primary-main);
      opacity: 0.63;
    }

    .react-input-emoji--placeholder {
      left: 50px;
      width: calc(100% - 60px);
    }

    .react-input-emoji--input {
      min-height: inherit;
      height: auto;
      margin: 0;
      padding: 0;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      color: var(--pallete-text-main-700);
      white-space: normal;
      overflow-x: hidden;
      overflow-y: auto;
    }

    .react-input-emoji--button {
      position: absolute;
      left: 13px;
      bottom: 18px;
      color: var(--pallete-primary-main);
      z-index: 2;
      padding: 0;
      .sp_dark & {
        color: rgba(255, 255, 255, 0.8);
      }

      svg {
        fill: currentColor;
      }
    }

    .react-emoji-picker--wrapper {
      right: auto;
      left: 0;
      width: 355px;
    }
  }

  .btn-send,
  .send-spinner {
    position: absolute;
    right: 8px;
    top: 8px;
    width: 42px;
    cursor: pointer;
    z-index: 2;
    background: #ccc;
    padding: 9px;
    border-radius: 50%;

    svg {
      width: 100%;
      height: auto;
      vertical-align: top;
    }
  }

  .sub-tab-cotnent {
    background: var(--pallete-background-default);
  }

  .tab-close {
    position: absolute;
    right: 20px;
    top: 15px;
    cursor: pointer;
    z-index: 10;
    background: var(--pallete-background-default);

    &.top-align {
      top: 0;
      right: -1px;

      &.max-top-align {
        /* top: -42px; */
      }
    }
  }

  .input-actions__img {
    position: relative;
    display: inline-block;
    vertical-align: top;
    margin: 9px 0 0;

    &.newClass {
      position: absolute !important;
      left: 20px;
      bottom: 17px;
    }
  }
`;
