import { AvatarName, Bell, Heat, ProfleTickIcon, Star } from 'assets/svgs';
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
import useAuth from 'hooks/useAuth';
import useOpenClose from 'hooks/useOpenClose';
import MemberShipUpgradeModels from 'pages/subscriptions/components/Model/MemberShipUpgradeModels';
import TextNotificationModal from 'pages/subscriptions/rightScreen/components/TextNotificationModal';

import { getSubscriptionIdByUserId, payForMembershipUpgrade } from 'api/sales';
import { ReactElement, useEffect, useState } from 'react';
import {
  onCardModalOpen,
  removeCallbackForPayment,
  setCallbackForPayment,
} from 'store/reducer/cardModal';
import { onToggleModal } from 'store/reducer/changeMembershipModal';

import { updatesubForTextMessagesNotifications } from 'api/ChatSubscriptions';
import { USERCHARGEBACKMESSAGE } from 'appconstants';
import UnSubscribeMode from 'pages/chat/components/Models/UnSubscribeMode';
import { useHistory } from 'react-router-dom';
import {
  cancelSubAutoReniew,
  chatUnsubscribeToggler,
} from 'store/reducer/chat';
import { setSelectedSub } from 'store/reducer/salesState';
import styled from 'styled-components';
import { useAnalytics } from 'use-analytics';
import SalespurchasesChat from './../../../assets/svgs/svgsFiles/SalespurchasesChat';

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

  onUserNameClick?: (user: ChatUserType) => void;
  onMembershipUpgrade?: (
    subId: string,
    memberhipId: string,
  ) => void | Promise<any>;
}

function RecipientInfo({
  className,
  selectedVariation,
  onMembershipUpgrade,
  onUserNameClick,
}: Props): ReactElement {
  const loggedUser = useAuth().user;
  const [upgrading, setUpdrading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isOpen = useAppSelector((state) => state.membershipModel.isModalOpen);
  const userCards = useAppSelector((state) => state.global.userCards);
  const [tIsOPen, onTOpen, onTClose, onTToogle] = useOpenClose();
  const [isOpenModel, onOpenModel, onCloseModel] = useOpenClose();
  const [subscription, setUserSubsciption] = useState<any>(null);
  const analytics = useAnalytics();
  const history = useHistory();
  const selectedOrder = useAppSelector(
    (state) => state.profileVisitor.subscription,
  );
  const selectedProfile = useAppSelector(
    (state) => state.profileVisitor.selectedProfile,
  );
  const isMemberShipUpgrading = useAppSelector(
    (state) => state.mysales.isMemberShipUpgrading,
  );
  const seller: any = selectedOrder?.sellerId;
  // const selectedSub = useAppSelector((state) => state.mysales.selectedUser);
  const dispatch = useAppDispatch();

  const IS_SP_HOUSE = SP_HOUSE_ID === seller?._id;
  const getSubscriptonById = async (id: string) => {
    try {
      const data = await getSubscriptionIdByUserId(
        id,
        {},
        {
          ignoreStatusCodes: [404, 500],
        },
      );
      setUserSubsciption(data);
      return data;
    } catch (error) {
      return error;
    }
  };
  const onMembershipUpgradeitem = async (
    subId: string,
    membershipId: string,
  ) => {
    payForMembershipUpgrade(subId, membershipId, dispatch)
      .then(async () => {
        try {
          await getSubscriptonById(seller?._id);
          dispatch(removeCallbackForPayment());
          analytics.track('subscription_renew', {
            purchasedFrom: selectedOrder?.sellerId?._id,
            memberLevelId: membershipId,
          });
          setUpdrading(false);
          toast.success('Subscription is upgraded successfully');
        } catch (e) {
          console.log(e);
        }
      })
      .catch((e) => {
        if (e && e?.message) {
          toast.error(e.message);
        } else {
          toast.error('Something went wrong please try again!');
        }
      });
  };
  const upgradeMembershipPayment = async (
    subId: string,
    membershipId: string,
  ) => {
    try {
      setUpdrading(true);
      if (!!onMembershipUpgrade) {
        await onMembershipUpgrade?.(subId, membershipId);
        setUpdrading(false);
        return;
      }
      return await onMembershipUpgradeitem(subId, membershipId);
    } catch (error) {
      setUpdrading(false);
    }
  };
  const handleSubscriptionToggler = async () => {
    if (subscription?.subscriptionId) {
      setIsLoading(true);
      onCloseModel();
      if (subscription.autoRenew) {
        dispatch(
          cancelSubAutoReniew({
            subscriptionId: subscription.subscriptionId,
          }),
        )
          .then(() => {
            toast.success('You successfully unsubscribe this user');
            setUserSubsciption({
              ...subscription,
              autoRenew: false,
            }),
              setIsLoading(false);
          })
          .catch((e) => {
            setIsLoading(false);
            console.log(e);
          });
      } else {
        dispatch(
          chatUnsubscribeToggler({
            subscriptionId: subscription.subscriptionId,
            data: { autoRenew: !subscription.autoRenew },
            dispatch,
          }),
        )
          .unwrap()
          .then(({ data }) => {
            toast.success('You successfully subscribe this user');
            setUserSubsciption({
              ...subscription,
              autoRenew: data.autoRenew,
              periodEnd: data.periodEnd,
              periodStart: data.periodStart,
              isActive: data.isActive,
            });

            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
      }
    }
  };
  useEffect(() => {
    if (seller?._id) {
      getSubscriptonById(seller?._id || '');
    }
  }, [selectedOrder?._id]);
  const isUserVerified =
    selectedProfile?.isEmailVerified && selectedProfile?.idIsVerified;
  const isNotExpired =
    dayjs.utc(subscription?.periodEnd).local().diff(dayjs(), 'minutes') >= 0;
  const isSellerDeActived = subscription?.sellerId?.isDeactivate;
  const showUpgrade_unsubscribeBtns =
    (!isSellerDeActived && !isNotExpired) || subscription?.autoRenew;
  return (
    <div className={`${className} user-detail-info`}>
      <div className="recipient_avatar">
        <UserDetailedAvatar
          src={selectedProfile?.profileImage}
          imgSettings={{ onlyDesktop: true }}
          fallbackComponent={
            <AvatarName
              text={selectedProfile?.pageTitle || 'Incongnito User'}
            />
          }
        />
      </div>
      <h4 className="name_title">
        {`${selectedProfile?.pageTitle ?? 'Incognito User'}`}

        {isUserVerified ? (
          <ProfleTickIcon
            width="15"
            height="15"
            fill="var(--pallete-primary-main)"
          />
        ) : null}
      </h4>
      <span
        className={`username`}
        onClick={(e) => {
          e.stopPropagation();
          onUserNameClick?.(selectedProfile as any);
        }}
      >
        @{selectedProfile?.username}
      </span>

      <ul className="list-btns d-flex flex-column">
        {seller?._id && (
          <li>
            <Button className="last_seen" shape="circle">
              {seller?.isOnline
                ? 'Online'
                : `Last seen ${dayjs(seller?.offlineAt).utc().fromNow()}`}
            </Button>
          </li>
        )}
        <li>
          <Button
            type="default"
            className="btn"
            icon={
              <Star
                width={20}
                height={20}
                secondaryColor="transparent"
                primaryColor="var(--pallete-primary-main)"
              />
            }
            onClick={() => {
              window.open(`/${selectedProfile?.username}`);
            }}
          >
            View Profile
          </Button>
        </li>
        {subscription?._id ? (
          <li>
            <Button
              type="default"
              disabled={!selectedOrder?._id}
              className="btn-notifications btn"
              icon={<SalespurchasesChat />}
              onClick={(e) => {
                e.stopPropagation();
                history.replace(
                  `/messages/subscriptions?userId=${seller?._id}&subId=${selectedOrder?._id}`,
                );
              }}
            >
              Send Message
            </Button>
          </li>
        ) : null}
      </ul>
      {subscription?._id ? (
        <ul className="list-btns d-flex flex-column">
          {!IS_SP_HOUSE && showUpgrade_unsubscribeBtns ? (
            <li>
              <Button
                type="default"
                disabled={isMemberShipUpgrading || upgrading}
                isLoading={isMemberShipUpgrading || upgrading}
                icon={<Heat />}
                onClick={() => {
                  // if (isSellerDeActived) {
                  //   toast.error(`You can't updgrade your subscription for now`);
                  //   return;
                  // }
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
          <li>
            <Button
              type="default"
              disabled={!selectedOrder?._id}
              className="btn-notifications"
              icon={<Bell />}
              onClick={(e) => {
                e.stopPropagation();
                onTOpen();
              }}
            >
              Get Text Notifications
            </Button>
          </li>
        </ul>
      ) : null}
      {!IS_SP_HOUSE && seller?._id && showUpgrade_unsubscribeBtns && (
        <div className="mt-10 mb-10 d-flex  justify-content-center ">
          <Button
            isLoading={isLoading}
            disabled={isLoading}
            // icon={<ChatUnsubscribeSVG />}
            size="small"
            type="text"
            className="btn-renewel"
            onClick={() => onOpenModel()}
          >
            Cancel <span className="text-offwhite">Auto-renewal</span>{' '}
            subscription
          </Button>
        </div>
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
                  selectedOrder?._id || '',
                  membershipId?.[0],
                ),
            }),
          );
          upgradeMembershipPayment(
            selectedOrder?._id || '',
            membershipId?.[0],
          ).catch((e) => toast.error(e?.message));
        }}
        selectedVariation={selectedVariation}
        isOpen={isOpen}
        user={selectedOrder}
        post={false}
      />
      <TextNotificationModal
        onSave={async (checked) => {
          try {
            if (subscription?._id) {
              const response = await updatesubForTextMessagesNotifications(
                subscription?._id,
                checked,
              );
              if (response?.success) {
                dispatch(
                  setSelectedSub({
                    ...subscription,
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
        value={false}
        user={selectedOrder?.sellerId}
        loggedUser={loggedUser}
        isOpen={tIsOPen}
        onCancel={onTToogle}
      />
      <UnSubscribeMode
        isOpen={isOpenModel}
        isSubscribed={subscription?.autoRenew}
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
    margin: 0 0 5px;
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
    margin: 0 0 9px;
    cursor: pointer;
  }
  .description {
    color: #131549;
    margin: 0 0 10px;
  }
  .last_seen {
    padding: 2px 5px;
    color: var(--pallete-primary-main);
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

  /* .btn-notifications {
    display: flex;
    align-items: center;
    svg {
      min-width: 20px;
      margin-top: 0;
    }
  } */
`;
