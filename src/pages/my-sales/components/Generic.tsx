import { submitOrder } from 'api/Order';
import FocusInput from 'components/focus-input';
import FulfillmentButtons from 'components/Fulfillment/FulfillmentButtons';
import FulfillmentHeader from 'components/Fulfillment/FulfillmentHeader';
import FulfillmentPriceWidget from 'components/Fulfillment/FulfillmentPriceWidget';
import OrderInfoWidget from 'components/Fulfillment/OrderInfoWidget';
import dayjs from 'dayjs';
import { OrderStatus, ServiceType } from 'enums';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useStatusAndDate from '../hooks/useStatusAndDate';
import { getOrderPrice } from '../utils';

const PaymaQuestion = styled.div`
  p {
    margin: 0 0 19px;

    strong {
      font-weight: 500;
    }
  }
`;

interface Props {
  order: any;
  onRefuseOrder: (orderId: string) => void;
  updateOrder: (orderId: string) => void;
}

const PaymaSale: React.FC<Props> = ({
  order,
  onRefuseOrder,
  updateOrder: handleOrderUpdate,
}) => {
  const [status, , setStatus] = useStatusAndDate({ order });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setStatus(order?.orderStatus);
    if (order?.orderStatus !== OrderStatus.IN_PROGRESS) {
      setMessage(order?.message);
    } else {
      setMessage('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const completeOrder = async () => {
    const requestData = {
      orderId: order._id,
      message: message,
    };

    setIsLoading(true);

    await submitOrder(requestData)
      .then(({ data }: any) => {
        setStatus(data.orderStatus);
        setMessage(data?.message);
        handleOrderUpdate(order._id);
      })
      .catch((e: Error) => {
        console.log(e);
      });

    setIsLoading(false);
  };

  const pastDueDate = dayjs(order?.dueDate).isBefore(dayjs(), 'date');

  return (
    <div>
      <FulfillmentHeader
        image={order?.buyer?.profileImage}
        order={order}
        status={status}
        popType={order.popType}
        name={`${order?.buyer?.pageTitle ?? 'Incognito User'}`}
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
        showDescription={false}
      />
      <hr />
      {status !== OrderStatus.CANCELED &&
        order?.popType !== ServiceType.CHAT_SUBSCRIPTION && (
          <PaymaQuestion>
            <p>Message For Buyer:</p>
            {status !== OrderStatus.IN_PROGRESS || pastDueDate ? (
              <p>{message}</p>
            ) : (
              <FocusInput
                type="textarea"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                materialDesign
              />
            )}
          </PaymaQuestion>
        )}
      {status === OrderStatus.IN_PROGRESS && (
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
      )}
    </div>
  );
};
export default PaymaSale;
