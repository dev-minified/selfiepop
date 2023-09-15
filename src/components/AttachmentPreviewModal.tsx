import { LeftSliderArrow, RightSliderArrow } from 'assets/svgs';
import attrAccept from 'attr-accept';
import Image from 'components/Image';
import Modal from 'components/modal';
import { ImagesSizes } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import React, { useEffect, useState } from 'react';
import Slider, { Settings } from 'react-slick';
import { setSliderAttachments, toggleSlider } from 'store/reducer/slider';
import styled from 'styled-components';
import { getImageURL } from 'util/index';
import AudioPlay from './Audioplay';
import VideoPlay from './VideoPlay';

interface Props {
  className?: string;
  mainSliderSettings?: Settings;
  thumbnailsSliderSettings?: Settings;
}

const AttachmentsPreviewModel: React.FC<Props> = (props) => {
  const { className, mainSliderSettings, thumbnailsSliderSettings } = props;
  const dispatch = useAppDispatch();
  const [activeSlide, setActiveSlide] = useState(0);
  const {
    isOpen,
    attachments: { items = [], active = null },
  } = useAppSelector((state) => state?.slider);
  const [nav1, setNav1] = useState<any>(null);
  const [nav2, setNav2] = useState<any>(null);
  const [slider1, setSlider1] = useState<any>(null);
  const [slider2, setSlider2] = useState<any>(null);
  const [URLItems, setURLItems] = useState<any>(items);
  useEffect(() => {
    setNav1(slider1);
    setNav2(slider2);
    return () => {
      setNav1(null);
      setNav2(null);
    };
  }, [slider1, slider2]);

  useEffect(() => {
    const newItems = [...(items || [])].filter((f) => {
      const isImage = attrAccept(f, 'image/*');
      const isVideo = attrAccept(f, 'video/*');
      if (isImage || isVideo) {
        return isVideo ? !!f.thumbnail : !!(f.imageURL || f.url || f.path);
      }
      return true;
    });
    const index = newItems.findIndex((f) => f.path === active?.path);
    // newItems = checkURL(newItems);
    if (index !== -1) {
      setActiveSlide(index);
    } else {
      setActiveSlide(0);
    }
    setURLItems(newItems);
    return () => {};
  }, [active, items]);
  const settingsMain: Settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    // dots: true,
    lazyLoad: 'progressive',

    asNavFor: '.slider-nav' as any,
    infinite: true,
    // adaptiveHeight: true,
    nextArrow: <RightSliderArrow />,
    prevArrow: <LeftSliderArrow />,
    ...mainSliderSettings,
  };

  const settingsThumbs = {
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    // dots: true,
    centerMode: true,
    swipeToSlide: true,
    focusOnSelect: true,
    centerPadding: '10px',
    nextArrow: <RightSliderArrow />,
    prevArrow: <LeftSliderArrow />,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 700,
        settings: {
          arrows: false,
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 500,
        settings: {
          arrows: false,
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 400,
        settings: {
          arrows: false,
          slidesToShow: 1,
        },
      },
    ],
    ...thumbnailsSliderSettings,
  };

  const renderAnchors = () => {
    if (URLItems?.length < 2) {
      return null;
    }
    return URLItems?.map((file: any) => {
      if (file) {
        if (attrAccept(file, 'video/*')) {
          return (
            <Image
              src={file?.thumbnail}
              alt="alt"
              key={file.path || file?.url}
            />
          );
        } else if (attrAccept(file, 'image/*')) {
          const { url } = getImageURL({
            url: file?.path || file?.url,
            settings: {
              onlyMobile: true,
              defaultSize: ImagesSizes['480x220'],

              imgix: { all: 'w=50&h=50' },
            },
          });
          return (
            <Image
              src={url}
              fallbackUrl={file?.path || file?.url}
              alt="alt"
              key={url}
            />
          );
        } else {
          return (
            <div className="slider_item image" key={file?.path || file?.url}>
              <Image
                src="/assets/images/mp3-icon.png"
                alt="alt"
                key={file.path || file?.url}
              />
            </div>
          );
        }
      }
    });
  };

  const renderAttachments = () => {
    return URLItems?.map((file: any, index: number) => {
      if (attrAccept(file, 'video/*')) {
        return (
          <div
            className={`slider_item video ${
              activeSlide === index ? ' active_video' : ''
            }`}
            key={file.path || file?.url}
          >
            <VideoPlay
              playing={activeSlide === index}
              controls={activeSlide === index}
              url={file?.path || file?.url}
              config={{
                file: {
                  attributes: {
                    poster: file?.thumbnail,
                    controlsList: 'nodownload',
                    onContextMenu: (e: any) => e?.preventDefault(),
                  },
                },
              }}
            />
          </div>
        );
      } else if (attrAccept(file, 'image/*')) {
        const { url } = getImageURL({
          url: file?.path || file?.url,
          settings: {
            imgix: { desktop: 'w=900&h=600', mobile: 'w=480&h=220' },
          },
        });
        return (
          <div className="slider_item image" key={file?.path || file?.url}>
            <Image
              src={`${url}`}
              alt="alt"
              key={url}
              fallbackUrl={file?.path || file?.url}
            />
          </div>
        );
      } else {
        return (
          <div className="ctn" key={index}>
            <span className="mp3_icon">
              <img
                className="mp3-placeholder"
                src="/assets/images/mp3-icon.png"
                key={file?.path}
                alt={file?.path}
              />
            </span>
            <div className="slider_item audio" key={file?.path || file?.url}>
              <AudioPlay src={file?.url || file?.path} />
            </div>
          </div>
        );
      }
    });
  };
  const handleClose = () => {
    dispatch(toggleSlider(false));
    dispatch(setSliderAttachments({ items: [], active: null }));
  };

  return (
    <>
      {isOpen ? (
        <Modal
          isOpen={isOpen}
          onClose={handleClose}
          showFooter={false}
          className={`${className}`}
        >
          <div className="slider_container">
            <Slider
              {...settingsMain}
              asNavFor={nav2}
              className="my own class"
              dotsClass="slick-dots-list"
              initialSlide={activeSlide}
              ref={(slider) => setSlider1(slider)}
              draggable
              beforeChange={(current, next) => {
                setActiveSlide(next);

                try {
                  const item = document
                    .querySelector('.slick-active .slider_item.audio')
                    ?.getElementsByTagName('audio')[0];

                  item?.pause();
                } catch (error) {}
              }}
            >
              {renderAttachments()}
            </Slider>
            <div className="slider_thumb">
              <Slider
                {...settingsThumbs}
                asNavFor={nav1}
                draggable
                initialSlide={activeSlide}
                infinite={false}
                ref={(slider) => setSlider2(slider)}
              >
                {renderAnchors()}
              </Slider>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
};

export default styled(AttachmentsPreviewModel)`
  margin: 0 auto;
  max-width: 1000px;
  padding: 0 30px;
  height: 100%;

  @media (max-width: 767px) {
    padding: 0 5px;
    height: auto;
  }

  .modal-content {
    height: 100%;
  }

  .slider_thumb {
    .slick-slide {
      width: 70px;
      padding: 0 5px;
    }
    .slick-track {
      display: flex;
      align-items: center;
      &:after,
      &:before {
        display: none;
      }
    }
  }
  .slick-slide {
    z-index: 0;
    &.slick-active {
      z-index: 1;
    }
  }
  .modal-header {
    padding: 0;
    position: absolute;
    border: none;
    right: 0;
    top: 0;

    .close {
      padding: 0;
      margin: 0;
      z-index: 999;
      position: relative;
      color: #fff;
      width: 30px;

      span {
        opacity: 1;
      }
    }
  }

  .slick-dots {
    position: static;
  }

  .modal-body {
    padding: 0;
    display: table;

    @media (max-width: 767px) {
      overflow: auto;
      padding: 10px 0 0;
      max-height: calc(100vh - 20px);
      display: block;
    }

    .slider_container {
      display: table-cell;
      vertical-align: middle;
      min-width: 0;

      @media (max-width: 767px) {
        display: block;
      }
    }
  }

  .modal-content {
    background: none;
    border: none;
    border-radius: 0;
  }

  .slick-slider {
    padding: 0 30px;
    width: 100%;
    overflow: hidden;
    max-width: 1000px;
    min-width: 0;

    .rhap_container {
      margin: 80px 0;

      @media (max-width: 767px) {
        margin: 60px 0;
      }
    }
  }

  .slider_item {
    img,
    video {
      margin: 0 auto;
      width: 100%;
      height: auto;
      display: block;
      max-height: calc(100vh - 80px);
      object-fit: contain;

      @media (max-width: 767px) {
        max-height: inherit;
      }
    }

    video {
      width: 100%;
      height: 100%;
    }
  }

  .slick-arrow {
    cursor: pointer;

    background: none !important;
    color: #fff;
    width: 20px;
    height: 20px;
    top: calc(50% - 80px);
    transform: translate(0, -50%);

    @media (max-width: 767px) {
      top: calc(50% - 25px);
    }
  }

  .slick-prev {
    left: 0;
  }

  .slick-next {
    right: 0;
  }

  .slick-track {
    max-height: calc(100vh - 60px);

    @media (max-width: 767px) {
      max-height: inherit;
    }
  }

  .slick-dots {
    margin: 0;

    a {
      width: 50px;
      height: 50px;
      display: block;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .ctn {
    .mp3_icon {
      max-width: 160px;
      margin: 0 auto;
      display: block;
      margin-top: 40px;
    }
    .mp3-placeholder {
      width: 100%;
      height: auto;
    }
  }
`;
