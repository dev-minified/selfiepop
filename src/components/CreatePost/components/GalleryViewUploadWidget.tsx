import { MEDIA_UPLOAD_STATUSES } from 'appconstants';
import { LockIcon, PlusFilled } from 'assets/svgs';
import attrAccept from 'attr-accept';
import AttachmentContainer from 'components/AttachmentContainer';
import GallaryViewModal from 'components/PrivatePageComponents/GallaryViewModal';
import Scrollbar from 'components/Scrollbar';
import UploadandEditor from 'components/UploadandEditor';
import { useAppSelector } from 'hooks/useAppSelector';
import {
  MutableRefObject,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Accept } from 'react-dropzone';
import { arrayMove } from 'react-sortable-hoc';
import styled from 'styled-components';
import {
  getAudioFileDuration,
  getChangeUrlsOnly,
  getImageURL,
  getVideoCover,
  isValidUrl,
} from 'util/index';
import { v4 as uuid } from 'uuid';
import SortableList from './InputDragable/SortableList';
interface Props {
  showButton?: boolean;
  onChange?: (files: MediaType[], id?: string) => void;
  limit?: number;
  // accept?: string[] | string;
  accept?: Accept;
  value?: MediaType[] & {
    checked?: boolean;
    progress?: number;
    status?: string;
  };
  openinGallery?: boolean;
  className?: string;
  message?: string;
  subMessage?: string;
  customButton?: boolean;
  buttonRef?: MutableRefObject<any>;
  onSortCallback?: (files: MediaType[]) => void;
  breakCache?: boolean;
  galleryOptions?: {
    rotate: boolean;
    disableVideoAudioRotation?: boolean;
  };
  onNewListOpenModel?: () => void;
}
function GallaryViewUploadWidget({
  value,
  showButton = true,
  onChange,
  customButton = false,
  limit = 10000,
  // accept = ['image/*', 'video/*'],

  accept = { 'image/*': [], 'video/*': [] },
  className,

  onSortCallback,
  openinGallery = false,
  breakCache = false,
  onNewListOpenModel,
  galleryOptions = { rotate: false, disableVideoAudioRotation: true },
  ...rest
}: Props): ReactElement {
  const [files, setFiles] = useState<
    (MediaType & { checked?: boolean; progress?: number; status?: string })[]
  >([]);
  const uploadingGroups = useAppSelector((state) => state.fileGroups);
  const [slideIndex, setSlideIndex] = useState(-1);
  const scrollRef = useRef();
  const [gallaryFiles, setGalleryFiles] = useState(files);
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
      } as any);
    }

    const f = files.concat(newFiles);
    setFiles(f);
    onChange?.(f);
  };

  const removeFile = (id: string) => {
    const f = files.filter((file) => (file.id || file._id) !== id);
    setFiles(f);
    onChange?.(f, id);
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
    onSortCallback?.(sortedArray);
  };
  const handleImageClick = (index: number) => {
    setSlideIndex(index);
  };
  // const onDragItemMove = (e: SortEvent) => {};
  return (
    <div className={className}>
      <div className={files.length > 0 ? 'imag_media d-flex' : ''}>
        <Scrollbar className="custom-scroll-bar-holder" ref={scrollRef}>
          <SortableList
            useDragHandle
            // onSortMove={onDragItemMove}
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
                    closeIcon: true,
                    edit: false,
                    play: attrAccept({ type: m.type }, 'video/*'),
                    video: attrAccept({ type: m.type }, 'video/*'),
                    timeStampText: false,
                    showprogress:
                      m.status === MEDIA_UPLOAD_STATUSES.IN_PROGRESS,
                  }}
                  filekey={'id'}
                  onClose={() => removeFile(m.id || m._id)}
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
                    const fileIndex: any = files.findIndex(
                      (f) => f.id === k1.id,
                    );
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
                      };
                    }
                  });
                setFiles(newFiles);
                onChange?.(newFiles);
                setGalleryFiles(newFiles);
              }}
              onClose={() => setSlideIndex(-1)}
              // rotate={true}
            />
          ) : null}
          {customButton && (
            <div className="upload_placeholder" onClick={onNewListOpenModel}>
              <PlusFilled />
            </div>
          )}
          {showButton && (
            <UploadandEditor
              customRequest={handleSuccess}
              disabled={files.length >= limit}
              cropper={false}
              accept={accept}
              {...rest}
            >
              <RenderPlusIcon />
            </UploadandEditor>
          )}
        </Scrollbar>
      </div>
    </div>
  );
}

export default styled(GallaryViewUploadWidget)`
  padding: 1px 0 0;
  .attachmentlightbox {
    display: none;
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
    height: 172px;

    @media (max-width: 767px) {
      height: 112px;
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
