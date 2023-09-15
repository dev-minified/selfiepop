import { Spinner } from 'assets/svgs';
import attrAccept from 'attr-accept';
import EmptydataMessage from 'components/EmtpyMessageData';
import Scrollbar from 'components/Scrollbar';
import useOpenGallery from 'hooks/useLightGallery';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { getChangeUrlsOnly } from 'util/index';
import LibraryAttachmentContainer from './LibraryAttachmentContainer';

interface ITemplateModal {
  className?: string;
  title?: string;
  isOpen: boolean;
  isLoading?: boolean;
  showEmptyMessage?: boolean;
  setActiveView?: any;

  sumbitTitle?: string;
  templates: MediaLibrary[];
  onClose?: () => void;
  loadMore: (...args: any) => void;
  oK?: () => void;
  onClick?: (item?: IPost | ChatMessage) => void;
  onItemSelect?: (item: MediaLibrary, index: number, value?: boolean) => void;
  onDeleteItem?: (item: MediaLibrary, index: number) => void;
  notAllowedTypes?: string[];
}

const LibraryTemplateModal: React.FC<ITemplateModal> = ({
  onClick,
  templates,
  loadMore,
  isLoading,
  className,
  onItemSelect,
  setActiveView,
  onDeleteItem,
  notAllowedTypes = [],
  showEmptyMessage,
}) => {
  const scrollbarRef = useRef<any>();
  const [galleryImages, setGalleryImages] = useState(templates);
  useEffect(() => {
    setGalleryImages(() => templates);
    return () => {};
  }, [templates]);

  const { onOpenGallery } = useOpenGallery();
  const handleUpdate = useCallback(
    () => {
      if (isLoading || !templates?.length) return;

      const { scrollTop, scrollHeight, clientHeight } =
        scrollbarRef.current.view;
      // const pad = 300; // 50px of the bottom
      const pad = 1; // 50px of the bottom
      // t will be greater than 1 if we are about to reach the bottom
      const t = (scrollTop + pad) / (scrollHeight - clientHeight);
      if (t > 1) {
        loadMore?.(scrollbarRef);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [templates?.length, isLoading],
  );
  const onHandleImageLoadError = (item: any, index: any) => {
    const gImages = [...galleryImages];
    const galleryItem: any = { ...(gImages?.[index] || {}) };

    if (galleryItem?._id) {
      const type = galleryItem?.type || galleryItem.fileType;
      const name = galleryItem?.name || galleryItem.ogFileName;
      const isImage = attrAccept({ name: name, type: type }, 'image/*');
      if (isImage) {
        galleryItem['nosize'] = true;
        gImages[index] = galleryItem;
        setGalleryImages(() => gImages);
      }
    }
  };
  const handleItemSelect = (
    item: MediaLibrary,
    index: number,
    value?: boolean,
  ) => {
    onItemSelect?.(item, index, value);
  };

  return (
    <div className={`${className} modal-templates`}>
      <Scrollbar
        // autoHeight={true}
        // autoHeightMax={'calc(100vh - 308px)'}
        // style={{ overflow: 'hidden' }}
        onScroll={handleUpdate}
        ref={scrollbarRef}
      >
        <div className="gallery-holder">
          {!!galleryImages?.length ? (
            <div className="lg-react-element">
              {galleryImages?.map((itm: any, index: number) => {
                const isImage = attrAccept(
                  { name: itm.name, type: itm.type },
                  'image/*',
                );
                const item = { ...itm };
                if (isImage) {
                  const fallbackUrl = getChangeUrlsOnly(itm.path || itm.url);
                  item.fallbackUrl = fallbackUrl.url;
                }

                return (
                  <LibraryAttachmentContainer
                    notAllowedTypes={notAllowedTypes}
                    key={item?._id + index}
                    index={index}
                    item={item}
                    setActiveView={setActiveView}
                    onDeleteItem={onDeleteItem}
                    onImageLoadError={onHandleImageLoadError}
                    onItemSelect={handleItemSelect}
                    onClick={() => {
                      onOpenGallery({
                        index: index,
                        value: galleryImages as any,

                        ImageSizesProps: {
                          onlyMobile: true,
                        },
                      });

                      onClick?.(item);
                    }}
                  />
                );
              })}
            </div>
          ) : null}
          {isLoading && (
            <LoaderWrapper>
              <Spinner
                width="28px"
                height="28px"
                color="var(--pallete-text-secondary-50)"
              />
            </LoaderWrapper>
          )}

          {!templates?.length && !isLoading && showEmptyMessage && (
            <EmptydataMessage text="You don't have any media..." />
          )}
        </div>
      </Scrollbar>
    </div>
  );
};

export default styled(LibraryTemplateModal)`
  &.modal-dialog {
    max-width: 697px;

    .modal-title {
      font-size: 16px;
      line-height: 20px;
      font-weight: 500;

      svg {
        display: inline-block;
        vertical-align: bottom;
        margin: 0 10px 0 0;
      }

      path {
        fill: #000;
      }
    }

    .modal-body {
      padding: 3px 1px;

      .button-default {
        margin: 10px 5px !important;
        width: calc(100% - 10px);
      }
    }

    .media {
      padding: 0;
    }

    .audio_thumbnail {
      position: absolute;
    }

    .user-detail {
      padding: 0;
    }

    .lg-react-element {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      .gallery-item,
      .img-container {
        width: calc(20% - 2px);
        margin: 0 1px 2px;
        padding-top: calc(20% - 2px);

        @media (max-width: 767px) {
          width: calc(33.333% - 2px);
          padding-top: calc(33.333% - 2px);
        }

        @media (max-width: 479px) {
          width: calc(50% - 2px);
          padding-top: calc(50% - 2px);
        }

        .image-comp {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
      }
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
      color: rgba(255, 255, 255, 1);
      font-weight: 500;
      border-radius: 4px;
      padding: 4px 5px;
      z-index: 2;
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
      color: rgba(255, 255, 255, 1);
      font-weight: 500;
      border-radius: 4px;
      padding: 4px 5px;
      z-index: 2;

      svg {
        width: 18px;
        height: 16px;
      }
    }

    .checkbox {
      pointer-events: none;
      position: absolute;
      right: 9px;
      top: 9px;
      width: 26px;
      height: 26px;
      z-index: 2;

      label {
        padding: 0;
      }

      input[type='checkbox']:checked + .custom-input-holder .custom-input {
        background: var(--pallete-primary-main);
        border-color: var(--pallete-primary-main);
      }

      .custom-input {
        margin: 0;
        width: 24px;
        height: 24px;
        border: 2px solid rgba(255, 255, 255, 0.8);
        border-radius: 100%;
        background: none;

        &:after {
          display: none;
        }

        &:before {
          color: #fff !important;
          font-size: 9px !important;
        }
      }
    }
  }
`;
const LoaderWrapper = styled.div`
  z-index: 9;
  display: flex;
  padding-bottom: 1rem;
  padding-top: 1rem;
  justify-content: center;

  -moz-user-select: none;
  -webkit-user-select: none;
`;
