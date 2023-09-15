import HeaderTitle from 'components/HeaderTitle';
import ListItem from 'components/UserList/ListItem';
import { ReactElement, ReactNode } from 'react';
import styled from 'styled-components';
interface Props {
  className?: string;
  caption?: ReactElement | ReactNode;
  onChangeHistory?: (...args: any) => void;
  onDelete?: (...args: any) => void;
  buttonText?: string;
  buttonUrl: string;
  activeOrpendingLength?: number;
  isDelete?: boolean;
  items: any[];
  isMember?: boolean;
  onChangeUnread?: (...args: any) => void | Promise<any>;
}

function TeamMembers({
  className,
  buttonText,
  caption,
  buttonUrl,
  items,
  onDelete,
  isMember = true,
  activeOrpendingLength,
  isDelete = true,
  onChangeHistory,
  onChangeUnread,
}: Props): ReactElement {
  return (
    <div className={className}>
      <HeaderTitle
        buttonText={buttonText}
        buttonUrl={buttonUrl}
        caption={caption}
        items={items}
        requests={activeOrpendingLength}
      />
      {items?.map((item) => {
        return (
          <ListItem
            key={item?.id}
            className="user_list"
            isMember={isMember}
            onChangeUnread={onChangeUnread}
            onItemClick={() => {
              onChangeHistory?.(item);
            }}
            onDelete={(e: any) => {
              e.stopPropagation();
              onDelete?.(item);
            }}
            isDelete={isDelete}
            {...item}
          />
        );
      })}
    </div>
  );
}
export default styled(TeamMembers)`
  padding: 23px 30px;
  height: 100%;

  @media (max-width: 767px) {
    padding: 10px 15px 30px;
  }

  .user_list .user-managed-list__wrap {
    padding: 0;
  }

  .chat-user-area {
    background: var(--pallete-background-primary-light);
    margin: 0 0 10px;

    &:hover {
      background: var(--pallete-background-secondary);
    }

    &.red-Bg {
      background: rgba(247, 123, 123, 0.3);
    }

    &.yellow-Bg {
      background: rgba(255, 255, 50, 0.4);
    }
  }

  .date {
    color: var(--pallete-text-main-550);
    padding: 0 0 0 5px;
  }

  .counter {
    display: inline-block;
    vertical-align: middle;
    background: var(--pallete-text-secondary-150);
    color: #fff;
    border-radius: 3px;
    font-size: 12px;
    line-height: 14px;
    padding: 3px 7px 1px;
    font-weight: 500;
    margin: 0 0 0 5px;
  }

  .block-head {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: var(--pallete-text-lighter-50);
    margin: 0 0 14px;

    p {
      margin: 0 0 16px;

      @media (max-width: 767px) {
        margin: 0 0 10px;
      }

      strong {
        color: var(--pallete-text-main);
      }
    }
  }
`;
