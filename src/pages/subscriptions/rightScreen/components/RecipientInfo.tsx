import { updatesubForTextMessagesNotifications } from 'api/ChatSubscriptions';
import { EmptyBellIcon, Heat, ProfleTickIcon } from 'assets/svgs';
import AvatarStatus from 'components/AvatarStatus';
import Button from 'components/NButton';
import { toast } from 'components/toaster';
import { SP_HOUSE_ID } from 'config';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useOpenClose from 'hooks/useOpenClose';
import UnSubscribeMode from 'pages/chat/components/Models/UnSubscribeMode';

import { USERCHARGEBACKMESSAGE } from 'appconstants';
import { ReactElement, useState } from 'react';
import {
  onCardModalOpen,
  setCallbackForPayment,
} from 'store/reducer/cardModal';
import { onToggleModal } from 'store/reducer/changeMembershipModal';
import {
  cancelSubAutoReniew,
  chatUnsubscribeToggler,
} from 'store/reducer/chat';
import {
  setSelectedSub,
  toggleContentAccess,
  toggleSendMessage,
} from 'store/reducer/salesState';
import styled from 'styled-components';
import MemberShipUpgradeModels from '../../components/Model/MemberShipUpgradeModels';
import TextNotificationModal from './TextNotificationModal';
dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(isSameOrAfter);
const UserDetailedAvatar = styled(AvatarStatus)`
  &.user-image {
    width: 100%;
    height: 100%;
  }
`;
interface Props {
  className?: string;
  // isBuyer?: boolean;
  user?: ChatSubsType | null;
  selectedVariation?: any;
  setSelectedVariation?: any;
  loggedUser?: any;
  onUserNameClick?: () => void;
  onMembershipUpgrade?: (
    subId: string,
    memberhipId: string,
  ) => void | Promise<any>;
}

function RecipientInfo({
  className,
  user,
  selectedVariation,

  loggedUser,
  onMembershipUpgrade,
  onUserNameClick,
}: Props): ReactElement {
  const [upgrading, setUpdrading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isOpen = useAppSelector((state) => state.membershipModel.isModalOpen);
  const userCards = useAppSelector((state) => state.global.userCards);
  const [tIsOPen, onTOpen, onTClose, onTToogle] = useOpenClose();
  const [isOpenModel, onOpenModel, onCloseModel] = useOpenClose();

  const selectedSubscription = useAppSelector(
    (state) => state.mysales.selectedSubscription,
  );
  const isMemberShipUpgrading = useAppSelector(
    (state) => state.mysales.isMemberShipUpgrading,
  );
  // const selectedSub = useAppSelector((state) => state.mysales.selectedUser);
  const dispatch = useAppDispatch();
  if (!user?._id) return <></>;
  const IS_SP_HOUSE = SP_HOUSE_ID === selectedSubscription?.sellerId?._id;
  const handleSubscriptionToggler = async () => {
    if (selectedSubscription?._id) {
      setIsLoading(true);
      onCloseModel();
      if (selectedSubscription.autoRenew) {
        dispatch(
          cancelSubAutoReniew({
            subscriptionId: selectedSubscription._id,
          }),
        )
          .then(() => {
            dispatch(
              setSelectedSub({
                ...selectedSubscription,
                autoRenew: false,
              }),
            );
            setIsLoading(false);
          })
          .catch((e) => {
            setIsLoading(false);
            console.log(e);
          });
      } else {
        dispatch(
          chatUnsubscribeToggler({
            subscriptionId: selectedSubscription._id,
            data: { autoRenew: !selectedSubscription.autoRenew },
            dispatch,
          }),
        )
          .unwrap()
          .then(({ data }) => {
            dispatch(
              setSelectedSub({
                ...selectedSubscription,
                autoRenew: data.autoRenew,
                periodEnd: data.periodEnd,
                periodStart: data.periodStart,
                isActive: data.isActive,
              }),
            );
            dispatch(
              toggleSendMessage({
                allowBuyerToMessage:
                  selectedSubscription?.priceVariation?.allowBuyerToMessage,
              }),
            );
            dispatch(
              toggleContentAccess({
                isContentAccess:
                  selectedSubscription?.priceVariation?.allowContentAccess,
              }),
            );
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
      }
    }
  };
  const upgradeMembershipPayment = async (
    subId: string,
    membershipId: string,
  ) => {
    try {
      setUpdrading(true);
      return await onMembershipUpgrade?.(subId, membershipId);
      setUpdrading(false);
    } catch (error) {
      setUpdrading(false);
    }
    // return dispatch(
    //   paymentForMembershipUpgrade({ subId, membershipId, dispatch }),
    // )
    //   .unwrap()
    //   .then(() => {
    //     getDetail();
    //     dispatch(removeCallbackForPayment());
    //     getOrdersList({ userId: user?._id, type: 'buyer' })
    //       .then((d) => {
    //         if (d?.totalCount > 0) {
    //           dispatch(
    //             insertBeginningOfUserList({
    //               data: d.items[0],
    //               insertatbeginning: false,
    //             }),
    //           );
    //           dispatch(setSelectedUser(d.items[0]));
    //         }
    //         analytics.track('subscription_renew', {
    //           purchasedFrom: user?.sellerId?._id,
    //           memberLevelId: membershipId,
    //         });
    //         toast.success('Subscription is upgraded successfully');
    //       })
    //       .catch((e) => console.log(e));
    //   })
    //   .catch((e) => {
    //     if (e && e?.message) {
    //       toast.error(e.message);
    //     } else {
    //       toast.error('Something went wrong please try again!');
    //     }
    //   });
  };
  const isUserVerified =
    user?.sellerId?.isEmailVerified && user?.sellerId?.idIsVerified;

  const isNotExpired =
    dayjs
      .utc(selectedSubscription?.periodEnd)
      .local()
      .diff(dayjs(), 'minutes') >= 0;
  const isSellerDeActived = selectedSubscription?.sellerId?.isDeactivate;
  const showUpgrade_unsubscribeBtns =
    (!isSellerDeActived && !isNotExpired) || selectedSubscription?.autoRenew;
  return (
    <div className={className}>
      <div className="recipient_avatar">
        <UserDetailedAvatar
          src={user?.sellerId?.profileImage}
          imgSettings={{ onlyDesktop: true }}
        />
      </div>
      <h4 className="name_title">
        {`${user?.sellerId?.pageTitle ?? 'Incognito User'}`}

        {isUserVerified ? (
          <ProfleTickIcon
            width="15"
            height="15"
            fill="var(--pallete-primary-main)"
          />
        ) : null}
      </h4>
      <ul className="user-detail-area">
        <li>
          <span
            className={`username`}
            onClick={(e) => {
              e.stopPropagation();
              onUserNameClick?.();
            }}
          >
            @{user?.sellerId?.username}
          </span>
        </li>
        {selectedSubscription?._id && (
          <li>
            <span className="last_seen">
              {selectedSubscription?.sellerId?.isOnline
                ? 'Online'
                : `${dayjs(selectedSubscription?.sellerId?.offlineAt)
                    .utc()
                    .fromNow()}`}
            </span>
          </li>
        )}
      </ul>
      {!!selectedSubscription?._id && (
        <>
          <ul className="list-btns d-flex flex-column">
            {/* {selectedSubscription?._id && (
              <li>
                <Button type="default" className="last_seen">
                  {selectedSubscription?.sellerId?.isOnline
                    ? 'Online'
                    : `Last seen ${dayjs(
                        selectedSubscription?.sellerId?.offlineAt,
                      )
                        .utc()
                        .fromNow()}`}
                </Button>
              </li>
            )} */}
            {!IS_SP_HOUSE ? (
              <li>
                <Button
                  type="default"
                  disabled={isMemberShipUpgrading || upgrading}
                  isLoading={isMemberShipUpgrading || upgrading}
                  icon={<Heat />}
                  onClick={() => {
                    if (isSellerDeActived) {
                      toast.error(
                        `You can't updgrade your subscription for now`,
                      );
                      return;
                    }
                    if (!loggedUser?.allowPurchases) {
                      toast.error(USERCHARGEBACKMESSAGE);
                      return;
                    }
                    if (!userCards?.length) {
                      dispatch(onCardModalOpen());
                      return;
                    }
                    dispatch(
                      onToggleModal({
                        isModalOpen: true,
                      }),
                    );
                  }}
                >
                  Change Memberships
                </Button>
              </li>
            ) : null}
          </ul>
          <ul className="list-btns d-flex flex-column">
            <li>
              <Button
                type="default"
                className="btn-notifications"
                icon={<EmptyBellIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  onTOpen();
                }}
              >
                Get Text Notifications
              </Button>
            </li>
          </ul>
        </>
      )}
      <MemberShipUpgradeModels
        onClose={() => {
          dispatch(
            onToggleModal({
              isModalOpen: false,
            }),
          );
        }}
        cbSubmit={(c, membershipId) => {
          dispatch(
            setCallbackForPayment({
              callback: () =>
                upgradeMembershipPayment(
                  selectedSubscription?._id || '',
                  membershipId?.[0],
                ),
            }),
          );
          upgradeMembershipPayment(
            selectedSubscription?._id || '',
            membershipId?.[0],
          ).catch((e) => toast.error(e?.message));
        }}
        selectedVariation={selectedVariation}
        isOpen={isOpen}
        user={user}
        post={false}
      />
      <TextNotificationModal
        onSave={async (checked) => {
          try {
            if (selectedSubscription?._id) {
              const response = await updatesubForTextMessagesNotifications(
                selectedSubscription?._id,
                checked,
              );
              if (response?.success) {
                dispatch(
                  setSelectedSub({
                    ...selectedSubscription,
                    textNotification: checked,
                  }),
                );
              }
              onTClose();
              toast.success('Notifications settings is updated!');
            }
          } catch (error: any) {
            if (error?.message) {
              toast.error(
                error?.message || 'Notifications settings is not updated!',
              );
            }
          }
        }}
        value={selectedSubscription?.textNotification}
        user={user?.sellerId}
        loggedUser={loggedUser}
        isOpen={tIsOPen}
        onCancel={onTToogle}
      />
      {!IS_SP_HOUSE &&
        selectedSubscription?._id &&
        showUpgrade_unsubscribeBtns && (
          <div className="mt-10 mb-10 d-flex  justify-content-center ">
            <Button
              isLoading={isLoading}
              disabled={isLoading}
              className="btn-renewel"
              // icon={<ChatUnsubscribeSVG />}
              size="small"
              type="text"
              onClick={() => onOpenModel()}
            >
              {selectedSubscription?.autoRenew ? (
                <>
                  Cancel <span className="text-offwhite">Auto-renewal</span>{' '}
                  subscription
                </>
              ) : (
                'Subscribe'
              )}
            </Button>
          </div>
        )}

      <UnSubscribeMode
        isOpen={isOpenModel}
        isSubscribed={selectedSubscription?.autoRenew}
        onCancel={() => onCloseModel()}
        onUnsubscribe={handleSubscriptionToggler}
      />
    </div>
  );
}

export default styled(RecipientInfo)`
  padding: 20px 0;
  background: var(--pallete-background-default);
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
  line-height: 17px;
  font-weight: 400;
  border: 2px solid var(--pallete-colors-border);

  .sp_dark & {
    padding: 0;
    border: none;
  }

  .gift-box {
    padding: 0;

    .roses_section {
      @media (min-width: 1200px) {
        padding: 0 5px;
      }
    }

    .btn-price {
      font-size: 14px;
    }
  }

  .recipient_avatar {
    width: 132px;
    height: 132px;
    border-radius: 100%;
    margin: 0 auto 8px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  h4 {
    color: var(--pallete-text-light-100);
    margin: 0 0 10px;

    svg {
      margin: 0 0 0 10px;
      display: inline-block;
      vertical-align: middle;

      path {
        .sp_dark & {
          fill: var(--pallete-text-main);
        }
      }
    }
  }

  .username {
    display: block;
    color: var(--pallete-text-light-200);
    /* margin: 0 0 9px; */
    cursor: pointer;
  }

  .description {
    color: #131549;
    margin: 0 0 10px;
  }

  .last_seen {
    /* padding: 2px 5px; */
    /* color: var(--pallete-primary-main); */
    font-size: 14px;
    line-height: 17px;
    margin: 0 0 10px;
    pointer-events: none;
  }

  .list-btns {
    padding: 11px 0 3px;
    margin: 0;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: center;

    + .list-btns {
      padding-top: 16px;
    }

    li {
      padding: 0 10px;
      width: 100%;

      + li {
        margin: 10px 0 0;
      }
    }

    .button {
      color: var(--pallete-text-button-primary);
      background-color: var(--pallete-background-light);
      width: 100%;
      max-width: 204px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      font-size: 14px;

      .sp_dark & {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.6);
      }

      svg {
        color: #fff;
      }

      .flame-icon {
        circle {
          fill: transparent;
        }
      }

      .text-button {
        flex-grow: 1;
        flex-basis: 0;
        min-width: 0;
        text-align: center;
      }

      &:hover {
        color: #fff;

        .sp_dark & {
          background: var(--colors-indigo-200);
        }
      }
    }
  }

  .btn-renewel {
    border: none !important;
    font-size: 12px;
    line-height: 14px;

    &.button-sm {
      font-size: 12px;
      line-height: 14px;
    }

    &:hover {
      background: none;
    }

    &:not(:hover) {
      color: rgba(255, 255, 255, 0.4);

      .text-offwhite {
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }

  .cancel_btn {
    background-color: var(--pallete-background-light);
    color: var(--pallete-text-button-primary);
  }

  .user-detail-area {
    margin: 0 0 9px;
    padding: 0;
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    line-height: 17px;
    color: var(--pallete-text-light-200);

    .sp_light & {
      margin: 0 -18px 9px;
      color: #d0d0d0;
    }

    li {
      padding: 0 10px;
      position: relative;
      margin: 0 0 6px;

      &:first-child {
        &:before {
          display: none;
        }
      }

      &:before {
        position: absolute;
        left: -2px;
        top: 50%;
        transform: translate(0, -50%);
        content: '';
        background: var(--pallete-text-light-200);
        width: 4px;
        height: 4px;
        border-radius: 100%;
      }
    }
  }
`;
