import { RecycleBin } from 'assets/svgs';
import TagListing from 'components/TagListing';
import { ManagerItemStatus } from 'enums';
import useSocket from 'hooks/useSocket';
import AvatarStatus from 'pages/chat/components/AvatarStatus';
import { useEffect } from 'react';
import styled from 'styled-components';

export type ListItemType = {
  image?: string;
  isActive?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  timestamp?: string;
  extra?: React.ReactNode;
  isOnline?: boolean;
  id?: string;
  status?: string;
  tags?: string[];
  dollorIcon?: boolean;
  isMember?: boolean;
  buyer?: IOrderUser;
  oldUnread?: string;
  userId?: string;
};

interface Props extends ListItemType {
  className?: string;
  onItemClick?: () => void;
  onDelete?: () => void;
  isDelete?: boolean;
  onChangeUnread?: (...args: any) => void | Promise<any>;
}

const ListItem: React.FC<Props> = (props) => {
  const { socket } = useSocket();
  const {
    className,
    image,
    isActive,
    title,
    description,
    isMember = true,
    timestamp,
    dollorIcon,
    extra,
    tags,
    isOnline,
    status,
    oldUnread = '',
    onDelete,
    isDelete,
    onItemClick,
    userId,
    onChangeUnread,
  } = props;

  useEffect(() => {
    if (userId && status === ManagerItemStatus?.active) {
      socket?.on(userId, (data: any) => {
        onChangeUnread?.(data, userId);
      });
    }
    return () => {
      socket?.off(userId);
    };
  }, [userId]);

  return (
    <div
      className={`${className} chat-user-area ${
        isActive ? 'active' : ''
      } ${oldUnread}`}
      onClick={onItemClick}
    >
      <AvatarStatus
        src={image}
        imgSettings={{
          onlyMobile: true,
        }}
        isActive={isOnline}
      />
      <div className="user-detail">
        <strong className="user-name">{title}</strong>
        <div className="member-tags-area">
          {description && (
            <div className="member-total-amount">{description}</div>
          )}
          {!!tags?.length && tags.length > 0 && (
            <TagListing tags={tags.map((t) => ({ value: t }))} />
          )}
        </div>
      </div>
      <div
        className={`${
          isMember && (status !== 'cancelled' ? 'delete-item-active' : '')
        } more-info`}
      >
        {!!timestamp && <div className="time-info">{timestamp}</div>}
        <div className="orders-detail-area">
          {extra}
          {dollorIcon && <span className="messages-sign">$</span>}
        </div>
        {isDelete &&
          (status !== 'cancelled' && status ? (
            <div className="delete-btn" onClick={onDelete}>
              <RecycleBin />
            </div>
          ) : (
            <></>
          ))}
      </div>
    </div>
  );
};

export default styled(ListItem)`
  padding: 10px 11px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 1px;
  transition: all 0.4s ease;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
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

    &.delete-item-active {
      .list-icons {
        padding-right: 30px;
      }

      .delete-btn {
        position: absolute;
        right: 10px;
        top: 9px;
        width: 22px;

        @media (max-width: 767px) {
          right: 14px;
        }

        svg {
          width: 100%;
          height: auto;
          vertical-align: top;
        }
      }
    }
  }

  .orders-detail-area {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .time-info {
    margin: 3px 0 10px;
  }
  .messages-sign {
    display: inline-block;
    vertical-align: top;
    background: var(--pallete-text-secondary-150);
    color: #fff;
    border-radius: 3px;
    font-size: 12px;
    line-height: 14px;
    padding: 3px 7px 1px;
    font-weight: 500;
    margin: 0 0 0 5px;
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
  }

  .member-tags-area {
    display: flex;
    align-items: center;

    @media (max-width: 767px) {
      flex-wrap: wrap;
    }
    .counter {
      background: rgba(172, 180, 221, 0.32);
      display: inline-block;
      vertical-align: top;
      color: #fff;
      font-size: 12px;
      line-height: 14px;
      padding: 2px 7px;
      cursor: pointer;
      margin: 1px 5px 1px 0;
      border-radius: 18px;
      font-weight: 500;
      transition: all 0.4s ease;
      min-height: 18px;

      &:hover {
        background: var(--colors-indigo-500);

        .arrow {
          border-color: #fff transparent transparent transparent;
        }
      }
    }

    .arrow {
      border-style: solid;
      border-width: 5px 5px 0 5px;
      border-color: var(--pallete-text-secondary-150) transparent transparent
        transparent;
      display: inline-block;
      vertical-align: middle;
    }
    .member-total-amount {
      color: #a27fa6;
      font-size: 14px;
      line-height: 16px;
      font-weight: 500;
      margin: 0 5px 0 0;
      letter-spacing: 0.5;

      @media (max-width: 767px) {
        width: 100%;
      }
    }
  }

  .list-icons {
    margin: 0 -5px 8px;
    padding: 0;
    list-style: none;
    display: flex;
    justify-content: flex-end;

    li {
      padding: 0 5px;
    }
  }

  .user-status {
    display: block;
    text-align: right;

    &.active {
      color: #3dd13a;

      circle {
        fill: currentColor;
        stroke: currentColor;
      }
    }

    &.pending {
      color: #fe0404;

      svg {
        border-radius: 100%;
      }
    }

    &.declined {
      color: #6b6b6b;
    }

    &.canceled {
      color: #aeb1d4;
    }

    svg {
      width: 10px;
      height: auto;
      margin: 0 0 0 6px;

      circle {
        fill: currentColor;
        stroke: currentColor;
      }
    }
  }
`;
