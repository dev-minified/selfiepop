import { ExtraOrderTypes } from 'appconstants';
import { ServiceType } from 'enums';
import React from 'react';
import styled from 'styled-components';
import { DashedLine } from '../Typography';

interface Props {
  popType: ServiceType;
  price: number;
  className?: string;
  priceVariation?: any;
}

const getTitle = (popType: ServiceType, priceVariation: any) => {
  switch (popType) {
    case ServiceType.SHOUTOUT:
      return 'Custom Video';
    case ServiceType.ADDITIONAL_SERVICES:
      return 'Custom Service';
    case ServiceType.PAYMA:
      return 'Paid Q&A';
    case ServiceType.DIGITAL_DOWNLOADS:
      return 'Digital Download';
    case ServiceType.ADVERTISE:
      return `${priceVariation?.type} advertising`;
    case ServiceType.POPLIVE:
      return 'Pop Live';
    case ServiceType.CHAT_SUBSCRIPTION:
      return 'Chat Subscription';
    case ExtraOrderTypes.tip:
      return ExtraOrderTypes.tip;
    case ExtraOrderTypes.message_unlock:
      return ExtraOrderTypes.message_unlock.split('_').join(' ');
    case ExtraOrderTypes.post_unlock:
      return ExtraOrderTypes.post_unlock.split('_').join(' ');
  }
};

const FulfillmentPriceWidget: React.FC<Props> = (props) => {
  const { popType, price, className, priceVariation } = props;
  return (
    <div className={className}>
      <DashedLine className="dashed" />
      <div className="ff-price">
        <strong className="title">{getTitle(popType, priceVariation)}</strong>
        <span className="price">${(Number(price) || 0).toFixed(2)}</span>
      </div>
      <DashedLine className="dashed" />
    </div>
  );
};

export default styled(FulfillmentPriceWidget)`
  margin: 0 0 20px;
  .ff-price {
    font-size: 17px;
    line-height: 21px;
    font-weight: 500;
    color: var(--pallete-text-main-450);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 23px 0;
  }

  .title {
    font-weight: 500;
  }
`;
