import { ChevronLeft, ChevronRight, Star } from 'assets/svgs';
import attrAccept from 'attr-accept';
import Scrollbar from 'components/Scrollbar';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import utc from 'dayjs/plugin/utc';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import { getSubscription } from 'store/reducer/chat';
import {
  getUserOrderNotPurchaseService,
  toggleContentAccess,
  toggleSendMessage,
} from 'store/reducer/salesState';
import styled from 'styled-components';
import { getImageURL, parseQuery } from 'util/index';
import RecipientInfo from './components/RecipientInfo';
import ThumbnailImg from './components/ThumbnailImg';

dayjs.extend(utc);
dayjs.extend(isSameOrAfter);

interface Props {
  className?: string;
  onMembershipUpgrade?: (
    subId: string,
    memberhipId: string,
  ) => void | Promise<any>;
  onUserNameClick?: () => void;
}

function BuyerInfo({
  className,
  onMembershipUpgrade,
  onUserNameClick,
}: Props): ReactElement {
  const location = useLocation();
  const { userId } = parseQuery(location.search);
  const [selectedVariation, setSelectedVariation] = useState('');
  // const selectedSub = useAppSelector((state) => state.mysales.selectedSubscription);
  const selectedSubscription = useAppSelector(
    (state) => state.mysales.selectedSubscription,
  );
  const { ordersListNotPurchased: ordersList } = useAppSelector(
    (state) => state.mysales,
  );
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const ref1 = useRef<any>(null);
  const ref2 = useRef<any>(null);
  const getSubscriptionById = () => {
    if (selectedSubscription?._id) {
      dispatch(
        getSubscription({
          subscriptionId: selectedSubscription?._id,
          callback: (data: any) => {
            const priceVariation = {
              ...data?.oldPriceVariation,
              ...(data?.priceVariation?._id
                ? {
                    allowBuyerToMessage:
                      data?.priceVariation?.allowBuyerToMessage,
                    allowContentAccess:
                      data?.priceVariation?.allowContentAccess,
                    title: data?.priceVariation?.title || '',
                  }
                : {}),
            };
            const isNotExpired =
              dayjs.utc(data?.periodEnd).local().diff(dayjs(), 'minutes') >= 0;
            dispatch(
              toggleSendMessage({
                allowBuyerToMessage: isNotExpired
                  ? priceVariation?.allowBuyerToMessage
                  : false,
              }),
            );
            dispatch(
              toggleContentAccess({
                isContentAccess: isNotExpired
                  ? priceVariation?.allowContentAccess
                  : false,
              }),
            );
            // dispatch(
            //   toggleSendMessage({
            //     allowBuyerToMessage: priceVariation?.allowBuyerToMessage,
            //   }),
            // );

            // dispatch(
            //   toggleContentAccess({
            //     isContentAccess: priceVariation?.allowContentAccess,
            //   }),
            // );

            setSelectedVariation(priceVariation?._id);
          },
          customError: {
            ignoreStatusCodes: [404],
          },
        }),
      ).catch((e) => {
        console.log(e);
      });
    }
  };
  useEffect(() => {
    getSubscriptionById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubscription?._id]);

  const settingsThumbs1 = {
    slidesToShow: 1,
    slidesToScroll: 1,
    rows: 3,
    dots: true,
    slidesPerRow: 1,
    arrows: false,
    adaptiveHeight: true,
    centerPadding: '10px',
  };
  const getMoreOrdersServices = async () => {
    const paramsList: any = {
      skip: ordersList?.service.items?.length,
      limit: 20,
    };

    dispatch(
      getUserOrderNotPurchaseService({
        userId: userId as string,
        params: paramsList,
        callback: () => {},
      }),
    ).catch((e) => console.log(e));
  };

  const services = ordersList?.service?.items?.filter(
    (item) => item.popType !== 'pop-course' && item.isActive,
  );
  const ChatSubscription = ordersList?.course?.items?.filter(
    (item) => item.popType === 'chat-subscription' && item.isActive,
  );
  const onMembershipUpgradeHandler = async (
    subId: string,
    memerbshipId: string,
  ) => {
    try {
      const priceVariation = await onMembershipUpgrade?.(subId, memerbshipId);
      setSelectedVariation(priceVariation);
      return priceVariation;
    } catch (error) {
      return;
    }
  };
  return (
    <div className={className}>
      <Scrollbar className="roomDetails">
        <div className="scroll-wrap">
          {user && (
            <RecipientInfo
              // isBuyer={isBuyer}
              onUserNameClick={onUserNameClick}
              selectedVariation={selectedVariation}
              setSelectedVariation={setSelectedVariation}
              user={selectedSubscription}
              loggedUser={user}
              className="mb-20 widget-box"
              onMembershipUpgrade={onMembershipUpgradeHandler}
            />
          )}
          {!selectedSubscription?._id && (
            <div className="membership-section widget-block">
              <header className="widget-header">
                <strong className="widget-title">
                  <span className="img-icon">
                    <Star />
                  </span>{' '}
                  Join My Fan Club
                </strong>
                <div className="arrows-holder slider-arrow">
                  {(ChatSubscription?.length || [].length) > 3 && (
                    <>
                      <span
                        onClick={() => {
                          ref2.current.slickPrev();
                        }}
                        className="img-arrow next"
                      >
                        <ChevronLeft />
                      </span>{' '}
                      <span
                        onClick={() => {
                          ref2.current.slickNext();
                        }}
                        className="img-arrow prev"
                      >
                        <ChevronRight />
                      </span>
                    </>
                  )}
                </div>
              </header>
              <Slider
                ref={ref2}
                {...settingsThumbs1}
                className="my own class"
                dotsClass="slick-dots-list"
                afterChange={(crslide) => {
                  if (userId && crslide * 3 + 3 >= ChatSubscription?.length) {
                    getMoreOrdersServices();
                  }
                }}
              >
                {ChatSubscription?.map((p, i) => {
                  let url = p?.additionalArt?.find((e) =>
                    attrAccept(
                      { type: e?.artType, name: e.artName },
                      'image/*',
                    ),
                  )?.artPath;
                  let fallBack = url;
                  if (url) {
                    const { url: popUrl, fallbackUrl } = getImageURL({
                      url,
                      settings: {
                        imgix: {
                          all: 'w=300&h=300',
                        },
                      },
                    });
                    url = popUrl;
                    fallBack = fallbackUrl;
                  }
                  return (
                    <ThumbnailImg
                      key={`${p?.popName}-${i}`}
                      caption={`${p?.title}`}
                      src={url}
                      tag={`${p?.price}`}
                      type={p?.popType}
                      fallbackUrl={fallBack}
                      onClick={() => {
                        window.open(
                          `/${selectedSubscription?.sellerId?.username}/${p?.popName}`,
                        );
                      }}
                    />
                  );
                })}
              </Slider>
            </div>
          )}
          {!!services?.length && (
            <div className="service-section widget-block">
              <header className="widget-header">
                <strong className="widget-title">
                  {/* <span className="img-icon">
                    <Account />
                  </span>{' '} */}
                  Services
                </strong>
                <div className="arrows-holder slider-arrow">
                  {(services?.length || [].length) > 3 && (
                    <>
                      <span
                        onClick={() => {
                          ref1.current.slickPrev();
                        }}
                        className="img-arrow next"
                      >
                        <ChevronLeft />
                      </span>{' '}
                      <span
                        onClick={() => {
                          ref1.current.slickNext();
                        }}
                        className="img-arrow prev"
                      >
                        <ChevronRight />
                      </span>
                    </>
                  )}
                </div>
              </header>
              <Slider
                ref={ref1}
                {...settingsThumbs1}
                className="my own class"
                dotsClass="slick-dots-list"
                afterChange={(crslide) => {
                  if (userId && crslide * 3 + 3 >= services?.length) {
                    getMoreOrdersServices();
                  }
                }}
              >
                {services
                  ?.filter((e) => e.isActive)
                  ?.map((p, i) => {
                    let url = p?.additionalArt?.find((e) =>
                      attrAccept(
                        { type: e?.artType, name: e.artName },
                        'image/*',
                      ),
                    )?.artPath;

                    let fallBack = url;
                    if (url) {
                      const { url: popUrl, fallbackUrl } = getImageURL({
                        url,
                        settings: {
                          imgix: {
                            all: 'w=300&h=300',
                          },
                        },
                      });
                      url = popUrl;
                      fallBack = fallbackUrl;
                    }
                    return (
                      <ThumbnailImg
                        key={`${p?.popName}-${i}`}
                        caption={`${p?.title}`}
                        src={url}
                        type={p?.popType}
                        tag={`${p?.price}`}
                        fallbackUrl={fallBack}
                        onClick={() => {
                          window.open(
                            `/${selectedSubscription?.sellerId?.username}/${p?.popName}`,
                          );
                        }}
                      />
                    );
                  })}
              </Slider>
            </div>
          )}
        </div>
      </Scrollbar>
    </div>
  );
}

export default styled(BuyerInfo)`
  background: var(--pallete-background-gray);
  height: 100%;

  .widget-block {
    padding: 15px 0 4px;
    border-top: 1px solid var(--pallete-colors-border);

    .slick-slider {
      overflow: hidden;

      .image-thumbnail {
        max-width: inherit;
      }
    }

    .image-thumbnail {
      img {
        max-height: 125px;
        object-fit: cover;
      }
    }
  }

  .widget-header {
    margin: 0 0 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .widget-title {
    color: var(--pallete-text-main-600);
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    text-transform: uppercase;
    .img-icon {
      display: inline-block;
      vertical-align: top;
      margin: 0 5px 0 0;
      width: 14px;
      svg {
        max-width: 100%;
        height: auto;
      }
      .star {
        #Layer_1 {
          fill: transparent;
        }
        #Layer_2 {
          fill: currentColor;
        }
      }
    }
  }

  .arrows-holder {
    display: flex;
    align-items: center;

    .img-arrow {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--pallete-text-main);
      opacity: 0.2;
      cursor: pointer;
      transition: all 0.4s ease;
      margin-left: 12px;

      &:hover {
        opacity: 0.6;
      }

      svg {
        width: 8px;
        height: auto;
      }

      path {
        fill: currentColor;
      }
    }
  }
`;
