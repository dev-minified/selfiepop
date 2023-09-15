import { getPurchaseHistory, getSubscriptionById } from 'api/sales';
import { AvatarName, ProfleTickIcon } from 'assets/svgs';
import AvatarStatus from 'components/AvatarStatus';
import Button from 'components/NButton';
import Scrollbar from 'components/Scrollbar';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { useAppSelector } from 'hooks/useAppSelector';
import NotesView from 'pages/chat/components/NotesView';
import TagView from 'pages/chat/components/TagView';
import PurchaseHistory from 'pages/my-members/components/PurchaseHistory';

import { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';

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
  showPurchaseMenu?: boolean;
  onUserNameClick?: () => void;
}

function RecipientInfo({
  className,
  showPurchaseMenu = true,
  onUserNameClick,
}: Props): ReactElement | null {
  const selectedOrder = useAppSelector(
    (state) => state.profileOrders.selectedOrder,
  );
  const [pageLoading, setPageLoading] = useState(true);
  const [subscription, setSubscription] = useState<ChatSubsType>();
  const [purchaseWallet, setPurchaseWallet] = useState<any>([]);
  // const selectedSub = useAppSelector((state) => state.mysales.selectedUser);
  const buyer: any = selectedOrder?.buyer || {};
  const seller: any = selectedOrder?.seller || {};

  const isUserVerified = buyer?.isEmailVerified && buyer?.idIsVerified;

  useEffect(() => {
    setPurchaseWallet([]);
    if (seller?._id && buyer?._id) {
      if (selectedOrder?.subscriptionId) {
        fetchUserSub(selectedOrder?.subscriptionId);
      }
      getPurchaseHistory(
        { seller: seller?._id, buyer: buyer?._id },

        {
          ignoreStatusCodes: [404],
        },
      )
        .then((res) => setPurchaseWallet(res))
        .catch(() => console.log);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrder?._id]);
  const fetchUserSub = async (subId: string) => {
    // setTimeout(() => controller.abort(), 500);
    try {
      const response = await getSubscriptionById(
        subId,
        {},
        {
          ignoreStatusCodes: [404],
        },
      );
      console.log({ response });
      if (!response?.cancelled) {
        setSubscription(response);
      }

      setPageLoading(false);
    } catch (error: any) {
      setPageLoading(false);
    }
  };
  return buyer._id ? (
    <div className={className}>
      <Scrollbar className="">
        <div className="scroll-wrap">
          <div className="user-widget">
            <div className="recipient_avatar">
              <UserDetailedAvatar
                src={buyer?.profileImage}
                imgSettings={{ onlyDesktop: true }}
                fallbackComponent={
                  <AvatarName text={buyer?.pageTitle ?? 'Incognito User'} />
                }
              />
            </div>
            <h4 className="name_title">
              {`${buyer?.pageTitle ?? 'Incognito User'}`}

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
                onUserNameClick?.();
              }}
            >
              @{buyer?.username}
            </span>

            <ul className="list-btns d-flex flex-column">
              {buyer?._id && (
                <li>
                  <Button className="last_seen" shape="circle">
                    {buyer?.isOnline
                      ? 'Online'
                      : `Last seen ${dayjs(buyer?.offlineAt).utc().fromNow()}`}
                  </Button>
                </li>
              )}
            </ul>
          </div>
          {subscription?._id && (
            <TagView
              sub={subscription!}
              isBuyer={false}
              user={subscription.sellerId}
              className="mb-20 widget-box"
              // managedAccountId={managedAccountId}
            />
          )}
          {subscription?._id && (
            <NotesView
              sub={subscription!}
              isBuyer={false}
              user={subscription.sellerId}
              className="widget-box"
            />
          )}

          {showPurchaseMenu && (
            <div className="mt-20">
              <PurchaseHistory purchaseWallet={purchaseWallet} />
            </div>
          )}
        </div>
      </Scrollbar>
    </div>
  ) : null;
}

export default styled(RecipientInfo)`
  /* background: var(--pallete-background-gray-secondary-light); */
  width: 320px;
  border-left: 1px solid var(--pallete-colors-border);

  .rc-scollbar {
    padding: 0 !important;
  }

  .scroll-wrap {
    padding: 40px 20px 20px;

    @media (max-width: 767px) {
      padding: 20px;
    }
  }

  .user-widget {
    /* padding: 20px; */
    background: var(--pallete-background-default);
    border-radius: 5px;
    text-align: center;
    font-size: 14px;
    line-height: 17px;
    font-weight: 400;
    /* border: 2px solid var(--pallete-colors-border); */
    margin: 0 0 20px;

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
    }

    .description {
      color: #131549;
      margin: 0 0 10px;
    }

    .last_seen {
      padding: 2px 5px;
      /* color: var(--pallete-primary-main); */
      background: var(--pallete-background-light);
      color: var(--pallete-text-button-primary);
      font-size: 14px;
      line-height: 17px;
      margin: 0 0 10px;
      pointer-events: none;
    }

    .selected-variant {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      line-height: 16px;
      color: var(--pallete-text-secondary);
      font-weight: 500;
      margin: 0 0 15px;

      svg {
        margin: 0 10px 0 0;
      }
    }

    .list-btns {
      padding: 11px 0 3px;
      margin: 0;
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: center;

      li {
        padding: 0 10px;
      }

      .button {
        background: var(--pallete-text-secondary-200);
        color: #fff;
        /* border-color: var(--pallete-text-secondary-200); */
        width: 100%;
        max-width: 204px;
        margin: 0px auto;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        justify-content: center;
        font-size: 14px;

        .sp_dark & {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }
`;
