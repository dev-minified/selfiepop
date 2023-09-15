import { updateOrderPayma } from 'api/Order';
import FocusInput from 'components/focus-input';
import FulfillmentButtons from 'components/Fulfillment/FulfillmentButtons';
import FulfillmentHeader from 'components/Fulfillment/FulfillmentHeader';
import FulfillmentPriceWidget from 'components/Fulfillment/FulfillmentPriceWidget';
import OrderInfoWidget from 'components/Fulfillment/OrderInfoWidget';
import dayjs from 'dayjs';
import { OrderStatus } from 'enums';
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
}

const PaymaSale: React.FC<Props> = ({ order, onRefuseOrder }) => {
  const [status, , setStatus] = useStatusAndDate({ order });
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setStatus(order?.orderStatus);
    if (order?.orderStatus !== OrderStatus.IN_PROGRESS) {
      setAnswer(order?.paymaAnswer);
    } else {
      setAnswer('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const completeOrder = async () => {
    const requestData = {
      orderId: order._id,
      paymaAnswer: answer,
    };

    setIsLoading(true);

    await updateOrderPayma(requestData)
      .then(({ data }: any) => {
        setStatus(data.orderStatus);
        setAnswer(data?.paymaAnswer);
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
      <div>
        <p>
          <strong>Question: </strong>
          {order?.paymaQuestion}
        </p>
      </div>
      <hr />
      {status !== OrderStatus.CANCELED && (
        <PaymaQuestion>
          <p>
            My answer for{' '}
            <strong>{order?.buyer?.pageTitle ?? 'Incognito User'}</strong> is:
          </p>
          {status !== OrderStatus.IN_PROGRESS || pastDueDate ? (
            <p>{answer}</p>
          ) : (
            <FocusInput
              type="textarea"
              rows={6}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              materialDesign
            />
          )}
        </PaymaQuestion>
      )}
      {status === OrderStatus.IN_PROGRESS && (
        <FulfillmentButtons
          submitButtonText="SUBMIT ANSWER"
          refuseButtonText="REFUSE PAID Q&A"
          isLoading={isLoading}
          disabled={isLoading || !answer || pastDueDate}
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
