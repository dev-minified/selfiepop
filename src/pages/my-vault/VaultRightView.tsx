import { ChevronLeft, ChevronRight } from 'assets/svgs';
import attrAccept from 'attr-accept';
import Scrollbar from 'components/Scrollbar';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import utc from 'dayjs/plugin/utc';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import ThumbnailImg from 'pages/subscriptions/rightScreen/components/ThumbnailImg';
import { ReactElement, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import { getVaultUserOrderNotPurchaseService } from 'store/reducer/vault';
import styled from 'styled-components';
import { getImageURL, parseQuery } from 'util/index';
import RecipientInfo from './components/RecipientInfo';

dayjs.extend(utc);
dayjs.extend(isSameOrAfter);

interface Props {
  className?: string;
}

function VaultRightView({ className }: Props): ReactElement {
  const location = useLocation();
  const { userId } = parseQuery(location.search);
  const selectedSubscription = useAppSelector(
    (state) => state.vault.selectedUser,
  );
  const vaultordersListNotPurchased = useAppSelector(
    (state) => state.vault.vaultordersListNotPurchased,
  );
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const ref1 = useRef<any>(null);
  const ref2 = useRef<any>(null);
  useEffect(() => {
    if (!!userId) {
      const paramsListService: any = { skip: 0, limit: 20 };
      dispatch(
        getVaultUserOrderNotPurchaseService({
          userId: userId as string,
          params: paramsListService,
          callback: () => {},
        }),
      ).catch((e) => {
        console.log(e);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const settingsThumbs1 = {
    slidesToShow: 1,
    slidesToScroll: 1,
    rows: 3,
    slidesPerRow: 1,
    dots: true,
    arrows: false,
    adaptiveHeight: true,
    centerPadding: '10px',
  };
  const getMoreOrdersServices = async () => {
    const paramsList: any = {
      skip: vaultordersListNotPurchased?.service.items?.length,
      limit: 20,
    };

    dispatch(
      getVaultUserOrderNotPurchaseService({
        userId: userId as string,
        params: paramsList,
        callback: () => {},
      }),
    ).catch((e) => console.log(e));
  };

  const services = vaultordersListNotPurchased?.service?.items?.filter(
    (item) => item.popType !== 'pop-course' && item.isActive,
  );

  const ChatSubscription = vaultordersListNotPurchased?.service?.items?.filter(
    (item) => item.popType === 'chat-subscription' && item.isActive,
  );
  return (
    <div className={className}>
      <Scrollbar className="roomDetails">
        <div className="scroll-wrap">
          {user && (
            <RecipientInfo
              user={selectedSubscription as any}
              className="mb-20 widget-box"
            />
          )}
          {!selectedSubscription?._id && (
            <div className="membership-section">
              <header className="widget-header">
                {/* <strong className="widget-title">
                  <span className="img-icon">
                    <Star />
                  </span>{' '}
                  SERVICES
                </strong> */}

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

export default styled(VaultRightView)`
  background: var(--pallete-background-gray);
  height: 100%;
  max-width: 390px;
  width: 100%;
  margin: 0 0 0 -1px;
  border-left: 1px solid var(--pallete-colors-border);

  @media (max-width: 1399px) {
    width: 320px;
  }

  .widget-block {
    padding: 15px 0 4px;
    border-top: 1px solid var(--pallete-colors-border);

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
    line-height: 20px;
    font-weight: 500;
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    text-transform: uppercase;

    .sp_dark & {
      color: rgba(255, 255, 255, 0.6);
    }

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
