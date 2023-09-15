import { Mp3Icon, PlayIcon, Video } from 'assets/svgs';
import attrAccept from 'attr-accept';
import Checkbox from 'components/checkbox';
import ImageComp from 'components/Image';
import { LIGHTGALLARYLICENCEKEY } from 'config';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import lgVideo from 'lightgallery/plugins/video';
import lgZoom from 'lightgallery/plugins/zoom';
import LightGallery from 'lightgallery/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { isValidUrl } from 'util/index';
import { v4 as uuid } from 'uuid';
import './index.css';

dayjs.extend(isYesterday);
dayjs.extend(isToday);
type Item = {
  id: string;
  _id?: string;
  size?: string;
  type?: string;
  src: string;
  thumb: string;
  subHtml?: string;
  poster?: string;
  fallback?: string;
  name?: string;
  createdAt?: string;
  checked?: boolean;
  videoDuration?: number | string;
};
type LightBoxProps = React.ComponentProps<typeof LightGallery> & {
  value: Item[];
  showOptions?: {
    video?: boolean;
    play?: boolean;
    timeStampText?: boolean;
    edit?: boolean;
    closeIcon?: boolean;
    selectable?: boolean;
    showprogress?: boolean;
  };
  maxThumbnailCount?: number;
  className?: string;
  isInit?: boolean;
  disabledclass?: string;
  playIcon?: boolean;
};

const LightBoxItem = styled.a<{ displayele?: boolean }>`
  ${({ displayele }) => !displayele && `display:none !important`}
`;
let timeOut: ReturnType<typeof setTimeout>;
const bigPositiveNumber = 10000000000000;
const LightBox: React.FC<LightBoxProps> = ({
  value,
  className,
  maxThumbnailCount = bigPositiveNumber,
  showOptions,
  isInit = true,
  disabledclass,
  playIcon = true,
  ...rest
}) => {
  const galleryId = uuid().split('-').join('');
  const lightGallery = useRef<any>(null);
  const [items, setItems] = useState(value);

  useEffect(() => {
    setItems(value);
  }, [value, isInit]);

  const onInit = useCallback(
    (detail: any) => {
      if (detail && isInit) {
        lightGallery.current = detail.instance;
      }
    },
    [isInit],
  );

  const handleError = useCallback(
    (index: number) => {
      const updatedItems = [...items];
      const element = updatedItems[index];
      element.thumb = element.fallback || '';
      element.src = element.fallback || '';
      updatedItems[index] = element;
      setItems([...updatedItems]);
      lightGallery.current && lightGallery.current.refresh();
    },
    [items],
  );
  const setImagesOnSocket = useCallback(
    (index: number, src: string) => {
      const updatedItems = [...items];
      const element = updatedItems[index];
      element.thumb = src || '';
      if (isValidUrl(element.src)) {
        const elementsrc = `${
          element.src.split('?')[0]
        }?${new Date().getTime()}`;
        element.src = elementsrc;
      }
      updatedItems[index] = element;
      setItems([...updatedItems]);
      lightGallery.current && lightGallery.current.refresh();
    },
    [items],
  );
  const getItems = useCallback(() => {
    return items.map((item, index) => {
      const isAudio = attrAccept(
        { name: item.name, type: item.type },
        'audio/*',
      );
      const isVideo = attrAccept(
        { name: item.name, type: item.type },
        'video/*',
      );
      const maxThumCount =
        maxThumbnailCount !== items.length
          ? maxThumbnailCount
          : bigPositiveNumber;
      const thumElment =
        maxThumCount > index ? (
          <div className="image-comp">
            {showOptions?.timeStampText && (
              <span className="timestamp">
                {dayjs(item?.createdAt).isYesterday()
                  ? 'Yesterday'
                  : dayjs(item?.createdAt).isToday()
                  ? 'Today'
                  : dayjs(item?.createdAt).format('MM/DD/YYYY')}
              </span>
            )}
            {showOptions?.selectable && (
              <Checkbox
                checked={item?.checked}
                // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                //   onSelect?.(
                //     media?.[filekey as keyof typeof media] as string,
                //     e.target.checked,
                //   )
                // }
              />
            )}
            {isVideo && playIcon ? (
              <div
                className={`video_thumbnail ${
                  index === 0 ? 'thumbnail-img' : ''
                }`}
              >
                <div className="icon-play">
                  <PlayIcon />
                </div>

                <ImageComp
                  className="img-responsive"
                  src={item.thumb}
                  alt={item.name}
                  fallbackUrl={item.fallback}
                  onError={() => handleError(index)}
                />
                {showOptions?.video && (
                  <span className="video-length">
                    <Video /> {item?.videoDuration}
                  </span>
                )}
              </div>
            ) : isAudio ? (
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
            ) : (
              <ImageComp
                className={`img-responsive ${
                  index === 0 ? 'thumbnail-img' : ''
                }`}
                src={item.thumb}
                alt={item.name}
                fallbackUrl={item.fallback}
                onError={() => handleError(index)}
                onSocketRecieve={({ src }) => {
                  setImagesOnSocket(index, src);
                }}
              />
            )}

            {maxThumCount - 1 === index && (
              <span
                key={`${item?.id || item?._id}-${index}`}
                className="counter"
              >
                +{items.length - 1 - index}
              </span>
            )}
          </div>
        ) : null;
      const key = item.id || item?._id || index;
      const itemDisplay = maxThumCount > index ? true : false;
      if (attrAccept({ name: item.name, type: item.type }, 'image/*')) {
        return (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <LightBoxItem
            key={key}
            data-lg-size={item.size}
            className="gallery-item"
            data-src={item.src}
            displayele={itemDisplay}
          >
            {thumElment}
          </LightBoxItem>
        );
      } else {
        return (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <LightBoxItem
            key={key}
            data-lg-size={item.size}
            className={`gallery-item`}
            displayele={itemDisplay}
            data-video={`{"source": [{"src":"${item.src}", "type":"${item.type}"}], "attributes": {"preload": false, "controls": true}}`}
          >
            {thumElment}
          </LightBoxItem>
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, maxThumbnailCount, handleError]);

  useEffect(() => {
    if (isInit) {
      lightGallery?.current?.refresh();
      // lightGallery.current.on;
    }
  }, [items, isInit]);

  return (
    <div className={`${className} lightbox-gallary`}>
      {isInit ? (
        <LightGallery
          plugins={[lgVideo, lgZoom]}
          elementClassNames={`custom-class-name`}
          onInit={onInit}
          showZoomInOutIcons={false}
          mobileSettings={{
            showCloseIcon: true,
          }}
          download={false}
          autoplayVideoOnSlide={true}
          licenseKey={LIGHTGALLARYLICENCEKEY}
          addClass={`gallery_${galleryId}`}
          onAfterSlide={(details) => {
            clearTimeout(timeOut);
            timeOut = setTimeout(() => {
              if (details.index !== details.prevIndex) {
                const prevdoc = document.getElementsByClassName(
                  `gallery_${galleryId}`,
                )[0];
                if (prevdoc) {
                  const vid = prevdoc.querySelectorAll(`.lg-video-cont`);
                  if (!!vid?.length) {
                    vid.forEach((v) => {
                      const videl = v?.getElementsByTagName('video')[0];
                      const videle = v
                        ?.getElementsByTagName('video')[0]
                        ?.getElementsByTagName('source')[0];
                      if (
                        videle &&
                        attrAccept({ type: videle?.type }, 'audio/*') &&
                        !v?.classList.contains('audioel')
                      ) {
                        v?.classList.add('audioel');
                      }
                      if (videl) {
                        videl?.pause();
                      }
                    });
                  }
                }
              }
            }, 200);
          }}
          {...rest}
        >
          {getItems()}
        </LightGallery>
      ) : (
        <div className={`${disabledclass} disablegallery`}>{getItems()}</div>
      )}
    </div>
  );
};

export default styled(LightBox)`
  .disablegallery {
    height: 100%;
  }

  .image-comp {
    position: relative;

    .icon-play {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
      width: 43px;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }

      .play {
        circle {
          fill: #000;
        }
      }
    }
  }
`;
