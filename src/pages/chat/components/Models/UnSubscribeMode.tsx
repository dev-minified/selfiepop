// import { Bell } from 'assets/svgs';
import { ChatUnsubscribeSVG } from 'assets/svgs';
import Model from 'components/modal';
import Button from 'components/NButton';
import { ReactElement } from 'react';
import styled from 'styled-components';

type Props = {
  isOpen?: boolean;
  className?: string;
  onUnsubscribe?: (...args: any) => void;
  onCancel?: (...args: any) => void;
  isSubscribed?: boolean;
};

function UnSubscribeModel({
  isOpen,
  className,
  onUnsubscribe,
  onCancel,
  isSubscribed,
}: Props): ReactElement {
  return (
    <Model
      className={className}
      isOpen={!!isOpen}
      title={
        <span className="title-holder user_notification">
          <span className="title-icon"> {<ChatUnsubscribeSVG />} </span>
          <span className="title-text">
            {isSubscribed ? 'UNSUBSCRIBE' : 'SUBSCRIBE'}
          </span>
        </span>
      }
      showFooter={false}
      onClose={onCancel}
    >
      <div className="notification_handler">
        {isSubscribed ? (
          <p className="description">
            Are you sure you want to unsubscribe?
            <br /> At the end of your current period, you will no longer be able
            to access chat/media.
          </p>
        ) : (
          <p className="description">
            Are you sure you want to subscribe? You will be able to Chat or
            access Media.
          </p>
        )}
        <div className="text-right action_buttons">
          <Button
            size="small"
            onClick={onCancel}
            type="text"
            className="button-close"
          >
            NO
          </Button>
          <Button size="small" type="text" onClick={onUnsubscribe}>
            YES
          </Button>
        </div>
      </div>
    </Model>
  );
}
export default styled(UnSubscribeModel)`
  max-width: 493px;

  .modal-header {
    border: none;
    padding: 20px 24px 0;

    .title-icon {
      margin: 0 15px 0 0;
    }

    .title-text {
      display: inline-block;
      vertical-align: middle;
    }
  }

  .modal-title {
    font-size: 16px;
    line-height: 20px;
    font-weight: 400;
  }

  .modal-body {
    padding: 17px 24px;
  }

  .modal-content {
    border-radius: 6px;
  }
  .action_buttons {
    display: flex;
    justify-content: flex-end;

    .button {
      min-width: inherit;
      font-size: 16px;
      line-height: 20px;
      margin-bottom: 0;
    }
  }

  .button {
    &.button-sm {
      min-width: inherit;
      font-size: 16px;
      line-height: 20px;
      padding: 5px 10px;
      color: #000;
      border: none;

      &:hover {
        background: var(--pallete-primary-main);
        color: #fff;
        border: none;
      }

      &.button-close {
        color: rgba(0, 0, 0, 0.4);

        &:hover {
          color: #fff;
        }
      }
    }
  }
`;
