import dayjs from 'dayjs';
import useAuth from 'hooks/useAuth';
import { ReactElement } from 'react';
import { useLocation } from 'react-router';
import styled from 'styled-components';
import { parseQuery } from 'util/index';
import AvatarStatus from '../AvatarStatus';
interface Props {
  className?: string;
  onChatClick?: (sub: ChatSubsType) => void;
  sub: ChatSubsType;
}

function RoomCard({ className, onChatClick, sub }: Props): ReactElement {
  const { user } = useAuth();
  const location = useLocation();
  const { subscription: subscriptionId } = parseQuery(location.search);
  const subscriptionUser =
    user?._id === sub.sellerId._id ? sub.buyerId : sub.sellerId;

  const current = dayjs();
  let timestamp = sub.lastMessage?.createdAt
    ? dayjs(sub.lastMessage?.createdAt)
    : '';

  if (timestamp) {
    timestamp = (timestamp as dayjs.Dayjs).isSame(current, 'date')
      ? (timestamp as dayjs.Dayjs).format('hh:mm A')
      : (timestamp as dayjs.Dayjs).format('MM/DD/YYYY hh:mm A');
  }

  return (
    <div
      className={`${className} chat-user-area ${
        subscriptionId === sub?._id ? 'active' : ''
      }`}
      onClick={() => onChatClick?.(sub)}
    >
      <AvatarStatus
        src={
          subscriptionUser.profileImage ||
          '/assets/images/default-profile-img.svg'
        }
        isActive={subscriptionUser.isOnline}
        imgSettings={{
          onlyMobile: true,
        }}
        fallbackUrl={'/assets/images/default-profile-img.svg'}
      />
      <div className="user-detail">
        <strong className="user-name">{`${
          subscriptionUser.pageTitle ?? 'Incognito User'
        }`}</strong>
        <div className="description">{sub.lastMessage?.messageValue || ''}</div>
      </div>
      <div className="more-info">
        {timestamp && <div className="time-info">{timestamp}</div>}
        {!!sub?.unread && sub?.unread > 0 && (
          <span className="number">{sub?.unread}</span>
        )}
      </div>
    </div>
  );
}

export default styled(RoomCard)`
  padding: 10px 11px;
  display: flex;
  flex-direction: row;
  align-items: center;
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

  .time-info {
    margin: 3px 0 10px;
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
`;
