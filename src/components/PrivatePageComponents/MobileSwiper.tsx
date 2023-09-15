import { PlayIcon } from 'assets/svgs';
import { Mp3Icon } from 'assets/svgs/index';
import attrAccept from 'attr-accept';
import Image from 'components/Image';
import useOpenClose from 'hooks/useOpenClose';
import useSingleAndDoubleClick from 'hooks/useSingleOrDoubleClick';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Lazy, Pagination, Zoom } from 'swiper';
import 'swiper/css';
import 'swiper/css/lazy';
import 'swiper/css/pagination';
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import GallaryViewModal from './GallaryViewModal';

type SlideItem = {
  id: string;
  type?: string;
  src: string;
  thumb: string;
  poster?: string;
  fallback?: string;
  name?: string;
};
interface props extends SwiperProps {
  items?: SlideItem[];
}
const MobileSwiper: React.FC<props> = ({ className, items, ...rest }) => {
  const [isOpenModel, onOpenModel, onCloseModel] = useOpenClose();
  const [activeSlide, setActiveSlide] = useState(0);
  const handlerSwiperOpen = (index: number) => {
    setActiveSlide(index);
    onOpenModel();
  };

  const hanldeClose = () => {
    onCloseModel();
  };

  const clickHandler = useSingleAndDoubleClick(handlerSwiperOpen);
  return (
    <React.Fragment>
      <Swiper
        lazy={true}
        pagination={{
          clickable: true,
        }}
        navigation={false}
        modules={[Lazy, Pagination, Zoom]}
        zoom={true}
        className={className}
        {...rest}
      >
        {items?.map((item: any, index) => {
          const ImageUrl = item?.thumbnail;
          const idx = item.id;
          const isImage = attrAccept({ type: item.type }, 'image/*');
          const isVideo = attrAccept({ type: item.type }, 'video/*');

          return (
            <SwiperSlide
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                clickHandler(index);
              }}
            >
              <div key={idx} className="swipe-slide-holder">
                {isVideo ? (
                  <div className="video_thumbnail">
                    <div className="icon-play">
                      <PlayIcon />
                    </div>
                    <Image
                      className="swiper-zoom-container img-responsive"
                      src={ImageUrl}
                      alt={item?.name}
                    />
                  </div>
                ) : isImage ? (
                  <Image
                    src={item?.path || item.url}
                    key={item?.path}
                    className="swiper-zoom-container"
                    fallbackUrl={item.fallback}
                  />
                ) : (
                  <div className="audio_thumbnail">
                    <div className="icons-holder">
                      <span className="icon-play">
                        <PlayIcon />
                      </span>
                      <span className="img-audio">
                        <Mp3Icon />
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <GallaryViewModal
        isOpen={isOpenModel}
        items={items}
        onClose={hanldeClose}
        currentSlideIndex={activeSlide}
      />
    </React.Fragment>
  );
};

export default styled(MobileSwiper)`
  &.swiper {
    padding: 0 0 20px;

    .swiper-pagination {
      /* bottom: -3px !important; */
      bottom: 5px !important;
    }
  }

  .swiper-slide {
    height: 250px;

    .audio_thumbnail {
      height: 100% !important;
      width: 100%;
    }

    .video_thumbnail {
      height: 100% !important;
    }
  }

  .image-comp {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      max-height: 100%;
      object-fit: contain;
    }
  }

  .swiper-zoom-container,
  .swipe-slide-holder {
    height: 100%;
  }

  .audio_thumbnail {
    height: 100%;
    width: 100%;
    background: var(--pallete-background-gray-secondary-light);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    .icons-holder {
      position: relative;
    }

    .img-audio {
      display: block;
      width: 100px;
    }

    .icon-play {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    svg {
      max-width: 100%;
      height: auto;
    }
  }

  .video_thumbnail {
    position: relative;
    height: 100%;

    .icon-play {
      width: 60px;
      height: 60px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }
  }

  .swiper-pagination-bullet {
    background: var(--pallete-text-main);
  }

  .swiper-pagination-bullet-active {
    background: var(--pallete-primary-main);
  }
`;
