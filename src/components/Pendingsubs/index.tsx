import {
  getExpiredorNearExpiredList,
  renewAllpendigSubs,
} from 'api/ChatSubscriptions';
import { InfoIcon } from 'assets/svgs';
import Button from 'components/NButton';
import { RequestLoader } from 'components/SiteLoader';
import According from 'components/according';
import { toast } from 'components/toaster';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useSocket from 'hooks/useSocket';
import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import SubItem from './SubItem';

type Props = {
  className?: string;
};

export type ExpSub = {
  sellerDeleted: boolean;
  buyerDeleted: boolean;
  tags: string[];
  notifications: boolean;
  textNotification: boolean;
  autoRenew: boolean;
  tryHit: 0;
  isActive: boolean;
  test: boolean;
  _id: string;
  buyerId: {
    allowPurchases: boolean;
    _id: string;
    username: string;
    email: string;
    pageTitle: string;
    profileImage: string;
  };
  memeberShip: {
    allowBuyerToMessage: boolean;
    isArchive: boolean;
    isDeleted: boolean;
    isDefault: boolean;
    _id: string;
    questions: any[];
    title: string;
    price: number[];
    description: string;
    isActive: boolean;
    type: string;
    sort: number[];
    allowContentAccess: boolean;
  };
  orderId: string;
  sellerId: {
    stopAllSelling: boolean;
    isDeactivate: boolean;
    idIsVerified: boolean;
    _id: string;
    profileImage: string;
    pageTitle: string;
    username: string;
  };
  periodStart: string;
  periodEnd: string;
  sellerNotes: [];
  createdAt?: string;
  updatedAt?: string;

  lastMessage?: string;
  renewStatus?: string;
  cardStatusMessage?: string;
  isNotAllowRetry?: boolean;
};
const SubsErrorMessages: any = {
  BUYER_PURCHASES_OFF: 'Your account have chargebacks',
  CARD_NOT_FOUND: 'Card not found',
  CARD_EXPIRED: 'Card is expired',
  '3D_CARD': 'Card require authentication',
  CARD_DECLINE: 'Card declined',
};
const SingleSubFailed: any = {
  ORDER_NOT_FOUND: 'Order not found',
  SELLER_DEACTIVATE: 'Seller is deactivated',
  SELLER_STOP_SELLING: 'Seller stops sellings',
  MEMBERSHIP_NOT_FOUND: 'Membership does not exist',
};
const Index = (props: Props) => {
  const { className } = props;
  const [isLoding, setIsLoading] = useState(true);
  const [isRenewAll, setIsRenewAll] = useState(false);
  const [allowAll, setAllowAll] = useState(false);
  const user = useAuth()?.user;
  const [subs, setSubs] = useState<{ items: ExpSub[]; totalCount: number }>({
    items: [],
    totalCount: 0,
  });
  const primaryCard = useAppSelector((state) => state.global.primaryCard);
  const { socket } = useSocket();
  const getExpiredSubs = async () => {
    getExpiredorNearExpiredList(
      { skip: 0, limit: 10 },
      {
        errorConfig: {
          ignoreStatusCodes: [404],
        },
        // signal: controller.signal,
      },
    )
      .then((data) => {
        setIsLoading(false);
        if (data.cancelled) {
          return;
        }
        if (!!data?.totalCount) {
          let isAllDeactivatedOrStopSelling = false;
          let iaAllMembershipNotExist = false;
          const isAllowAllSub = data.items.find((a: ExpSub) => {
            isAllDeactivatedOrStopSelling =
              a.sellerId.isDeactivate || a.sellerId.stopAllSelling;

            iaAllMembershipNotExist = !!a.memeberShip;

            return (
              !isAllDeactivatedOrStopSelling &&
              iaAllMembershipNotExist &&
              a.renewStatus !== 'PENDING' &&
              a.buyerId?.allowPurchases
            );
          });
          setAllowAll(!!isAllowAllSub);
          setSubs(data);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  };
  const iterateItems = (
    items: ExpSub[],
    message: string,
    isAllowRetry: boolean,
    status: string,
  ) => {
    const newSubs = items.map((s) => {
      if (!!message) {
        s.cardStatusMessage = message || 'Card declined';
        s.renewStatus = status;
      } else {
        s.cardStatusMessage = 'Card declined';
        s.renewStatus = status;
      }
      s.isNotAllowRetry = isAllowRetry;
      return s;
    });
    return newSubs;
  };
  useEffect(() => {
    if (user?._id) {
      socket?.on(user._id, (data) => {
        const message = SubsErrorMessages[data?.reason];
        const specificMessage = SingleSubFailed[data?.reason];
        if (!!message || !data.subscriptionId) {
          toast.error(`Your subscriptions  renewel failed. `);
          const items: any = iterateItems(
            subs.items,
            message,
            true,
            data.status,
          );
          setAllowAll((s) => false);
          setSubs((s) => ({ items, totalCount: s.totalCount }));
        } else {
          let items = subs.items;
          let totalCount = subs.totalCount;
          if (data.status === 'COMPLETE') {
            items = items.filter((s) => {
              return s._id !== data.subscriptionId;
            });
            totalCount = totalCount - 1;
            toast.success(`Your subscription has been renewed. `);
          } else {
            items = items.map((s) => {
              if (s._id === data.subscriptionId) {
                s.isNotAllowRetry = false;
                s.renewStatus = data.status;
                s.cardStatusMessage = specificMessage || 'Card declined';
              }
              return s;
            });
            toast.error(`Your subscription  renewel failed. `);
          }

          setAllowAll((s) => false);
          setSubs((s) => ({ items, totalCount: totalCount || 0 }));
        }
      });
    }
    return () => {
      socket?.off(user?._id);
    };
  }, [socket, user?._id, subs]);
  useEffect(() => {
    // controller = new AbortController();
    getExpiredSubs();
    return () => {
      // controller.abort();
    };
  }, []);
  const onRenewAllPendingSubs = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsRenewAll(true);
      await renewAllpendigSubs();
      getExpiredSubs();
      setAllowAll(false);
      setIsRenewAll(false);
    } catch (error) {
      setIsRenewAll(false);
    }
  };
  const { items, totalCount } = subs;
  return (
    <div className={`${className} pending-subs`}>
      {isLoding ? (
        <RequestLoader
          isLoading={true}
          width={64}
          height={64}
          color="var(--pallete-primary-main)"
        />
      ) : (
        <>
          <According
            title={`Pending subs ${totalCount}`}
            Svg={InfoIcon}
            showIcon
            defaultOpen
          >
            {items.map((sub) => (
              <SubItem
                sub={sub}
                key={sub?._id}
                isCardExpired={primaryCard.isExpired}
              />
            ))}
          </According>
          {allowAll ? (
            <Button
              type="primary"
              onClick={onRenewAllPendingSubs}
              disabled={isRenewAll}
              isLoading={isRenewAll}
            >
              Renew All
            </Button>
          ) : null}
        </>
      )}
    </div>
  );
};

export default styled(Index)`
  ${({ theme }) => css`
    .rc-according {
      &:not(.open) {
        .rc-header {
          .indicator {
            top: -7px;
          }
        }
      }
      .rc-header {
        padding: 0;
        border: none;
        margin: 0 0 30px;

        .indicator {
          right: 0;
          top: -9px;
          color: #cecfd1;
        }

        .icon {
          width: 20px;
          height: 20px;
          min-width: 20px;
          background: none;
          color: currentColor;
          margin: 0 12px 0 0;

          svg {
            width: 100%;
            height: auto;
            display: block;

            path {
              fill: currentColor;
              opacity: 1;
            }
          }
        }

        .title {
          h5 {
            font-size: 16px;
            line-height: 19px;
            font-weight: 500;
          }
        }
      }

      .content {
        padding: 0;
      }
    }
  `}
`;
