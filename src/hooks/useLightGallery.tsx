import attrAccept from 'attr-accept';
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
import React, { useCallback, useEffect, useRef } from 'react';
import { getChangeUrlsOnly, getImageURL, isValidUrl } from 'util/index';
import { v4 as uuid } from 'uuid';
import '../components/LightBox/index.css';
dayjs.extend(isYesterday);
dayjs.extend(isToday);
type Item = {
  id: string;
  _id?: string;
  size?: string;
  type?: string;
  fileType?: string;
  src: string;
  thumb: string;
  path?: string;
  thumbnail?: string;
  subHtml?: string;
  poster?: string;
  fallback?: string;
  name?: string;
  ogFileName?: string;
  createdAt?: string;
  checked?: boolean;
  videoDuration?: number | string;
  nosize?: boolean;
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

  className?: string;
  isInit?: boolean;

  settings?: LightGalleryAllSettings;
  index: number;
  ImageSizesProps?: ImageSizesProps['settings'];
  onDestroy?: (...args: any) => void;
};

const updatedImages = (media: Item, imageSizes: Record<string, any>) => {
  const element = {
    ...media,
    type: media.type,
    name: media.name,
    src: media.src || media.path || media,
    thumb: media.thumb || media.thumbnail,
    thumbnail: media.thumb || media.thumbnail,
  };
  // media.forEach((element: any, idx: number) => {

  const isAudio = attrAccept({ type: element.type }, 'audio/*');
  if (
    element &&
    isValidUrl(element.path) &&
    attrAccept({ type: element.type }, 'image/*')
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { size = 34311243, ...el } = { ...element };

    if (element?.nosize) {
      const { url: urlChange } = getChangeUrlsOnly(element.path);
      return {
        ...el,
        src: urlChange,

        path: urlChange,
        thumb: urlChange,
      };
    }
    const desktopSettings = {
      defaultUrl: el.path,

      ...imageSizes,
    };
    // const { url: durl, fallbackUrl: dfallback } = getImageURL({
    const { url: durl } = getImageURL({
      url: el.path,
      settings: desktopSettings,
    });

    return {
      ...el,
      src: durl,

      path: durl,
      thumb: durl,
    };
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { size, ...rest } = element;
    const type = attrAccept({ type: element.type }, 'video/*')
      ? 'video/mp4'
      : element.type;
    let src = element.path;
    let fallback = element.path;
    if (isAudio) {
      const { url, fallbackUrl } = getChangeUrlsOnly(element.path);
      src = url;
      fallback = fallbackUrl;
    }
    return {
      ...rest,
      poster: isAudio ? '/assets/images/mp3-icon.png' : element.thumbnail,
      fallback: fallback,
      thumb: isAudio ? '/assets/images/mp3-icon.png' : element.thumbnail,
      src: src,
      width: '650',
      height: '720',
      type,
    };
  }
};
const useOpenGallery = () => {
  const lightGallaryRef = useRef<any>(null);
  let containerElement: any;

  const onOpenGallery = useCallback((galleryProps: LightBoxProps) => {
    InitLightGallery(galleryProps);
  }, []);

  useEffect(() => {
    return () => {
      destroyGallery();
    };
  }, []);

  // const handleBeforeSlide = (event: any) => {
  //   const { index } = event.detail;
  //   console.log('beofore slide', index, event.detail);
  // };
  // eslint-disable-next-line
  const handleAfterSlide = useCallback((event: any, rest?: any) => {
    rest?.onAfterSlide?.(event.detail as AfterSlideDetail);
  }, []);
  // const handleVideoSlide = (event: any) => {
  //   const { index } = event.detail;
  // };
  // eslint-disable-next-line
  const handleAfterOpen = useCallback((rest?: any) => {
    const slideIndex = lightGallaryRef.current?.index;
    rest?.onAfterOpen?.({
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
  const InitLightGallery = (galleryProps: LightBoxProps) => {
    const {
      index = 0,
      settings,
      value: items = [],
      container,
      ImageSizesProps = undefined,
      ...rest
    } = galleryProps;
    containerElement =
      typeof window !== 'undefined'
        ? container
          ? container
          : document.getElementsByTagName('body')?.[0]
        : null;
    const galleryId = settings?.galleryId
      ? settings?.galleryId
      : uuid().split('-').join('');
    const itemstoRender = items?.map((itemm, index) => {
      let item: any = itemm;
      if (ImageSizesProps) {
        item = updatedImages(itemm, ImageSizesProps);
      }
      const isAudio = attrAccept(
        {
          name: item.name || item.ogFileName,
          type: item.type || item.fileType,
        },
        'audio/*',
      );
      const isVideo = attrAccept(
        {
          name: item.name || item.ogFileName,
          type: item.type || item?.fileType,
        },
        'video/*',
      );

      if (isAudio || isVideo) {
        //  data-video={`{"source": [{"src":"${item.src}", "type":"${item.type}"}], "attributes": {"preload": false, "controls": true}}`}
        return {
          type: 'video',
          video: {
            source: [
              {
                src: item.src || item?.path,
                type: item.type || item?.fileType,
              },
            ],
            // tracks: [],
            attributes: {
              preload: 'none',
              controls: true,
              playsinline: true,
              disablePictureInPicture: true,
              id: `current-item-${index}`,
              'data-galleryitemclass': isAudio
                ? 'gallery-audio-item'
                : 'gallery-video-item',
            },
          },
          thumb: item.thumb || item?.thumbnail,

          subHtml: ``,
          // subHtml: `<div class="lightGallery-captions">
          //         <h4>Photo by <a href="https://unsplash.com/@brookecagle">Brooke Cagle</a></h4>
          //         <p>Description of the slide 2</p>
          //     </div>`,
        };
      }

      return {
        type: item.type,
        id: `current-item-${index}`,
        src: item.src || item.path,
        responsive: '',
        thumb: item.thumb || item.thumbnail,
      };
    });

    if (containerElement) {
      lightGallaryRef.current = LightGalleryJS(containerElement, {
        dynamic: true,

        container: containerElement,
        plugins: [lgZoom, lgVideo],
        download: false,
        mobileSettings: {
          controls: true,
        },

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

        ...rest,
        ...settings,
        addClass: `gallery_${galleryId} ${settings?.addClass || ''}`,
        galleryId: `gallery_${galleryId}`,
      });

      // lightGallaryRef.current.init();
    }
    if (lightGallaryRef?.current && containerElement) {
      // lightGallaryRef.current.init();
      lightGallaryRef.current.openGallery(index, containerElement);
      // containerElement.addEventListener('lgBeforeSlide', handleBeforeSlide);
      containerElement.addEventListener('lgAfterSlide', (e: any) =>
        handleAfterSlide(e, rest),
      );
      containerElement.addEventListener('lgAfterClose', handleCloseSlide);
      containerElement.addEventListener('lgAfterOpen', () =>
        handleAfterOpen(rest),
      );
      // containerElement.addEventListener('lgHasVideo ', handleVideoSlide);
      // containerElement.addEventListener('lgSlideItemLoad  ', handleSlideItemLoaded);
    }

    // dynamicGallery.openGallery(0);
  };

  return { onOpenGallery };
};

export default useOpenGallery;
