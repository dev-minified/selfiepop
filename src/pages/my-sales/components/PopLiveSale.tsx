import FulfillmentButtons from 'components/Fulfillment/FulfillmentButtons';
import FulfillmentHeader from 'components/Fulfillment/FulfillmentHeader';
import FulfillmentPriceWidget from 'components/Fulfillment/FulfillmentPriceWidget';
import OrderInfoWidget from 'components/Fulfillment/OrderInfoWidget';
import PopLiveLinkWidget from 'components/PopLiveLinkWidget';
import { CHIME_URL } from 'config';
import { OrderStatus } from 'enums';
import React from 'react';
import { getOrderPrice } from '../utils';

interface Props {
  order: any;
  status: string;
  onRefuseOrder(orderId: string): void;
}

const ShoutoutSale: React.FC<Props> = ({ order, onRefuseOrder }) => {
  const link = `${CHIME_URL}${order?.eventId}/${order?.sellerHash}`;

  return (
    <div>
      <FulfillmentHeader
        image={order?.buyer?.profileImage}
        order={order}
        status={order?.orderStatus}
        popType={order?.popType}
        name={`${order?.buyer?.pageTitle ?? 'Incognito User'}`}
      />
      <FulfillmentPriceWidget
        popType={order.popType}
        price={getOrderPrice(order)}
      />
      <OrderInfoWidget order={order} />

      <PopLiveLinkWidget link={link} />
      <FulfillmentButtons
        submitButton={false}
        refuseButton={
          ![
            OrderStatus.COMPLETED,
            OrderStatus.CANCELED,
            OrderStatus.DISPUTE,
          ].includes(order?.orderStatus as OrderStatus)
        }
        refuseButtonText="REFUSE POPLIVE"
        onRefuseClick={() => onRefuseOrder(order._id)}
        orderStatus={order?.orderStatus}
        deliveryDate={order?.popLiveDateTime}
      />
    </div>
  );
};
export default ShoutoutSale;
