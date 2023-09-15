import { ServiceType } from 'enums';
import React, { ReactElement, ReactNode } from 'react';
import styled from 'styled-components';

type Props = {
  className?: string;
  seller: any;
  order: any;
  title?: string | ReactElement | ReactNode;
};

const getTitle = (type: ServiceType, order: any) => {
  switch (type) {
    case ServiceType.SHOUTOUT:
      return 'Custom Video Request from';
    case ServiceType.PAYMA:
      return 'Q&A Request from';
    case ServiceType.POPLIVE:
      return 'Video Chat Request from';
    case ServiceType.DIGITAL_DOWNLOADS:
      return 'Digital Download from';
    case ServiceType.ADDITIONAL_SERVICES:
      return `${order?.title ? order?.title : 'Custom Service'} from`;
    case ServiceType.ADVERTISE:
      return 'Advertise with';
    default:
      return null;
  }
};

const PaymentWidget: React.FC<Props> = ({
  className,
  seller,
  order,
  title = 'Payment Info',
}) => {
  const platformFee = !!order?.price
    ? (order?.orderPlatformFee / 100) * order?.price + 0.5
    : 0;
  let discountPrice = order?.coupon?.amount || 0;
  if (discountPrice && discountPrice > order?.price) {
    discountPrice = order?.coupon?.orderPrice || 0;
  }

  return (
    <div className={`${className} payment-block`}>
      <h3 className="mb-35">{title}</h3>
      <div className="widget-payment">
        <ul className="payment-list">
          <li>
            <strong className={`title`}>
              <span className={`service_name`}>
                {getTitle(order?.popId?.popType, order) || ''}
              </span>{' '}
              {`${seller?.pageTitle ?? 'Incognito User'}`}
            </strong>
            {/* <span className="price">${order?.price || 0}</span> */}
            <span className="price">${order?.price + discountPrice || 0}</span>
          </li>

          <li className="service-fee">
            <strong className="title">Service Fee</strong>
            <span className="price">${(platformFee || 0).toFixed(2)}</span>
          </li>
          <li className="total-fee">
            <strong className="title">Total</strong>
            <span className="price">
              ${(order?.price + platformFee || 0).toFixed(2)}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default styled(PaymentWidget)`
  .widget-payment {
    overflow: hidden;
    position: relative;
    padding: 23px 10px 3px;
  }
  .service_name {
    text-transform: capitalize;
  }
  .widget-payment:after,
  .widget-payment:before {
    position: absolute;
    left: 0;
    right: 0;
    top: -3px;
    border-top: 4px dashed rgba(103, 97, 109, 0.37);
    content: '';
    height: 4px;
  }

  .widget-payment:after {
    top: auto;
    bottom: -3px;
  }

  .payment-list {
    margin: 0 auto;
    padding: 0;
    list-style: none;
    max-width: 530px;
    color: var(--pallete-text-main-450);
    font-size: 17px;
    line-height: 24px;
    font-weight: 500;

    .sp_dark & {
      color: #fff;
    }

    .modal-content & {
      color: #000;
    }
  }

  .payment-list li {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 0 16px;

    .title {
      .modal-content & {
        color: #8c8c8c;
      }
    }

    &.total {
      .title {
        .modal-content & {
          color: #000;
        }
      }
    }
  }

  .payment-list .service-fee {
    color: #a3a3a3;
    font-size: 13px;
    line-height: 20px;
    margin: 0 0 26px;

    .sp_dark & {
      color: rgba(255, 255, 255, 0.6);
    }
  }
`;
