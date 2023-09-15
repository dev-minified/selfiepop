import { WhiteCross } from 'assets/svgs';
import Empty from 'components/Empty';
import { RequestLoader } from 'components/SiteLoader';
import dayjs from 'dayjs';
import { ServiceType } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import RatingCard from 'pages/components/RatingCard';
import AdvertisementSale from 'pages/my-sales/components/AdvertisementSale';
import DigitalDownloadsSale from 'pages/my-sales/components/DigitalDownloadsSale';
import Generic from 'pages/my-sales/components/Generic';
import PaymaSale from 'pages/my-sales/components/PaymaSale';
import PopLiveSale from 'pages/my-sales/components/PopLiveSale';
import ShoutoutSale from 'pages/my-sales/components/ShoutoutSale';
import { stringify } from 'querystring';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { getSelectedOrder, setSelectedOrder } from 'store/reducer/salesState';
import styled from 'styled-components';
import { parseQuery } from 'util/index';

const getComponent = (order: any, props: any) => {
  switch (order.popType) {
    case ServiceType.POPLIVE:
      return <PopLiveSale {...props} order={order} />;
    case ServiceType.PAYMA:
      return <PaymaSale {...props} order={order} />;
    case ServiceType.ADVERTISE:
      return <AdvertisementSale {...props} order={order} />;
    case ServiceType.DIGITAL_DOWNLOADS:
      return <DigitalDownloadsSale {...props} order={order} />;
    case ServiceType.SHOUTOUT:
      return <ShoutoutSale {...props} order={order} />;
    default:
      return <Generic {...props} order={order} />;
  }
};

function SalesDetail({
  order: Order = undefined,
  className,
  setViewDetail,
  // eslint-disable-next-line
  scrollbarRef,
  // eslint-disable-next-line
  handleScroll,
  ...props
}: any) {
  const location = useLocation();
  const history = useHistory();
  const { orderId, ...rest } = parseQuery(location.search);
  const [order, setOrder] = useState<any>(Order || {});
  const dispatch = useAppDispatch();
  const isOrderFetching = useAppSelector(
    (state) => state.mysales.isOrderFetching,
  );

  useEffect(() => {
    Order && setOrder(Order);
  }, [Order]);

  useEffect(() => {
    if (Order?._id) return;
    orderId &&
      dispatch(
        getSelectedOrder({
          orderId: orderId as string,
          customError: { ignoreStatusCodes: [404] },
        }),
      )
        .then((data: any) => {
          setOrder(data.payload.data);
        })
        .catch((e) => console.log(e));
  }, [orderId]);

  if (!order?._id) return <Empty />;

  const AWAITING_BUYER_REVIEW =
    order.processingStatus === 'Awaiting Buyer Review';
  const RatingView = () => {
    if (AWAITING_BUYER_REVIEW) return null;
    if (
      order.orderStatus.toLowerCase() === 'completed' &&
      order.disputeCompletedAt == null &&
      order.rate != null
    ) {
      return (
        <RatingCard
          name={`${order?.seller?.pageTitle ?? 'Incognito User'}`}
          rating={order?.rate}
          saleReview
        />
      );
    }
    return null;
  };
  const DisputeView = () => {
    if (AWAITING_BUYER_REVIEW && order.disputeStartedAt != null) return null;
    if (
      order.orderStatus.toLowerCase() === 'dispute' &&
      order.disputeStartedAt
    ) {
      return (
        <div className="text-center caption primary-text">
          Buyer contested this order. You will have the results of the review no
          later than{' '}
          {dayjs(order.dateOrderStarted).add(7, 'day').format('MM/DD/YYYY')}
        </div>
      );
    }
    if (
      order.orderStatus.toLowerCase() === 'declined' &&
      order.disputeCompletedAt
    ) {
      return (
        <div className="text-center caption primary-text">
          This order has been completed and the dispute has been resolved.
        </div>
      );
    }
    if (
      order.orderStatus.toLowerCase() === 'completed' &&
      order.disputeCompletedAt
    ) {
      return (
        <div className="text-center caption primary-text">
          Buy has contested this order. We have reviewed the dispute and have
          ruled in buyer favous.
        </div>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      {isOrderFetching && !order?._id ? (
        <RequestLoader
          isLoading={true}
          width="28px"
          height="28px"
          color="var(--pallete-primary-main)"
        />
      ) : (
        <>
          {' '}
          <div
            onClick={() => {
              history.push(`${location.pathname}?${stringify({ ...rest })}`);
              dispatch(setSelectedOrder(null));

              setViewDetail(false);
            }}
            className="btn-close"
          >
            <WhiteCross />
          </div>
          {getComponent(order, props)}
          <div className="mb-30">
            {/* <FulfillmentButtons
          className="btn-blue"
          icon={<Star />}
          submitButtonText="View Shootout"
          refuseButtonText="REFUSE SHOUTOUT"
          onSubmitClick={() => {}}
          onRefuseClick={() => {}}
          orderStatus={'Completed'}
        />
        <FulfillmentButtons
          className="btn-outline"
          icon={<ShareWhite />}
          submitButtonText="Share Shootout"
          refuseButtonText="REFUSE SHOUTOUT"
          onSubmitClick={() => {}}
          onRefuseClick={() => {}}
          orderStatus={'Completed'}
        />
        <hr /> */}
            <RatingView />
            <DisputeView />
            {/* <div className="text-center bottom-text">
          <div className="text-block">
            Did not receive what you purchased? <br />
            <Link to="/">Click Here</Link> to contest this order.
          </div>
          <div className="text-detail">
            You have until 07/07/2021 before your sale will be finalized.
          </div>
        </div> */}
          </div>
        </>
      )}
    </div>
  );
}

export default styled(SalesDetail)`
  max-width: 555px;
  margin: 0 auto;
  padding: 40px 15px 5px;
  /* position: relative; */

  @media (max-width: 767px) {
    padding: 15px 15px 5px;
  }

  .btn-close {
    position: absolute;
    right: 0;
    top: 10px;
    cursor: pointer;

    &:hover {
      path {
        fill: var(--colors-indigo-500);
      }
    }
    @media (max-width: 767px) {
      right: 10px;
    }
  }

  .button.button-lg {
    min-width: 245px;
    padding: 15px 10px;
  }

  .btn-blue {
    .button.button-lg {
      background: var(--colors-indigo-500);
      border-color: var(--colors-indigo-500);
      opacity: 1;
    }
  }

  .btn-outline {
    .button.button-lg {
      border: 2px solid #c5c5c5;
      background: none;
      opacity: 1;
      color: #abaaaa;
    }
  }

  .label-text {
    font-size: 16px;
    line-height: 22px;
    color: var(--pallete-text-main-300);

    .text-black {
      color: var(--pallete-text-main);
    }

    .font-bold {
      font-weight: 500;
    }
  }

  .heading-box {
    margin: 0 0 15px;
    font-size: 15px;

    strong {
      font-weight: 700;
    }
  }

  .c-rate {
    .rc-rate {
      font-size: 40px;
    }

    .rc-rate-star {
      margin-right: 5px;
    }
  }

  .bottom-text {
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: var(--pallete-text-main);
    padding: 0 0 15px;

    .text-block {
      margin: 0 0 10px;
    }

    a {
      text-decoration: underline;

      &:hover {
        color: #326894;
      }
    }
  }

  .text-detail {
    color: #326894;
  }
`;
