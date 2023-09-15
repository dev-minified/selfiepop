import { ChevronLeft } from 'assets/svgs';
import Empty from 'components/Empty';
import Button from 'components/NButton';
import dayjs from 'dayjs';
import { OrderStatus } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import useRequestLoader from 'hooks/useRequestLoader';
import RatingCard from 'pages/components/RatingCard';
import ChatSubscription from 'pages/my-sales/components/chatSubscription';
import { useEffect, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { useParams } from 'react-router-dom';
import { setSalesOrders, setSelectedOrder } from 'store/reducer/Orders';
import styled from 'styled-components';
import swal from 'sweetalert';
import { getOrder, refuseOrder } from '../../api/Order';
import { ServiceType } from '../../enums';
import AdvertisementSale from './components/AdvertisementSale';
import DigitalDownloadsSale from './components/DigitalDownloadsSale';
import Generic from './components/Generic';
import PaymaSale from './components/PaymaSale';
import PopLiveSale from './components/PopLiveSale';
import ShoutoutSale from './components/ShoutoutSale';

const getComponent = (order: any, props: any) => {
  switch (order.popType) {
    case ServiceType.POPLIVE:
      return <PopLiveSale {...props} order={order} />;
    case ServiceType.PAYMA:
      return <PaymaSale {...props} order={order} />;
    case ServiceType.ADVERTISE:
      return <AdvertisementSale {...props} order={order} />;
    case ServiceType.DIGITAL_DOWNLOADS:
      return <DigitalDownloadsSale {...props} order={order} />;
    case ServiceType.CHAT_SUBSCRIPTION:
      return <ChatSubscription {...props} order={order} />;
    case ServiceType.SHOUTOUT:
      return <ShoutoutSale {...props} order={order} />;
    default:
      return <Generic {...props} order={order} />;
  }
};

function SalesDetail({ className, ...props }: any) {
  const { id } = useParams<{ id: string }>();
  const selectedOrder = useAppSelector(
    (state) => state.profileOrders.selectedOrder,
  );
  const orders = useAppSelector((state) => state.profileOrders.orders);
  const dispatch = useAppDispatch();
  const { showLeftView } = useControllTwopanelLayoutView();
  const [order, setOrder] = useState<any>(selectedOrder || {});
  const { withLoader } = useRequestLoader();
  useEffect(() => {
    setOrder(selectedOrder);
  }, [selectedOrder]);

  useEffect(() => {
    if (!id) return;
    getOrder(id)
      .then((res) => {
        setOrder(res);
      })
      .catch((e: Error) => console.log(e));
  }, [id]);

  if (!order?._id) return <Empty />;

  const AWAITING_BUYER_REVIEW =
    order.processingStatus === 'Awaiting Buyer Review';
  const RatingView = () => {
    if (AWAITING_BUYER_REVIEW) return null;
    if (
      order.orderStatus.toLowerCase() === 'completed' &&
      order.disputeCompletedAt == null &&
      order.rate != null
    ) {
      return (
        <RatingCard
          name={`${order?.buyer?.pageTitle ?? 'Incognito User'}`}
          rating={order?.rate}
          saleReview
        />
      );
    }
    return null;
  };
  // new impl

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    // setOrders((prev: any) => ({
    //   ...prev,
    //   items:
    //     prev.items?.map((o: any) =>
    //       o?._id === orderId ? { ...o, orderStatus: status } : o,
    //     ) || [],
    // }));
    const updatedOrders = {
      ...orders,
      items:
        orders.items?.map((o: any) =>
          o?._id === orderId ? { ...o, orderStatus: status } : o,
        ) || [],
    };
    dispatch(setSalesOrders(updatedOrders));
    if (selectedOrder && selectedOrder?._id === orderId) {
      dispatch(
        setSelectedOrder((prev: any) => ({ ...prev, orderStatus: status })),
      );
    }
  };
  const onRefuseOrder = (orderId: string) => {
    swal({
      title: 'Order Cancelation!',
      text: 'Are you sure you want to cancel the order?',
      icon: 'warning',
      buttons: ['Close', 'Ok'],
    }).then(async (isRefuse) => {
      if (isRefuse) {
        const res = await withLoader(refuseOrder(orderId)).catch(() => {
          swal('Error', 'Could not process your request', 'error');
        });

        if (res) {
          swal('Success', 'Order has been canceled', 'success');
          updateOrderStatus(orderId, OrderStatus.CANCELED);
        }
      }
    });
  };

  const updateOrder = async (orderId: string) => {
    const order = await getOrder(orderId).catch(console.log);
    if (order) {
      const prevIems = [...orders.items];
      const orderIndex = prevIems?.findIndex((o: any) => o?._id === orderId);
      if (orderIndex > -1) {
        prevIems.splice(orderIndex, 1, order);
      }
      dispatch(setSalesOrders({ ...orders, items: prevIems }));
      dispatch(
        setSelectedOrder((prev: any) => {
          if (order?._id === prev?._id) {
            return order;
          }

          return prev;
        }),
      );
    }
  };
  // new impl
  const DisputeView = () => {
    if (AWAITING_BUYER_REVIEW && order.disputeStartedAt != null) return null;
    if (
      order.orderStatus.toLowerCase() === 'dispute' &&
      order.disputeStartedAt
    ) {
      return (
        <div className="caption primary-text text-center">
          Buyer contested this order. You will have the results of the review no
          later than{' '}
          {dayjs(order.dateOrderStarted).add(7, 'day').format('MM/DD/YYYY')}
        </div>
      );
    }
    if (
      order.orderStatus.toLowerCase() === 'declined' &&
      order.disputeCompletedAt
    ) {
      return (
        <div className="caption primary-text text-center">
          This order has been completed and the dispute has been resolved.
        </div>
      );
    }
    if (
      order.orderStatus.toLowerCase() === 'completed' &&
      order.disputeCompletedAt
    ) {
      return (
        <div className="caption primary-text text-center">
          Buy has contested this order. We have reviewed the dispute and have
          ruled in buyer favous.
        </div>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      {!!isMobileOnly && (
        <Header
          onBack={() => {
            showLeftView();
          }}
        />
      )}
      {getComponent(order, { ...props, onRefuseOrder, updateOrder })}
      <div className="mb-30">
        <RatingView />
        <DisputeView />
      </div>
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

export default styled(SalesDetail)`
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

    .text-black {
      color: var(--pallete-text-main);
    }

    .font-bold {
      font-weight: 500;
    }
  }

  .heading-box {
    margin: 0 0 15px;
    font-size: 15px;

    strong {
      font-weight: 700;
    }
  }
`;
