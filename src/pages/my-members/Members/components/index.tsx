import { getPurchaseHistory } from 'api/sales';
import { ArrowBack, CircleAvatar, SalespurchasesChat } from 'assets/svgs';
import Scrollbar from 'components/Scrollbar';
import { RequestLoader } from 'components/SiteLoader';
import Chat from 'components/SubscribersSubscriptions/Chat';
import Tabs from 'components/Tabs';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useBottomNavToggler from 'hooks/useBottomnavToggle';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import { setTwoPanelLayoutHeight } from 'layout/TwoPanelLayoutWithouScroll';
import RoomDetail from 'pages/chat/components/RoomDetail';
import { stringify } from 'querystring';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { isDesktop } from 'react-device-detect';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useMediaQuery } from 'react-responsive';
import { useHistory, useLocation } from 'react-router-dom';
import {
  // setSelectedUser,
  updateChatWindowActiveStatus,
} from 'store/reducer/salesState';
import styled from 'styled-components';
import { parseQuery } from 'util/index';

const TabPane = Tabs.TabPane;
interface Props {
  className?: string;
  showAttachmentViwe?: boolean;
  topBar?: ReactNode;
}

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
function SubscriberRightSider({ className, topBar }: Props): ReactElement {
  const { user } = useAuth();
  // const selectedUser = useAppSelector((state) => state.mysales.selectedUser);
  const selectedSubscription = useAppSelector(
    (state) => state.mysales.selectedSubscription,
  );
  const isFetchingSubscription = useAppSelector(
    (state) => state.chat.isFetchingSubscription,
  );
  const usersListTotalCount = useAppSelector(
    (state) => state.mysales.usersList.totalCount,
  );
  const subs = useAppSelector((state) => state.mysales.usersList);
  const [tab, selectedTab] = useState<number>(1);
  const isFetchingUsers = useAppSelector(
    (state) => state.mysales.isUserListFetching,
  );
  const [purchaseWallet, setPurchaseWallet] = useState<any>([]);
  const { showLeftView } = useControllTwopanelLayoutView();
  const location = useLocation();
  const diskTopHidden = useMediaQuery({ minWidth: 1400 });
  const tabletHidden = useMediaQuery({ maxWidth: 1399 });
  const { userId, ...rest } = parseQuery(location.search);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const isChatActive = useAppSelector(
    (state) => state.mysales.isChatWindowActive,
  );
  const {
    showNav = true,
    applyClass,
    onBottomNavToggle,
  } = useBottomNavToggler();
  useEffect(() => {
    if (user?._id && selectedSubscription?._id) {
      getPurchaseHistory(
        { seller: user?._id, buyer: selectedSubscription?.buyerId?._id },

        {
          ignoreStatusCodes: [404],
        },
      )
        .then((res) => setPurchaseWallet(res))
        .catch(() => console.log);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, selectedSubscription?._id]);

  // useEffect(() => {
  //   setChatLayoutHeight({
  //     id: 'chat-layout',
  //   });
  // }, [user, selectedSubscription?._id]);
  useEffect(() => {
    if (!isDesktop) {
      setTwoPanelLayoutHeight();
    }
  }, [user, selectedSubscription?._id, userId]);
  useEffect(() => {
    if (!isDesktop) {
      if (userId) {
        showNav && onBottomNavToggle({ showNav: false });
      } else {
        !showNav && onBottomNavToggle({ showNav: true });
      }
    }
    return () => {
      !isDesktop && onBottomNavToggle({ showNav: true, applyClass: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNav, userId, applyClass]);
  const handleTabChange = (stab: string) => {
    if (Number(stab) === tab) {
      return;
    }
    if (stab !== '1' && isChatActive) {
      dispatch(updateChatWindowActiveStatus(false));
    }
    if (stab === '1' && !isChatActive) {
      dispatch(updateChatWindowActiveStatus(true));
    }
    selectedTab(Number(stab));
  };
  const SkeletonLoading = () => {
    return (
      <>
        <div className="middle-block ">
          <div className="full-height">
            <div className="skeleton_area">
              <div className="skeleton_chat_area">
                <div className="skeleton_chat_box">
                  <SkeletonTheme
                    borderRadius="30px"
                    baseColor="#EDF0F6"
                    highlightColor="#c2c3c6"
                  >
                    <Skeleton circle height="42px" width="42px" />
                  </SkeletonTheme>
                  <div className="skeleton_chat_frame">
                    <SkeletonTheme
                      borderRadius="14px 14px 14px 0px"
                      baseColor="#EDF0F6"
                      highlightColor="#c2c3c6"
                    >
                      <Skeleton height="84px" width="100%" />
                    </SkeletonTheme>
                  </div>
                </div>
                <div className="skeleton_chat_box skeleton_chat_sender">
                  <div className="skeleton_chat_frame">
                    <SkeletonTheme
                      borderRadius="14px 14px 0px 14px"
                      baseColor="#EDF0F6"
                      highlightColor="#c2c3c6"
                    >
                      <Skeleton height="62px" width="118px" />
                    </SkeletonTheme>
                  </div>
                  <SkeletonTheme
                    borderRadius="30px"
                    baseColor="#EDF0F6"
                    highlightColor="#c2c3c6"
                  >
                    <Skeleton circle height="42px" width="42px" />
                  </SkeletonTheme>
                </div>
              </div>
              <div className="skeleton_frame">
                <div className="skeleton_text_wrap">
                  <SkeletonTheme
                    borderRadius="30px"
                    baseColor="#EDF0F6"
                    highlightColor="#c2c3c6"
                  >
                    <Skeleton height={60} />
                  </SkeletonTheme>
                </div>

                <SkeletonTheme
                  borderRadius="30px"
                  baseColor="#EDF0F6"
                  highlightColor="#c2c3c6"
                >
                  <Skeleton
                    circle
                    className="ml-10"
                    height="60px"
                    width="60px"
                  />
                </SkeletonTheme>
              </div>
            </div>
          </div>
        </div>
        {isDesktop && (
          <div className="right-col">
            <Scrollbar className="roomDetails">
              <div className="skeleton_cards__area">
                <div className="skeleton_card text-center">
                  <SkeletonTheme
                    borderRadius="100%"
                    baseColor="#EDF0F6"
                    highlightColor="#c2c3c6"
                  >
                    <Skeleton
                      circle
                      height="132px"
                      width="132px"
                      className="mb-10"
                    />
                  </SkeletonTheme>
                  <SkeletonTheme
                    borderRadius="3px"
                    baseColor="#EDF0F6"
                    highlightColor="#c2c3c6"
                  >
                    <Skeleton height="48px" width="178px" className="mb-5" />
                  </SkeletonTheme>
                  <SkeletonTheme
                    borderRadius="3px"
                    baseColor="#EDF0F6"
                    highlightColor="#c2c3c6"
                  >
                    <Skeleton height="20px" width="178px" className="mb-10" />
                  </SkeletonTheme>
                  <SkeletonTheme
                    borderRadius="3px"
                    baseColor="#EDF0F6"
                    highlightColor="#c2c3c6"
                  >
                    <Skeleton height="24px" width="178px" className="mb-25" />
                  </SkeletonTheme>
                  <div className="skeleton-social-area">
                    <SkeletonTheme
                      borderRadius="6px"
                      baseColor="#EDF0F6"
                      highlightColor="#c2c3c6"
                    >
                      <Skeleton height="34px" width="34px" count={3} />
                    </SkeletonTheme>
                  </div>
                </div>
                <div className="skeleton_card">
                  <SkeletonTheme
                    borderRadius="3px"
                    baseColor="#EDF0F6"
                    highlightColor="#c2c3c6"
                  >
                    <Skeleton height="24px" width="87px" className="mb-10" />
                  </SkeletonTheme>
                  <SkeletonTheme
                    borderRadius="3px"
                    baseColor="#EDF0F6"
                    highlightColor="#c2c3c6"
                  >
                    <Skeleton height="73px" className="mb-15" />
                  </SkeletonTheme>
                  <SkeletonTheme
                    borderRadius="3px"
                    baseColor="#EDF0F6"
                    highlightColor="#c2c3c6"
                  >
                    <Skeleton height="41px" />
                  </SkeletonTheme>
                </div>
                {new Array(2).fill(0)?.map((i, index) => (
                  <div key={index} className="skeleton_card">
                    <SkeletonTheme
                      borderRadius="3px"
                      baseColor="#EDF0F6"
                      highlightColor="#c2c3c6"
                    >
                      <Skeleton height="24px" width="155px" className="mb-10" />
                    </SkeletonTheme>
                    <SkeletonTheme
                      borderRadius="3px"
                      baseColor="#EDF0F6"
                      highlightColor="#c2c3c6"
                    >
                      <Skeleton height="26px" className="mb-10" />
                    </SkeletonTheme>
                    <SkeletonTheme
                      borderRadius="3px"
                      baseColor="#EDF0F6"
                      highlightColor="#c2c3c6"
                    >
                      <Skeleton height="121px" />
                    </SkeletonTheme>
                  </div>
                ))}
              </div>
            </Scrollbar>
          </div>
        )}
      </>
    );
  };
  if (isFetchingSubscription) {
    return (
      <RequestLoader
        className="mt-25"
        isLoading={true}
        width="28px"
        height="28px"
        color="var(--pallete-primary-main)"
      />
    );
  }

  return (
    <div className={className}>
      <div id="chat-layout" className="three-cols">
        {isDesktop ? (
          isFetchingUsers && !usersListTotalCount ? (
            <SkeletonLoading />
          ) : (
            <>
              {selectedSubscription && (
                <>
                  <div className="middle-block ">
                    {topBar}
                    {diskTopHidden && (
                      <div className="tablet-hidden full-height">
                        <Chat
                          isSeller={true}
                          isAllowMessages={true}
                          className={`chat-block`}
                        />
                      </div>
                    )}
                    {tabletHidden && (
                      <div className="desktop-hidden full-height">
                        <Chat
                          isSeller={true}
                          isAllowMessages={true}
                          className={`chat-block`}
                        />
                      </div>
                    )}
                  </div>
                  <div className="right-col">
                    <RoomDetail
                      onUserNameClick={() =>
                        history.push(
                          `/profile/${selectedSubscription?.buyerId?.username}`,
                        )
                      }
                      purchaseWallet={purchaseWallet}
                      user={selectedSubscription || {}}
                      showautoRenowelbutton={false}
                    />
                  </div>
                </>
              )}
            </>
          )
        ) : (
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
              {isFetchingUsers &&
              !selectedSubscription &&
              !usersListTotalCount ? (
                <SkeletonLoading />
              ) : (
                selectedSubscription && (
                  <>
                    <div className="back-bar">
                      <div
                        className="arrow-back"
                        onClick={() => {
                          // dispatch(setSelectedUser(null));
                          showLeftView();
                          history.push(
                            `subscriber?${stringify({
                              ...rest,
                            })}`,
                          );
                        }}
                      >
                        <ArrowBack />
                      </div>
                    </div>
                    <Tabs
                      defaultActiveKey="1"
                      type="card"
                      onChange={handleTabChange}
                      destroyInactiveTabPane
                    >
                      {!!selectedSubscription?._id && (
                        <>
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
                              className={`chat-block`}
                            />
                          </TabPane>
                        </>
                      )}
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
                          className="user-detail"
                          user={selectedSubscription || {}}
                          showautoRenowelbutton={false}
                        />
                      </TabPane>
                    </Tabs>
                  </>
                )
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
export default styled(SubscriberRightSider)`
  height: 100%;

  @media (max-width: 767px) {
    margin: 0;
  }
  .three-cols {
    display: flex;
    height: 100%;
    /* height: calc(100vh - 114px); */
  }
  .left-col {
    width: 375px;
    border-right: 1px solid var(--pallete-colors-border);
    height: 100%;
    @media (max-width: 1199px) {
      width: 300px;
    }
  }
  .memerbstabs {
    padding-top: 10px;
  }
  .right-col {
    width: 320px;
    border-left: 1px solid var(--pallete-colors-border);
    /* padding: 20px; */
    background: var(--pallete-background-gray);
    @media (max-width: 1199px) {
      /* padding: 15px; */
      width: 280px;
    }
    @media (max-width: 1023px) {
      display: none;
    }
  }

  .scroll-wrap {
    padding: 20px;

    @media (max-width: 1199px) {
      padding: 15px;
    }
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
  .middle-block .block .rc-tabs-tab {
    &:nth-child(2) {
      @media (min-width: 1024px) {
        display: none;
      }
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
  .full-height {
    height: 100%;
  }
  .tablet-hidden {
    @media (max-width: 1399px) {
      display: none !important;
    }
  }
  .middle-block {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    /* padding: 20px 0 0; */
    background: var(--pallete-background-primary);
    height: 100%;
    @media (max-width: 1399px) {
      /* padding: 20px 0 0; */
    }
    @media (max-width: 1023px) {
      /* padding: 12px 0 0; */
    }
    @media (max-width: 767px) {
      padding: 12px 0 40px;
    }
    .chat-block {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .user-detail {
      padding: 20px 20px 0;
      background: var(--pallete-background-default);

      @media (max-width: 767px) {
        padding: 15px 10px 0;
      }
    }
    .widget-box {
      margin-bottom: 20px;
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
          border-left: 1px solid var(--pallete-colors-border);
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
        @media (max-width: 767px) {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--pallete-background-default);
          border-top: 1px solid var(--pallete-colors-border);
          z-index: 3;
        }
      }
    }

    .left-col {
      border-right: none;
      position: relative;
    }
  }
  .back-bar {
    padding: 0 15px 12px 45px;
    position: relative;
    display: flex;
    align-items: center;
    min-height: 25px;
    .arrow-back {
      width: 15px;
      position: absolute;
      left: 15px;
      top: calc(50% - 6px);
      transform: translate(0, -50%);
    }
    .user-info {
      padding: 0 0 0 10px;
      flex-grow: 1;
      flex-basis: 0;
    }
    .name {
      display: block;
      font-size: 16px;
      line-height: 20px;
      color: var(--pallete-text-main-550);
      font-weight: 500;
    }
    .user-name {
      display: block;
      color: var(--pallete-text-light-200);
      font-size: 14px;
      line-height: 17px;
    }
  }
  .skeleton_area {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
  }
  .skeleton_frame {
    display: flex;
    flex-direction: row;
  }
  .skeleton_text_wrap {
    flex-grow: 1;
    flex-basis: 0;
  }

  .skeleton_chat_box {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    margin: 0 0 20px;
  }

  .skeleton_chat_frame {
    margin: 0 0 20px 15px;
    max-width: 393px;
    width: 100%;
  }

  .skeleton_chat_sender {
    justify-content: flex-end;

    .skeleton_chat_frame {
      margin: 0 15px 20px auto;
      max-width: inherit;
      width: auto;
    }
  }
  .skeleton_cards__area {
    padding: 20px;
  }

  .skeleton_card {
    padding: 15px;
    background: var(--pallete-background-default);
    border-radius: 5px;
    font-weight: 400;
    margin: 0 0 20px;
  }

  .skeleton-social-area {
    br {
      display: none;
    }

    .react-loading-skeleton {
      margin: 0 8px;
    }
  }
`;
