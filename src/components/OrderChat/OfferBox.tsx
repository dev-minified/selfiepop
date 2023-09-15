import { ThumbBubble } from 'assets/svgs';
import Image from 'components/Image';
import Button from 'components/NButton';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { OrderStatus } from 'enums';
import React, { useState } from 'react';
import { Collapse } from 'react-collapse';
import styled from 'styled-components';
import { getChangeUrlsOnly, getLocation } from 'util/index';
dayjs.extend(advancedFormat);

interface OfferProps {
  className?: string;
  type: 'buyer' | 'seller';
  from: string;
  timestamp: string;
  image: string;
  offer: Offer;
  orderStatus?: string;
  location?: string;
  onAcceptClick?: () => Promise<void>;
  onWithdrawClick: () => Promise<void>;
  onDeclineClick: () => Promise<void>;
}

const ActionButtons = (props: OfferProps) => {
  const {
    onAcceptClick,
    onDeclineClick,
    onWithdrawClick,
    type,
    offer,
    orderStatus,
  } = props;
  const [loading, setLoading] = useState<string>('');

  switch (offer.status) {
    case 'open':
      return (
        <>
          {[
            OrderStatus.IN_PROGRESS,
            OrderStatus.PENDING,
            OrderStatus.PRE_ORDER,
          ].includes(orderStatus as OrderStatus) ? (
            type === 'buyer' ? (
              <>
                <div className="text-center mt-30">
                  <Button
                    onClick={async () => {
                      setLoading('decline');
                      await onDeclineClick();
                      setLoading('');
                    }}
                    isLoading={loading === 'decline'}
                    disabled={loading === 'decline'}
                    size="small"
                    shape="circle"
                    type="info"
                  >
                    Decline
                  </Button>
                  <Button
                    onClick={async () => {
                      setLoading('accept');
                      await onAcceptClick?.();
                      setLoading('');
                    }}
                    isLoading={loading === 'accept'}
                    disabled={loading === 'accept'}
                    size="small"
                    shape="circle"
                    type="secondary"
                  >
                    Accept Offer
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center  mt-30">
                <Button
                  onClick={async () => {
                    setLoading('withdraw');
                    await onWithdrawClick();
                    setLoading('');
                  }}
                  isLoading={loading === 'withdraw'}
                  disabled={loading === 'withdraw'}
                  size="small"
                  shape="circle"
                  type="info"
                >
                  Withdraw Offer
                </Button>
              </div>
            )
          ) : null}
        </>
      );
    case 'withdrawn':
      return null;
    case 'accepted':
      return (
        <div className="text-center mt-30">
          <Button
            className="events-none"
            size="small"
            shape="circle"
            type="secondary"
          >
            Offer Accepted
          </Button>
        </div>
      );
    case 'declined':
      return (
        <div className="text-center mt-30">
          <Button
            className="events-none"
            size="small"
            shape="circle"
            type="info"
          >
            {type === 'buyer' ? 'You Declined This Offer' : 'Offer Declined'}
          </Button>
        </div>
      );
    default:
      return null;
  }
};

const getSubtitle = (type: OfferProps['type'], status: OfferStatus) => {
  switch (status) {
    case 'open':
    case 'accepted':
    case 'declined':
      return type === 'buyer'
        ? 'Has made an alternative offer.'
        : 'You have made an alternative offer.';
    case 'withdrawn':
      return type === 'buyer'
        ? 'Has withdrawn this offer.'
        : 'You have withdrawn this offer.';
  }
};

const OfferBox: React.FC<OfferProps> = (props) => {
  const { className, type, from, timestamp, image, offer, location } = props;
  const [expanded, setExpanded] = useState<boolean>(true);
  const { url, fallbackUrl } = getChangeUrlsOnly(image);
  return (
    <div className={className}>
      <div className="box-wrap">
        <div style={{ width: '50px', height: '50px' }}>
          <Image
            fallbackUrl={
              fallbackUrl || '/assets/images/default-profile-img.svg'
            }
            src={url || '/assets/images/default-profile-img.svg'}
            alt="profile"
          />
        </div>
        <div className="text-holder">
          <div className="name-area">
            <strong className="name">{from}</strong>
            <span className="time">
              {' '}
              {dayjs(timestamp).format('dddd MMMM Do, h:mm A')}
            </span>
          </div>
          <p>{getSubtitle(type, offer.status!)}</p>
        </div>
      </div>
      <div
        className={`offer-box ${
          !expanded && offer.status === 'accepted' ? 'accepted' : ''
        }`}
      >
        <div className="top-area">
          <div className="heading-area">
            <ThumbBubble
              color={
                offer.status === 'withdrawn'
                  ? '#A3A607'
                  : !expanded && offer.status === 'accepted'
                  ? '#ffffff'
                  : '#72777D'
              }
            />
            <span className="text-offer">New Offer</span>
          </div>
          <span
            className="img-hide"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? 'Hide' : 'View'}
          </span>
        </div>
        <Collapse isOpened={expanded}>
          <div className="slide-item">
            <p>
              <strong className="text-title">Price:</strong>{' '}
              <span>${offer.price.toFixed(2)}</span>
            </p>
            <p>
              <strong className="text-title">Details:</strong>{' '}
              <span>{offer.details}</span>
            </p>
            <p>
              <strong className="text-title">Location:</strong>{' '}
              <a
                href={getLocation(location || '').href}
                target="_blank"
                rel="noreferrer"
              >
                {location}
              </a>
            </p>
            <strong className="main-title">Promotion Date and Time:</strong>
            <ul className="timeline-area">
              <li>
                Starts:{' '}
                <strong className="time">
                  {dayjs(offer.startDateTime).format('MMMM D - YYYY @ hh:mm A')}
                </strong>
              </li>
              <li>
                Stops:{' '}
                <strong className="time">
                  {dayjs(offer.endDateTime).format('MMMM D - YYYY @ hh:mm A')}
                </strong>
              </li>
            </ul>
            <ActionButtons {...props} />
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default styled(OfferBox)`
  padding: 16px 18px;
  border: 1px solid var(--pallete-colors-border);
  border-radius: 4px;
  margin: 0 0 25px;
  font-size: 15px;
  line-height: 23px;
  font-weight: 400;
  color: var(--pallete-text-light-100);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.06);

  .events-none {
    pointer-events: none;
  }

  .box-wrap {
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    img {
      border-radius: 50%;
    }
  }

  .image-comp {
    min-widht: 44px;
    width: 44px;
    height: 44px;
    border-radius: 100%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .text-holder {
    width: calc(100% - 44px);
    padding: 0 0 0 10px;
  }

  .name-area {
    font-weight: 500;
    margin: 0 0 4px;
  }

  .name {
    display: inline-block;
    vertical-align: top;
    font-weight: 500;
    padding: 0 20px 0 0;
  }

  .time {
    display: inline-block;
    vertical-align: top;
    color: #716b76;
  }

  p {
    margin: 0 0 10px;
  }

  .offer-box {
    background: var(--pallete-background-gray);
    border: 1px solid var(--pallete-colors-border);
    border-radius: 4px;
    padding: 15px 16px;
    font-size: 15px;
    line-height: 24px;
    color: var(--pallete-text-main);

    &.accepted {
      background: #7ccf78;
      color: #fff;

      .top-area {
        color: #fff;
      }
    }

    .slide-item {
      padding: 11px 0 0;
    }

    .top-area {
      padding: 0 60px 0 0;
      color: #72777d;
      font-weight: 500;
      position: relative;

      svg {
        width: 34px;
        display: inline-block;
        vertical-align: top;
        margin: 0 10px 0 0;
      }

      .img-hide {
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 0;
        color: var(--pallete-text-main-250);
        border: 1px solid var(--pallete-colors-border);
        background: var(--pallete-background-default);
        min-width: 56px;
        text-align: center;
        font-weight: 400;
        border-radius: 4px;
        transition: all 0.4s ease;

        &:hover {
          background: var(--colors-indigo-200);
          color: #fff;
        }
      }
    }

    strong {
      font-weight: 500;
    }

    a {
      text-decoration: underline;

      &:hover {
        text-decoration: none;
      }
    }

    p {
      margin: 0 0 17px;
    }

    .timeline-area {
      margin: 0;
      padding: 0;
      color: var(--pallete-text-main-300);

      strong {
        font-weight: 500;
        color: var(--pallete-text-main);
      }
    }

    .main-title {
      margin: 0 0 8px;
      display: block;
    }

    .button.button-sm {
      @media (max-width: 480px) {
        min-width: 100px;
      }
    }
  }
`;
