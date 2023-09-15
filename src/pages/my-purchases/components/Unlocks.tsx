import FulfillmentHeader from 'components/Fulfillment/FulfillmentHeader';
import FulfillmentPriceWidget from 'components/Fulfillment/FulfillmentPriceWidget';
import OrderInfoWidget from 'components/Fulfillment/OrderInfoWidget';
import PopLiveLinkWidget from 'components/PopLiveLinkWidget';
import React, { useEffect } from 'react';
import useStatusAndDate from '../hooks/useStatusAndDate';
import { getOrderPrice } from '../utils';

interface Props {
  order: any;
}

const Unlocksorders: React.FC<Props> = ({ order }) => {
  const [status, , setStatus] = useStatusAndDate({ order });

  useEffect(() => {
    setStatus(order?.orderStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

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
        showDescription={true}
      />
      <hr />
      <PopLiveLinkWidget
        title="Chat link"
        link={`${window.location.protocol}//${window.location.host}/messages/subscriptions?userId=${order.buyer._id}&type=chat`}
      />
    </div>
  );
};
export default Unlocksorders;
