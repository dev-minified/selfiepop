import React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  email: string;
  phone: string;
}

const FulfillmentDeliveryInfoWidget: React.FC<Props> = (props) => {
  const { className, email, phone } = props;
  return (
    <div className={className}>
      <strong className="title">Delivery Info:</strong>
      <div className="items-wrap">
        <div className="item-holder">
          <span className="text-title">Email:</span>
          <strong className="detail-text">{email}</strong>
        </div>
        {phone?.length > 0 && (
          <div className="item-holder">
            <span className="text-title">Text Message:</span>
            <strong className="detail-text">{phone}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default styled(FulfillmentDeliveryInfoWidget)`
  .title {
    display: block;
    font-weight: 500;
    margin: 0 0 10px;
  }

  .items-wrap {
    display: flex;
    flex-direction: row;
    margin: 0 -5px;
  }

  .item-holder {
    width: 46%;
    margin: 0 0 20px;
    padding: 0 5px;
  }

  .text-title {
    color: var(--pallete-text-main-300);
  }

  .detail-text {
    color: var(--pallete-text-main);
    font-weight: 500;
    padding: 0 0 0 5px;
  }
`;
