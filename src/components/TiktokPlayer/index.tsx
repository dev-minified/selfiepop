import styled from 'styled-components';
import { Virtual } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import { PostTierTypes } from 'enums';
import 'swiper/css/virtual';
interface User {
  _id: string;
  media: Media[];
}

interface Media {
  type: 'video' | 'image';
  url: string;
  thumbnail?: string;
}

interface props {
  className?: string;
  children: (item: IPost) => any;
  items?: any[];
  swipePaginated: () => Promise<void>;
}

const TikTokPlayer: React.FC<props> = (props) => {
  const { className, children, items = [], swipePaginated } = props;

  return (
    <div className={`${className}`}>
      <Swiper
        onReachEnd={() => {
          swipePaginated();
        }}
        direction={'vertical'}
        pagination={{
          clickable: true,
        }}
        className="parent_swiper"
        modules={[Virtual]}
        slidesPerView={1}
        virtual
      >
        {items.map((item: IPost, i: number) => {
          const isFreeSubExist = !!item?.membershipAccessType?.find(
            (m) => m.accessType === PostTierTypes.free_to_view,
          );
          const isNotSeller = !(
            item?.membership?.accessType === PostTierTypes.hidden &&
            !isFreeSubExist
          );
          return isNotSeller ? (
            <SwiperSlide key={i}>
              <div
                className={`slider-wrap ${
                  !!!item?.media?.length && 'no-slider-media'
                }`}
              >
                {/* <MediaSlider media={user.media} /> */}
                {children(item)}
              </div>
            </SwiperSlide>
          ) : null;
        })}
      </Swiper>
    </div>
  );
};

export default styled(TikTokPlayer)`
  height: 100%;
  .parent_swiper {
    /* height: calc(100vh - 120px); */
    height: 100%;
    @media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) {
      /* height: calc(100vh - 190px); */
    }
  }
  .media-holder {
    overflow: hidden;
    display: block !important;

    img,
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .swipe-slide-holder {
    /* height: calc(100vh - 120px) !important; */
  }

  .slick-vertical {
    .slick-slide {
      border: none;
    }
  }

  .card-private-area {
    /* height: calc(100vh - 120px); */
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: var(--pallete-background-gray-100);

    @media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) {
      /* height: calc(100vh - 190px); */
    }

    .private-post-card {
      width: 100%;
    }

    .lock_icon {
      color: #fff;
    }

    .post_icon_list {
      justify-content: center;
    }

    .post-options {
      width: 100%;
      border: none;
    }

    .img-lock {
      circle {
        fill: var(--pallete-text-main);
        .sp_dark & {
          fill: #303030;
        }
      }
    }
  }

  .private-post-card {
    position: relative;
  }

  .slider-wrap {
    position: relative;
    overflow: hidden;
    &.no-slider-media {
      background: rgb(0, 0, 0);
      height: 100%;
      .media-wrapper {
        height: 100%;
        .place-holder-media-text {
          font-size: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #6c757d;
        }
      }
    }
    .pb-20,
    .swiper {
      padding: 0 !important;
    }

    .swiper-slide {
      height: 100% !important;
    }

    .swipe-slide-holder {
      /* height: calc(100vh - 120px); */
      background: var(--pallete-background-primary);

      @media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) {
        /* height: calc(100vh - 190px); */
      }
    }

    .image-comp {
      img {
        /* width: 100%;
        height: 100%;
        object-fit: cover; */
      }
    }
  }

  .post-detail-area {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 12px 50px 12px 16px;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.58) 5.21%,
      rgba(0, 0, 0, 0) 98%
    );
    color: #fff;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
    z-index: 2;

    p {
      text-shadow: 0px 0px 8px var(--pallete-text-main);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 80%;
    }
  }

  .actions-list {
    position: absolute;
    right: 26px;
    bottom: 0;
    display: flex;
    flex-direction: column;
    color: #fff;
    z-index: 3;
    font-size: 12px;
    line-height: 14px;
    font-weight: 500;
    text-align: center;

    .action-item {
      margin: 0 0 20px;
      cursor: pointer;
      transition: all 0.4s ease;

      &:hover {
        opacity: 0.8;
      }
    }

    svg {
      width: 22px;
      height: auto;
      display: block;
      margin: 0 auto;

      &.icon-heart {
        path {
          .sp_dark & {
            fill: #fff;
          }
        }
      }
    }

    .counter {
      display: block;
      padding: 7px 0 0;
    }
  }

  .total-tip-amount {
    display: inline-block;
    vertical-align: top;
    padding: 4px;
    border: 1px solid #fff;
    border-radius: 4px;
  }

  .profile-image {
    width: 46px;
    height: 46px;
    position: relative;
    /* padding: 4px; */
    margin: 0 8px 0 0;

    &:before {
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      content: '';
      border: 2px solid var(--pallete-primary-darker);
      position: absolute;
      border-radius: 100%;
      display: none;
    }

    .image-comp {
      border-radius: 100%;
      overflow: hidden;
    }
  }

  .user-details {
    display: flex;
    align-items: center;
    margin: 0 0 15px;
  }

  .text-description {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
  }

  .user-name,
  .profile-name {
    display: block;
    font-weight: 500;
    line-height: 20px;

    svg {
      width: 16px;
      height: auto;
      display: inline-block;
      vertical-align: middle;
      margin: 0 0 0 8px;
    }
  }

  .profile-name {
    font-size: 15px;
    line-height: 18px;
  }
  .slider-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    .media-wrapper {
      min-width: 0;
    }
  }
`;
