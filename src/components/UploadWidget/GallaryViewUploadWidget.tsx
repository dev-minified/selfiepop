import { defaultImage } from 'appconstants';
import { ImageThumbnail, InfoIcon, LockIcon, PlusFilled } from 'assets/svgs';
import attrAccept from 'attr-accept';
import AttachmentContainer from 'components/AttachmentContainer';
import SortableList from 'components/CreatePost/components/InputDragable/SortableList';
import Button from 'components/NButton';
import GallaryViewModal from 'components/PrivatePageComponents/GallaryViewModal';
import Scrollbar from 'components/Scrollbar';
import UploadandEditor from 'components/UploadandEditor';
import { useAppSelector } from 'hooks/useAppSelector';
import { ReactElement, useEffect, useState } from 'react';
import { Accept } from 'react-dropzone';
import { arrayMove } from 'react-sortable-hoc';
import styled from 'styled-components';
import {
  getAudioFileDuration,
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
  value?: MediaType[];
  className?: string;
  message?: string;
  customButton?: React.ReactElement;
  subMessage?: string;
  openinGallery?: boolean;
  galleryOptions?: {
    rotate: boolean;
    disableVideoAudioRotation?: boolean;
  };
}
function GallaryViewUploadWidget({
  value,
  showButton = true,
  customButton,
  onChange,
  limit = 10000,
  // accept = ['image/*', 'video/*'],
  accept = { 'image/*': [], 'video/*': [] },
  className,
  message,
  subMessage,
  openinGallery = false,
  galleryOptions = { rotate: false, disableVideoAudioRotation: true },
  ...rest
}: Props): ReactElement {
  const [files, setFiles] = useState<MediaType[]>([]);
  const [gallaryFiles, setGalleryFiles] = useState(files);
  const [slideIndex, setSlideIndex] = useState(-1);
  const uploadingGroups = useAppSelector((state) => state.fileGroups);
  useEffect(() => {
    const prevFiles: any[] = value ? [...value] : [];
    Object.values(uploadingGroups).forEach((group) => {
      group.files.forEach((file) => {
        const index = prevFiles.findIndex((f: any) => f.id === file.id);
        if (index > -1) {
          prevFiles[index] = {
            ...prevFiles[index],
            progress: file.progress,
            status: file.status,
          };
        }
      });
    });
    setFiles(prevFiles);
  }, [uploadingGroups, value]);
  useEffect(() => {
    const images: any = [];
    const newFiles = [...files.map((f) => ({ ...f }))];
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
        const { url: murl } = getImageURL({
          url: el.path || el.url || '',
          settings: {
            defaultUrl: el.path,
            onlyMobile: true,
            imgix: {
              all: 'h=500&w=500',
            },
          },
        });
        images.push({
          ...el,
          src: url + `?${date}`,
          fallback: fallbackUrl
            ? fallbackUrl + +`?${date}`
            : el.path
            ? el.path + `?${date}`
            : el.url + `?${date}`,
          path: url + `?${date}`,
          url: url + `?${date}`,
          thumb: murl + `?${date}`,
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { size, ...el } = element as any;
        if (attrAccept({ type: element.type }, 'image/*')) {
          images.push({
            width: '650',
            height: '720',
            ...el,
            src: element.url || element.path,
            fallback: defaultImage,
          });
        } else {
          images.push({
            width: '650',
            height: '720',
            ...el,
            poster: isAudio ? '/assets/images/mp3-icon.png' : element.thumbnail,
            fallback: element.url || element.path,
            thumb: isAudio ? '/assets/images/mp3-icon.png' : element.thumbnail,
            src: element.url || element.path,
          });
        }
      }
    });
    setGalleryFiles(() => [...images]);
  }, [files]);
  const handleImageClick = (index: number) => {
    setSlideIndex(index);
  };
  const handleSuccess = async (fls: any) => {
    const newFiles: MediaType[] = [];
    for (let index = 0; index < fls.length; index++) {
      const file = fls[index];
      let url = undefined;
      let thumb = undefined;
      let duratonInSeconds = 0;
      let duration = undefined;
      let width = file.width || 0;
      let height = file.height || 0;
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
              width = payload.width;
              height = payload.height;
              Object.defineProperty(file, 'width', {
                value: payload.width,
                writable: true,
              });
              Object.defineProperty(file, 'height', {
                value: payload.height,
                writable: true,
              });
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

    const f = files.concat(newFiles);
    setFiles(f);
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
    const sortedArray = arrayMove<any>(files, oldIndex, newIndex).map(
      (item, index) => ({ ...item, sortOrder: index }),
    );
    setFiles(sortedArray);
  };
  const removeFile = (id: string) => {
    const f = files.filter((file) => (file.id || file._id) !== id);
    setFiles(f);
    onChange?.(f);
  };
  return (
    <div className={className}>
      <div
        className={`items-area ${files.length > 0 ? 'imag_media d-flex' : ''}`}
      >
        <Scrollbar className="custom-scroll-bar-holder">
          {files.length > 0 ? (
            <SortableList
              useDragHandle
              axis="x"
              onSortEnd={onSortEnd}
              distance={5}
              lockAxis="x"
              items={files}
              renderItem={(m: any, index: number) => {
                return (
                  <AttachmentContainer
                    media={m}
                    onClick={() => {
                      handleImageClick(index);
                    }}
                    dragHandle={true}
                    showOptions={{
                      showprogress: m.status === 'IN_PROGRESS',
                      closeIcon: true,
                      edit: false,
                      play:
                        !m.islocK && attrAccept({ type: m.type }, 'vidoe/*'),
                      video: attrAccept({ type: m.type }, 'vidoe/*'),
                      timeStampText: false,
                    }}
                    filekey={'id'}
                    onClose={removeFile}
                    icon={m.islocK ? <LockIcon /> : undefined}
                  />
                );
              }}
            />
          ) : (
            <div className="no-messages">
              <span className="img">
                <InfoIcon />
              </span>
              <strong className="title">
                {message || 'Create your Free Message'}
              </strong>
              <p>
                {subMessage ||
                  'Please enter your message and any related media.'}
              </p>
            </div>
          )}
          {openinGallery && slideIndex !== -1 ? (
            <GallaryViewModal
              className="gallaryswiper"
              isOpen={slideIndex !== -1}
              items={
                gallaryFiles.map((f) => ({ ...f, id: f?.id ?? f?._id })) as any
              }
              currentSlideIndex={slideIndex}
              galleryActions={galleryOptions}
              onCloseModel={(items) => {
                const newFiles = [...files];
                items.forEach((k1: any) => {
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
                    if (k1.rotate !== '')
                      newFiles[fileIndex] = {
                        ...fileItem,
                        rotate: k1.rotate,
                      };
                  }
                });
                setFiles(newFiles);
                onChange?.(newFiles);
                setGalleryFiles(newFiles);
              }}
              onClose={() => setSlideIndex(-1)}
            />
          ) : null}
          {customButton && customButton}
          {showButton && (
            <UploadandEditor
              customRequest={handleSuccess}
              disabled={files.length >= limit}
              cropper={false}
              accept={accept}
              {...rest}
            >
              {files.length > 0 ? (
                <div className="upload_placeholder">
                  <PlusFilled />
                </div>
              ) : (
                <Button
                  icon={<ImageThumbnail />}
                  block
                  type="primary"
                  shape="circle"
                  className="bg-blue"
                >
                  ATTACH MEDIA
                </Button>
              )}
            </UploadandEditor>
          )}
        </Scrollbar>
      </div>
    </div>
  );
}

export default styled(GallaryViewUploadWidget)`
  padding: 1px 0 0;

  .items-area {
    height: 320px;

    @media (max-width: 767px) {
      height: 210px;
    }

    &.imag_media {
      height: 165px;

      @media (max-width: 767px) {
        height: 105px;
      }

      .rc-scollbar {
        display: flex;
        width: auto;
      }
    }

    .no-messages {
      @media (max-width: 767px) {
        padding: 20px 0 10px;
      }
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
      margin-top: 0;
    }

    .drag-dots {
      width: 4px;
      height: 4px;
      display: block;
      margin: 8px auto 0;
      color: #d6dade;
      transform: rotate(90deg);
      transition: all 0.4s ease;
      position: relative;
      right: -8px;

      @media (max-width: 767px) {
        right: -13px;
      }

      &:hover {
        color: var(--pallete-primary-main);
      }
    }
  }

  .upload_placeholder {
    width: 106px;
    min-width: 106px;
    height: 136px;
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

  .imag_media {
    margin: 20px -5px 10px;
    overflow: auto;
  }

  .img-container {
    width: 136px;
    min-width: 136px;
    height: 136px;
    padding: 0;
    margin: 0 10px 10px 5px;
    display: inline-block;
    vertical-align: top;

    @media (max-width: 767px) {
      height: 77px;
      width: 77px;
      min-width: 77px;
    }

    img {
      position: static;
    }
  }
`;
