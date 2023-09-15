import styled from 'styled-components';
import LightBox from './LightBox/index1';
type Props = {
  maxThumbnailCount?: number;
  media?: IPostMedia[];
  className?: string;
  onImageLoad?: (args: any) => Promise<any>;
};

function AttachmentLightBoxSwiper({
  media = [],
  maxThumbnailCount,
  className,
}: Props) {
  return (
    <div id={'posts-gallery'}>
      <div className={`${className} `}>
        <LightBox value={media as any} maxThumbnailCount={maxThumbnailCount} />
      </div>
    </div>
  );
}

export default styled(AttachmentLightBoxSwiper)`
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

    .video_thumbnail {
      height: 100%;
      position: relative;

      .icon-play {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 80px;
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
      height: 194px;
      background: var(--pallete-background-gray-secondary-light);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;

      .icons-holder {
        position: relative;
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

      .video_thumbnail {
        .icon-play {
          width: 43px;
        }
      }

      .audio_thumbnail {
        height: 100%;
        position: relative;

        .icons-holder {
          width: 53px;
          position: static;
        }

        path {
          fill-opacity: 0.6;
        }

        .icon-play {
          left: auto;
          top: auto;
          transform: none;
          right: 10px;
          bottom: 10px;
          width: 32px;

          svg {
            width: 100%;
            height: auto;
            vertical-align: top;
          }

          path {
            fill-opacity: 1;
          }
        }
      }
    }

    .counter {
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
