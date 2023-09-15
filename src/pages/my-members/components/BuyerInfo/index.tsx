// import NewButton from 'components/NButton';
import { getOrdersList } from 'api/Order';
import { getPurchaseHistory } from 'api/sales';
import { CircleAvatar, SalespurchasesChat } from 'assets/svgs';
import AttachmentPreviewModal from 'components/AttachmentPreviewModal';
import Chat from 'components/SubscribersSubscriptions/Chat';
import Tabs from 'components/Tabs';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import RoomDetail from 'pages/chat/components/RoomDetail';
import { ReactElement, useEffect, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { useHistory, useLocation } from 'react-router-dom';
import { getSubscription } from 'store/reducer/chat';
import {
  insertBeginningOfUserList,
  setSelectedSub,
  // setSelectedUser,
  setUserUnreadCount,
} from 'store/reducer/salesState';
import styled from 'styled-components';
import { parseQuery } from 'util/index';

const TabPane = Tabs.TabPane;

interface Props {
  className?: string;
}
export const setChatLayoutHeight = () => {
  setTimeout(() => {
    const el = document.querySelector('.chat_blockright');
    const el2 = document.querySelector('.user-detailmobile');
    el?.setAttribute(
      'style',
      `
      height: calc(100vh - 58px - ${el.getBoundingClientRect().y}px)
    `,
    );
    el2?.setAttribute(
      'style',
      `
      height: calc(100vh - 58px - ${el2?.getBoundingClientRect().y}px)
    `,
    );
  }, 0);
};
const variants = {
  initial: (direction: string) => {
    return direction === 'left'
      ? {
          left: '-100vw',
          opacity: 0,
          position: 'absolute',
        }
      : {
          left: '100vw',
          opacity: 0,
          position: 'absolute',
        };
  },
  animate: {
    left: '0',
    opacity: 1,
    // position: 'relative',
  },
  exit: (direction: string) => {
    return direction === 'left'
      ? {
          left: '-100vw',
          opacity: 0,
          position: 'absolute',
        }
      : {
          left: '100vw',
          opacity: 0,
          position: 'absolute',
        };
  },
};
function BuyerInfo({ className }: Props): ReactElement {
  const selectedSub = useAppSelector(
    (state) => state.mysales.selectedSubscription,
  );
  const emailNotificationClosedByUser = useAppSelector(
    (state) => state.global.emailNotificationClosedByUser,
  );
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const history = useHistory();

  const { userId, type } = parseQuery(location.search);
  const [purchaseWallet, setPurchaseWallet] = useState<any>([]);
  const getSubscriptionById = (id?: string) => {
    if (id) {
      dispatch(
        getSubscription({
          subscriptionId: id,
          callback: (data) => {
            dispatch(setSelectedSub(data));
            dispatch(
              setUserUnreadCount({
                unread: data?.unread || 0,
                subscriptionId: data?._id,
              }),
            );
          },
          customError: {
            ignoreStatusCodes: [404],
          },
        }),
      )
        .then(() => console.log('fetched data'))
        .catch((e) => console.log(e));
    }
  };
  useEffect(() => {
    if (!user?.enableMembershipFunctionality || user?.skipOnBoarding) {
      history.push('/my-profile');
    }
  }, [user]);
  useEffect(() => {
    if (!selectedSub?._id && userId) {
      getOrdersList({ userId, type: 'seller' })
        .then((d) => {
          if (d?.totalCount > 0) {
            dispatch(
              insertBeginningOfUserList({
                data: d.items[0],
                insertatbeginning: type === 'chat',
              }),
            );
            // dispatch(setSelectedUser(d.items[0]));
            getSubscriptionById(d?.items[0]?.subscriptionId);
          }
        })
        .catch((e) => console.log(e));
    }
  }, [userId]);
  useEffect(() => {
    if (userId && user) {
      getPurchaseHistory(
        { seller: user?._id, buyer: userId },

        {
          ignoreStatusCodes: [404],
        },
      )
        .then((res) => setPurchaseWallet(res))
        .catch(() => console.log);
    }
  }, [userId, user]);
  useEffect(() => {
    setChatLayoutHeight();
  }, [emailNotificationClosedByUser]);

  return (
    <div className={className}>
      {!isMobileOnly ? (
        <>
          <RoomDetail
            purchaseWallet={purchaseWallet}
            showPurchaseMenu={true}
            className="user-detail"
            user={selectedSub || {}}
            showautoRenowelbutton={false}
          />
        </>
      ) : (
        <div>
          <AnimatePresence initial={false}>
            <motion.div
              key="right"
              custom={'right'}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants as any}
              style={{ width: '100%', position: 'relative' }}
              transition={{ mass: 0.2, duration: 0.6 }}
              className="middle-block"
            >
              <Tabs defaultActiveKey="1" type="card" className="rc-tabs-mobile">
                <TabPane
                  tab={
                    <span id="sp_test_chat">
                      <SalespurchasesChat />
                      Chat
                    </span>
                  }
                  key="1"
                >
                  <Chat
                    isSeller={true}
                    isAllowMessages={true}
                    className={`chat-blockright`}
                  />
                </TabPane>

                <TabPane
                  className="hidden-desktop"
                  tab={
                    <span id="sp_test_user_info">
                      <CircleAvatar />
                      Buyer Info
                    </span>
                  }
                  key={'2'}
                >
                  <RoomDetail
                    purchaseWallet={purchaseWallet}
                    className="user-detailmobile"
                    user={selectedSub || {}}
                    showautoRenowelbutton={false}
                    showPurchaseMenu={true}
                  />
                </TabPane>
              </Tabs>
            </motion.div>
          </AnimatePresence>
          <AttachmentPreviewModal />
        </div>
      )}
    </div>
  );
}
export default styled(BuyerInfo)`
  height: 100%;
  .user-detailmobile {
    height: calc(100vh - 172px);
  }
  .chat-blockright {
    height: calc(100vh - 172px);
    display: flex;
    flex-direction: column;
    padding: 0;
  }
  .scroll-wrap {
    padding: 20px;
  }
  .rc-tabs-mobile {
    .rc-tabs-nav-list {
      @media (max-width: 767px) {
        margin: 0;
      }
    }
    .rc-tabs-tab {
      @media (max-width: 767px) {
        margin: 0;
        font-size: 0;
        line-height: 0;
        padding: 5px;
        flex: 1;
        height: 58px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 0;
        border-left: 1px solid #e6ecf5;
        background: var(--pallete-background-default);
        color: var(--pallete-text-main-600);

        &.rc-tabs-tab-active {
          color: var(--pallete-primary-main);

          .sp_dark & {
            color: var(--pallete-text-main);
          }
        }
      }

      &:last-child {
        @media (max-width: 767px) {
          border-left: none;
        }
      }

      svg {
        @media (max-width: 767px) {
          width: 24px;
          margin: 0;
          height: auto;
        }
      }
    }
    .rc-tabs-nav {
      z-index: 4;
      @media (max-width: 767px) {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--pallete-background-default);
        border-top: 1px solid var(--pallete-colors-border);
      }
    }
  }
`;
