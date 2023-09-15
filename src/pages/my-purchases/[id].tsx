import { getOrder } from 'api/Order';
import { ExtraOrderTypes } from 'appconstants';
import { ChevronLeft } from 'assets/svgs';
import Empty from 'components/Empty';
import Button from 'components/NButton';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ServiceType } from 'enums';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import RatingCard from 'pages/components/RatingCard';
import { useEffect, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import AdvertisementPurchase from './components/AdvertisementPurchase';
import Generic from './components/Generic';
import PaymaPurchase from './components/PaymaPurchase';
import PoplivePurchase from './components/PoplivePurchase';
import ShoutoutPurchase from './components/ShoutoutPurchase';
import Unlocks from './components/Unlocks';
import ChatSubscription from './components/chatSubscription';

dayjs.extend(relativeTime);
function PurchaseDetail({ order: Order, className, ...props }: any) {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(Order || {});
  const { showLeftView } = useControllTwopanelLayoutView();
  useEffect(() => {
    Order && setOrder(Order);
  }, [Order]);

  useEffect(() => {
    if (Order || !id) return;
    getOrder(id)
      .then((res) => {
        setOrder(res);
      })
      .catch((e: Error) => console.log(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!order._id) return <Empty />;

  const GetView = (viewProps: any) => {
    switch (order.popType) {
      case ExtraOrderTypes.tip:
        return <Unlocks {...props} order={order} />;
      case ExtraOrderTypes.message_unlock:
        return <Unlocks {...props} order={order} />;
      case ExtraOrderTypes.post_unlock:
        return <Unlocks {...props} order={order} />;
      case ServiceType.SHOUTOUT:
        return <ShoutoutPurchase {...viewProps} order={order} />;
      case ServiceType.POPLIVE:
        return <PoplivePurchase order={order} />;
      case ServiceType.CHAT_SUBSCRIPTION:
        return <ChatSubscription {...props} order={order} />;
      case ServiceType.PAYMA:
        return <PaymaPurchase order={order} />;
      case ServiceType.ADVERTISE:
        return <AdvertisementPurchase order={order} />;
      case ServiceType.ADDITIONAL_SERVICES:
      case ServiceType.DIGITAL_DOWNLOADS:
      default:
        return (
          <div>
            <Generic order={order} />
          </div>
        );
    }
  };

  const AWAITING_BUYER_REVIEW =
    order?.processingStatus === 'Awaiting Buyer Review';
  const RatingView = () => {
    const { tipId, postId, messageId } = order;
    const isUnlocks = tipId || postId || messageId;
    if (isUnlocks) return null;

    if (AWAITING_BUYER_REVIEW) return null;
    if (
      order?.orderStatus?.toLowerCase() === 'completed' &&
      order?.disputeCompletedAt == null &&
      order?.rate != null
    ) {
      return (
        <RatingCard
          name={`${order?.seller?.pageTitle ?? 'Incognito User'}`}
          rating={order?.rate}
        />
      );
    }
    return null;
  };
  const DisputeView = () => {
    const { tipId, postId, messageId } = order;
    const isUnlocks = tipId || postId || messageId;
    if (isUnlocks) return null;
    if (AWAITING_BUYER_REVIEW && order?.disputeStartedAt != null) return null;
    if (
      order?.orderStatus?.toLowerCase() === 'dispute' &&
      order?.disputeStartedAt
    ) {
      return (
        <div className="caption primary-text text-center">
          You have contested this order. You will have the results of the review
          no later than{' '}
          {dayjs(order?.dateOrderStarted).add(7, 'day').format('MM/DD/YYYY')}
        </div>
      );
    }
    if (
      order?.orderStatus?.toLowerCase() === 'declined' &&
      order?.disputeCompletedAt
    ) {
      return (
        <div className="caption primary-text text-center">
          This order has been completed and the dispute has been resolved.
        </div>
      );
    }
    if (
      order?.orderStatus?.toLowerCase() === 'completed' &&
      order.disputeCompletedAt
    ) {
      return (
        <div className="caption primary-text text-center">
          You have contested this order. We have reviewed your dispute and have
          ruled in your favour. The hold on your card has been reversed and you
          will not be charged for this service.
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${className} purchase-page mb-80`}>
      {!!isMobileOnly && (
        <Header
          onBack={() => {
            showLeftView();
          }}
        />
      )}
      <GetView {...props} />
      {AWAITING_BUYER_REVIEW && (
        <>
          <div className="mt-50">
            <div className="profile--info mb-30">
              <h2 className="text-center">
                <span className="secondary-text">
                  {`${order?.seller?.pageTitle ?? 'Incognito User'}`}
                </span>
              </h2>
              <h4 className="text-center">has completed your order.</h4>
            </div>
          </div>
          <Link to={`/review/rate-your-order?orderId=${order._id}`}>
            <Button type="primary" size="large" className="mb-30" block>
              RATE THIS WORK
            </Button>
          </Link>
          <div className="contest-view">
            <h4 className="text-center mb-20">
              Did you not receive what you purchased? <br />
              <Link to={`/review/contest-this-order?orderId=${order._id}`}>
                <span className="primary-text">
                  <u>Click Here</u>&nbsp;
                </span>
              </Link>
              to contest this order.
            </h4>
            <div className="caption primary-text text-center">
              You have until{' '}
              {dayjs(order.deliveryDate)
                .add(48, 'hour')
                .format('MM/DD/YYYY [at] h:mm A')}{' '}
              PST before your sale will be set as final
            </div>
          </div>
        </>
      )}
      <RatingView />
      <DisputeView />
    </div>
  );
}
const Header: React.FC<{
  onBack?(): void;
  onClose?(): void;
}> = ({ onBack }) => {
  return (
    <div className="scheduling-header">
      <span className="icon-holder">
        <Button type="text" icon={<ChevronLeft />} onClick={onBack} />
      </span>

      {/* <span className="icon-holder">
        <Button type="text" icon={<Cross />} onClick={onClose} />
      </span> */}
    </div>
  );
};
export default styled(PurchaseDetail)`
  max-width: 555px;
  margin: 0 auto;
  padding: 40px 15px 15px;

  @media (max-width: 767px) {
    padding: 15px;
  }

  .button.button-lg {
    min-width: 245px;
    padding: 15px 10px;
  }

  .label-text {
    font-size: 16px;
    line-height: 22px;
    color: var(--pallete-text-main-300);
    font-weight: 400;

    .text-black {
      color: var(--pallete-text-main);
    }

    .font-bold {
      font-weight: 700;
    }
  }
`;
