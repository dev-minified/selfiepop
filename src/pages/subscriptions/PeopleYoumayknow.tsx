import { getYouMayknowUsers } from 'api/sales';
import { ChevronLeft, ChevronRight, RefreshIcon } from 'assets/svgs';
import ProfileCard from 'components/ProfileCard';
import { RequestLoader } from 'components/SiteLoader';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import {
  getPeopleYoumayknow,
  setPeopleYoumayknow,
} from 'store/reducer/salesState';
import styled from 'styled-components';
import Button from './../../components/NButton';
const cardsSlider = {
  slidesToShow: 1,
  slidesToScroll: 1,
  rows: 4,
  arrows: false,
  dots: true,
  adaptiveHeight: true,
};
type IPeopleYoumayknow = {
  onProfileCardClick?: (item: any) => void;
  className?: string;
};
const PeopleYoumayknow = (props: IPeopleYoumayknow) => {
  const { onProfileCardClick, className } = props;
  const sliderRef = useRef<any>(null);
  const youmayknowusers = useAppSelector(
    (state) => state.mysales.youmayknowusers,
  );
  const isPeopleYoumayknowfetching = useAppSelector(
    (state) => state.mysales.isYoumayknowFetching,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dispatch = useAppDispatch();
  const getPeopleYouknow = () => {
    dispatch(
      getPeopleYoumayknow({
        callback: () => {},
        customError: {
          ignoreStatusCodes: [404, 500],
        },
      }),
    )
      .unwrap()
      .then(() => {
        // if (!data?.success && data?.cancelled) {
        //   setPeopleyoumayknowLoading(true);
        //   return;
        // }
      })
      .catch(() => {})
      .finally(() => {});
  };
  const getPeopleyoumayknow = async () => {
    setIsRefreshing(true);
    getYouMayknowUsers({
      ignoreStatusCodes: [404, 500],
    })
      .then((d) => {
        if (d.cancelled) {
          return;
        }
        dispatch(setPeopleYoumayknow(d.data));
        console.log({ d });
      })
      .catch(() => {})
      .finally(() => {
        setIsRefreshing(false);
      });
  };
  useEffect(() => {
    getPeopleYouknow();
  }, []);
  if (!!youmayknowusers?.length && youmayknowusers?.length < 3) {
    // cardsSlider.rows = 1;
  }
  const isPeopleYoumayKnow =
    youmayknowusers?.length && youmayknowusers?.length > 4;
  return isPeopleYoumayknowfetching ? (
    <>
      <RequestLoader
        className="mt-10"
        isLoading={true}
        width="28px"
        height="28px"
        color="var(--pallete-primary-main)"
      />
    </>
  ) : !!youmayknowusers?.length ? (
    <div className={`cards-slider ${className}`}>
      <div className="cards-header">
        <span className="heading">SUGGESTIONS</span>
        {isPeopleYoumayKnow ? (
          <div className="arrows-holder slider-arrow">
            <>
              <span
                onClick={() => {
                  getPeopleyoumayknow();
                }}
                className={`img-arrow refresh ${
                  isRefreshing ? 'refreshing_suggestions' : ''
                }`}
              >
                <RefreshIcon />
              </span>{' '}
              <span
                onClick={() => {
                  sliderRef?.current?.slickPrev();
                }}
                className="img-arrow next"
              >
                <ChevronLeft />
              </span>{' '}
              <span
                onClick={() => {
                  sliderRef?.current?.slickNext();
                }}
                className="img-arrow prev"
              >
                <ChevronRight />
              </span>
            </>
          </div>
        ) : null}
      </div>
      <Slider {...cardsSlider} ref={sliderRef}>
        {youmayknowusers?.map((item: any, index: any) => {
          return (
            <div key={index} className="slide">
              <ProfileCard
                isUserVerified={item?.isEmailVerified && item?.idIsVerified}
                img={item.profileImage}
                coverImg={
                  item.coverPhoto?.isActive
                    ? item.coverPhoto?.image ||
                      '/assets/images/defaultCover.png'
                    : '/assets/images/defaultCover.png'
                }
                heading={item.pageTitle}
                username={item.username}
                btnText={'View Profile'}
                onClick={() => onProfileCardClick?.(item)}
              />
            </div>
          );
        })}
      </Slider>
    </div>
  ) : (
    <div className="p-10">
      <Button disabled block shape="circle">
        Empty discovery data.
      </Button>
    </div>
  );
};

export default styled(PeopleYoumayknow)`
  padding: 15px;

  @media (max-width: 767px) {
    /* padding-bottom: 90px; */
  }

  .slick-list {
    margin: 0 -8px;
  }

  /* .slick-track {
      display: flex;

      &:before,
      &:after {
        display: none;
      }
    } */

  .slick-slide {
    min-height: inherit;
    height: auto;

    > div {
      height: 100%;
    }

    .slide {
      /* height: 100%; */
      padding: 0 8px;
      margin: 0 0 16px;
    }
  }

  .slick-dots {
    margin: 0;
    position: static;
    line-height: 1;

    .slick-active {
      button {
        background: #7d7d7d;
        opacity: 1;
      }
    }

    button {
      display: block;
      width: 8px;
      height: 8px;
      background: #d9d9d9;
      opacity: 0.2;

      &:hover {
        background: #7d7d7d;
        opacity: 1;
      }

      &:before,
      &:after {
        display: none;
      }
    }
  }

  .profile-card {
    height: 100%;
  }

  .heading {
    display: block;
    font-size: 14px;
    line-height: 16px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.6);

    .sp_dark & {
      color: rgba(#fff, 0.6);
    }

    .img {
      display: inline-block;
      vertical-align: middle;
      width: 14px;
      margin: 0 5px 0 0;

      svg {
        width: 100%;
        height: auto;
        display: block;
      }

      #Layer_1 {
        fill: transparent;
      }

      #Layer_2 {
        fill: #7b809b;
      }
    }
  }

  .cards-header {
    margin: 0 0 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
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

      &.refresh {
        opacity: 0.8;
        margin-right: 30px;

        &.refreshing_suggestions {
          animation: spin 1s infinite;
        }

        &:hover {
          opacity: 1;
        }

        svg {
          width: 22px;
          height: auto;
          display: block;
        }

        path {
          fill: none;
        }
      }
    }
  }
`;
