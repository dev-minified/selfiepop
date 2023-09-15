import { ImagesScreenSizes } from 'appconstants';
import {
  Cross,
  CrossIcon,
  DollarChat,
  InfoIcon,
  PostTemplateIcon,
  SendMessage,
  Spinner,
} from 'assets/svgs';
import attrAccept from 'attr-accept';
import classNames from 'classnames';
import FocusInput from 'components/focus-input';
import Button from 'components/NButton';
import Select from 'components/Select';
import Tooltip from 'components/tooltip';
import FileUploadReduxHoc from 'components/UploadWidget/FileUploadReduxHoc';
import GalleryViewUploadWidget from 'components/UploadWidget/GallaryViewUploadWidget';
import useAppTheme from 'hooks/useAppTheme';
import useAuth from 'hooks/useAuth';
import useOpenClose from 'hooks/useOpenClose';
import ChatTemplateModalWrapper from 'pages/Sales/components/ChatTemplateModalWrapper';
import React, { useEffect, useState } from 'react';
import InputEmoji from 'react-input-emoji';
import styled from 'styled-components';
import { appendScreenSizesToId, isValidUrl } from 'util/index';
import { v4 } from 'uuid';

// let sizes = ImagesScreenSizes.chat;
interface Props {
  preivewMessage?: string;
  customButton?: React.ReactElement;
  preivewSubMessage?: string;
  showTimingHeader?: boolean;
  showButton?: boolean;
  className?: string;
  scheduleMode?: boolean;
  selectedMessageType?: 'pay-to-view' | 'standard';
  setSelectedMessageType(type: 'pay-to-view' | 'standard'): void;
  showChooseTabsOptions?: boolean;
  showClose?: boolean;
  onCloseTabs?: (...args: any) => void;
  onFileChange?: (files: MediaType[]) => void;
  files?: MediaType[];
  price?: number;
  message?: string;
  onPriceChange?(price: number): void;
  onMessageChange?(message: string): void;
  isSending?: boolean;
  hasPaid?: boolean;
  onSend?: (
    filesGroup: any,
    message?: string,
    price?: number,
    messageKey?: string,
  ) => void;
  onSubmitCb?: (
    files: any[],
    message?: string,
    price?: number,
    messageKey?: string,
  ) => void;
  selectedTime?: string;
  onTimeChange?(time: string): void;
  validateFiles?(files: any[]): boolean;
  onSendStart?(): void;
  ImageSizes?: string[];
  managedAccountId?: string;
  media?: ChatMessage['messageMedia'];
  showTemplate?: boolean;
}

const options: { value: string; label: string }[] = [];
[...Array(12)].forEach((_, hours) => {
  [...Array(4)].forEach((_, minutes) => {
    const m = (minutes * 15) % 60;
    const h = hours + 1;
    options.push({
      value: `${h <= 9 ? 0 : ''}${h}:${m <= 9 ? 0 : ''}${m}`,
      label: `${h <= 9 ? 0 : ''}${h}:${m <= 9 ? 0 : ''}${m}`,
    });
  });
});

const PayToViewChatSubMessageInput: React.FC<{
  message?: string;
  onMessage?: (...args: any) => void;
  files?: MediaType[];
  onFileChange?: (files: MediaType[]) => void;
  price?: number;
  onPriceChange?: (p: number) => void;
  onChangeView(type: 'pay-to-view' | 'standard'): void;
  onSend?: () => void;
  defaultFiles?: any[];
  isSending?: boolean;
  showButton?: boolean;
  customButton?: React.ReactElement;
  preivewMessage?: string;
  preivewSubMessage?: string;
  type?: string;
  hasPaid?: boolean;
}> = ({
  message,
  onMessage,
  onFileChange,
  files,
  onPriceChange,
  onSend,
  customButton,
  showButton = false,
  price,
  onChangeView,
  isSending,
  preivewMessage,
  preivewSubMessage,
  type = '',
  hasPaid = true,
}) => {
  const [showPaid, setShowPaid] = useState(false);
  const isDisable = type === 'standard';
  const handleFileChange = (pfs: MediaType[]) => {
    onFileChange &&
      onFileChange(
        pfs?.map((i) => {
          return {
            ...i,
            isPaidType: type === 'pay-to-view',
            islocK: type === 'pay-to-view',
          };
        }) as any,
      );
  };
  useEffect(() => {
    type && handleFileChange(files!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const isPaidExist = files?.find((f) => f.isPaidType);
  const classname = !!isPaidExist;
  return (
    <div className="sub-tab-cotnent">
      <div className="sub-tab-holder">
        <GalleryViewUploadWidget
          openinGallery={true}
          showButton={showButton}
          message={preivewMessage}
          customButton={customButton}
          subMessage={preivewSubMessage}
          value={files?.map((f) => ({
            ...f,
            id: f?.id ?? f?._id,
          }))}
          onChange={handleFileChange}
        />
        <div
          className={`${
            type === 'pay-to-view' ? 'pay-to-view-active' : 'free-active'
          } inputs-field`}
        >
          <div className="message-field">
            <InputField onChange={onMessage as any} value={message} />
            {hasPaid && type !== 'pay-to-view' && (
              <span className="img-dollar">
                <Tooltip overlay={'Enable Pay to Unlock'}>
                  <DollarChat
                    onClick={() => {
                      setShowPaid(!showPaid);
                      onChangeView?.('pay-to-view');
                    }}
                  />
                </Tooltip>
              </span>
            )}
          </div>
          {type === 'pay-to-view' ? (
            <div className="price-field paid-active">
              <span
                className="img-close"
                onClick={() => {
                  onChangeView?.('standard');
                }}
              >
                <CrossIcon />
              </span>
              <FocusInput
                hasIcon={true}
                id="price"
                name="price"
                value={String(price) as string}
                hasLabel={false}
                icon={
                  isSending ? (
                    <span className="img-spinner">
                      <Spinner />
                    </span>
                  ) : (
                    <span
                      onClick={onSend}
                      className={`btn-tick ${classname ? '' : 'disabled'} `}
                    >
                      <SendMessage />
                    </span>
                  )
                }
                prefixElement="$"
                validations={[{ type: 'number' }]}
                materialDesign
                onChange={(e) => {
                  onPriceChange && onPriceChange(Number(e.target?.value) | 0);
                }}
              />
            </div>
          ) : (
            <>
              {isSending ? (
                <span className="icon">
                  <div className="send-spinner">
                    <Spinner />
                  </div>
                </span>
              ) : (
                <span className="icon">
                  <span
                    onClick={onSend}
                    className={`btn-tick ${isDisable ? '' : 'disabled'} `}
                  >
                    <SendMessage />
                  </span>
                </span>
              )}
            </>
          )}
        </div>
        <hr />
        <div className="btns-links">
          {type === 'pay-to-view' && (!files || files.length === 0) ? (
            <Button icon={<InfoIcon />} type="text" size="small">
              Please attach at least one media
              <span className="tooltip-area">
                You can add multiple attachments
              </span>
            </Button>
          ) : (
            ''
          )}

          {type === 'pay-to-view' && price === 0 && (
            <Button icon={<InfoIcon />} type="text" size="small">
              Enter a price
              <span className="tooltip-area">
                User had to pay this amount to see the media
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const InputField: React.FC<{
  onChange?(value: string): void;
  hasIcon?: boolean;
  value?: string;

  icon?: string | React.ReactElement;
  onSend?: () => void;
  isSending?: boolean;
}> = ({ value, onChange, icon, onSend, hasIcon, isSending }) => {
  const [inputValue, setInputValue] = useState('');
  const { mode } = useAppTheme();
  useEffect(() => {
    value && setInputValue(value);
  }, [value]);

  const handleChange = (value: string) => {
    if (!!value.length) {
      onChange?.(value);
      setInputValue(value);
    }
  };

  return (
    <div className="emoji-wrapper">
      <InputEmoji
        theme={mode}
        value={inputValue}
        onChange={handleChange}
        cleanOnEnter={false}
        placeholder={!!!inputValue?.length ? 'Include a Message' : ''}
      />

      {hasIcon ? (
        <>
          {isSending ? (
            <div className="send-spinner">
              <Spinner />
            </div>
          ) : (
            <div className="icon" onClick={onSend}>
              {icon}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

const ScheduleTimingContainer = styled.div`
  .schedule-detail {
    background: var(--pallete-background-gray-secondary-light);
    border-radius: 5px;
    padding: 14px 15px 14px 50px;
    position: relative;
    color: var(--pallete-text-light-50);
    font-size: 16px;
    line-height: 19px;
    font-weight: 400;
    display: flex;
    align-items: center;
    margin: 0 0 20px;
    z-index: 11;

    .icon-time {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translate(0, -50%);
      font-size: 30px;
    }

    .message {
      letter-spacing: -0.7px;
    }

    .select-values {
      width: 90px;
      margin: 0 0 0 23px;
    }

    .select-units {
      width: 84px;
      margin: 0 0 0 14px;
    }

    .react-select__control {
      border: 1px solid rgba(215, 179, 227, 0.56);
      border-radius: 5px;
      min-height: 36px;

      .react-select__indicators {
        width: 30px;
        height: 35px;
      }

      .react-select__indicator-separator {
        display: none;
      }
    }
  }
`;

export const ScheduleTimingHeader: React.FC<{
  selectedTime?: string;
  onChange?(time: string): void;
  headerTitle?: string;
}> = ({
  selectedTime,
  onChange,
  headerTitle = 'Time to send this message:',
}) => {
  const [time, setTime] = useState<{ label: string; value: string }>();
  const [amPm, setAmPm] = useState<{ label: string; value: string }>();
  useEffect(() => {
    const [t, a] = selectedTime?.split(' ') || [];

    a && setAmPm({ label: a.toUpperCase(), value: a });
    t && setTime(options.find((o) => o.value === t) || options[0]);
  }, [selectedTime]);

  return (
    <ScheduleTimingContainer>
      <div className="schedule-detail">
        <span className="icon-time"></span>
        <span className="message">{headerTitle}</span>
        <div className="select-values">
          <Select
            options={options}
            value={time}
            onChange={(value) =>
              onChange?.(`${value?.value} ${amPm?.value ? amPm?.value : ''}`)
            }
          />
        </div>
        <div className="select-units">
          <Select
            options={[
              { label: 'AM', value: 'am' },
              { label: 'PM', value: 'pm' },
            ]}
            value={amPm}
            onChange={(value) =>
              onChange?.(`${time?.value ? time?.value : ''} ${value?.value}`)
            }
          />
        </div>
      </div>
    </ScheduleTimingContainer>
  );
};

export const AddMessageView: React.FC<{
  preivewMessage?: string;
  customButton?: React.ReactElement;
  preivewSubMessage?: string;
  type: 'pay-to-view' | 'standard' | undefined;
  showTimingHeader?: boolean;
  files?: MediaType[];
  onFileChange?: (files: MediaType[]) => void;
  price?: number;
  message?: string;
  onPriceChange?(price: number): void;
  onMessageChange?(message: string): void;
  onCloseTabs?: (...args: any) => void;
  onSend?: (message?: string, price?: number) => void | Promise<any>;
  onChangeView(type: 'pay-to-view' | 'standard'): void;
  selectedTime?: string;
  onTimeChange?(time: string): void;
  showClose?: boolean;
  defaultFiles?: any[];
  isSending?: boolean;
  showButton?: boolean;
  hasPaid?: boolean;
  className?: string;
}> = ({
  type,
  showTimingHeader = true,
  onFileChange,
  onCloseTabs,
  files,
  customButton,
  onSend,
  showButton,
  showClose,
  price,
  message,
  onMessageChange,
  onPriceChange,
  selectedTime,
  onChangeView,
  onTimeChange,
  defaultFiles,
  isSending = false,
  hasPaid = true,
  preivewMessage = '',
  preivewSubMessage = '',
  className,
}) => {
  const onSendClick = async () => {
    try {
      await onSend?.(message, price);
    } catch (error) {}
  };
  useEffect(() => {
    onFileChange?.(
      defaultFiles?.map((f) => ({ ...f, id: f._id || f.id })) as any,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={className}>
      {showTimingHeader && (
        <ScheduleTimingHeader
          selectedTime={selectedTime}
          onChange={onTimeChange}
        />
      )}
      <div className="chat_sub">
        <PayToViewChatSubMessageInput
          hasPaid={hasPaid}
          customButton={customButton}
          showButton={showButton}
          onChangeView={onChangeView}
          message={message}
          onMessage={onMessageChange}
          onFileChange={onFileChange}
          files={files}
          defaultFiles={defaultFiles}
          onPriceChange={onPriceChange}
          onSend={onSendClick}
          price={price}
          isSending={isSending}
          preivewMessage={preivewMessage || 'Create your Paid Message'}
          preivewSubMessage={preivewSubMessage}
          type={type}
        />
        {showClose && (
          <span
            className={`tab-close   ${type === 'standard' && 'top-align'} ${
              (files?.length || -1) > 0 && 'max-top-align'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onCloseTabs?.(e);
            }}
          >
            <Cross />
          </span>
        )}
      </div>
    </div>
  );
};

const AddMessage: React.FC<Props> = (props) => {
  const { user } = useAuth();
  const [isOpen, onOpen, onClose] = useOpenClose();
  const [stateFile, setStateFile] = useState<any>([]);
  const {
    className,
    customButton,
    showButton,
    selectedMessageType,
    setSelectedMessageType,
    showTemplate = true,
    scheduleMode = false,
    hasPaid = true,
    showTimingHeader,
    onCloseTabs,
    onSend,
    showClose,
    price,
    onFileChange,
    message,
    onPriceChange,
    onMessageChange,
    validateFiles,
    onSubmitCb,
    onTimeChange,
    selectedTime,
    files: defaultFiles,
    onSendStart,
    preivewSubMessage,
    preivewMessage,
    media,
    ImageSizes: sizes = ImagesScreenSizes.chat,
    managedAccountId,
    ...rest
  } = props;

  return (
    <div className={`${className} scheduling-area`}>
      <ChatTemplateModalWrapper
        scheduleMode={scheduleMode}
        isOpen={isOpen}
        onClose={onClose}
        managedAccountId={managedAccountId}
      />
      <FileUploadReduxHoc files={media}>
        {(files, onChange, { onSubmit }) => {
          setStateFile(files || []);
          const handleSubmit = (message?: string, price?: number) => {
            if (validateFiles && !validateFiles?.(files)) {
              return;
            }
            onSendStart?.();
            const messageKey = v4();
            if (!!files.length) {
              onSubmit({
                key: messageKey,
                onCompletedCallback: (uploadedFiles: any) => {
                  onSend?.(uploadedFiles, message, price, messageKey);
                },
              });
            } else {
              onSend?.(
                { files: files, key: messageKey },
                message,
                price,
                messageKey,
              );
            }
            onSubmitCb?.(files || [], message, price, messageKey);
          };
          return (
            <AddMessageView
              hasPaid={hasPaid}
              customButton={customButton}
              showButton={showButton}
              showTimingHeader={showTimingHeader ?? props.showChooseTabsOptions}
              onChangeView={(value: 'pay-to-view' | 'standard') => {
                setSelectedMessageType?.(value);
              }}
              type={selectedMessageType}
              showClose={showClose}
              onCloseTabs={onCloseTabs}
              onSend={handleSubmit}
              files={files}
              defaultFiles={defaultFiles}
              onFileChange={(files: any) => {
                let newFiles: any[] = files || [];
                if (newFiles?.length) {
                  newFiles = files.map((f: any) => {
                    const newFile = { ...f };
                    if (
                      attrAccept({ name: f?.name, type: f.type }, 'image/*') &&
                      !f?._id &&
                      !isValidUrl(f?.path) &&
                      newFile?.orignalFile
                    ) {
                      const { file } = appendScreenSizesToId({
                        id: f?.id,
                        sizes,
                        userId: user?._id,
                        file: newFile?.orignalFile,
                        rotateAll: f?.rotate,
                        createpathagain: true,
                      });
                      newFile.orignalFile = file || newFile.orignalFile;
                      return newFile;
                    }
                    return f;
                  });
                }
                onFileChange?.(newFiles);
                onChange(newFiles);
              }}
              price={price}
              message={message}
              onPriceChange={onPriceChange}
              onMessageChange={onMessageChange}
              onTimeChange={onTimeChange}
              selectedTime={selectedTime}
              preivewSubMessage={preivewSubMessage}
              preivewMessage={preivewMessage}
              {...rest}
            />
          );
        }}
      </FileUploadReduxHoc>
      {showTemplate && (
        <span
          className={classNames('input-actions__img', {
            newClass:
              selectedMessageType === 'pay-to-view' &&
              !media?.length &&
              !defaultFiles?.length &&
              !stateFile?.length,
          })}
          onClick={() => {
            onOpen();
          }}
        >
          <Tooltip overlay={'Template'}>
            <PostTemplateIcon />
          </Tooltip>
        </span>
      )}
    </div>
  );
};

export default styled(AddMessage)`
  padding: 15px 20px;
  position: relative;
  max-width: 900px;
  margin: 0 auto;

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

      @media (max-width: 1399px) {
        width: 170px;
      }

      @media (max-width: 1199px) {
        width: 150px;
      }

      /* @media (max-width: 767px) {
        width: 150px;
      } */

      .sp_dark & {
        background: #3c3c3c;
      }

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
      z-index: 12;
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
