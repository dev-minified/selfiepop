import dayjs from 'dayjs';
import { OrderStatus, ServiceType } from 'enums';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Props {
  order: any;
  showFor?: boolean;
  showFrom?: boolean;
  showDescription?: boolean;
  className?: string;
}

const OrderInfoWidget: React.FC<Props> = (props) => {
  const {
    order,
    showFor = true,
    showFrom = true,
    showDescription = true,
    className,
  } = props;
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    if (order?.orderStatus === OrderStatus.COMPLETED) {
      order?.deliveryDate &&
        setDate(dayjs(order?.deliveryDate).format('MM/DD/YYYY'));
    } else {
      if (order.popType === ServiceType.POPLIVE) {
        setDate(dayjs(order?.popLiveDateTime).format('MM/DD/YYYY hh:mm A'));
      } else {
        setDate(dayjs(order?.dueDate).format('MM/DD/YYYY'));
      }
    }
  }, [order]);
  const title = order?.priceVariation?.title || order.title;
  return (
    <div className={className}>
      <h4>Order Info</h4>
      <strong className="title">
        Title: <span className="title-text">{title}</span>
      </strong>
      <div className="order-info">
        {showFor && (
          <div className="item-holder">
            <strong className="detail-text">For: </strong>
            <span className="text-title">
              {order.popType === ServiceType.SHOUTOUT ? (
                <span>
                  {order?.questions?.[0]?.responseValue === 'me' ? (
                    <span>{order?.buyer?.pageTitle}</span>
                  ) : (
                    <span>{order.questions[1]?.responseValue}</span>
                  )}
                </span>
              ) : (
                <span>{order?.buyer?.pageTitle}</span>
              )}
            </span>
          </div>
        )}
        {showFrom && (
          <div className="item-holder">
            <strong className="detail-text">From: </strong>
            <span className="text-title">{order?.seller?.pageTitle}</span>
          </div>
        )}
      </div>
      {showDescription && (
        <p>
          {order?.popType === ServiceType.SHOUTOUT ? (
            <>
              <strong className="detail-text">Instructions: </strong>
              <span className="text-title">
                {(order?.questions &&
                  order.questions.find(
                    ({ text }: any) => text === 'Shoutout Instructions',
                  )?.responseValue) ||
                  ''}
              </span>
            </>
          ) : (
            <>
              <span className="text-title">Details:</span>{' '}
              <strong className="detail-text">
                {order?.pricevariation?.description || order?.description}
              </strong>
            </>
          )}
        </p>
      )}
      {order?.popType !== ServiceType.CHAT_SUBSCRIPTION && (
        <div className="order-info">
          <div className="item-holder">
            <span className="text-title">
              {order?.popType === ServiceType.DIGITAL_DOWNLOADS
                ? 'Ordered'
                : 'Booked'}
              :{' '}
            </span>
            <strong className="detail-text">
              {
                <time
                  dateTime={dayjs(order?.dateOrderStarted).format('MM/DD/YYYY')}
                >
                  {dayjs(order?.dateOrderStarted).format('MM/DD/YYYY')}
                </time>
              }
            </strong>
          </div>
          <div className="item-holder">
            <span className="text-title">
              {order?.popType === ServiceType.POPLIVE
                ? 'Video Call Date'
                : order?.orderStatus === OrderStatus.COMPLETED
                ? 'Delivered'
                : 'Deliver By'}
              :{' '}
            </span>
            <strong className="detail-text">
              {<time dateTime={date}>{date}</time>}
            </strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default styled(OrderInfoWidget)`
  margin: 0 0 23px;

  h4 {
    margin: 0 0 34px;
    font-weight: 500;
  }

  .title {
    display: block;
    font-weight: 500;
    margin: 0 0 37px;
  }

  .order-info {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -10px 10px;

    .item-holder {
      width: 23%;
      min-width: 200px;
      padding: 0 10px;
      margin: 0 0 20px;

      &:nth-child(even) {
        width: 60%;
      }
    }
  }

  .text-title {
    color: var(--pallete-text-main-300);
  }

  .title-text {
    font-weight: 400;
  }

  .detail-text {
    font-weight: 500;
    color: var(--pallete-text-main);
  }
`;
