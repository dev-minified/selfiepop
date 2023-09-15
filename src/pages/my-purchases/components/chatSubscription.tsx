// import { submitOrder } from 'api/Order';
// import FulfillmentButtons from 'components/Fulfillment/FulfillmentButtons';
import FulfillmentHeader from 'components/Fulfillment/FulfillmentHeader';
import FulfillmentPriceWidget from 'components/Fulfillment/FulfillmentPriceWidget';
import OrderInfoWidget from 'components/Fulfillment/OrderInfoWidget';
import PopLiveLinkWidget from 'components/PopLiveLinkWidget';
// import dayjs from 'dayjs';
import React from 'react';
import { getOrderPrice } from '../utils';

interface Props {
  order: any;
  onRefuseOrder: (orderId: string) => void;
  updateOrder: (orderId: string) => void;
  isSeller?: boolean;
}

const PaymaSale: React.FC<Props> = ({ order, isSeller }) => {
  // const [status, , setStatus] = useStatusAndDate({ order });
  // const [message, setMessage] = useState('');
  // const [isLoading, setIsLoading] = useState<boolean>(false);

  // const completeOrder = async () => {
  //   const requestData = {
  //     orderId: order._id,
  //     message: message,
  //   };

  //   setIsLoading(true);

  //   await submitOrder(requestData)
  //     .then(({ data }: any) => {
  //       setStatus(data.orderStatus);
  //       setMessage(data?.message);
  //       handleOrderUpdate(order._id);
  //     })
  //     .catch((e: Error) => {
  //       console.log(e);
  //     });

  //   setIsLoading(false);
  // };

  // const pastDueDate = dayjs(order?.dueDate).isBefore(dayjs(), 'date');
  return (
    <div>
      <FulfillmentHeader
        image={order?.seller?.profileImage}
        order={order}
        isSeller={isSeller}
        status={order.orderStatus}
        popType={order.popType}
        name={`${order?.seller?.pageTitle ?? 'Incognito User'}`}
        className="mb-40"
      />
      <FulfillmentPriceWidget
        popType={order.popType}
        price={getOrderPrice(order)}
        className="mb-40"
      />
      <OrderInfoWidget
        order={order}
        showFor={false}
        showFrom={false}
        showDescription={true}
      />
      <hr />
      <PopLiveLinkWidget
        title="Chat link"
        link={`${window.location.protocol}//${window.location.host}/messages/subscriptions?userId=${order.buyer._id}&type=chat`}
      />
      {/* {status === OrderStatus.IN_PROGRESS && (
        <FulfillmentButtons
          submitButtonText="SUBMIT"
          refuseButtonText="REFUSE ORDER"
          isLoading={isLoading}
          disabled={isLoading || !message || pastDueDate}
          onSubmitClick={completeOrder}
          onRefuseClick={() => onRefuseOrder(order._id)}
          orderStatus={status}
          deliveryDate={order?.dueDate}
        />
      )} */}
    </div>
  );
};
export default PaymaSale;
