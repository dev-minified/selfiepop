import FulfillmentHeader from 'components/Fulfillment/FulfillmentHeader';
import FulfillmentPriceWidget from 'components/Fulfillment/FulfillmentPriceWidget';
import OrderInfoWidget from 'components/Fulfillment/OrderInfoWidget';
import Slider from 'components/slider';
import React from 'react';
import { getOrderPrice } from '../utils';

const DigitalDownloadsSale: React.FC<{ order: any }> = ({ order }) => {
  return (
    <div>
      <FulfillmentHeader
        image={order?.buyer?.profileImage}
        order={order}
        status={order?.orderStatus}
        popType={order.popType}
        name={`${order?.buyer?.pageTitle ?? 'Incognito User'}`}
      />
      {order?.popId?.digitalDownloads?.length > 0 && (
        <Slider
          additionalArt={order?.popId?.digitalDownloads.map(
            (dd: { path: string }) => ({ artType: 'image', artPath: dd.path }),
          )}
        />
      )}
      <FulfillmentPriceWidget
        popType={order.popType}
        price={getOrderPrice(order)}
      />
      <OrderInfoWidget order={order} showFrom={false} showFor={false} />
    </div>
  );
};
export default DigitalDownloadsSale;
