import { getOrderMessages } from 'api/messaging';
import { acceptOffer, declineOffer } from 'api/offer';
import { Download } from 'assets/svgs';
import FulfillmentDeliveryInfoWidget from 'components/Fulfillment/FulfillmentDeliveryInfoWidget';
import FulfillmentHeader from 'components/Fulfillment/FulfillmentHeader';
import FulfillmentPriceWidget from 'components/Fulfillment/FulfillmentPriceWidget';
import FulfillmentQuestions from 'components/Fulfillment/FulfillmentQuestions';
import OrderInfoWidget from 'components/Fulfillment/OrderInfoWidget';
import PendingApprovalWidget from 'components/Fulfillment/PendingApprovalWidget';
import PromotionalUpload from 'components/Fulfillment/PromotionalUpload';
import Button from 'components/NButton';
import OrderChat from 'components/OrderChat';
import { DashedLine } from 'components/Typography';
import { OrderStatus, ServiceType } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getOrderPrice } from '../utils';

const getButtons = (popType: ServiceType, order: any) => {
  switch (popType) {
    case ServiceType.DIGITAL_DOWNLOADS:
      return order?.orderStatus === 'Completed' ? (
        <a href={order?.digitalDownloadLink} download>
          <Button shape="circle" type="primary" size="large">
            Download File{' '}
            <span className="ml-5 mr-n5">
              <Download />
            </span>
          </Button>
        </a>
      ) : null;
    default:
      return null;
  }
};

const AdvertisementPurchase: React.FC<{ order: any; className?: string }> = ({
  order,
  className,
}) => {
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState(order?.orderStatus);

  useEffect(() => {
    setMessages([]);
    order?._id && updateMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  useEffect(() => {
    order?.orderStatus && setStatus(order?.orderStatus);
  }, [order]);

  const onAcceptOffer = async (offerId: string) => {
    await acceptOffer(order?._id, offerId, dispatch);
  };

  const onDeclineOffer = async (offerId: string) => {
    await declineOffer(order?._id, offerId);
  };

  const updateMessages = () => {
    getOrderMessages(order._id).then((res) => {
      setMessages(res.messages || []);
    });
  };

  return (
    <div className={className}>
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
        priceVariation={order?.priceVariation}
      />
      <hr />
      {status !== OrderStatus.CANCELED &&
        status !== OrderStatus.DISPUTE &&
        order.orderStatus !== OrderStatus.REFUNDED && (
          <>
            {!!order?.attachments?.length && (
              <>
                <h3>Proof of Promotion</h3>
                <PromotionalUpload
                  status={status}
                  disabled={order?.orderStatus !== OrderStatus.IN_PROGRESS}
                  order={order}
                  showEditor={false}
                  allowDelete={false}
                />
              </>
            )}
          </>
        )}
      <OrderInfoWidget
        order={order}
        showFor={false}
        showFrom={order?.popType !== ServiceType.DIGITAL_DOWNLOADS}
      />
      {order?.popType === ServiceType.DIGITAL_DOWNLOADS && (
        <FulfillmentDeliveryInfoWidget
          email={order?.buyer?.email}
          phone={order?.buyer?.phone}
        />
      )}
      <DashedLine className="mb-45" />

      {!!order.questions?.length && (
        <>
          <FulfillmentQuestions
            title="Order Question Details"
            questions={order.questions}
          />
          <hr className="mb-45" />
        </>
      )}

      <OrderChat
        order={order}
        orderMessages={messages}
        view="buyer"
        updateMessages={updateMessages}
        acceptOffer={onAcceptOffer}
        declineOffer={onDeclineOffer}
        offerAccepted={() => setStatus(OrderStatus.IN_PROGRESS)}
      />
      {messages.length <= 0 && status === OrderStatus.PENDING && (
        <PendingApprovalWidget
          seller={`${order?.seller?.pageTitle ?? 'Incognito User'}`}
        />
      )}

      <div className="text-center">{getButtons(order?.popType, order)}</div>
    </div>
  );
};
export default styled(AdvertisementPurchase)``;
