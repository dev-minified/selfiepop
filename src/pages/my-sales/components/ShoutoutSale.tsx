import { updateOrderStatus } from 'api/Order';
import FulfillmentButtons from 'components/Fulfillment/FulfillmentButtons';
import FulfillmentHeader from 'components/Fulfillment/FulfillmentHeader';
import FulfillmentPriceWidget from 'components/Fulfillment/FulfillmentPriceWidget';
import OrderInfoWidget from 'components/Fulfillment/OrderInfoWidget';
import ShoutoutFileUpload from 'components/Fulfillment/ShoutoutFileUpload';
import ShoutoutChat from 'components/ShoutoutChat';
import dayjs from 'dayjs';
import { OrderStatus } from 'enums';
import React, { useEffect, useState } from 'react';
import { getOrderPrice } from '../utils';

const ShoutoutSale: React.FC<{
  order: any;
  onRefuseOrder: (orderId: string) => void;
  updateOrder: (orderId: string) => Promise<void>;
}> = ({ order, onRefuseOrder, updateOrder }) => {
  const [status, setStatus] = useState('');
  const [video, setVideo] = useState<{
    videoPath?: string;
    videoName?: string;
    videoThumbnail?: string;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState(order);

  useEffect(() => {
    setStatus(order?.orderStatus);
    setSelectedOrder(order);
  }, [order]);

  const completeOrder = async () => {
    const requestData = {
      orderId: order._id,
      videoLink: video?.videoPath,
      videoName: video?.videoName,
      videoThumbnail: video?.videoThumbnail,
    };

    setIsLoading(true);

    await updateOrderStatus(requestData)
      .then((res: any) => {
        setStatus(res?.data?.orderStatus);
        setSelectedOrder(res?.data);
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
        image={selectedOrder?.buyer?.profileImage}
        order={order}
        status={status}
        popType={selectedOrder.popType}
        name={`${selectedOrder?.buyer?.pageTitle ?? 'Incognito User'}`}
      />
      {selectedOrder?.orderStatus !== OrderStatus.CANCELED &&
        selectedOrder?.orderStatus !== OrderStatus.DISPUTE &&
        order?.orderStatus !== OrderStatus.REFUNDED && (
          <ShoutoutFileUpload
            status={status}
            disabled={
              pastDueDate || order?.orderStatus !== OrderStatus.IN_PROGRESS
            }
            buyerId={selectedOrder?.buyer?._id}
            orderId={selectedOrder?._id}
            videoLink={selectedOrder?.videoLink}
            videoName={selectedOrder?.videoName}
            videoThumbnail={selectedOrder?.videoThumbnail}
            onUploadSuccess={(
              videoPath?: string,
              videoName?: string,
              videoThumbnail?: string,
            ) => {
              setVideo({ videoPath, videoName, videoThumbnail });
            }}
          />
        )}
      <FulfillmentPriceWidget
        popType={selectedOrder.popType}
        price={getOrderPrice(selectedOrder)}
      />
      <OrderInfoWidget order={selectedOrder} />
      <ShoutoutChat
        order={selectedOrder}
        type="sale"
        onSubmitSuccess={updateOrder}
      />
      {order?.orderStatus !== OrderStatus.REFUNDED && (
        <FulfillmentButtons
          submitButton={
            ![
              OrderStatus.COMPLETED,
              OrderStatus.CANCELED,
              OrderStatus.DISPUTE,
            ].includes(status as OrderStatus)
          }
          refuseButton={
            ![
              OrderStatus.COMPLETED,
              OrderStatus.CANCELED,
              OrderStatus.DISPUTE,
            ].includes(status as OrderStatus)
          }
          submitButtonText="SUBMIT AS COMPLETE"
          refuseButtonText="REFUSE CUSTOM VIDEO"
          isLoading={isLoading}
          disabled={isLoading || !video.videoPath || pastDueDate}
          onSubmitClick={completeOrder}
          onRefuseClick={() => onRefuseOrder(order._id)}
          orderStatus={status}
          deliveryDate={
            status === OrderStatus.COMPLETED
              ? order?.deliveryDate
              : order?.dueDate
          }
        />
      )}
    </div>
  );
};
export default ShoutoutSale;
