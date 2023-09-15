import { defaultImage as dfltImage, MEDIA_UPLOAD_STATUSES } from 'appconstants';
import {
  CloseCircle,
  Edit,
  ImageIcon,
  InfoIcon,
  Mp3Icon,
  Play,
  PlayIcon,
  RecycleBin,
  VerticalDots,
  Video,
  ViewMedia,
} from 'assets/svgs';
import attrAccept from 'attr-accept';
import Checkbox from 'components/checkbox';
import Image from 'components/Image';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import React, {
  forwardRef,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import styled from 'styled-components';

import { useOnClickOutside } from 'hooks/useClickOutside';
import { getImageURL, isValidUrl, secondsToHms } from 'util/index';

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

const AttachmentContainer = forwardRef((props: Props, ref: any) => {
  const [isVisible, setVisible] = useState(false);
  const {
    className,
    media,
    createdAt,
    filekey = '_id',
    dragHandle = false,

    showOptions = {
      infoData: false,
      timeStampText: true,
      video: true,
      play: true,
      edit: false,
      closeIcon: false,
      selectable: false,
      recycleBin: true,
      showprogress: false,
      mutipleSelect: true,
      image: false,
      viewMedia: false,
    },
    onDelete,
    onSelect,
    onClose,
    icon: Icon,
    onClick,
    ImageSizesProps = {},
    breakCache = false,
    defaultImage = dfltImage,
    onImageLoadError,
    isDragging = false,
  } = props;
  const [checked, setIsChecked] = useState<boolean | undefined>(false);

  const compRef = useRef(null);
  useEffect(() => {
    setIsChecked(!showOptions?.mutipleSelect ? props.checked : media?.checked);
    return () => {};
  }, [props?.checked, media?.checked]);

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
  const handleClose = (e?: any) => {
    e.stopPropagation();
    e.preventDefault();
    onClose && onClose(media?.[filekey as keyof typeof media] as string);
  };
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
  const DragHandler = SortableHandle(() => (
    <span className="drag-dots">
      <VerticalDots />
    </span>
  ));

  useOnClickOutside(compRef, () => {
    setVisible(false);
  });
  const md: any = media;
  const mediaType = md?.fileType || media?.type;
  const mediaName = md?.ogFileName || media?.name;
  const mediaSize = md?.size || 0;
  const mediaWidth = md?.width || 0;
  const mediaHeight = md?.height || 0;
  const addedBy = md?.addedBy;

  return (
    <div
      className={`img-container ${className} ${isVisible ? 'opacity' : ''} ${
        isDragging ? 'dragging' : ''
      } ${media?.status === MEDIA_UPLOAD_STATUSES.ENCODING ? 'encoding' : ''} `}
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
        <span className="timestamp">
          {dayjs(createdAt || media?.createdAt).isYesterday()
            ? 'Yesterday'
            : dayjs(createdAt || media?.createdAt).isToday()
            ? 'Today'
            : dayjs(createdAt || media?.createdAt).format('MM/DD/YYYY')}
        </span>
      )}
      {dragHandle && <DragHandler />}
      {showOptions.selectable && (
        <Checkbox
          value={checked}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation();
            setIsChecked(e.target.checked);
            onSelect?.(
              media?.[filekey as keyof typeof media] as string,
              e.target.checked,
            );
          }}
        />
      )}
      {showOptions.closeIcon && (
        <span className="close-icon " onClick={handleClose}>
          <CloseCircle />
        </span>
      )}
      {showOptions.viewMedia && isImage && (
        <span className="viewmedia media-image">
          <ViewMedia
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClick?.(media);
            }}
          />
        </span>
      )}
      {isImage && showOptions.image && (
        <span className="video-length image-length">
          <ImageIcon />
        </span>
      )}
      {isVideo && (
        <>
          {showOptions.video && (
            <span className="video-length">
              <Video />{' '}
              {media?.videoDuration || secondsToHms(media?.duration || 0)}
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
          {showOptions.edit && (
            <span id="edit-icon" className="edit-icon">
              <Edit /> Edit
            </span>
          )}
        </>
      )}
      {showOptions.infoData && (
        <div className="info-area" ref={compRef}>
          {isVisible && (
            <div className="info-tooltip">
              <ul className="list-info">
                <li>
                  <strong className="title">Uploaded on:</strong>
                  {dayjs(media?.createdAt).format('LL')}
                </li>
                {!!addedBy ? (
                  <li>
                    <strong className="title">Uploaded by:</strong>
                    {addedBy}
                  </li>
                ) : null}
              </ul>
              <ul className="list-info">
                <li>
                  <strong className="title">File name:</strong>
                  <span className="file-name">{mediaName}</span>
                </li>
                <li>
                  <strong className="title">File type:</strong>
                  {mediaType}
                </li>
                <li>
                  <strong className="title">File size:</strong>
                  {mediaSize}
                </li>
                <li>
                  <strong className="title">Dimensions:</strong>
                  {mediaWidth} by {mediaHeight} px
                </li>
              </ul>
            </div>
          )}
          {showOptions.recycleBin && (
            <span className="delete-item">
              <RecycleBin
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete?.(media);
                }}
              />
            </span>
          )}

          <span
            className="info-opener"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setVisible(!isVisible);
            }}
          >
            <InfoIcon />
          </span>
        </div>
      )}
      {showOptions.showprogress && (
        <span className="progress-bar">
          <span
            className="progress"
            style={{
              width: `${(media as any)?.progress}%`,
            }}
          ></span>
        </span>
      )}
    </div>
  );
});

export default styled(AttachmentContainer)`
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

  &.opacity {
    .timestamp,
    .video-length,
    .delete-item,
    .viewmedia {
      opacity: 0.2;
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
  .edit-icon {
    position: absolute;
    right: 6px;
    bottom: 10px;
    min-width: 50px;
    text-align: center;
    background: rgba(0, 0, 0, 0.6);
    font-size: 13px;
    line-height: 15px;
    color: rgba(255, 255, 255, 1);
    font-weight: 500;
    border-radius: 4px;
    padding: 4px 10px;
    svg {
      width: 14px;
      height: 13px;
    }
  }
  .close-icon {
    width: 24px;
    position: absolute;
    right: 8px;
    top: 8px;
    cursor: pointer;
    color: #fff;
    @media (max-width: 767px) {
      width: 12px;
      right: 5px;
      top: 5px;
    }
    svg {
      width: 100%;
      height: auto;
      vertical-align: top;
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
  .progress-bar {
    position: absolute;
    left: 5px;
    height: 6px;
    border-radius: 6px;
    bottom: 5px;
    right: 5px;
    background: var(--pallete-background-default);
    overflow: hidden;
    .progress {
      background: #a3a5ba;
      border-radius: 6px;
    }
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

  .drag-dots {
    width: 4px;
    height: 4px;
    display: block;
    margin: 8px auto 0;
    color: #d6dade;
    -webkit-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    transform: rotate(90deg);
    -webkit-transition: all 0.4s ease;
    transition: all 0.4s ease;
    position: relative;
    right: -8px;
  }

  .delete-item {
    color: #fff;
    position: absolute;
    right: 40px;
    bottom: 10px;
    width: 24px;
    height: 24px;
    padding: 3px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 14px;
      height: auto;
    }
  }

  .info-area {
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s ease;

    .info-opener {
      position: absolute;
      right: 10px;
      bottom: 10px;
      width: 24px;
      height: 24px;
      padding: 3px;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 4px;

      svg {
        width: 100%;
        height: auto;
        display: block;

        path {
          fill: #fff;
          fill-opacity: 1;
        }
      }
    }

    .info-tooltip {
      position: absolute;
      left: 4px;
      right: 4px;
      bottom: 40px;
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      font-size: 14px;
      line-height: 18px;
      font-weight: 400;
      z-index: 9;
      padding: 11px;
      border-radius: 8px;

      @media (max-width: 1023px) {
        padding: 8px;
        font-size: 12px;
        line-height: 15px;
      }

      strong {
        font-weight: 500;
      }
    }

    .list-info {
      margin: 0;
      padding: 0;
      list-style: none;

      li {
        margin: 0 0 4px;
      }

      strong {
        padding: 0 5px 0 0;
      }

      + .list-info {
        padding-top: 8px;
      }

      .file-name {
        word-break: break-word;
      }
    }
  }

  .viewmedia {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    &:hover {
      path {
        .sp_dark & {
          fill: #000;
        }
      }
    }

    path {
      .sp_dark & {
        fill: #999;
      }
    }
  }
  &.dragging {
    opacity: 0.4;
  }
`;
