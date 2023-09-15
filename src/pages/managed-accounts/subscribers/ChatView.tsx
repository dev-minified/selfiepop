import { SalespurchasesChat, SalespurchasesPost } from 'assets/svgs';
import ChatWidget from 'components/SubscribersSubscriptions/Chat';
import Tabs from 'components/Tabs';
import { useAppSelector } from 'hooks/useAppSelector';
import RoomDetail from 'pages/chat/components/RoomDetail';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { parseQuery } from 'util/index';
import WallWrapper from '../WallWrapper';

type Props = {
  className?: string;
};

const ChatView: React.FC<Props> = (props) => {
  const { className } = props;

  const { id, subscriberId } = useParams<{
    id: string;
    subscriberId: string;
  }>();
  const location = useLocation();
  const { userId } = parseQuery(location.search);

  const sub = useAppSelector((state) => state.chat.selectedSubscription);
  const managedUsers = useAppSelector((state) => state.managedUsers.item);
  const purchaseWallet = useAppSelector((state) => state.chat.purchaseWallet);
  const buyer = sub?.buyerId;
  const allowMessage =
    managedUsers?.permissions?.status === 'active' &&
    managedUsers?.permissions?.allowMessage;
  const allowContent =
    managedUsers?.permissions?.status === 'active' &&
    managedUsers?.permissions?.allowContent;

  return (
    <div className={className}>
      <Tabs
        destroyInactiveTabPane
        className={`chat-tabs mobile-fixed ${subscriberId ? '' : 'block'}`}
        defaultActiveKey={'2'}
        type="card"
      >
        <Tabs.TabPane
          tab={
            <span id="sp_test_posts">
              <SalespurchasesPost />
              Posts
            </span>
          }
          key="1"
        >
          <WallWrapper
            allowActions={allowContent}
            buyerId={`${userId || buyer?._id}`}
            className="chat_view_wall"
          />
        </Tabs.TabPane>

        <Tabs.TabPane
          tab={
            <span id="sp_test_chat">
              <SalespurchasesChat />
              Chat
            </span>
          }
          key="2"
        >
          <ChatWidget
            isManager={true}
            isAllowMessages={allowMessage}
            managedAccountId={id}
            className="chat_widget_height"
          />
        </Tabs.TabPane>
      </Tabs>
      <div className="right-col">
        <RoomDetail
          user={sub as any}
          className="user-detail"
          purchaseWallet={purchaseWallet}
          showautoRenowelbutton={false}
          managedAccountId={id}
        />
      </div>
    </div>
  );
};

export default styled(ChatView)`
  display: flex;
  flex-direction: row;
  height: 100%;
  .chat_widget_height {
    flex-grow: 1;
    flex-basis: 0;
    height: calc(100vh - 120px);
    display: flex;
    flex-direction: column;
  }
  .chat_view_wall {
    height: calc(100vh - 120px);
  }
  .chat-tabs {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    padding: 20px 0 0;
  }

  .user-detail {
    width: 320px;

    .scroll-wrap {
      padding: 15px;
    }
  }

  .right-col {
    width: 320px;
    border-left: 1px solid var(--pallete-colors-border);
    /* height: calc(100vh - 114px); */
    background: var(--pallete-background-gray);
    @media (max-width: 1199px) {
      /* padding: 15px; */
      width: 280px;
    }
    @media (max-width: 1023px) {
      display: none;
    }
  }
`;
