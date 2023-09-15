import FulfillmentHeader from 'components/Fulfillment/FulfillmentHeader';
import FulfillmentPriceWidget from 'components/Fulfillment/FulfillmentPriceWidget';
import OrderInfoWidget from 'components/Fulfillment/OrderInfoWidget';
import PopLiveLinkWidget from 'components/PopLiveLinkWidget';
import React from 'react';
import useStatusAndDate from '../hooks/useStatusAndDate';
import { getOrderPrice } from '../utils';

interface Props {
  order: any;
  onRefuseOrder: (orderId: string) => void;
  updateOrder: (orderId: string) => void;
  isSeller?: boolean;
}

const PaymaSale: React.FC<Props> = ({ order, isSeller }) => {
  // eslint-disable-next-line
  const [status, , setStatus] = useStatusAndDate({ order });
  return (
    <div>
      <FulfillmentHeader
        image={order?.buyer?.profileImage}
        order={order}
        status={status}
        isSeller={isSeller}
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
        showDescription={true}
      />
      <hr />
      <PopLiveLinkWidget
        title="Chat link"
        link={`${window.location.protocol}//${window.location.host}/my-members/subscriber?userId=${order.buyer._id}`}
      />
    </div>
  );
};
export default PaymaSale;
