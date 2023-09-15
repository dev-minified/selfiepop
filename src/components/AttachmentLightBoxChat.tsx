import { defaultImagePlaceholder } from 'appconstants';
import attrAccept from 'attr-accept';
import { useMemo } from 'react';
import styled from 'styled-components';

import { getChangeUrlsOnly, getImageURL, isValidUrl } from 'util/index';
import LightBox from './LightBox/index1';

type Props = {
  urls?: any;

  isPaymentComplete?: boolean;
  className?: string;
};
function AttachmentLightBoxChat({
  urls,
  className,
  isPaymentComplete = true,
}: Props) {
  const images: any = useMemo(() => {
    const images: any = [];

    urls.forEach((element: MediaType & { fallback?: string }) => {
      const isImage = attrAccept(
        { type: element.type, name: element.name },
        'image/*',
      );
      const isAudio = attrAccept({ type: element.type }, 'audio/*');
      if (
        element &&
        isValidUrl(element.path || element.url || element.fallback) &&
        isImage
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { size, ...el } = { ...element };
        // if (dayjs().diff(el.createdAt, 'seconds') > 14) {
        const { url, fallbackUrl } = getImageURL({
          url: el.path || el.url || el.thumbnail || '',
          settings: {
            defaultUrl: el.path || el.url || el.thumbnail,
            onlyDesktop: true,
            imgix: {
              all: 'fit=clip&h=900',
            },
          },
        });
        const { url: murl } = getImageURL({
          url: el.path || el.url || el.thumbnail || '',

          settings: {
            defaultUrl: el.path || el.url || el.thumbnail,
            onlyMobile: true,
            imgix: {
              all: 'h=300&w=300',
            },
          },
        });
        let murll = murl;
        if (!isPaymentComplete && element.updatedAt) {
          murll = murl + '?updatedAt=' + element.updatedAt;
        }
        images.push({
          ...el,
          src: url,
          poster: url,
          fallback: el.fallback
            ? el.fallback
            : fallbackUrl
            ? fallbackUrl
            : el.path || el.url,
          path: url,
          thumb: murll,
        });
      } else {
        let murll = element.thumbnail;
        if (!isPaymentComplete && element.updatedAt) {
          murll = element.thumbnail + '?updatedAt=' + element.updatedAt;
        }
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
          poster: element.thumbnail,
          fallback: fallback,
          thumb: murll,
          thumbfallback: defaultImagePlaceholder,
          src: src,
          type,
        });
      }
    });
    return images;
  }, [urls, isPaymentComplete]);
  return (
    <div id={`chat-gallery`} className={`chat_box_message ${className} `}>
      <div className={`chat-image-area`}>
        {!!images?.length ? (
          <LightBox
            playIcon={images?.length <= 1}
            value={images}
            maxThumbnailCount={1}
            isInit={isPaymentComplete}
          />
        ) : null}
      </div>
    </div>
  );
}
export default styled(AttachmentLightBoxChat)`
  &.chat_box_message {
    height: 100%;
  }
  .images-length {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
  }
  .image-counter {
    position: absolute;
    inset: 0;
    background: rgba(81, 83, 101, 0.75);
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: 600;
    font-size: 30px;
    cursor: pointer;
    z-index: 2;
    transition: all 0.4s ease;
    &:hover {
      background: rgba(8, 62, 103, 0.8);
    }
  }
  .main-img {
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    margin: 0 0 10px;
    cursor: pointer;
    max-height: 347px;
    @media (max-width: 640px) {
      max-height: 220px;
    }
    img {
      width: 100%;
      object-fit: cover;
      max-height: 100%;
      height: auto;
      vertical-align: top;
    }
  }
  .row-img {
    display: flex;
    margin: 10px -5px 0;

    .img-holder {
      width: calc(25% - 10px);
      padding-top: calc(25% - 10px);
      margin: 0 5px;
      position: relative;
      overflow: hidden;
      border-radius: 4px;
      height: 100%;
      cursor: pointer;
      @media (max-width: 640px) {
        /* padding-top: 0; */
      }
      .image-comp {
        position: static;
      }
    }
    img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .image-counter {
      position: absolute;
      inset: 0;
      background: rgba(81, 83, 101, 0.75);
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-weight: 600;
      font-size: 30px;
      cursor: pointer;
      z-index: 2;
      transition: all 0.4s ease;
      &:hover {
        background: rgba(8, 62, 103, 0.8);
      }
    }
    .image-wapper {
      position: relative;
    }
    .video_icon {
      width: 36px;
      height: 36px;
      background: rgba(0, 0, 0, 0.6);
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border-radius: 100%;
      transition: all 0.4s ease;
      cursor: pointer;
      &:hover {
        background: rgba(0, 0, 0, 0.9);
      }
      &:after {
        position: absolute;
        left: 50%;
        top: 50%;
        content: '';
        border-style: solid;
        border-width: 8px 0 8px 12px;
        border-color: transparent transparent transparent #fff;
        transform: translate(-50%, -50%);
        margin: 0 -2px 0 2px;
      }
    }
  }
`;
