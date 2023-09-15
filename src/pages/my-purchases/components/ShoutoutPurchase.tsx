import { Forward, Star } from 'assets/svgs';
import FulfillmentDeliveryInfoWidget from 'components/Fulfillment/FulfillmentDeliveryInfoWidget';
import FulfillmentHeader from 'components/Fulfillment/FulfillmentHeader';
import FulfillmentPriceWidget from 'components/Fulfillment/FulfillmentPriceWidget';
import OrderInfoWidget from 'components/Fulfillment/OrderInfoWidget';
import Button from 'components/NButton';
import ShoutoutChat from 'components/ShoutoutChat';
import { DashedLine } from 'components/Typography';
import VideoPlay from 'components/VideoPlay';
import { OrderStatus } from 'enums';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrderPrice } from '../utils';
import ShoutOutModalModal from './Shoutoutmodal';

type IUpload = { videoName: string; videoPath: string };

const ShoutoutPurchase: React.FC<{
  order: any;
  updateOrder: (orderId: string) => Promise<void>;
}> = ({ order, updateOrder }) => {
  const [upload, setUpload] = useState<null | IUpload>(null);
  const [showShoutModal, setShowShoutModal] = useState<boolean>(false);

  useEffect(() => {
    if (order?.orderStatus !== OrderStatus.IN_PROGRESS) {
      setUpload({
        videoName: order?.videoName || '',
        videoPath: order?.videoLink || '',
      });
    }
  }, [order]);

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
      <DashedLine className="mb-45" />
      <OrderInfoWidget order={order} />
      <FulfillmentDeliveryInfoWidget
        email={order?.buyer?.email}
        phone={order?.buyer?.phone}
      />
      {order?.orderStatus !== OrderStatus.IN_PROGRESS ? (
        <div className="widget-fileupload mb-30">
          <VideoPlay url={upload?.videoPath} />
        </div>
      ) : (
        (() => {
          if (order.popId.additionalArt) {
            const video = order.popId.additionalArt.find(
              ({ artType }: any) => artType === 'video',
            );
            if (video) {
              return (
                <div className="widget-fileupload mb-30">
                  <VideoPlay url={video?.artPath} />
                </div>
              );
            }

            return null;
          }
          return null;
        })()
      )}
      <FulfillmentPriceWidget
        popType={order.popType}
        price={getOrderPrice(order)}
      />
      <ShoutoutChat
        order={order}
        type="purchase"
        onSubmitSuccess={updateOrder}
      />
      <div className="text-center mb-20">
        {order?.orderStatus === OrderStatus.COMPLETED && (
          <>
            <Button
              className="mb-15"
              shape="circle"
              size="large"
              outline
              onClick={() => setShowShoutModal(true)}
            >
              Share Video{' '}
              <span className="mr-n5 ml-5">
                <Forward />
              </span>
            </Button>
            {showShoutModal && (
              <ShoutOutModalModal
                isOpen={showShoutModal}
                onClose={() => setShowShoutModal(false)}
                videoPath={order?.videoLink || ''}
              />
            )}
            <Link
              to={`/shoutout/view/${order?._id}`}
              className="ml-10 mb-15"
              target="_blank"
            >
              <Button type="primary" shape="circle" size="large">
                View Video{' '}
                <span className="mr-n5 ml-5">
                  <Star />
                </span>
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
export default ShoutoutPurchase;
