import { MEDIA_UPLOAD_STATUSES } from 'appconstants';
import { LockIcon, PlusFilled } from 'assets/svgs';
import attrAccept from 'attr-accept';
import AttachmentContainer from 'components/AttachmentContainer';
import SortableList from 'components/CreatePost/components/InputDragable/SortableList';
import GallaryViewModal from 'components/PrivatePageComponents/GallaryViewModal';
import Scrollbar from 'components/Scrollbar';
import UploadandEditor from 'components/UploadandEditor';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { ReactElement, useEffect, useState } from 'react';
import { Accept } from 'react-dropzone';
import { arrayMove } from 'react-sortable-hoc';
import { onFilesUpload } from 'store/reducer/libraryFileUpload';
import styled from 'styled-components';
import {
  getAudioFileDuration,
  getChangeUrlsOnly,
  getImageURL,
  getVideoCover,
  isValidUrl,
} from 'util/index';
import { v4 as uuid } from 'uuid';
interface Props {
  showButton?: boolean;
  onChange?: (files: MediaType[]) => void;
  limit?: number;
  // accept?: string[] | string;
  accept?: Accept;
  files: any[];
  openinGallery?: boolean;
  className?: string;

  onSortCallback?: (files: MediaType[]) => void;
  breakCache?: boolean;
  galleryOptions?: {
    rotate: boolean;
    disableVideoAudioRotation?: boolean;
  };
  value?: any[];
  showCloseIcon?: boolean;
}
function GallaryViewUploadWidget({
  showButton = true,
  showCloseIcon = true,
  onChange,
  limit = 10000,
  // accept = ['image/*', 'video/*'],

  accept = { 'image/*': [], 'video/*': [] },
  className,

  onSortCallback,
  openinGallery = false,
  breakCache = false,
  galleryOptions = { rotate: true, disableVideoAudioRotation: true },

  files = [],
  ...rest
}: Props): ReactElement {
  const dispatch = useAppDispatch();
  const [slideIndex, setSlideIndex] = useState(-1);
  const [gallaryFiles, setGalleryFiles] = useState(files);
  useEffect(() => {
    const images: any = [];
    const newFiles = [...(files || [])?.map((f) => ({ ...f }))];
    newFiles.forEach((element) => {
      const isAudio = attrAccept({ type: element.type }, 'audio/*');
      if (
        element &&
        isValidUrl(element.path || element.url) &&
        attrAccept({ type: element.type }, 'image/*')
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { size, ...el } = { ...element } as any;
        const date = `?${el.updatedAt}`;
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

        images.push({
          ...el,
          src: url + `?${date}`,
          fallback: fallbackUrl
            ? fallbackUrl + `?${date}`
            : el.path
            ? el.path + `?${date}`
            : el.url + `?${date}`,
          path: url + `?${date}`,
          url: url + `?${date}`,
          thumb: url + `?${date}`,
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { size, ...rest } = element as any;

        let src = element.url || element.path;
        let fallback = element.url || element.path;
        if (isAudio && isValidUrl(element.path || element.url)) {
          const { url, fallbackUrl } = getChangeUrlsOnly(
            element.url || element.path,
          );
          src = url;
          fallback = fallbackUrl;
        }
        images.push({
          ...rest,
          poster: isAudio ? '/assets/images/mp3-icon.png' : element.thumbnail,
          fallback: fallback,
          thumb: isAudio ? '/assets/images/mp3-icon.png' : element.thumbnail,
          src: src,
          width: '650',
          height: '720',
        });
      }
    });
    setGalleryFiles(() => [...images]);
  }, [files]);

  const RenderPlusIcon = () => {
    return (
      <div className="upload_placeholder">
        <PlusFilled />
      </div>
    );
  };
  const handleSuccess = async (fls: any) => {
    const newFiles: MediaType[] = [];
    for (let index = 0; index < fls.length; index++) {
      const file = fls[index];
      let width = file.width || 0;
      let height = file.height || 0;
      let url = undefined;
      let thumb = undefined;
      let duratonInSeconds = 0;
      let duration = undefined;
      if (attrAccept(file, 'video/*')) {
        await getVideoCover(file)
          .then((payload: any) => {
            duration = payload.timeDuration;
            duratonInSeconds = payload.duration;
            try {
              thumb = URL.createObjectURL(payload.blob);
            } catch (error) {}
            url = payload.src;
            if (payload.width && payload.height) {
              Object.defineProperty(file, 'width', {
                value: payload.width,
                writable: true,
              });
              Object.defineProperty(file, 'height', {
                value: payload.height,
                writable: true,
              });
              width = payload.width;
              height = payload.height;
            }
          })
          .catch((e) => {
            console.log(e, 'error');
          });
      } else if (attrAccept(file, 'image/*')) {
        try {
          url = URL.createObjectURL(file);
        } catch (error) {}
      } else if (attrAccept(file, 'audio/*')) {
        await getAudioFileDuration(file)
          .then((payload: any) => {
            duration = payload.timeDuration;
            duratonInSeconds = payload.duration;
            url = payload.src;
          })
          .catch((e) => {
            console.log(e, 'error');
          });
      }
      newFiles.push({
        name: file.name,
        type: file.type,
        id: uuid(),
        size: file.size,
        orignalFile: file,
        path: url,
        thumbnail: thumb,
        thumb: thumb,
        videoDuration: duration,
        duration: duratonInSeconds,
        updatedAt: new Date().getTime() + '',
        width,
        height,
      } as any);
    }
    const newMedia = [...(files || [])];
    const f = newMedia.concat(newFiles);

    // dispatch(onFilesUpload({ libraryMedia: f }));
    onChange?.(f);
  };

  const removeFile = (id: string) => {
    const f = (files || []).filter((file) => file.id !== id);
    dispatch(onFilesUpload({ libraryMedia: f }));
    onChange?.(f);
  };
  const onSortEnd = async ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    if (oldIndex === newIndex) return;
    const sortedArray = arrayMove<any>(files || [], oldIndex, newIndex)?.map(
      (item, index) => ({ ...item, sortOrder: index }),
    );

    // dispatch(onFilesUpload({ libraryMedia: sortedArray }));
    onSortCallback?.(sortedArray);
    onChange?.(sortedArray);
  };
  const handleImageClick = (index: number) => {
    setSlideIndex(index);
  };

  return (
    <div
      className={`${files?.length > 0 ? 'imag_media d-flex' : ''} ${className}`}
    >
      <Scrollbar className="custom-scroll-bar-holder">
        <SortableList
          useDragHandle
          axis="xy"
          onSortEnd={onSortEnd}
          distance={5}
          lockAxis="x"
          items={files}
          renderItem={(m: any, index: number) => {
            return (
              <AttachmentContainer
                isGalleryChecked={true}
                onClick={() => {
                  handleImageClick(index);
                }}
                media={m}
                dragHandle={true}
                showOptions={{
                  closeIcon: showCloseIcon,
                  edit: false,
                  play: attrAccept({ type: m.type }, 'video/*'),
                  video: attrAccept({ type: m.type }, 'video/*'),
                  timeStampText: false,
                  showprogress: m.status === MEDIA_UPLOAD_STATUSES.IN_PROGRESS,
                }}
                filekey={'id'}
                onClose={removeFile}
                icon={m.islocK ? <LockIcon /> : undefined}
                breakCache={breakCache}
              />
            );
          }}
        />
        {openinGallery && slideIndex !== -1 ? (
          <GallaryViewModal
            className="gallaryswiper"
            isOpen={slideIndex !== -1}
            items={gallaryFiles as any}
            currentSlideIndex={slideIndex}
            // disableVideoAudioRotation={true}
            galleryActions={galleryOptions}
            onCloseModel={(items) => {
              const newFiles = [...files];
              items
                // .filter((k: any) => k.rotateable)
                .forEach((k1: any) => {
                  const fileIndex: any = files.findIndex((f) => f.id === k1.id);
                  const fileItem: any = files[fileIndex];
                  const isVideo = attrAccept(
                    { type: fileItem.type },
                    'vidoe/*',
                  );
                  const isAudio = attrAccept(
                    { type: fileItem.type },
                    'audio/*',
                  );
                  if (!isVideo && !isAudio) {
                    newFiles[fileIndex] = {
                      ...fileItem,
                      rotate: k1.rotate,
                      settings: {
                        ...(fileItem?.settings || {}),
                        rotate: k1.rotate,
                      },
                    };
                  }
                });

              onChange?.(newFiles);
              setGalleryFiles(newFiles);
            }}
            onClose={(e) => {
              e.stopPropagation();
              setSlideIndex(-1);
            }}
            // rotate={true}
          />
        ) : null}
        {showButton && (
          <UploadandEditor
            customRequest={handleSuccess}
            disabled={files && files?.length >= limit}
            cropper={false}
            accept={accept}
            {...rest}
          >
            <RenderPlusIcon />
          </UploadandEditor>
        )}
      </Scrollbar>
    </div>
  );
}

export default styled(GallaryViewUploadWidget)`
  padding: 8px 8px 6px;
  position: relative;
  overflow: hidden;
  height: 150px;

  @media (max-width: 767px) {
    height: 103px;
  }

  &:before {
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border: 5px dashed #e5ccee;
    border-radius: 5px;
    content: '';
    position: absolute;

    .sp_dark & {
      /* border-color: #666; */
    }
  }

  .drag-dots {
    display: none;
  }

  .upload_placeholder {
    width: 106px;
    min-width: 106px;
    height: 120px;
    background: #e1e4eb;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    @media (max-width: 767px) {
      height: 77px;
      width: 77px;
      min-width: 77px;
    }

    svg {
      width: 46px;
      height: 46px;
      color: var(--pallete-primary-main);

      @media (max-width: 767px) {
        width: 30px;
        height: 30px;
      }
    }
  }

  .rc-scollbar {
    display: flex;
    width: auto !important;
  }

  .custom-scroll-bar-holder {
    > div {
      z-index: 10;

      &:first-child {
        overflow-x: auto !important;
      }
    }
  }

  .sortable {
    display: flex;
    margin: 0;

    li {
      width: 128px;

      @media (max-width: 767px) {
        width: 85px;
      }
    }
  }

  .img-container {
    width: 120px;
    min-width: 120px;
    height: 120px;
    padding: 0 !important;
    margin: 0 4px 10px;
    display: inline-block;
    vertical-align: top;
    border-radius: 4px;
    overflow: hidden;

    @media (max-width: 767px) {
      height: 77px;
      width: 77px;
      min-width: 77px;
    }

    img {
      position: static;
    }

    .close-icon {
      background: rgba(0, 0, 0, 0.5);
      border-radius: 100%;

      @media (max-width: 767px) {
        height: 12px;
      }
    }
  }
`;
