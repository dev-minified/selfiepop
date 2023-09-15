import { defaultImagePlaceholder } from 'appconstants';
import { Mp3Icon, PlayIcon, Video } from 'assets/svgs';
import attrAccept from 'attr-accept';
import ImageComp from 'components/Image1';
import Checkbox from 'components/checkbox';
import { LIGHTGALLARYLICENCEKEY } from 'config';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import LightGalleryJS from 'lightgallery';
import { AfterSlideDetail } from 'lightgallery/lg-events';
import { LightGalleryAllSettings } from 'lightgallery/lg-settings';
import { GalleryItem } from 'lightgallery/lg-utils';
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
  thumbfallback?: string;
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
  playIcon?: boolean;
  disabledclass?: string;
  settings?: LightGalleryAllSettings;
  onDestroy?: (...args: any) => void;
  onSelect?: (key: string, isChecked: boolean) => void;
  filekey?: string;
};

const LightBoxItem = styled.div<{ displayele?: boolean }>`
  cursor: pointer;
  ${({ displayele }) => !displayele && `display:none !important`}
`;
// let timeOut: ReturnType<typeof setTimeout>;
const bigPositiveNumber = 10000000000000;
const LightBox: React.FC<LightBoxProps> = ({
  value,
  className,
  maxThumbnailCount = bigPositiveNumber,
  showOptions,
  isInit = true,
  disabledclass,
  settings,
  onDestroy,
  container,
  playIcon = true,
  onSelect,
  filekey,
  ...rest
}) => {
  const galleryId = settings?.galleryId
    ? settings?.galleryId
    : uuid().split('-').join('');
  const lightGallery = useRef<any>(null);
  const [items, setItems] = useState(value);
  const lightGallaryRef = useRef<any>(null);
  const itemRef = useRef<any>(null);
  const containerElement =
    typeof window !== 'undefined'
      ? container
        ? container
        : document.getElementsByTagName('body')?.[0]
      : null;
  useEffect(() => {
    setItems(value);
  }, [value, isInit]);

  const handleError = useCallback(
    (index: number) => {
      const updatedItems = [...items];
      const element = updatedItems[index];
      const isImage = attrAccept(
        { name: element?.name, type: element?.type },
        'image/*',
      );
      if (isImage) {
        element.thumb = element.fallback || defaultImagePlaceholder;
        element.src = element.fallback || '';
      } else {
        element.thumb = element.thumbfallback || defaultImagePlaceholder;
        element.fallback = element.thumbfallback || defaultImagePlaceholder;
      }
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

  const OpenGallery = useCallback(
    (e: any) => {
      e.stopPropagation();
      e.preventDefault();
      const dataSet = e.target?.dataset;
      InitLightGallery(Number(dataSet.item || 0));
    },
    [itemRef, isInit],
  );

  useEffect(() => {
    if (itemRef && isInit) {
      itemRef?.current?.removeEventListener('click', OpenGallery);
      itemRef?.current?.addEventListener('click', OpenGallery);
    }

    return () => {
      itemRef?.current?.removeEventListener('click', OpenGallery);
    };
  }, [itemRef, items, lightGallaryRef, isInit]);
  useEffect(() => {
    return () => {
      destroyGallery();
      onDestroy?.({ onunmount: true });
    };
  }, []);

  // const handleBeforeSlide = (event: any) => {
  //   const { index } = event.detail;
  //   console.log('beofore slide', index, event.detail);
  // };
  // eslint-disable-next-line
  const handleAfterSlide = useCallback((event: any) => {
    rest.onAfterSlide?.(event.detail as AfterSlideDetail);
  }, []);
  // const handleVideoSlide = (event: any) => {
  //   const { index } = event.detail;
  // };
  // eslint-disable-next-line
  const handleAfterOpen = useCallback(() => {
    const slideIndex = lightGallaryRef.current.index;
    rest.onAfterOpen?.({
      isFirstSlide: slideIndex === 0,
      index: slideIndex,
      lightGallery: lightGallaryRef.current,
    });
    // const { index } = event.detail;
  }, []);
  // const handleSlideItemLoaded = (event: any) => {
  //   // const { index } = event.detail;
  //   console.log('slide item content loaded', event);
  // };
  const handleCloseSlide = () => {
    destroyGallery();
    onDestroy?.({ onclose: true });
  };
  function destroyGallery() {
    if (containerElement) {
      containerElement.removeEventListener('lgAfterClose', handleCloseSlide);
      // containerElement.removeEventListener('lgBeforeSlide', handleBeforeSlide);
      containerElement.removeEventListener('lgAfterSlide', handleAfterSlide);
      containerElement.removeEventListener('lgAfterOpen', handleAfterOpen);
      // containerElement.removeEventListener('lgHasVideo ', handleVideoSlide);
      // containerElement.removeEventListener('lgSlideItemLoad ', handleSlideItemLoaded);
    }
    if (lightGallaryRef.current) {
      lightGallaryRef.current.destroy();
      lightGallaryRef.current = null;
    }
  }
  const InitLightGallery = (index = 0) => {
    const itemstoRender = items.map((item, index) => {
      const isAudio = attrAccept(
        { name: item.name, type: item.type },
        'audio/*',
      );
      const isVideo = attrAccept(
        { name: item.name, type: item.type },
        'video/*',
      );

      if (isAudio || isVideo) {
        //  data-video={`{"source": [{"src":"${item.src}", "type":"${item.type}"}], "attributes": {"preload": false, "controls": true}}`}
        return {
          type: 'video',
          video: {
            source: [
              {
                src: item.src,
                type: item.type,
              },
            ],
            // tracks: [],
            attributes: {
              preload: 'none',
              controls: true,
              controlslist: 'nodownload',
              oncontextmenu: 'return false',
              disablePictureInPicture: true,
              playsinline: true,
              id: `current-item-${index}`,
              'data-galleryitemclass': isAudio
                ? 'gallery-audio-item'
                : 'gallery-video-item',
            },
          },
          thumb: item.thumb,

          // subHtml: ``,
          // subHtml: `<div class="lightGallery-captions">
          //         <h4>Photo by <a href="https://unsplash.com/@brookecagle">Brooke Cagle</a></h4>
          //         <p>Description of the slide 2</p>
          //     </div>`,
        };
      }
      return {
        type: item.type,
        id: `current-item-${index}`,
        src: item.src,
        responsive: '',
        thumb: item.thumb,
      };
    });

    if (containerElement) {
      lightGallaryRef.current = LightGalleryJS(containerElement, {
        dynamic: true,

        container: containerElement,
        plugins: [lgZoom, lgVideo],
        download: false,

        licenseKey: LIGHTGALLARYLICENCEKEY,
        // dynamicEl: [
        //   {
        //     src: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
        //     responsive:
        //       'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80 800',
        //     thumb:
        //       'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
        //     subHtml: `<div class="lightGallery-captions">
        //             <h4>Photo by <a href="https://unsplash.com/@brookecagle">Brooke Cagle</a></h4>
        //             <p>Description of the slide 1</p>
        //         </div>`,
        //   },
        //   {
        //     video: {
        //       source: [
        //         {
        //           src: 'https://www.lightgalleryjs.com//videos/video1.mp4',
        //           type: 'video/mp4',
        //         },
        //       ],
        //       attributes: { preload: 'none', controls: true },
        //     },
        //     thumb:
        //       'https://www.lightgalleryjs.com//images/demo/html5-video-poster.jpg',
        //     subHtml: `<div class="lightGallery-captions">
        //             <h4>Photo by <a href="https://unsplash.com/@brookecagle">Brooke Cagle</a></h4>
        //             <p>Description of the slide 2</p>
        //         </div>`,
        //   },
        //   {
        //     src: 'https://images.unsplash.com/photo-1477322524744-0eece9e79640?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
        //     responsive:
        //       'https://images.unsplash.com/photo-1477322524744-0eece9e79640?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=480&q=80 480, https://images.unsplash.com/photo-1477322524744-0eece9e79640?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80 800',
        //     thumb:
        //       'https://images.unsplash.com/photo-1477322524744-0eece9e79640?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
        //   },
        //   {
        //     src: '//www.youtube.com/watch?v=egyIeygdS_E',
        //     poster: 'https://img.youtube.com/vi/egyIeygdS_E/maxresdefault.jpg',
        //     thumb: 'https://img.youtube.com/vi/egyIeygdS_E/maxresdefault.jpg',
        //   },
        // ],
        dynamicEl: itemstoRender as GalleryItem[],
        autoplayVideoOnSlide: true,

        mobileSettings: {
          showCloseIcon: true,
          closeOnTap: false,
          controls: true,
        },
        ...rest,
        ...settings,
        addClass: `gallery_${galleryId}-chat ${settings?.addClass || ''}`,
        galleryId: `gallery_${galleryId}-chat`,
      });

      // lightGallaryRef.current.init();
    }
    if (lightGallaryRef?.current && containerElement) {
      // lightGallaryRef.current.init();
      lightGallaryRef.current.openGallery(index, containerElement);
      // containerElement.addEventListener('lgBeforeSlide', handleBeforeSlide);
      containerElement.addEventListener('lgAfterSlide', handleAfterSlide);
      containerElement.addEventListener('lgAfterClose', handleCloseSlide);
      containerElement.addEventListener('lgAfterOpen', handleAfterOpen);
      // containerElement.addEventListener('lgHasVideo ', handleVideoSlide);
      // containerElement.addEventListener('lgSlideItemLoad  ', handleSlideItemLoaded);
    }

    // dynamicGallery.openGallery(0);
  };

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
          <div className="image-comp" key={item._id || item.id}>
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onSelect?.(
                    item?.[filekey as keyof typeof item] as string,
                    e.target.checked,
                  )
                }
              />
            )}
            {isVideo && playIcon ? (
              <div
                data-item={index}
                className={`video_thumbnail ${
                  index === 0 ? 'thumbnail-img' : ''
                }`}
              >
                <div className="icon-play" data-item={index}>
                  <PlayIcon data-item={index} />
                </div>
                <ImageComp
                  data-item={index}
                  className={`img-responsive `}
                  src={item.thumb}
                  alt={item.name}
                  onError={() => handleError(index)}
                />
                {showOptions?.video && (
                  <span className="video-length" data-item={index}>
                    <Video data-item={index} /> {item?.videoDuration}
                  </span>
                )}
              </div>
            ) : isAudio ? (
              <div
                className={`audio_thumbnail ${
                  index === 0 ? 'thumbnail-img' : ''
                }`}
                data-item={index}
              >
                <div className="icons-holder" data-item={index}>
                  <span className="icon-play" data-item={index}>
                    <PlayIcon data-item={index} />
                  </span>
                  <span className="img-audio" data-item={index}>
                    <Mp3Icon data-item={index} />
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
                data-item={index}
                fallbackUrl={item.fallback}
                onError={() => handleError(index)}
                onSocketRecieve={({ src }) => {
                  setImagesOnSocket(index, src);
                }}
              />
            )}

            {maxThumCount - 1 === index && (
              <span className="counter" data-item={index}>
                +{items.length - 1 - index}
              </span>
            )}
          </div>
        ) : null;

      const itemDisplay = maxThumCount > index ? true : false;
      if (attrAccept({ name: item.name, type: item.type }, 'image/*')) {
        return (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <LightBoxItem
            key={item.id || item?._id}
            // data-lg-size={item.size}
            className="gallery-item"
            // data-src={item.src}
            displayele={itemDisplay}
            data-index={index}
            id={`sp-item-${index}`}
          >
            {thumElment}
          </LightBoxItem>
        );
      } else {
        return (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <LightBoxItem
            id={`sp-item-${index}`}
            key={item.id || item?._id}
            data-index={index}
            // data-lg-size={item.size}
            className={`gallery-item`}
            displayele={itemDisplay}
            // data-video={`{"source": [{"src":"${item.src}", "type":"${item.type}"}], "attributes": {"preload": false, "controls": true}}`}
          >
            {thumElment}
          </LightBoxItem>
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, maxThumbnailCount, handleError, lightGallaryRef, isInit]);

  return (
    <div className={`${className} lightbox-gallary`}>
      <div className={`${disabledclass} disablegallery`} ref={itemRef}>
        {getItems()}
      </div>
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
