import { HappyFace, SendIcon } from 'assets/svgs';
import FocusInput from 'components/focus-input';
import Button from 'components/NButton';
import { BaseEmoji, EmojiData, Picker } from 'emoji-mart';
import useDropDown from 'hooks/useDropDown';
import useKeyPressListener from 'hooks/useKeyPressListener';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  onSendClick?: (message: string) => Promise<void>;
  to: string;
}

const MessageBox: React.FC<Props> = ({ className, to, onSendClick }) => {
  const inputRef = useRef<HTMLTextAreaElement>();
  const [message, setMessage] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(false);
  const { ref, isVisible, setIsVisible } = useDropDown(false, false);

  const insertEmoji = (emoji: EmojiData) => {
    const pos = inputRef.current?.selectionEnd;
    if (pos != null) {
      setMessage((msg) => {
        return `${msg.substring(0, pos)}${
          (emoji as BaseEmoji).native
        }${msg.substring(pos)}`;
      });
    }
  };

  const sendMessage = async () => {
    if (message && !disabled) {
      setMessage('');
      setDisabled(true);
      await onSendClick?.(message).catch(console.log);
      setDisabled(false);
    }
  };

  useKeyPressListener(sendMessage);

  return (
    <div className={className}>
      <div className="message-box">
        <FocusInput
          ref={inputRef}
          label={
            <div>
              Message <strong className="name">{to}</strong>
            </div>
          }
          inputClasses="mb-5"
          id="description"
          name="description"
          type="textarea"
          rows={3}
          value={message}
          materialDesign
          hasLimit={false}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="textarea-actions">
          <div className="emoji">
            <div ref={ref}>
              {isVisible && (
                <Picker
                  showPreview={false}
                  showSkinTones={false}
                  onSelect={insertEmoji}
                />
              )}
            </div>
            <div
              className="emoji-opener"
              onClick={() => setIsVisible((prev: boolean) => !prev)}
            >
              <HappyFace />
            </div>
          </div>
          <Button
            onClick={sendMessage}
            icon={<SendIcon />}
            disabled={disabled}
            type="text"
            size="x-small"
          />
        </div>
      </div>
    </div>
  );
};

export default styled(MessageBox)`
  .message-box {
    background: #f8fafb;
    border: 1px solid #bbbbbb;
    border-radius: 4px;

    .sp_dark & {
      background: #000;
      border-color: var(--pallete-colors-border);
    }

    .materialized-input {
      .form-control {
        border: none;
        outline: none;
        background: none;
      }
    }

    .materialized-input.text-input {
      &.input-active {
        label {
          top: -7px;

          &:before {
            opacity: 1;
            visibility: visible;
          }
        }
      }

      label {
        background: none;
        z-index: 2;

        &:before {
          position: absolute;
          left: 0;
          right: 0;
          top: 8px;
          content: '';
          height: 1px;
          background: var(--pallete-background-default);
          z-index: -1;
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s ease;
        }
      }

      .name {
        color: var(--pallete-text-main);
        font-weight: 500;
      }
    }
  }

  .textarea-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px 2px;
    line-height: 1;
    position: relative;
    z-index: 3;

    .emoji-opener {
      display: inline-block;
      cursor: pointer;
      width: 15px;
      color: #bec0c3;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }

    .emoji-mart-search-icon {
      top: 6px;
      padding: 0 5px;
    }

    .button-icon-only.button-xs {
      .sp_dark & {
        background: #000;
      }

      svg {
        .sp_dark & {
          max-width: 16px;
          max-height: 16px;
        }
      }
    }
  }

  .emoji {
    position: relative;
    height: 15px;

    .emoji-mart {
      position: absolute;
      bottom: 100%;
      left: 0;
      margin: 0 0 15px;
    }
  }
`;
