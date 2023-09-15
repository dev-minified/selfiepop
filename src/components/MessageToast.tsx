import React from 'react';
import styled from 'styled-components';

import ImageModifications from './ImageModifications';

interface Props {
  className?: string;
  user?: IUser;
  message?: ChatMessage;
  eventType?: string;
}

const MessageToast: React.FC<Props> = (props) => {
  const { user, message, eventType, className } = props;
  let content = message?.messageValue;
  if (eventType === 'chat' && message?.messageMedia.length) {
    const isPaidType = message.messageMedia.some((media) => media.isPaidType);
    if (isPaidType) {
      content = 'sent you a new gallery!';
    } else {
      if (message.messageMedia[0].type === 'image') {
        content = 'sent you a new photo!';
      } else if (message.messageMedia[0].type === 'video') {
        content = 'sent you a new video!';
      }
    }
  }

  if (eventType === 'chat' && message?.messageType === 'GIFT') {
    content = 'Gift Received';
  }

  if (eventType === 'paymentComplete') {
    content = 'paid for the message!';
  }
  return (
    <div className={`toast-message ${className}`}>
      <div className="user-image">
        <ImageModifications
          src={user?.profileImage || '/assets/images/default-profile-pic.png'}
          alt="user"
          fallbackUrl="/assets/images/default-profile-pic.png"
        />
      </div>
      <div className="toaster-content">
        <div className="title">{user?.pageTitle ?? 'Incognito User'}</div>
        <div className="user-name">@{user?.username}</div>
        <div className="content">{content}</div>
      </div>
    </div>
  );
};

export default styled(MessageToast)`
  display: flex;

  .user-image img {
    width: 50px;
    height: 50px;
    margin: 5px 10px 5px 0;
    border-radius: 50%;
  }

  .toaster-content {
    .title {
      width: 100%;
      font-size: 16px;
      color: var(--pallete-text-main);
    }

    .content {
      text-overflow: ellipsis;
      width: 230px;
      overflow: hidden;
      white-space: nowrap;
      color: var(--pallete-text-main);
    }
  }
`;
