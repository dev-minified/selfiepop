import { getPurchaseHistory, getSubscriptionById } from 'api/sales';
import {
  CheckList,
  CircleAvatar,
  HistoryIcon,
  Question,
  SalespurchasesChat,
  SalespurchasesPost,
} from 'assets/svgs';
import Scrollbar from 'components/Scrollbar';
import ChatWidget from 'components/SubscribersSubscriptions/Chat';
import Tabs from 'components/Tabs';

import ListItem from 'components/UserList/ListItem';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useBottomNavToggler from 'hooks/useBottomnavToggle';
import useSocket from 'hooks/useSocket';
import RoomDetail from 'pages/chat/components/RoomDetail';
import React, { useEffect } from 'react';
import { BrowserView, isDesktop, MobileView } from 'react-device-detect';
import { useLocation, useParams } from 'react-router-dom';
import {
  getLogHistory,
  setMessages,
  setPurchaseWallet,
  setSelectedChat,
} from 'store/reducer/chat';
import { setHeaderTitle, setHeaderUrl } from 'store/reducer/headerState';
import { getManagedUserDetails } from 'store/reducer/managed-users';
import { getManagerFaqsList } from 'store/reducer/manager-faqs';
import { addTask, getSubscriptionTasks } from 'store/reducer/task';
import styled from 'styled-components';
import { parseQuery } from 'util/index';
import WallWrapper from '../WallWrapper';
import Faqs from './Faqs';
import LogHistory from './LogHistory';
import ManagerTasks from './ManagerTasks';
import PendingFaqs from './PendingFaqs';

type Props = {
  className?: string;
};

const SubscriberDetails: React.FC<Props> = (props) => {
  const { className } = props;

  const { id, subscriberId } = useParams<{
    id: string;
    subscriberId: string;
  }>();
  const location = useLocation();
  const { userId } = parseQuery(location.search);
  const dispatch = useAppDispatch();
  const { socket } = useSocket();
  const { showNav = true, onBottomNavToggle } = useBottomNavToggler();
  const purchaseWallet = useAppSelector((state) => state.chat.purchaseWallet);
  const sub = useAppSelector((state) => state.chat.selectedSubscription);
  const manegedItem = useAppSelector((state) => state.managedUsers.item);
  const buyer = sub?.buyerId;

  useEffect(() => {
    dispatch(
      setHeaderTitle(
        sub ? `${sub?.buyerId?.pageTitle ?? 'Incognito User'}` : '',
      ),
    );
  }, [dispatch, sub]);
  useEffect(() => {
    if (!isDesktop) {
      if (userId) {
        showNav && onBottomNavToggle({ showNav: false });
      } else {
        !showNav && onBottomNavToggle({ showNav: true });
      }
    }
    return () => {
      !showNav && !isDesktop && onBottomNavToggle({ showNav: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, showNav]);
  useEffect(() => {
    socket?.on(subscriberId, (data) => {
      if (data?.type === 'taskAdded') {
        dispatch(addTask(data.task));
      }
    });

    return () => {
      socket?.off(subscriberId);
    };
  }, [socket, dispatch, subscriberId]);

  useEffect(() => {
    dispatch(getManagerFaqsList({ sellerId: id }));
    dispatch(setHeaderUrl(`/managed-accounts/${id}/subscribers`));
    dispatch(
      getSubscriptionTasks({ sellerId: id, subscriptionId: subscriberId }),
    );
    dispatch(
      getLogHistory({ subscriptionId: subscriberId, params: { sellerId: id } }),
    );
    getSubscriptionById(subscriberId, { sellerId: id })
      .then((res) => {
        if (!res) return;
        dispatch(setSelectedChat(res));
        if (manegedItem?._id !== res?.sellerId?._id) {
          dispatch(getManagedUserDetails({ userId: res?.sellerId?._id }));
        }
      })
      .catch(console.log);

    return () => {
      dispatch(setSelectedChat(undefined));
      dispatch(setMessages({ items: [], totalCount: 0 }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sub) {
      getPurchaseHistory(
        { seller: sub?.sellerId?._id, buyer: sub?.buyerId?._id },

        {
          ignoreStatusCodes: [404],
        },
      )
        .then((res) => {
          dispatch(setPurchaseWallet(res));
        })
        .catch(() => console.log);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sub]);

  const LeftView: React.FC<{ showTasks?: boolean; showLogs?: boolean }> = (
    props,
  ) => {
    const { showTasks = true, showLogs = true } = props;
    return (
      <div className={`${className} user-subscriber-detail`}>
        <div className="desktop-chat-view">
          {buyer && (
            <ListItem
              title={`${buyer?.pageTitle ?? 'Incognito User'}`}
              image={buyer?.profileImage}
              isOnline={buyer?.isOnline}
            />
          )}
          <Tabs className="secondary-tabs">
            {showTasks && (
              <Tabs.TabPane tab="Tasks" key="tasks">
                <ManagerTasks id={id} subscriberId={subscriberId} />
              </Tabs.TabPane>
            )}
            <Tabs.TabPane tab="FAQ" key="faq">
              <Faqs id={id} subscriberId={subscriberId} sub={sub} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Unanswered Questions" key="unanswered-questions">
              <PendingFaqs id={id} subscriberId={subscriberId} sub={sub} />
            </Tabs.TabPane>
            {showLogs && (
              <Tabs.TabPane tab="Log History" key="logs">
                <LogHistory />
              </Tabs.TabPane>
            )}
          </Tabs>
        </div>
      </div>
    );
  };

  return (
    <div>
      <MobileView>
        <div className={className}>
          <div className="mobile-chat-view middle-block">
            <Tabs defaultActiveKey="1" type="card">
              <Tabs.TabPane
                tab={
                  <span>
                    <SalespurchasesPost />
                    Posts
                  </span>
                }
                key="5"
              >
                <WallWrapper buyerId={`${userId || buyer?._id}`} />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={
                  <span>
                    <SalespurchasesChat />
                    Chat
                  </span>
                }
                key="1"
              >
                <ChatWidget
                  managedAccountId={id}
                  className="chat_widget_height"
                />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={
                  <span>
                    <CircleAvatar />
                    Buyer Info
                  </span>
                }
                key={'2'}
              >
                <RoomDetail
                  user={sub as any}
                  className="user-detail"
                  purchaseWallet={purchaseWallet}
                  showautoRenowelbutton={false}
                  managedAccountId={id}
                />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={
                  <span>
                    <Question />
                    FAQs
                  </span>
                }
                key={'3'}
              >
                <Scrollbar>
                  <LeftView showTasks={false} showLogs={false} />
                </Scrollbar>
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={
                  <span>
                    <CheckList />
                    Tasks
                  </span>
                }
                key={'4'}
              >
                <Scrollbar>
                  <div className={`${className} user-subscriber-detail`}>
                    <div className="desktop-chat-view">
                      {buyer && (
                        <ListItem
                          title={`${buyer?.pageTitle ?? 'Incognito User'}`}
                          image={buyer?.profileImage}
                          isOnline={buyer?.isOnline}
                        />
                      )}
                      <Tabs className="secondary-tabs">
                        <Tabs.TabPane tab="Tasks" key="tasks">
                          <ManagerTasks id={id} subscriberId={subscriberId} />
                        </Tabs.TabPane>
                      </Tabs>
                    </div>
                  </div>
                </Scrollbar>
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={
                  <span>
                    <HistoryIcon />
                    Log History
                  </span>
                }
                key={'6'}
              >
                <Scrollbar>
                  <div className={`${className} user-subscriber-detail`}>
                    <div className="desktop-chat-view">
                      {buyer && (
                        <ListItem
                          title={`${buyer?.pageTitle ?? 'Incognito User'}`}
                          image={buyer?.profileImage}
                          isOnline={buyer?.isOnline}
                        />
                      )}
                      <Tabs className="secondary-tabs">
                        <Tabs.TabPane tab="Log History" key="logs">
                          <LogHistory />
                        </Tabs.TabPane>
                      </Tabs>
                    </div>
                  </div>
                </Scrollbar>
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </MobileView>
      <BrowserView>
        <LeftView />
      </BrowserView>
    </div>
  );
};

export default styled(SubscriberDetails)`
  .chat-user-area {
    background: var(--pallete-background-primary-light);
    padding: 10px 20px 10px 18px;
  }

  .mobile-chat-view {
    .chat_widget_height {
      flex-grow: 1;
      flex-basis: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .rc-tabs {
      height: calc(100vh - 228px);
    }

    /* .user-detail {
      width: 320px;
    } */

    .scroll-wrap {
      padding: 15px;
    }

    .rc-tabs-tab {
      &:nth-child(4) {
        @media (min-width: 1024px) {
          display: none;
        }
      }

      @media (max-width: 767px) {
        min-width: inherit;
      }
    }

    .rc-tabs-content-holder {
      flex-grow: 1;
      flex-basis: 0;
      background: var(--pallete-background-default);
      position: relative;
      overflow: hidden;
    }
    .rc-middle-container {
    }
    .rc-tabs-content {
      height: 100%;
    }
    .rc-tabs-tabpane {
      height: 100%;
    }

    .rc-tabs-mobile {
      &.secondary-tabs {
        .rc-tabs-nav {
          padding: 0;
          border-bottom: 1px solid var(--pallete-colors-border);

          &:after {
            display: none;
          }
        }
      }
      &:not(.secondary-tabs) {
        .rc-tabs-nav-list {
          @media (max-width: 767px) {
            margin: 0;
          }
        }
        > .rc-tabs-nav {
          @media (max-width: 767px) {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--pallete-background-default);
            border-top: 1px solid var(--pallete-colors-border);
            z-index: 3;
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
        }
      }
    }

    .rc-tabs-tab {
      &:nth-child(2) {
        @media (min-width: 1024px) {
          display: none;
        }
      }
    }
  }

  .desktop-chat-view {
    .rc-tabs {
      display: block;
      height: auto;
    }

    .rc-tabs-nav {
      z-index: inherit;
    }

    .rc-tabs-nav-wrap {
      padding: 0 18px;
      background: var(--pallete-background-gray-secondary-100);
      .rc-tabs-tab {
        min-width: inherit;
        padding: 17px 0;
        color: #999498;
        font-weight: 400;
        margin: 0;
        background: none;
        border: none;
        border-bottom: 1px solid transparent;

        @media (max-width: 767px) {
          border-bottom-width: 2px;
        }

        + .rc-tabs-tab {
          margin: 0 0 0 40px;
        }

        &:hover {
          color: var(--pallete-text-main);
        }

        &.rc-tabs-tab-active {
          color: var(--pallete-text-main);
          border-bottom-color: #000;
        }
      }
    }

    .rc-tabs-tabpane {
      padding: 20px;

      @media (max-width: 767px) {
        padding: 15px;
      }
    }
  }

  .text-input {
    margin: 0 0 25px !important;

    .icon {
      color: var(--pallete-primary-main);
      height: 28px;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;

      path {
        fill: var(--pallete-primary-main);
      }
    }
  }

  .search-area {
    flex-grow: 1;
    flex-basis: 0;
  }

  .form-control-search {
    height: 44px;
    background: var(--pallete-background-secondary);
    border: none;
    border-radius: 30px;
    font-size: 15px;
    line-height: 20px;
    padding: 6px 17px 6px 50px;

    &::placeholder {
      color: #8b7fa6;
    }
  }

  .btn-question {
    margin: 0 0 20px;
    background: #93b87d;

    svg {
      margin: -1px 15px 0 0;
    }
  }

  .pop-card:not(.post-card) {
    padding: 0;
    border: 1px solid var(--pallete-colors-border);
    background: var(--pallete-background-default);
    font-size: 15px;
    line-height: 18px;
    font-weight: 400;
    color: var(--pallete-text-main);
    margin: 0 0 20px;

    .card-Header {
      padding: 15px 22px;
      border-bottom: 1px solid var(--pallete-colors-border);

      @media (max-width: 767px) {
        padding: 15px;
      }

      .btn-holder {
        padding: 29px 0 16px;

        @media (max-width: 767px) {
          padding: 15px 0 0;
        }

        .button {
          min-width: 167px;
        }
      }
    }

    .title-text {
      font-weight: 500;
    }

    .card-header-title {
      padding-right: 40px;
      position: relative;

      .title {
        color: var(--pallete-text-light-50);
      }

      .button {
        position: absolute;
        right: 0;
        top: 0;
        color: #bbcddb;
        padding: 0;
        width: auto;
        height: auto;

        &:hover {
          color: var(--pallete-primary-main);
        }
      }
    }

    .card-body {
      padding: 14px 22px 20px;

      @media (max-width: 767px) {
        padding: 15px;
      }

      p {
        margin: 0 0 13px;
      }

      .chat-user-area {
        background: var(--pallete-background-gray-secondary-light);
        padding: 4px 10px;
      }
    }
  }

  .tags-row {
    margin: 0 0 20px;

    label {
      .label-text {
        padding: 4px 13px;
        background: var(--pallete-background-blue-A300);
      }
    }
  }

  .btns-area {
    text-align: right;

    .button {
      min-width: 133px;
      padding: 4px 10px;
    }
  }

  .btn-faq {
    svg {
      margin: -1px 5px 0 0;
    }
  }
`;
