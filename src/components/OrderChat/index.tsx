import { sendOrderMessage } from 'api/messaging';
import { toast } from 'components/toaster';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'emoji-mart/css/emoji-mart.css';
import { OrderStatus } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
import useSocket from 'hooks/useSocket';
import React, { useEffect, useState } from 'react';
import { setCallbackForPayment } from 'store/reducer/cardModal';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import ChatBubble from './ChatBubble';
import MessageBox from './MessageBox';
import OfferBox from './OfferBox';
dayjs.extend(utc);

interface Props {
  className?: string;
  order: any;
  view: 'seller' | 'buyer';
  orderMessages: Message[];
  acceptOffer?: (offerId: string) => Promise<void>;
  withdrawOffer?: (offerId: string) => Promise<void>;
  declineOffer?: (offerId: string) => Promise<void>;
  updateMessages?: () => void;
  offerAccepted?: () => void;
}

const OrderChat: React.FC<Props> = (props) => {
  const {
    className,
    order,
    view,
    orderMessages = [],
    updateMessages,
    acceptOffer,
    withdrawOffer,
    offerAccepted,
    declineOffer,
  } = props;
  const dispatch = useAppDispatch();
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (order?._id) {
      setMessages(orderMessages);
      socket?.on(order._id, (message: Message) => {
        if (message.from !== view) {
          setMessages((prev) => [...prev, message]);
        }
      });
      socket?.on(`${order._id}-offer`, (data: Offer | Message) => {
        setMessages((prev) => {
          if ((data as Message).messageType) {
            updateMessages?.();
            return [...prev, data as Message];
          } else {
            updateMessages?.();
            if ((data as Offer).status === 'accepted') {
              offerAccepted?.();
            }
            return prev.map((message: Message) =>
              message.messageType === 'offer' && message.offer?._id === data._id
                ? { ...message, offer: data as Offer }
                : message,
            );
          }
        });
      });
    }

    return () => {
      socket?.off(order?._id);
      socket?.off(`${order._id}-offer`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  useEffect(() => {
    setMessages(orderMessages);
  }, [orderMessages]);

  const sendMessage = async (message: string) => {
    const messageObject: Message = {
      _id: uuid(),
      message,
      from: view,
      image: order?.[view]?.profileImage,
      messageType: 'message',
    };
    setMessages((prev) => [...prev, messageObject]);
    return sendOrderMessage(order?._id, messageObject).catch(() => {
      toast.error('Could not send message');
      setMessages((prev) =>
        prev.filter((message: Message) => message._id !== messageObject._id),
      );
    });
  };

  const pastDueDate = dayjs(order?.dueDate).isBefore(dayjs(), 'date');

  return messages.length > 0 ? (
    <div className={`${className} mb-30`}>
      <strong className="messages-info">{messages.length} Messages</strong>
      {messages.map((message) => {
        const from = `${order?.[message.from]?.pageTitle ?? 'Incognito User'}`;
        const image = order?.[message.from]?.profileImage;
        return message.messageType === 'message' ? (
          <ChatBubble
            key={message._id}
            message={message.message}
            from={from}
            image={image}
            timestamp={message.createdAt!}
          />
        ) : (
          <OfferBox
            from={from}
            type={view}
            key={message._id}
            location={order?.seletedPriceVariation?.stats?.url || ''}
            timestamp={message.createdAt!}
            image={image}
            offer={message.offer!}
            orderStatus={order?.orderStatus}
            onAcceptClick={async () => {
              dispatch(
                setCallbackForPayment({
                  callback: () => acceptOffer?.(message.offer?._id || ''),
                }),
              );
              await acceptOffer?.(message.offer?._id || '');
            }}
            onDeclineClick={async () =>
              await declineOffer?.(message.offer?._id || '')
            }
            onWithdrawClick={async () =>
              await withdrawOffer?.(message.offer?._id || '')
            }
          />
        );
      })}
      {[OrderStatus.PENDING, OrderStatus.IN_PROGRESS].includes(
        order?.orderStatus,
      ) && !pastDueDate ? (
        <MessageBox
          to={`${order?.[view]?.pageTitle ?? 'Incognito User'}`}
          onSendClick={sendMessage}
        />
      ) : null}
    </div>
  ) : null;
};

export default styled(OrderChat)`
  .messages-info {
    display: block;
    font-size: 18px;
    line-height: 21px;
    color: var(--pallete-text-main);
    margin: 0 0 25px;
  }
`;
