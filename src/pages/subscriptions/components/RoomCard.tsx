import { AvatarName, ProfleTickIcon } from 'assets/svgs';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import AvatarStatus from 'pages/chat/components/AvatarStatus';
import { ReactElement } from 'react';
import { useLocation } from 'react-router';
import styled from 'styled-components';
import { parseQuery } from 'util/index';
dayjs.extend(relativeTime);
dayjs.extend(utc);
interface Props {
  className?: string;
  onChatClick?: (user: IOrderUserType) => void;
  user: IOrderUserType;
  title?: string;
  options?: {
    showusername?: boolean;
    showlastmessage?: boolean;
  };
}

function RoomCard({
  className,
  onChatClick,
  user,
  title,
  options = {
    showusername: false,
    showlastmessage: true,
  },
}: Props): ReactElement {
  const location = useLocation();
  const { userId: usreId } = parseQuery(location.search);
  let timestamp: any = '';

  if (user?.lastMessageAt) {
    timestamp = user?.lastMessageAt ? dayjs(user?.lastMessageAt) : '';
  }
  if (timestamp) {
    timestamp = timestamp.utc().fromNow();
  }
  const isUserVerified =
    user?.sellerId?.isEmailVerified && user?.sellerId?.idIsVerified;
  return (
    <div
      className={`${className} chat-user-area ${
        usreId === user?.sellerId?._id ? 'active' : ''
      }`}
      onClick={() => onChatClick?.(user)}
    >
      <AvatarStatus
        imgSettings={{
          onlyMobile: true,
        }}
        src={user?.sellerId?.profileImage || user?.profileImage}
        // src={
        //   user?.sellerId?.profileImage ||
        //   user?.profileImage ||
        //   '/assets/images/default-profile-img.svg'
        // }
        fallbackComponent={
          <AvatarName text={user?.sellerId?.pageTitle || 'Incongnito User'} />
        }
        // fallbackUrl={'/assets/images/default-profile-img.svg'}
        isActive={user?.sellerId?.isOnline}
      />
      <div className="user-detail">
        <strong className="user-name">
          {`${
            user?.sellerId?.pageTitle
              ? user?.sellerId?.pageTitle
              : title
              ? title
              : 'Incognito User'
          }`}{' '}
          {isUserVerified ? (
            <ProfleTickIcon
              width="12"
              height="12"
              fill="var(--pallete-primary-main)"
            />
          ) : null}
        </strong>
        {options.showusername && user?.sellerId?.username && (
          <div className="user_handle">@{user?.sellerId?.username}</div>
        )}
        {options.showlastmessage && user?.lastMessage && (
          <div className="description">{user?.lastMessage}</div>
        )}
      </div>
      <div className="more-info">
        {!!timestamp && <div className="time-info">{timestamp}</div>}
        <div className="orders-detail-area">
          {!!user?.unread && user?.unread > 0 && (
            <span className="unread-messages">{user.unread}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default styled(RoomCard)`
  padding: 10px 8px 10px 11px;
  display: flex;
  flex-direction: row;
  /* align-items: center; */
  margin: 0 0 1px;
  transition: all 0.4s ease;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;

  @media (max-width: 1199px) {
    padding: 15px;
  }

  &:hover {
    background: var(--pallete-background-secondary);
  }

  &.active {
    border-color: var(--pallete-primary-main);
  }

  .user-detail {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    padding: 0 5px 0 15px;
  }

  .more-info {
    text-align: right;
    color: #9d9e9f;
    font-size: 11px;
    line-height: 13px;
    font-weight: 500;
  }

  .orders-detail-area {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .time-info {
    margin: 3px 0 6px;
  }

  .order-info {
    background: #16c107;
    color: #fff;
    text-transform: uppercase;
    font-size: 12px;
    line-height: 15px;
    padding: 2px 7px 1px;
    border-radius: 3px;
    font-weight: 500;

    span {
      display: inline-block;
      vertical-align: top;
      padding: 0 0 0 2px;
    }
  }

  .unread-messages,
  .account-subscriptions {
    display: inline-block;
    vertical-align: top;
    background: var(--colors-indigo-500);
    color: #fff;
    border-radius: 3px;
    font-size: 12px;
    line-height: 16px;
    padding: 1px 7px;
    font-weight: 500;
    margin: 0 0 0 5px;
  }

  .account-subscriptions {
    background: #838385;
  }

  .number {
    min-width: 22px;
    height: 17px;
    background: var(--pallete-primary-main);
    color: #ffffff;
    border-radius: 3px;
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    display: inline-block;
    vertical-align: top;
    text-align: center;
  }

  .user-name {
    color: var(--pallete-text-main-550);
    font-weight: 500;
    white-space: nowrap;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;

    .sp_dark & {
      color: #fff;

      svg {
        path {
          fill: #fff;
        }
      }
    }

    svg {
      display: inline-block;
      width: 16px;
      height: auto;
      margin: -3px 0 0 6px;
    }
  }

  .description {
    color: var(--pallete-primary-main);
    font-size: 15px;
    line-height: 18px;
    font-weight: 400;
    white-space: nowrap;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;

    .sp_dark & {
      color: #d0d0d0;
    }
  }
  .user_handle {
    color: var(--pallete-text-light-200);
    font-size: 12px;
    line-height: 18px;
    font-weight: 400;
    white-space: nowrap;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
