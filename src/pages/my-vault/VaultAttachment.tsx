import { defaultImage as dfltImage } from 'appconstants';
import { ImageIcon, Mp3Icon, Play, PlayIcon, Video } from 'assets/svgs';
import attrAccept from 'attr-accept';
import Image from 'components/Image';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { ReactElement, forwardRef } from 'react';
import styled from 'styled-components';

import { getImageURL, isValidUrl } from 'util/index';

dayjs.extend(isYesterday);
dayjs.extend(localizedFormat);
dayjs.extend(isToday);
const ImageComp = styled.div<{ rotation?: number | string }>`
  width: 100%;
  height: 100%;

  ${({ rotation }) => {
    if (rotation !== '' && rotation !== undefined) {
      return ` img {

        transform: rotate(${rotation}deg)
      }
       `;
    }
  }}
`;
interface Props {
  className?: string;
  isGalleryChecked?: boolean;
  defaultImage?: string;
  media?: MediaType & {
    checked?: boolean;
    progress?: number;
    status?: string;
    rotate?: number | string;
  };
  filekey?: string;
  createdAt?: string;
  dragHandle?: boolean;
  checked?: boolean;
  onClick?: (
    media?: MediaType & { checked?: boolean; rotate?: string | number },
  ) => void;

  showOptions?: {
    video?: boolean;
    play?: boolean;
    timeStampText?: boolean;
    edit?: boolean;
    closeIcon?: boolean;
    selectable?: boolean;
    showprogress?: boolean;
    mutipleSelect?: boolean;
    infoData?: boolean;
    recycleBin?: boolean;
    image?: boolean;
    audio?: boolean;
    viewMedia?: boolean;
  };
  onSelect?(id?: string, value?: boolean): void;
  onClose?(id?: string): void;
  icon?: HTMLElement | ReactElement;
  ImageSizesProps?: ImageSizesProps['settings'];
  breakCache?: boolean;
  isDragging?: boolean;
  onImageLoadError?: (...args: any) => void;
  onDelete?: (...args: any) => void | Promise<any>;
}

const VaultAttachment = forwardRef((props: Props, ref: any) => {
  const {
    className,
    media,
    createdAt,

    showOptions = {
      timeStampText: true,
      video: true,
      play: true,

      selectable: false,
      recycleBin: true,

      image: false,
    },

    icon: Icon,
    onClick,
    ImageSizesProps = {},
    breakCache = false,
    defaultImage = dfltImage,
    onImageLoadError,
    isDragging = false,
  } = props;

  const isVideo = attrAccept(
    { name: media?.name, type: media?.type },
    'video/*',
  );
  const isImage = attrAccept(
    { name: media?.name, type: media?.type },
    'image/*',
  );
  const isAudio = attrAccept(
    { name: media?.name, type: media?.type },
    'audio/*',
  );

  let src = '/assets/images/video-placeholder.png';
  if (isVideo && media?.thumbnail) {
    src = media.thumbnail;
  }
  const mediaUrl = media?.url || media?.path;
  if (!isVideo && mediaUrl) {
    src = mediaUrl;
  }
  if (isAudio) {
    src = '/assets/images/mp3.svg';
  }
  const isValidurl = isValidUrl(mediaUrl || '');
  let fallback = isImage ? mediaUrl : '';
  if ((media as any)?.nosize) {
    fallback = media?.fallbackUrl;
    src = media?.fallbackUrl || '';
  } else if (isImage && mediaUrl && isValidurl) {
    const date = `?${media?.updatedAt}`;
    const { url, fallbackUrl } = getImageURL({
      url: mediaUrl,
      settings: {
        imgix: {
          all: 'w=163&h=163&auto=compress',
        },
        ...ImageSizesProps,
      },
    });
    fallback = media?.fallbackUrl
      ? media?.fallbackUrl + date
      : fallbackUrl
      ? fallbackUrl + date
      : mediaUrl + date;
    src = url + date;
  } else if (isImage) {
    fallback = defaultImage;
  }

  const md: any = media;
  const mediaType = md?.fileType || media?.type;
  const mediaName = md?.ogFileName || media?.name;
  const mediaSize = md?.size || 0;
  const mediaWidth = md?.width || 0;
  const mediaHeight = md?.height || 0;
  const addedBy = md?.addedBy;
  let timestamp: any = '';
  if (media?.createdAt) {
    timestamp = media?.createdAt ? dayjs(media?.createdAt) : '';
  }
  if (timestamp) {
    timestamp = timestamp.utc().fromNow();
  }
  return (
    <div
      className={`img-container ${className}`}
      // style={{ opacity: isDragging ? 0.4 : 1 }}
      ref={ref}
    >
      <div
        className="img-box"
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(media);
        }}
      >
        {isImage && isValidurl ? (
          <ImageComp rotation={media?.rotate} className="image_frame">
            <Image
              src={`${src}`}
              fallbackUrl={fallback}
              breakCache={breakCache}
              onError={onImageLoadError}
            />
          </ImageComp>
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
          <ImageComp rotation={media?.rotate} className="image_frame">
            <Image
              src={`${src}`}
              breakCache={breakCache}
              fallbackUrl={fallback}
              onError={onImageLoadError}
            />
          </ImageComp>
        )}
      </div>

      {showOptions.timeStampText && (
        <span className="timestamp">{timestamp}</span>
      )}

      {isImage && showOptions.image && (
        <span className="image-length">
          <ImageIcon />
        </span>
      )}
      {isAudio && showOptions.audio && (
        <span className="audio-length">
          <Mp3Icon width={30} height={30} />
        </span>
      )}
      {isVideo && (
        <>
          {showOptions.video && (
            <span className="video-length">
              <Video />{' '}
              {/* {media?.videoDuration || secondsToHms(media?.duration || 0)} */}
            </span>
          )}
          {Icon && (
            <span
              id="play-icon"
              className={`play-icon ${Icon ? 'custom_icon' : ''}`}
            >
              {Icon as any}
            </span>
          )}
          {showOptions.play && (
            <span id="play-icon" className="play-icon">
              <Play
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClick?.(media);
                }}
              />
            </span>
          )}
        </>
      )}
    </div>
  );
});

export default styled(VaultAttachment)`
  cursor: pointer;
  width: calc(25% - 6px);
  margin: 0 3px 4px;
  padding-top: calc(25% - 6px);
  position: relative;
  @media (max-width: 1199px) {
    width: calc(33.333% - 6px);
    padding-top: calc(33.333% - 6px);
  }
  @media (max-width: 767px) {
    width: calc(50% - 6px);
    padding-top: calc(50% - 6px);
  }

  img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .img-box {
    width: 100%;
    height: 100%;
  }
  .timestamp {
    position: absolute;
    left: 10px;
    top: 10px;
    min-width: 50px;
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
    font-size: 13px;
    line-height: 15px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
    border-radius: 4px;
    padding: 4px 5px;
  }
  .video-length {
    position: absolute;
    left: 10px;
    bottom: 10px;
    min-width: 50px;
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
    font-size: 13px;
    line-height: 15px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
    border-radius: 4px;
    padding: 4px 5px;
    svg {
      width: 18px;
      height: 16px;
    }
    &.image-length {
      min-width: 10px;
    }
  }

  .play-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 36px;
    height: 36px;
    background: rgba(0, 0, 0, 0.07);
    color: #fff;
    cursor: pointer;
    border-radius: 100%;
    &:hover {
      background: #000;
    }
  }
  .custom_icon {
    background: rgba(0, 0, 0, 0.7);
  }

  .audio_thumbnail {
    width: 100%;
    height: 100%;
    background: var(--pallete-background-gray-secondary-light);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 0;
    top: 0;

    .icons-holder {
      position: relative;
    }

    .img-audio {
      max-width: 60px;
      display: block;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;

        path {
          fill-opacity: 0.4;
        }
      }
    }

    .icon-play {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: none;
    }

    svg {
      max-width: 100%;
      height: auto;
    }
  }
`;
