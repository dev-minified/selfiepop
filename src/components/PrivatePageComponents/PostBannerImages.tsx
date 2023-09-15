import { defaultImagePlaceholder } from 'appconstants';
import attrAccept from 'attr-accept';
import AttachmentLightBoxSwiper from 'components/AttachmentLightBoxSwiper';

import React, { useMemo } from 'react';
import { isDesktop, isMobileOnly } from 'react-device-detect';
import 'react-h5-audio-player/lib/styles.css';
import styled from 'styled-components';
import { getChangeUrlsOnly, getImageURL, isValidUrl } from 'util/index';
import MobileSwiper from './MobileSwiper';

interface ImagesHolderProps {
  className?: string;
  media?: IPostMedia[];
}

const ImagesHolder: React.FunctionComponent<ImagesHolderProps> = ({
  className,
  media = [],
}) => {
  const images: any = useMemo(() => {
    const images: any = [];

    // media.forEach((element: any, idx: number) => {
    media.forEach((element: any, idx: number) => {
      const isAudio = attrAccept({ type: element.type }, 'audio/*');
      if (
        element &&
        isValidUrl(element.path || element.url) &&
        attrAccept({ type: element.type }, 'image/*')
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { size = 34311243, ...el } = { ...element };
        const desktopSettings = {
          defaultUrl: el.path,
          onlyDesktop: true,
          imgix: {
            all: 'fit=clip&h=900',
          },
        };
        // const { url: durl, fallbackUrl: dfallback } = getImageURL({
        const { url: durl } = getImageURL({
          url: el.path || el.url || '',
          settings: desktopSettings,
        });

        const mobileSettings: any = {
          defaultUrl: el.path,

          imgix: {
            all: 'h=500&w=500',
          },
        };
        if (idx === 0 || isMobileOnly) {
          mobileSettings.onlyMobile = true;
        } else {
          mobileSettings.onlysMobile = true;
        }
        const { url, fallbackUrl } = getImageURL({
          url: el.path || el.url || '',
          settings: mobileSettings,
        });

        images.push({
          ...el,
          src: durl,
          fallback: fallbackUrl ? fallbackUrl : el.path ? el.path : el.url,
          path: url,
          thumb: url,
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { size, ...rest } = element;
        const type = attrAccept({ type: element.type }, 'video/*')
          ? 'video/mp4'
          : element.type;
        let src = element.url || element.path;
        let fallback = element.url || element.path;
        if (isAudio) {
          const { url, fallbackUrl } = getChangeUrlsOnly(
            element.path || element.url,
          );
          src = url;
          fallback = fallbackUrl;
        }
        images.push({
          width: '650',
          height: '200',
          ...rest,
          poster: isAudio ? '/assets/images/mp3-icon.png' : element.thumbnail,
          fallback: fallback,
          thumb: isAudio ? '/assets/images/mp3-icon.png' : element.thumbnail,
          thumbfallback: isAudio
            ? '/assets/images/mp3-icon.png'
            : defaultImagePlaceholder,
          src: src,
          type,
        });
      }
    });
    return images || [];
  }, [media]);

  return (
    <div className={className}>
      {images?.length && isDesktop ? (
        <AttachmentLightBoxSwiper media={images} maxThumbnailCount={5} />
      ) : (
        <MobileSwiper items={images} />
      )}
    </div>
  );
};

export default styled(ImagesHolder)`
  .slick-slide {
    min-height: 150px;
  }

  .slide-holder {
    > div {
      padding-top: 100%;
      position: relative;
    }

    img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .slick-dots {
    display: flex;
    position: static;
    margin-top: 15px;

    button {
      &:hover {
        background: var(--pallete-primary-main);
      }
    }
  }
`;
