import { Cross, RotateLeft, RotateRight } from 'assets/svgs';
import attrAccept from 'attr-accept';
import classNames from 'classnames';
import AudioPlay from 'components/Audioplay';
import Image from 'components/Image';
import VideoPlay from 'components/VideoPlay';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { default as Modal, default as ReactModal } from 'react-modal';
import styled from 'styled-components';
// import required modules
import { Lazy, Navigation, Zoom } from 'swiper';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/lazy';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';

Modal.setAppElement('#root');

const ToolTipContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;

  .close-icon {
    position: static !important;
  }
`;
const RotateContainer = styled.div`
  display: flex;
  align-items: center;
  color: #fff;

  svg {
    width: 100%;
    height: auto;
    vertical-align: top;
  }
`;

const RotateLeftIcon = styled.div`
  width: 26px;
  height: 26px;
  margin: 0 5px;
  cursor: pointer;
`;
const RotateRightIcon = styled.div`
  width: 26px;
  height: 26px;
  margin: 0 5px;
  cursor: pointer;
`;

type SlideItem = {
  id: string;
  //   size?: string;
  type?: string;
  src: string;
  thumb: string;
  poster?: string;
  fallback?: string;
  name?: string;
  rotate?: number;
  url?: string;
};
interface props extends ReactModal.Props {
  className?: string;
  defaultImage?: string;
  items?: SlideItem[];
  swipperProps?: SwiperProps;
  onClose?: ReactModal.Props['onRequestClose'];
  currentSlideIndex?: number;
  // rotate?: boolean;
  // disableVideoAudioRotation?: boolean;
  onCloseModel?: (...args: any) => void;
  galleryActions?: {
    rotate: boolean;
    disableVideoAudioRotation?: boolean;
  };
  navigator?: boolean;
}
const MobileSwiperModal: React.FC<props> = ({
  className,
  items,
  swipperProps,
  isOpen,
  currentSlideIndex,
  onClose,
  // rotate,
  onCloseModel,
  navigator = false,
  galleryActions = { rotate: false, disableVideoAudioRotation: true },
  ...rest
}) => {
  const ref = useRef<any>();
  const [mItems, setMItems] = useState(items || []);
  const [currentSlide, setCurrentSlide] = useState(currentSlideIndex || 0);
  const { rotate } = galleryActions;
  useEffect(() => {
    if (isOpen) {
      setMItems(items || []);
      setCurrentSlide(() => currentSlideIndex || 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, isOpen]);
  const onRotateLeft = () => {
    setMItems((pre) => {
      return pre.map((item, index) =>
        index === currentSlide
          ? {
              ...item,
              rotate: (item.rotate || 0) - 90,
            }
          : item,
      );
    });
  };

  const onRotateRight = () => {
    setMItems((pre) => {
      return pre.map((item, index) =>
        index === currentSlide
          ? {
              ...item,
              rotate: (item.rotate || 0) + 90,
            }
          : item,
      );
    });
  };
  const handleClose = (e: any) => {
    e?.stopPropagation();
    onCloseModel?.(mItems);
    onClose?.(e);
  };
  let isAudio = false;
  let isVideo = false;
  if (currentSlide !== -1 && mItems.length) {
    const item = mItems[currentSlide];
    isAudio = attrAccept({ type: item.type }, 'audio/*');
    isVideo = attrAccept({ type: item.type }, 'video/*');
  }
  const isImage = !isAudio && !isVideo;
  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          shouldCloseOnOverlayClick
          onRequestClose={handleClose}
          className={classNames(
            'react-swipper-gallary-modal-content',
            className,
          )}
          overlayClassName={classNames(
            'react-swipper-gallary-modal-overlay ',
            className,
          )}
          {...rest}
        >
          <ToolTipContainer>
            {rotate && isImage && (
              <RotateContainer>
                <RotateLeftIcon onClick={onRotateLeft}>
                  <RotateLeft />
                </RotateLeftIcon>
                <RotateRightIcon onClick={onRotateRight}>
                  <RotateRight />
                </RotateRightIcon>
              </RotateContainer>
            )}

            <div className="close-icon" onClick={handleClose}>
              <Cross />
            </div>
          </ToolTipContainer>
          <motion.div
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                ease: 'easeOut',
                duration: 0.2,
                delay: 0.5,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.75,
              transition: {
                ease: 'easeIn',
                duration: 0.2,
              },
            }}
          >
            <div>
              <Swiper
                lazy={true}
                navigation={navigator}
                zoom={true}
                onSwiper={(s) => (ref.current = s)}
                modules={[Lazy, Zoom, Navigation]}
                initialSlide={currentSlideIndex || currentSlide}
                onSlideChange={(a) => {
                  setCurrentSlide(a.activeIndex);
                  const prevItem = items?.[a?.previousIndex];
                  if (prevItem) {
                    const isAudio = attrAccept(
                      { type: prevItem?.type },
                      'audio/*',
                    );
                    const isVideo = attrAccept(
                      { type: prevItem?.type },
                      'video/*',
                    );
                    if (isVideo || isAudio) {
                      const id = prevItem?.id?.split('-').join('_');
                      const element = document.getElementsByClassName(
                        `${isVideo ? 'video_' : 'audio_'}${id}`,
                      )[0];
                      const paelement = isVideo
                        ? element.getElementsByTagName('video')[0]
                        : element.getElementsByTagName('audio')[0];
                      if (paelement) {
                        paelement?.pause();
                      }
                    }
                  }
                  if (swipperProps?.onSlideChange) {
                    swipperProps?.onSlideChange(a);
                  }
                }}
                {...swipperProps}
              >
                {mItems?.map((item: any) => {
                  const idx = item?.id?.split('-').join('_');
                  const isImage = attrAccept({ type: item.type }, 'image/*');
                  const isVideo = attrAccept({ type: item.type }, 'video/*');
                  return (
                    <React.Fragment key={idx}>
                      <SwiperSlide key={idx}>
                        <motion.div
                          className="slide-rotate"
                          animate={{
                            rotate: item.rotate || 0,
                            transition: {
                              ease: 'easeOut',
                              duration: 0.1,
                            },
                          }}
                        >
                          <div className="slide-holder">
                            {isVideo ? (
                              <div className="swipe-video-holder">
                                <VideoPlay
                                  url={item.url || item.path}
                                  className={`video_${idx}`}
                                  attributes={{
                                    disablePictureInPicture: true,
                                  }}
                                />
                              </div>
                            ) : isImage ? (
                              <Image
                                src={item.src || item.path || item.url}
                                key={item?.path}
                                fallbackUrl={item.fallback}
                                className={`swiper-zoom-container image_${idx}`}
                              />
                            ) : (
                              <AudioPlay
                                className={`audio_${idx}`}
                                src={item.url || item.path}
                              />
                            )}
                          </div>
                        </motion.div>
                      </SwiperSlide>
                    </React.Fragment>
                  );
                })}
              </Swiper>
            </div>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default styled(MobileSwiperModal)`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  outline: none;

  .ReactModal__Content {
    outline: none;
  }

  .slide-holder,
  .slide-rotate {
    height: 100%;
  }

  .swiper-slide {
    height: calc(100vh - 40px);
    padding: 15px 45px;

    @media (min-width: 1024px) {
      padding: 40px 122px 80px;
    }

    .swiper-zoom-container {
      height: 100%;
    }

    .image-comp {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .audio-holder {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    img {
      max-height: 100%;
      object-fit: contain;
    }
  }

  .swipe-video-holder {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    @media (min-width: 768px) {
      .rc-vidoe-player {
        padding-top: 0;
        margin-bottom: 0;
        height: 100%;
        max-width: 1024px;
        margin: 0 auto;

        .react-player {
          position: static;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        video {
          width: auto !important;
          height: auto !important;
          max-width: 100% !important;
          max-height: 100% !important;
          display: block;
          margin: 0 auto;
        }
      }
    }
  }

  .swiper-pagination {
    display: none !important;
  }

  .swiper-button-prev,
  .swiper-button-next {
    color: #999;

    &:after {
      font-family: 'icomoon';
      content: '\\ea3c';
      font-size: 16px;
    }

    &:hover {
      color: #fff;
    }
  }

  .swiper-button-prev {
    &:after {
      transform: rotate(180deg);
    }
  }

  .close-icon {
    position: absolute;
    right: 8px;
    top: 8px;
    z-index: 3;
    cursor: pointer;
    /* background: #000; */
    border-radius: 100%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    color: #999;
    transition: all 0.4s ease;

    &:hover {
      color: #fff;
    }

    svg {
      width: 14px;
      height: auto;
      vertical-align: top;
    }

    circle {
      display: none;
    }
  }
`;
