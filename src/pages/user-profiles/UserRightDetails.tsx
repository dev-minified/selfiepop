import { getUserNotPurchaseServices } from 'api/Order';
import { ChevronLeft, ChevronRight } from 'assets/svgs';
import attrAccept from 'attr-accept';
import Scrollbar from 'components/Scrollbar';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import utc from 'dayjs/plugin/utc';
import { ServiceType } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import ThumbnailImg from 'pages/subscriptions/rightScreen/components/ThumbnailImg';
import { ReactElement, useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import { getUserOrderNotPurchaseService } from 'store/reducer/salesState';
import styled from 'styled-components';
import { getImageURL } from 'util/index';
import PurchaseRecieptInfo from './components/PurchaseRecipientInfo';

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

function BuyerInfo({ className }: Props): ReactElement | null {
  const seller = useAppSelector(
    (state) => state.profileVisitor.selectedProfile,
  );
  // const selectedSub = useAppSelector((state) => state.mysales.selectedSubscription);

  const [notpurchasedservices, setServices] = useState({
    items: [],
    totalCount: 0,
  });
  const [chat_variation, setChatVariation] = useState<any>();
  const dispatch = useAppDispatch();

  const ref1 = useRef<any>(null);

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
  const fetchOrders = async () => {
    if (!!seller?._id) {
      const paramsListService: any = { skip: 0, limit: 20 };
      try {
        const response2 = await getUserNotPurchaseServices(
          seller._id,
          paramsListService,
        );
        if (response2.success) {
          const chat_subIndex = response2?.items?.findIndex((item: any) => {
            return (
              item.popType === ServiceType.CHAT_SUBSCRIPTION && item.isActive
            );
          });
          if (chat_subIndex > -1) {
            const chatsub = response2.items[chat_subIndex];
            const activePremium = chatsub?.priceVariations?.find(
              (member: any) => {
                if (member?.isActive && !!member?.price) {
                  return true;
                }
                return false;
              },
            );
            const defMembership = chatsub?.priceVariations?.find(
              (member: any) => {
                return member?.isActive;
              },
            );
            const chatItem = activePremium
              ? { ...chatsub, ...activePremium }
              : { ...chatsub, ...defMembership };
            setChatVariation(chatItem);
            const items = [...response2.items];
            items[chat_subIndex] = chatItem;
            setServices({ ...response2, items });
          } else {
            setServices(response2);
          }
        }
      } catch (error) {}
    }
  };
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seller?._id]);
  const getMoreOrdersServices = async () => {
    const paramsList: any = {
      skip: notpurchasedservices.items?.length,
      limit: 20,
    };

    dispatch(
      getUserOrderNotPurchaseService({
        userId: seller?._id as string,
        params: paramsList,
        callback: () => {},
      }),
    ).catch((e) => console.log(e));
  };

  const services = notpurchasedservices?.items?.filter(
    (item: any) => item.popType !== 'pop-course' && item.isActive,
  );

  return seller?._id ? (
    <div className={className}>
      <Scrollbar className="custom-scroll-bar" style={{ overflowX: 'hidden' }}>
        <div className="scroll-wrap">
          {!!seller?._id && (
            <PurchaseRecieptInfo
              onUserNameClick={(user) => {
                window.open(`/${user.username}`, '_blank');
              }}
            />
          )}
          {!!services?.length && (
            <div className="service-section widget-block">
              <header className="widget-header">
                <strong className="widget-title">Services</strong>
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
                  if (seller?._id && crslide * 3 + 3 >= services?.length) {
                    getMoreOrdersServices();
                  }
                }}
              >
                {services
                  ?.filter((e: any) => e.isActive)
                  ?.map((p: any, i) => {
                    let url = p?.additionalArt?.find((e: any) =>
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
                          window.open(`/${seller?.username}/${p?.popName}`);
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
  ) : null;
}

export default styled(BuyerInfo)`
  background: var(--pallete-background-gray);
  border: 2px solid var(--pallete-colors-border);
  width: 390px;
  min-width: 390px;

  @media (max-width: 1023px) {
    width: 280px;
    min-width: 280px;
  }

  .scroll-wrap {
    padding: 17px 16px;
  }

  .user-detail-info {
    padding: 0;
    background: none;
    margin: 0 0 23px;
  }

  .widget-block {
    padding: 30px 0;

    .slick-slider {
      overflow: hidden;
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
    line-height: 16px;
    font-weight: 500;
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    text-transform: uppercase;
  }

  .image-thumbnail {
    max-width: inherit;
    font-size: 16px;
    line-height: 19px;
    font-weight: 500;

    .caption {
      background: rgba(0, 0, 0, 0.4);
      padding: 12px 17px 12px 17px;
      pointer-events: none;
    }

    .tag {
      background: none;
      right: 12px;
      bottom: 12px;
      top: auto;
      z-index: 2;
      padding: 0;
      min-width: inherit;
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
