import { GetPopIcon } from 'appconstants';
import EmptydataMessage from 'components/EmtpyMessageData';
import Button from 'components/NButton';
import Scrollbar from 'components/Scrollbar';
import { RequestLoader } from 'components/SiteLoader';
import dayjs from 'dayjs';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';

import { stringify } from 'querystring';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import {
  getSelectedUserOrders,
  setSelectedOrder,
  setUserOrders,
} from 'store/reducer/salesState';
import styled from 'styled-components';
import { getSortbyParam, parseQuery } from 'util/index';
import Card from './components/Card';
import CardFooter from './components/CardFooter';
import CardHeader from './components/CardHeader';

interface Props {
  className?: string;
  messages?: ChatMessage[];
  setViewDetail?: Function;
}

const PAGE_LIMIT = 10;
const Orders: React.FC<Props> = (props) => {
  const { className, setViewDetail } = props;

  const { selectedSubscription, isUserOrdersFetching, ordersList } =
    useAppSelector((state) => state.mysales);

  const location = useLocation();
  const qs = parseQuery(location.search);
  const scrollbarRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState<any>(null);

  const dispatch = useAppDispatch();
  const history = useHistory();
  const { userId } = parseQuery(location.search);

  useEffect(() => {
    if (selectedSubscription?._id) {
      dispatch(
        setUserOrders({
          orders: { items: [], totalCount: 0 },
          pops: { items: [], totalCount: 0 },
        }),
      );
      getPaginatedOrders(
        selectedSubscription,
        () => {
          setIsLoading(false);
        },
        { sort: getSortbyParam('createdAt'), order: 'desc' },
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubscription?._id]);
  const getPaginatedOrders = async (
    sub: ChatSubsType,
    callback?: (args: any) => void,
    params: Record<string, any> = {},
  ) => {
    setIsLoading(true);
    dispatch(
      getSelectedUserOrders({
        userId: sub?.sellerId?._id,
        callback,
        params: { limit: 10, ...params, type: 'buyer' },
        customError: { ignoreStatusCodes: [404] },
      }),
    )
      .then((e: any) => {
        if (
          e?.meta?.requestStatus === 'rejected' &&
          e.meta?.arg?.userId !== userId &&
          !(e as any).error?.message
        ) {
          setIsLoading(true);
        }

        if (e?.meta?.requestStatus === 'fulfilled') {
          setIsLoading(false);
        }
        if (!!(e as any).error?.message) {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };
  const handleScroll = async () => {
    if (
      scrollbarRef.current &&
      (ordersList?.orders?.items?.length as any) <
        (ordersList?.orders?.totalCount as any)
    ) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollbarRef.current.view;
      const pad = 1; // 100px of the bottom
      // t will be greater than 1 if we are about to reach the bottom
      const t = (scrollTop + pad) / (scrollHeight - clientHeight);
      if (t > 1 && !isUserOrdersFetching) {
        getPaginatedOrders(selectedSubscription as ChatSubsType, () => {}, {
          skip: ordersList?.orders?.items?.length || 0,
          limit: PAGE_LIMIT,
          sort: getSortbyParam('createdAt'),
          order: 'desc',
        }).catch((e) => {
          console.log({ e });
        });
      }
    }
  };

  if (!isLoading && !ordersList?.orders?.totalCount) {
    return <EmptydataMessage text=" You don't have any Orders." />;
  }
  const getPrice = (order: any) => {
    let price =
      order?.offerPrice === undefined ? order.price : order?.offerPrice;
    if (order?.priceVariation?._id) {
      price =
        order?.offerPrice === undefined
          ? order?.priceVariation?.price || 0
          : order?.offerPrice;
      if (order.coupon?.amount) {
        price =
          price - order.coupon.amount < 0 ? 0 : price - order.coupon.amount;
      }
    }
    return price;
  };
  return (
    <div className={`${className} order_parent`}>
      <Scrollbar onScrollStop={handleScroll} ref={scrollbarRef}>
        {ordersList?.orders?.items?.map((order) => {
          return (
            <div key={order?._id} className="order-scroll-wrap">
              <Card>
                <CardHeader>
                  <div className="card-header-area">
                    <div className="icon">
                      <GetPopIcon
                        type={order?.popType}
                        primaryColor="var(--pallete-primary-main)"
                      />
                    </div>
                    <div className="header-detail-area">
                      <h3>{order?.priceVariation?.title || order?.title}</h3>
                      <ul className="list-detail">
                        <li>
                          Price:{' '}
                          <strong className="val">${getPrice(order)}</strong>
                        </li>
                        <li>
                          Ordered:{' '}
                          <strong className="val">
                            {' '}
                            <time
                              dateTime={dayjs(order?.dateOrderStarted).format(
                                'MM/DD/YYYY',
                              )}
                            >
                              {dayjs(order?.dateOrderStarted).format(
                                'MM/DD/YYYY',
                              )}
                            </time>
                          </strong>
                        </li>
                        <li>
                          Status:{' '}
                          <strong className="status-val val">
                            <span
                              className={`status status-${order.orderStatus}`}
                            ></span>
                            {order.orderStatus}
                          </strong>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter>
                  <Button
                    block
                    onClick={() => {
                      history.push(
                        `${location.pathname}?${stringify({
                          ...qs,
                          orderId: order._id,
                        })}`,
                      );
                      dispatch(
                        setSelectedOrder({
                          ...order,
                          buyer: {
                            ...(order as any)?.buyer,
                            ...selectedSubscription?.buyerId,
                          },
                        }),
                      );

                      setViewDetail?.(true);
                    }}
                    type="primary"
                    shape="circle"
                    size="large"
                    className="btn-details"
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </div>
          );
        })}
        {isLoading && (
          <div className={`pt-20 ${className}`}>
            <RequestLoader
              isLoading={true}
              width="28px"
              height="28px"
              color="var(--pallete-primary-main)"
            />
          </div>
        )}
      </Scrollbar>
    </div>
  );
};

export default styled(Orders)`
  &.order_parent {
    height: 100%;
  }

  .order-scroll-wrap {
    padding: 20px 20px 0;

    @media (max-width: 767px) {
      padding: 16px 10px 0;
    }
  }

  .empty_message {
    margin-top: -1.6rem;

    @media (max-width: 767px) {
      margin-top: -8px;
    }
  }

  .messages-container {
    padding-bottom: 10px;
  }

  .header-detail-area {
    text-transform: capitalize;
  }

  .send-spinner {
    background: var(--pallete-primary-main);
    border-radius: 50%;
    padding: 6px;
    position: absolute;
    right: 8px;
    top: 8px;
    width: 42px;
    cursor: pointer;
    z-index: 2;

    svg {
      width: 100%;
      height: auto;
      vertical-align: top;
    }
  }

  .chat-input {
    padding: 0 15px 0 0;

    @media (max-width: 767px) {
      padding: 0 6px 0 0;
    }
    .text-input {
      margin-bottom: 15px !important;
    }
    .input-wrap {
      margin-bottom: 9px;
    }

    .form-control {
      border: none;
      background: var(--pallete-background-gray-secondary-light);
      height: 60px;
      border-radius: 60px;
      padding: 10px 70px;
      font-weight: 400;
      font-size: 16px;

      &::placeholder {
        color: var(--pallete-primary-main);
        opacity: 0.63;
      }
    }

    .pre-fix {
      width: 22px;
      color: var(--pallete-primary-main);
      top: 50%;
      transform: translate(0, -50%);
      left: 18px;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }

    .icon {
      top: 50%;
      transform: translate(0, -50%);
      width: 42px;
      max-width: inherit;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }

    hr {
      margin: 0 -20px;
      border-color: var(--pallete-colors-border);

      @media (max-width: 767px) {
        margin: 0 -10px;
      }
    }

    .input-actions {
      padding: 11px 0;
      color: var(--pallete-primary-main);
      .sp_dark & {
        color: rgba(255, 255, 255, 0.8);
      }

      .input-actions__img {
        margin-right: 26px;
        cursor: pointer;
      }

      path {
        fill: currentColor;
      }
    }

    /*.emoji-mart {
      position: absolute;
      bottom: 100%;
      left: 0;
      margin: 0 0 15px;
    }*/
  }

  .input-wrap {
    position: relative;
  }

  .sub-tabs-holder {
    padding: 10px 0 0;
    margin: 0 0 0 -20px;
    position: relative;
    max-width: inherit;

    @media (max-width: 767px) {
      margin: 0 0 0 -10px;
    }

    .rc-tabs-content-holder {
      overflow: visible;
    }

    .sub-tab-cotnent {
      padding: 0 20px 20px;

      @media (max-width: 767px) {
        padding: 0 10px 6px;
      }
    }

    .btns-links {
      .button {
        color: var(--pallete-text-light-150);

        svg {
          margin-right: 5px;
        }
      }
    }

    /* tabs updated style for chat */
    .chat_sub {
      position: relative;
    }

    .rc-tabs-card {
      .rc-tabs-nav-list {
        margin: 0;
      }

      .rc-tabs-nav-wrap {
        padding: 0 44px 0 0;

        @media (max-width: 767px) {
          padding: 0;
        }
      }

      .rc-tabs-tab {
        margin: 0;
        flex: 1;
        border-radius: 0;
        padding: 10px 16px;

        &:nth-last-child(2) {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .btns-links {
      .button {
        color: var(--pallete-text-light-150);

        svg {
          margin-right: 5px;
        }
      }
    }

    .tab-close {
      position: absolute;
      right: -1px;
      top: 0;
      width: 46px;
      height: 43px;
      border: 1px solid #e6ecf1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--pallete-primary-main);
      z-index: 10;
      background: var(--pallete-background-default);

      @media (max-width: 767px) {
        border: none;
        height: 40px;
      }

      &.top-align {
        top: 0;
        right: -1;

        &.max-top-align {
          /* top: -42px; */
        }
      }
    }
  }

  .input-wrap {
    position: relative;
  }

  .emoji-wrapper {
    position: relative;

    .icon {
      position: absolute;
      right: 8px;
      top: 8px;
      z-index: 3;
      cursor: pointer;
      transform: none;
    }
  }

  .react-emoji {
    display: block;
    position: relative;

    .react-input-emoji--container {
      margin: 0 !important;
      border: none;
      background: none;
    }

    .react-input-emoji--wrapper {
      background: var(--pallete-background-gray-secondary);
      border-radius: 30px;
      padding: 20px 70px 20px 54px;

      .sp_dark & {
        background: #262626;
      }
    }

    .react-input-emoji--placeholder {
      /* color: var(--pallete-primary-main); */
      /* opacity: 0.63; */
      color: #bfbfbf;
    }

    .react-input-emoji--placeholder {
      left: 54px;
      width: calc(100% - 60px);
    }

    .react-input-emoji--input {
      min-height: inherit;
      height: auto;
      margin: 0;
      padding: 0;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      color: var(--pallete-text-main-700);
      white-space: normal;
      overflow-x: hidden;
      overflow-y: auto;
    }

    .react-input-emoji--button {
      position: absolute;
      left: 18px;
      bottom: 18px;
      color: var(--pallete-primary-main);
      z-index: 2;
      padding: 0;
      .sp_dark & {
        color: rgba(255, 255, 255, 0.8);
      }

      svg {
        fill: currentColor;
      }
    }

    .react-emoji-picker--wrapper {
      right: auto;
      left: 0;
      width: 355px;
    }
  }

  .btn-send {
    position: absolute;
    right: 8px;
    bottom: 8px;
    width: 42px;
    cursor: pointer;
    z-index: 2;
    padding: 0;
    top: auto;

    svg {
      width: 100%;
      height: auto;
      vertical-align: top;
    }
  }
`;
