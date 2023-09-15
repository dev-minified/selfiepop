import FulfillmentHeader from 'components/Fulfillment/FulfillmentHeader';
import FulfillmentPriceWidget from 'components/Fulfillment/FulfillmentPriceWidget';
import OrderInfoWidget from 'components/Fulfillment/OrderInfoWidget';
import { OrderStatus } from 'enums';
import React from 'react';
import styled from 'styled-components';
import { getOrderPrice } from '../utils';

const PaymaQuestion = styled.div`
  .answer-title {
    font-weight: 500;
  }

  p {
    margin: 0 0 19px;
  }
`;
const PaymaPurchase: React.FC<{ order: any }> = ({ order }) => {
  return (
    <div>
      <FulfillmentHeader
        isSeller
        order={order}
        image={order?.seller?.profileImage}
        status={order?.orderStatus}
        popType={order.popType}
        name={`${order?.seller?.pageTitle ?? 'Incognito User'}`}
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
      <PaymaQuestion>
        <p>
          <strong>Question: </strong>
          {order?.paymaQuestion}
        </p>
        {order?.orderStatus !== OrderStatus.IN_PROGRESS &&
          order?.orderStatus !== OrderStatus.CANCELED && (
            <>
              <hr />
              <p>
                <strong className="answer-title">
                  {`${order?.seller?.pageTitle ?? 'Incognito User'}`}'s Answer:
                </strong>
              </p>
              <p>{order?.paymaAnswer}</p>
            </>
          )}
      </PaymaQuestion>
    </div>
  );
};
export default PaymaPurchase;
