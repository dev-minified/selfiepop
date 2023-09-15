import FulfillmentHeader from 'components/Fulfillment/FulfillmentHeader';
import FulfillmentPriceWidget from 'components/Fulfillment/FulfillmentPriceWidget';
import OrderInfoWidget from 'components/Fulfillment/OrderInfoWidget';
import PopLiveLinkWidget from 'components/PopLiveLinkWidget';
import { CHIME_URL } from 'config';
import { useEffect, useState } from 'react';
import { getOrderPrice } from '../utils';

const PoplivePurchase = ({ order }: any) => {
  const [status, setStatus] = useState('');

  const link = `${CHIME_URL}${order?.eventId}/${order?.buyerHash}`;
  useEffect(() => {
    setStatus(order?.orderStatus);
  }, [order]);

  return (
    <div>
      <FulfillmentHeader
        isSeller
        order={order}
        image={order?.seller?.profileImage}
        status={status}
        popType={order.popType}
        name={`${order?.seller?.pageTitle ?? 'Incognito User'}`}
      />
      <FulfillmentPriceWidget
        popType={order.popType}
        price={getOrderPrice(order)}
      />
      <OrderInfoWidget order={order} />
      <hr className="mb-40" />

      <PopLiveLinkWidget link={link} />
      <hr className="mb-40" />
    </div>
  );
};
export default PoplivePurchase;
