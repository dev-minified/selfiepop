import attrAccept from 'attr-accept';
import AudioPlay from 'components/Audioplay';
import Image from 'components/Image';
import lgVideo from 'lightgallery/plugins/video';
import lgZoom from 'lightgallery/plugins/zoom';
import LightGallery from 'lightgallery/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { getImageURL, isValidUrl } from 'util/index';
import VideoPlay from './VideoPlay';
type Props = {
  item?: any;
  randerBannerItem?: boolean;
  media?: IPostMedia[];
  className?: string;
  spliceItemstart?: number;
};

function AttachmentLightBoxPost({
  media = [],

  randerBannerItem,
  className,
  spliceItemstart = 1,
}: Props) {
  const lightGallery = useRef<any>(null);
  const [images, setImages] = useState<any>([]);

  useEffect(() => {
    const images: any = [];

    media.forEach((element) => {
      if (
        element &&
        isValidUrl(element.path || element.url) &&
        attrAccept({ type: element.type }, 'image/*')
      ) {
        const el = { ...element };
        const { url, fallbackUrl } = getImageURL({
          url: el.path || el.url || '',

          settings: {
            defaultUrl: el.path,
            onlyDesktop: true,
            imgix: {
              all: 'fit=clip&h=900',
            },
          },
        });
        const { url: murl } = getImageURL({
          url: el.path || el.url || '',

          settings: {
            defaultUrl: el.path,
            onlyMobile: true,
            imgix: {
              all: 'fit=clip&h=900',
            },
          },
        });

        images.push({
          ...el,
          src: url,
          fallback: fallbackUrl ? fallbackUrl : element.path,
          path: url,
          thumb: murl,
        });
      } else {
        images.push({
          ...element,
          fallback: element.path,
          thumb: element.thumbnail,
          src: element.path,
          width: '650',
          height: '720',
        });
      }
    });
    setImages(() => [...images]);
  }, [media]);

  const onInit = useCallback((detail: any) => {
    if (detail) {
      lightGallery.current = detail.instance;
    }
  }, []);

  useEffect(() => {
    lightGallery.current.refresh();
  }, [images]);

  const first: any = images?.[0];
  const isvideo = attrAccept({ type: first?.type }, 'video/*');
  const isaudio = attrAccept({ type: first?.type }, 'audio/*');

  return (
    <div id={'posts-gallery'}>
      <div className={`${className} `} key={images?.[0]?.url || 'item_1'}>
        <LightGallery
          plugins={[lgVideo, lgZoom]}
          elementClassNames="custom-class-name"
          onInit={onInit}
          videojs
        >
          {randerBannerItem && !!images?.length && (
            <a
              key={first.id}
              className="gallery-item"
              data-src={first.src}
              {...(isvideo ? { 'data-video': first.src } : {})}
            >
              {first && isvideo ? (
                <VideoPlay url={first.path} />
              ) : isaudio ? (
                <AudioPlay
                  className="audio_0"
                  src={first.url}
                  muted={true}
                  onClick={() => {
                    const att = document
                      .querySelector('.audio_0')
                      ?.getElementsByTagName('audio');
                    if (att) {
                      att[0].pause();
                    }
                  }}
                  onPlay={() => {
                    const att = document
                      .querySelector('.audio_0')
                      ?.getElementsByTagName('audio');
                    if (att) {
                      att[0].pause();
                    }
                  }}
                />
              ) : (
                first && (
                  <span>
                    <Image
                      onImageLoad={async (e) => {
                        if (e.error) {
                          const updatedImages = [...images];
                          const image = updatedImages[0];
                          image.thumb = image.fallbackUrl;
                          image.src = image.fallbackUrl;
                          updatedImages[0] = image;
                          setImages([...updatedImages]);
                        }
                      }}
                      src={first.src}
                      data-id={first.id}
                      // ref={ref as any}
                      // onClick={open}
                      fallbackUrl={first.fallback}
                    />
                  </span>
                )
              )}
            </a>
          )}
          {(images || [])
            .slice(spliceItemstart)
            .map((items: any, index: number) => {
              const count = randerBannerItem ? index + 1 : index;
              const ImageUrl = items.murl;

              const isVideo = attrAccept({ type: items.type }, 'video/*');

              const isHidden = index > 3;

              return (
                <a
                  {...(isVideo
                    ? { 'data-video': items.src }
                    : { 'data-src': items.src })}
                  className={`img-holder gallery-item ${
                    isVideo ? 'video-thumb' : ''
                  }`}
                  key={items.murl}
                  style={{
                    opacity: isHidden ? 0 : 1,
                    display: isHidden ? 'none' : 'block',
                  }}
                >
                  {attrAccept(items, 'video/*') ? (
                    <Image
                      src={items?.thumbnail}
                      alt="alt"
                      key={items.path || items?.url}
                    />
                  ) : attrAccept(items, 'image/*') ? (
                    <Image
                      src={ImageUrl}
                      onImageLoad={async (e) => {
                        if (e.error) {
                          const updatedImages = [...images];
                          const image = updatedImages[count];
                          image.thumb = image.fallbackUrl;
                          image.src = image.fallbackUrl;
                          updatedImages[count] = image;
                          setImages([...updatedImages]);
                        }
                      }}
                      key={items?.path}
                      fallbackUrl={items?.fallback}
                    />
                  ) : (
                    <div
                      className="slider_item image"
                      key={items?.path || items?.url}
                    >
                      <span className="mp3_icon">
                        <img
                          alt="Mp 3 icon"
                          src="/assets/images/mp3-icon.png"
                          key={items?.path}
                        />
                      </span>
                    </div>
                  )}
                  {index >= 3 && media[index + 2] && (
                    <span
                      key={media[index + 2]?.path}
                      className="image-counter"
                    >{`+${media.length - 4}`}</span>
                  )}
                </a>
              );
            })}
        </LightGallery>
      </div>
    </div>
  );
}

export default styled(AttachmentLightBoxPost)`
  .lg-react-element {
    margin: 0 -5px;
    font-size: 0;
    line-height: 0;

    > * {
      font-size: 16px;
      line-height: 20px;
    }
  }

  .gallery-item {
    display: block;
    width: calc(100% - 10px);
    margin: 0 5px;
    position: relative;
    overflow: hidden;
    border-radius: 6px;

    img {
      width: 100%;
      height: auto;
      display: block;
    }

    &:not(:first-child) {
      display: inline-block;
      vertical-align: top;
      margin: 10px 5px 0;
      width: calc(25% - 10px);
      padding-top: calc(25% - 10px);
      position: relative;
      overflow: hidden;
      border-radius: 4px;
      height: 100%;
      cursor: pointer;

      .image-comp {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }

      img {
        height: 100%;
        object-fit: cover;
      }
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
  }

  .main-img {
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    margin: 0 0 10px;
    cursor: pointer;
    /* max-height: 347px;
    @media (max-width: 640px) {
      max-height: 220px;
    } */
    img {
      width: 100%;
      /* object-fit: cover; */
      /* max-height: 100%; */
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
  .pswp__button--zoom {
    display: none;
  }
`;
