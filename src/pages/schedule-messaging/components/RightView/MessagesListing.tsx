import { Calendar, Plus } from 'assets/svgs';
import Button from 'components/NButton';
import dayjs from 'dayjs';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import React, { useEffect } from 'react';
import { getCurrentDayPostsMessages } from 'store/reducer/scheduledMessaging';
import styled from 'styled-components';
import ScheduledMessage from './ScheduledMessage';
import ScheduledPost from './ScheduledPost';

interface Props {
  className?: string;
  onAddClick?: (value?: string) => void;
  managedAccountId?: string;
}

const AddMessageButton: React.FC<{
  onAddClick?(value?: string): void;
  managedAccountId?: string;
}> = ({ onAddClick, managedAccountId }) => {
  const selectedDate = useAppSelector(
    (state) => state.scheduledMessaging.selectedDate,
  );
  const managedUsers = useAppSelector(
    (state) => state.managedUsers.item?.permissions,
  );
  const ShowMsgButton = managedAccountId
    ? managedUsers?.status === 'active' && managedUsers?.allowMessage
    : true;
  const ShowPostButton = managedAccountId
    ? managedUsers?.status === 'active' && managedUsers?.allowContent
    : true;
  return (
    <>
      {ShowMsgButton && (
        <Button
          onClick={() => {
            onAddClick?.('scheduledMessage');
          }}
          icon={<Plus />}
          block
          type="primary"
          shape="circle"
          disabled={selectedDate.isBefore(dayjs(), 'date')}
        >
          ADD A SCHEDULED MESSAGE
        </Button>
      )}
      {ShowPostButton && (
        <Button
          onClick={() => {
            onAddClick?.('scheduledPost');
          }}
          icon={<Plus />}
          block
          type="primary"
          shape="circle"
          disabled={selectedDate.isBefore(dayjs(), 'date')}
        >
          ADD A SCHEDULED POST
        </Button>
      )}
    </>
  );
};

const MessagesListing: React.FC<Props> = (props) => {
  const { className, onAddClick, managedAccountId } = props;
  const dispatch = useAppDispatch();

  const messages = useAppSelector(
    (state) => state.scheduledMessaging.filteredSchduleMessages?.items,
  );
  const posts = useAppSelector(
    (state) => state.scheduledMessaging.filteredSchdulePost?.items,
  );

  const selectedDate = useAppSelector(
    (state) => state.scheduledMessaging.selectedDate,
  );
  const isBefore = selectedDate.isBefore(dayjs(), 'date');

  useEffect(() => {
    selectedDate && dispatch(getCurrentDayPostsMessages());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  return (
    <div className={className}>
      {messages?.map((message: any) => {
        const isCacheBurst =
          dayjs(message?.updatedAt) > dayjs().subtract(5, 'minutes');
        return (
          <ScheduledMessage
            cacheburst={isCacheBurst}
            key={message._id}
            message={message}
            managedAccountId={managedAccountId}
          />
        );
      })}
      {posts?.map((post: any) => {
        const isCacheBurst =
          dayjs(post?.updatedAt) > dayjs().subtract(5, 'minutes');
        return (
          <ScheduledPost
            key={post._id}
            post={post}
            cacheburst={isCacheBurst}
            managedAccountId={managedAccountId}
          />
        );
      })}
      {!isBefore && (
        <>
          <AddMessageButton
            managedAccountId={managedAccountId}
            onAddClick={(e: any) => {
              onAddClick?.(e);
            }}
          />
        </>
      )}
      {!messages?.length && !posts?.length && (
        <div className="no-messages">
          <span className="img">
            <Calendar />
          </span>
          <span>
            {`There ${isBefore ? 'were' : 'are'} no scheduled`} <br />
            {'messages for this day'}
          </span>
        </div>
      )}
    </div>
  );
};

export default styled(MessagesListing)`
  padding: 20px;
  overflow: hidden;
  max-width: 900px;
  margin: 0 auto;

  .button {
    background: var(--pallete-primary-main);
    margin: 0 0 20px;
    padding: 14px;
    + .button {
      margin-left: 0;
    }
  }

  .no-messages {
    padding: 30px 0 0;
    text-align: center;
    color: #e0e0e0;
    font-size: 22px;
    line-height: 26px;
    font-weight: 500;

    .img {
      display: block;
      width: 52px;
      margin: 0 auto 16px;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
      path {
        fill: #e0e0e0;
      }
    }
  }
`;
