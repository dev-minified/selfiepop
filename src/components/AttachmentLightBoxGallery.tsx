import attrAccept from 'attr-accept';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getImageURL, isValidUrl } from 'util/index';
import LightBox from './LightBox';
type Props = {
  media?: any;
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
};
function AttachmentLightBoxGallery({ media, showOptions, className }: Props) {
  const [images, setImages] = useState<any[]>([]);
  useEffect(() => {
    const images: any = [];
    media.forEach((element: MediaType & { fallback?: string }) => {
      const isImage = attrAccept({ type: element.type }, 'image/*');
      if (element && isValidUrl(element.path || element.url) && isImage) {
        // eslint-disable-next-line
        const { size, ...el } = { ...element };
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

        images.push({
          ...el,
          src: url,
          fallback: el.fallback
            ? el.fallback
            : fallbackUrl
            ? fallbackUrl
            : el.path,
          path: url,
          thumb: murl,
        });
      } else {
        // eslint-disable-next-line
        const { size, ...rest } = element;
        images.push({
          ...rest,
          poster: element.thumbnail,
          fallback: element.fallback ? element.fallback : element.path,
          thumb: element.thumbnail,
          src: element.path || element.thumbnail,
          width: '650',
          height: '720',
        });
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setImages((_: any) => [...images]);
  }, [media]);

  return (
    <div id={`chat-gallery`} className={`chat_box_message ${className} `}>
      <div className={`chat-image-area`}>
        <LightBox value={images} showOptions={showOptions} />
      </div>
    </div>
  );
}
export default styled(AttachmentLightBoxGallery)`
  &.chat_box_message {
    height: 100%;
    width: 100%;
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

  .row-img,
  .lg-react-element {
    display: flex;
    flex-wrap: wrap;
    margin: 10px -5px 0;

    .img-holder,
    .gallery-item {
      width: calc(25% - 10px);
      padding-top: calc(25% - 10px);
      margin: 0 5px 10px;
      position: relative;
      overflow: hidden;
      border-radius: 4px;
      height: 100%;
      cursor: pointer;
      display: block;

      @media (max-width: 640px) {
        width: calc(50% - 10px);
        padding-top: calc(50% - 10px);
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

  .video_thumbnail {
    .icon-play {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      z-index: 2;
    }

    svg {
      height: auto;
      width: 100%;

      circle {
        fill: #333;
      }
    }
  }

  .audio_thumbnail {
    .img-audio {
      display: none !important;
    }

    .icon-play {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      z-index: 2;
    }

    svg {
      height: auto;
      width: 100%;

      circle {
        fill: #333;
      }
    }
  }

  .lg-react-element {
    margin: 0;

    .gallery-item {
      border-radius: 0;
      margin: 0 3px 4px;
    }
  }
`;
