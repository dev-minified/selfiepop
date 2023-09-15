import attrAccept from 'attr-accept';
import Scrollbar from 'components/Scrollbar';

import { RequestLoader } from 'components/SiteLoader';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import React from 'react';
import MessageBox from './ChatWidget/Message';
import PendingMessagesContainer from './PendingMessage';

interface Props {
  scrollbarRef?: any;
  onAttachmentClick?(
    attachment: {
      name?: string;
      type?: string;
      path?: string;
    }[],
  ): void;
  buyPaidMessage(
    subId: string,
    messageId: string,
    viewBy: 'BUYER' | 'SELLER',
    price?: number,
  ): Promise<void>;
  handleScroll?: (...args: any) => void;
  managedAccountId?: string;
  managedUser?: any;
  onDeleteMessage?: (messageId: string) => void | Promise<any>;
  showActions?: boolean;
}

const MessagesContainer: React.FC<Props> = (props) => {
  const {
    scrollbarRef,
    managedAccountId,
    onAttachmentClick,
    buyPaidMessage,
    handleScroll,
    managedUser,
    onDeleteMessage,
    showActions = true,
  } = props;
  const { user } = useAuth();

  const messages = useAppSelector((state) => state.chat.messages);
  const isFetchingMessages = useAppSelector(
    (state) => state.chat.isFetchingMessages,
  );
  // const templateMessage = useAppSelector((state) => state.chat.templateMessage);
  const selectedSubscription = useAppSelector(
    (state) => state.chat.selectedSubscription,
  );

  let viewBy: 'SELLER' | 'BUYER';
  if (managedAccountId) {
    viewBy = 'SELLER';
  } else {
    viewBy =
      user?._id === selectedSubscription?.sellerId._id ? 'SELLER' : 'BUYER';
  }

  return (
    <>
      <Scrollbar autoHide onScrollStop={handleScroll} ref={scrollbarRef}>
        <div className="messages-container">
          {isFetchingMessages && (
            <RequestLoader
              isLoading={true}
              width="28px"
              height="28px"
              color="var(--pallete-primary-main)"
            />
          )}

          {messages.items?.map((message) => {
            const { messageMedia, ...rest } = message;
            const newMessageMedia = messageMedia?.map((m: any) => {
              const type = attrAccept({ type: m?.type }, 'video/*')
                ? 'video/mp4'
                : m.type;
              const newFile = { ...m, type };
              return newFile;
            });
            let postedBy = {};
            let readBy = {};
            const isMessageOwner = message.sentFrom === viewBy;
            const isMessageBuyer = message.sentFrom !== viewBy;
            if (managedAccountId && isMessageOwner) {
              const isPostedBy =
                message?.postedBy && typeof message?.postedBy === 'object';
              postedBy = isPostedBy ? message?.postedBy : managedUser;
            }
            if (managedAccountId && isMessageBuyer) {
              const isReadBy =
                message?.readBy && typeof message?.readBy === 'object';
              if (isReadBy) {
                readBy = isReadBy ? (message?.readBy as ReadBy) : managedUser;
              }
            }
            let currentUser: any = {};
            const isse = selectedSubscription?.sellerId._id === user._id;
            if (isse) {
              currentUser = isMessageOwner
                ? selectedSubscription?.sellerId
                : selectedSubscription?.buyerId;
            } else {
              currentUser = isMessageOwner
                ? selectedSubscription?.buyerId
                : selectedSubscription?.sellerId;
            }

            return (
              <MessageBox
                key={message._id}
                medias={newMessageMedia || []}
                message={{ ...rest, messageMedia: newMessageMedia }}
                orientation={isMessageOwner ? 'right' : 'left'}
                image={
                  message.sentFrom === 'SELLER'
                    ? selectedSubscription?.sellerId?.profileImage
                    : selectedSubscription?.buyerId?.profileImage
                }
                currentUser={currentUser}
                onAttachmentClick={() => {
                  onAttachmentClick?.(message.messageMedia || []);
                }}
                viewBy={viewBy}
                postBy={postedBy}
                readBy={readBy}
                buyPaidMessage={buyPaidMessage}
                managedAccountId={managedAccountId}
                onDeleteMessage={onDeleteMessage}
                showActions={showActions}
              />
            );
          })}
          <PendingMessagesContainer
            buyPaidMessage={buyPaidMessage}
            managedAccountId={managedAccountId}
          />
        </div>
      </Scrollbar>
    </>
  );
};

export default MessagesContainer;
