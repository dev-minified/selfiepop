import { getOrderMessages } from 'api/messaging';
import { createOffer, withdrawOffer } from 'api/offer';
import { acceptAdvertisementRequest, updateOrder } from 'api/Order';
import AcceptAdvertisement from 'components/Fulfillment/AcceptAdvertisement';
import { DateTimeRange } from 'components/Fulfillment/AdvertisementDateTimeRange';
import AlternateOfferAdvertisement from 'components/Fulfillment/AlternateOfferAdvertisement';
import FulfillmentButtons from 'components/Fulfillment/FulfillmentButtons';
import FulfillmentHeader from 'components/Fulfillment/FulfillmentHeader';
import FulfillmentPriceWidget from 'components/Fulfillment/FulfillmentPriceWidget';
import FulfillmentQuestions from 'components/Fulfillment/FulfillmentQuestions';
import OrderInfoWidget from 'components/Fulfillment/OrderInfoWidget';
import PromotionalUpload from 'components/Fulfillment/PromotionalUpload';
import Button from 'components/NButton';
import OrderChat from 'components/OrderChat';
import { DashedLine } from 'components/Typography';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { OrderStatus } from 'enums';
import React, { useEffect, useState } from 'react';
import { getOrderPrice } from '../utils';

dayjs.extend(utc);

interface Props {
  order: any;
  onRefuseOrder: (orderId: string) => void;
}
const AdvertisementSale: React.FC<Props> = ({ order, onRefuseOrder }) => {
  const [status, setStatus] = useState('');
  const [isAlternate, setIsAlternate] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setStatus(order?.orderStatus);
    setMessages([]);
    order?._id && updateMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const acceptRequest = async (dateTimeRange: DateTimeRange) => {
    const startDate =
      dayjs(dateTimeRange[0].date).format('MM/DD/YYYY') +
      ' ' +
      dateTimeRange[0].time;
    const endDate =
      dayjs(dateTimeRange[1].date).format('MM/DD/YYYY') +
      ' ' +
      dateTimeRange[1].time;
    const startUtc = dayjs(startDate).utc().format();
    const endUtc = dayjs(endDate).utc().format();
    await acceptAdvertisementRequest(order?._id, {
      startDateTime: startUtc,
      endDateTime: endUtc,
    })
      .then((res) => {
        if (res?.message === 'Order Accepted') {
          setStatus(OrderStatus.IN_PROGRESS);
          updateMessages();
        }
      })
      .catch(console.log);
  };

  const createAlternateOffer = async (values: {
    price: number;
    description: string;
    dateTimeRange: DateTimeRange;
  }) => {
    const startDate =
      dayjs(values.dateTimeRange[0].date).format('MM/DD/YYYY') +
      ' ' +
      values.dateTimeRange[0].time;
    const endDate =
      dayjs(values.dateTimeRange[1].date).format('MM/DD/YYYY') +
      ' ' +
      values.dateTimeRange[1].time;
    const startUtc = dayjs(startDate).utc().format();
    const endUtc = dayjs(endDate).utc().format();

    const offer: Offer = {
      price: values.price,
      details: values.description,
      startDateTime: startUtc,
      endDateTime: endUtc,
      location: '',
    };
    await createOffer(order._id, offer).then(() => {
      setIsAlternate(false);
    });
  };

  const onWithdrawOffer = async (offerId: string) => {
    await withdrawOffer(order?._id, offerId).catch(console.log);
  };

  const updateMessages = () => {
    getOrderMessages(order._id).then((res) => {
      setMessages(res.messages || []);
    });
  };

  const isOfferOpen =
    messages.filter(
      (message) =>
        message.messageType === 'offer' && message.offer?.status === 'open',
    ).length > 0;
  const hasOffer =
    messages.filter((message) => message.messageType === 'offer').length > 0;

  const pastDueDate = dayjs(order?.dueDate).isBefore(dayjs(), 'date');
  const handleUpload = async (files: any[]) => {
    await updateOrder(order._id, { attachments: files }).catch((err) =>
      console.log(err),
    );
  };

  return (
    <div>
      <FulfillmentHeader
        image={order?.buyer?.profileImage}
        order={order}
        status={status}
        popType={order.popType}
        name={`${order?.buyer?.pageTitle ?? 'Incognito User'}`}
      />
      <FulfillmentPriceWidget
        popType={order.popType}
        price={getOrderPrice(order)}
        priceVariation={order?.priceVariation}
      />
      {status !== OrderStatus.CANCELED &&
        status !== OrderStatus.DISPUTE &&
        status !== OrderStatus.REFUNDED && (
          <PromotionalUpload
            status={status}
            disabled={pastDueDate || status !== OrderStatus.IN_PROGRESS}
            order={order}
            onUpload={handleUpload}
            allowDelete={status === OrderStatus.IN_PROGRESS}
          />
        )}

      <OrderInfoWidget order={order} showFrom={false} />

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
        view="seller"
        updateMessages={updateMessages}
        withdrawOffer={onWithdrawOffer}
        offerAccepted={() => setStatus(OrderStatus.IN_PROGRESS)}
      />

      {status === OrderStatus.PENDING && !pastDueDate ? (
        <>
          {isAlternate ? (
            <AlternateOfferAdvertisement
              buyer={`${order?.buyer?.pageTitle ?? 'Incognito User'}`}
              onSubmit={createAlternateOffer}
              onCancel={() => setIsAlternate(false)}
            />
          ) : (
            <>
              {!hasOffer && (
                <AcceptAdvertisement
                  orderId={order?._id}
                  buyer={`${order?.buyer?.pageTitle ?? 'Incognito User'}`}
                  orderDate={order?.dateOrderStarted}
                  onAccept={acceptRequest}
                />
              )}
              {!isOfferOpen && (
                <div className="text-center">
                  <Button
                    onClick={() => setIsAlternate(true)}
                    shape="circle"
                    size="large"
                    type={'outline'}
                    className="mb-15"
                  >
                    Make Alternate Offer
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      ) : null}

      {order.orderStatus !== OrderStatus.REFUNDED && (
        <FulfillmentButtons
          submitButton={false}
          refuseButton={
            ![
              OrderStatus.COMPLETED,
              OrderStatus.CANCELED,
              OrderStatus.DISPUTE,
            ].includes(order?.orderStatus as OrderStatus)
          }
          submitButtonText="MARK AS COMPLETE"
          refuseButtonText="REFUSE REQUEST"
          onRefuseClick={() => onRefuseOrder(order._id)}
          orderStatus={status}
          deliveryDate={
            status === OrderStatus.COMPLETED
              ? order?.deliveryDate
              : order?.dueDate
          }
          popType={order?.popType}
        />
      )}
    </div>
  );
};
export default AdvertisementSale;
