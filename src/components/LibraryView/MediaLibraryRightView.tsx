// import { updateImagesPhysically } from 'api/sales';
import { updateImagesPhysically } from 'api/sales';
import { ImagesScreenSizes } from 'appconstants';
import { EditPencil, FolderSvg, RecycleBin, UploadMedia } from 'assets/svgs';
import ArrowBack from 'assets/svgs/svgsFiles/ArrowBack';
import attrAccept from 'attr-accept';
import Button from 'components/NButton';
import { toast } from 'components/toaster';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useOpenClose from 'hooks/useOpenClose';
import useSocket from 'hooks/useSocket';
import FileUploader from 'pages/Sales/components/FileUploader';
import { useCallback, useEffect, useState } from 'react';
import {
  onRemoveGroup,
  selectGroupBykey,
  uploadFiles,
} from 'store/reducer/files';
import {
  addInProgressGellaryId,
  addMediaToSelectedMedias,
  checkIfFilesareReadytoUpload,
  checkifOneOrMoreFolderExist,
  deleteFolderWithMedia,
  deleteMediaInLibrary,
  deleteMediaInTrashLibrary,
  getMediaByFolderId,
  getPaginatedMediaByFolderId,
  onFilesUpload,
  removeFromSelectedMedia,
  removeFromSelectedMediaandUpdateSort,
  removeInProgressGellaryId,
  resetActiveLibrary,
  resetSelectedItems,
  selectinProgressGroupsItemBykey,
  setLibraryLoading,
  updateFolderMediaItem,
  uploadMediaLibrary,
} from 'store/reducer/libraryFileUpload';
import styled from 'styled-components';
import swal from 'sweetalert';
import {
  addBlurtoLastPiece,
  appendScreenSizesToId,
  fileChanges,
  getFilemetaData,
  getImageURL,
  isValidUrl,
} from 'util/index';
import LibraryInputModal from './LibraryInputModal';
import ModalFooter from './ModalFooter';
import LibrarayUploadEditor from './RightView';
import UploaderView from './UploaderView';
import ConfirmationModal from './model/ConfirmationModal';
import LibraryTemplateModal from './model/LibraryView';
dayjs.extend(utc);
type Props = {
  className?: string;
  setActiveView?: any;
  folderId?: string;
  onPostHandler?: (files?: any) => void;
  isDesktop?: boolean;
  showActionFooter?: boolean;
  onFilesChangeCallback?: (files: any[]) => void;
  onChange?: (files: any[]) => void;
  buyer?: Record<string, any>;
  notAllowedTypes?: string[];
  managedAccountId?: string;
  addtoButtontext?: string;
};
const DragAndDropView = styled.div`
  padding: 8px 8px 6px;
  margin: 0 5px;
  position: relative;
  overflow: hidden;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 17px;
  line-height: 20px;
  color: #a7b0ba;

  &:before {
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border: 5px dashed #e5ccee;
    border-radius: 5px;
    content: '';
    position: absolute;
    pointer-events: none;

    .sp_dark & {
      /* border-color: #666; */
    }
  }

  svg {
    width: 38px;
    color: #d1bfd3;
    display: block;
    margin: 0 auto 5px;
  }

  .uploader-wrap {
    width: 100%;
  }
`;
const LIMIT = 15;
const noBlurExist = ['image/gif', 'image/svg+xml'];
const blurThumbUrlPlaceholder = '/assets/images/svg/ChatblurPlaceholder.svg';
const MediaLibraryRightView = (props: Props) => {
  const {
    className,
    setActiveView,
    isDesktop,
    onPostHandler,
    buyer = {},
    notAllowedTypes = [],
    managedAccountId = '',
    addtoButtontext,
    showActionFooter,
  } = props;
  const libraryDateBefore = dayjs.utc('01/24/2023');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const activeFolder = useAppSelector(
    (state) => state.libraryMedia.activeFolder,
  );
  const isDragging = useAppSelector(
    (state) => state.libraryMedia.itemsDragging,
  );
  const activeLibrary = useAppSelector(
    (state) => state.libraryMedia.activeLibrary,
  );
  const media = useAppSelector((state) => state.libraryMedia.libraryMedia);
  const isProgressUploadingMedia = useAppSelector((state) =>
    selectinProgressGroupsItemBykey(state, activeFolder?._id || ''),
  );
  const { user } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    if (activeFolder?._id) {
      setLoading(true);
      dispatch(resetActiveLibrary());
      const buyerId = buyer?._id;
      dispatch(
        getMediaByFolderId({
          id: activeFolder._id,

          params: {
            sort: 'createdAt',
            order: 'desc',
            limit: LIMIT + 1,
            skip: 0,
            buyerId,
            sellerId: managedAccountId,
          },
        }),
      )
        .unwrap()
        .then((d) => {
          if (!d.success && d.cancelled) {
            setLoading(true);
            return;
          }
          setLoading(false);
        })

        .catch(() => {
          setLoading(false);
        });
    }
    return () => {};
  }, [activeFolder]);
  const processFilesAfterGroupUpload = async (files: any[], key: string) => {
    const folderId = activeFolder?._id;
    setTimeout(() => {
      dispatch(
        onRemoveGroup({
          groupId: key,
        }),
      );
    }, 200);
    const newFiles = [];
    for (let j = 0; j < files.length; j++) {
      let f = files[j];

      const isVideo = attrAccept({ type: f.type }, 'video/*');
      const isImage = attrAccept({ type: f.type }, 'image/*');
      f = await getFilemetaData(f);
      let blurThumbnail = f?.blurThumbnail;
      const isAudio = attrAccept({ type: f.type }, 'audio/*');
      const isUploaded: boolean = isValidUrl(f?.path);

      if (!blurThumbnail && isUploaded && !isAudio) {
        blurThumbnail = getImageURL({
          url: f.imageURL || f.thumbnail || f.thumb || f.url || f.path,
          settings: {
            bdesktop: true,
          },
        })?.url;
      }
      let file: any = {
        // _id: f.id,
        size: f.size,
        type: isVideo ? 'video/mp4' : f.type || f?.orignalFile?.type,
        path: f.url,
        blurThumbnail: noBlurExist.includes(f.type)
          ? blurThumbUrlPlaceholder
          : blurThumbnail,
        name: f.name,
        createdAt: f.createdAt || dayjs().utc().format(),
        updatedAt: f.updatedAt || dayjs().utc().format(),
        sortOrder: (activeLibrary?.items[0]?.sortOrder || 0) + 1,
        width: f.width,
        height: f.height,
        folderId: folderId,
        title: '',
        // settings: f?.settings || undefined,
      };
      if (!isImage) {
        file = {
          ...file,
          duration: f.duration,
          thumbnail: f.thumbnail,
          videoDuration: f.timeDuration,
        };
      }

      // if (f.rotate !== undefined) {
      //   const isRotateable = (((f.rotate || 0) % 360) + 360) % 360 !== 0;
      //   if (isRotateable) {
      //     file.rotate = f.rotate;
      //     file.updatedAt = new Date().getTime();
      //   }
      // }

      newFiles.push(file);
    }
    return newFiles;
  };
  const onSubmitMedia = async (media: any) => {
    const files = media?.files || [];
    const key = media.key;
    const newFiles = await processFilesAfterGroupUpload(files, key);
    dispatch(
      uploadMediaLibrary({
        folderId: key,
        files: newFiles,
        options: {
          params: {
            sellerId: managedAccountId,
          },
        },
      }),
    );
  };
  const onItemSelect = useCallback(
    (item: MediaLibrary, index: number, value?: boolean) => {
      const items = { ...item };
      if (value) {
        const updatedAtServer = dayjs.utc(item.updatedAt);
        const isBefore = updatedAtServer.isSameOrBefore(libraryDateBefore);
        let updatedAt = item.updatedAt || dayjs.utc().format();
        const isImage = attrAccept(
          { type: items.type, name: items?.name },
          'image/*',
        );
        if (
          isBefore &&
          isValidUrl(items?.blurThumbnail) &&
          !!items?.blurThumbnail
        ) {
          updatedAt = dayjs.utc().format();
          const { imgnewUrl, defaultUrl } = addBlurtoLastPiece(items.path, 100);
          updateImagesPhysically({
            url: isImage ? defaultUrl : items.blurThumbnail,
            name: imgnewUrl,
          })
            .then(() => {
              dispatch(
                updateFolderMediaItem({
                  id: item._id!,
                  data: { updatedAt },
                  index: index,
                  customErrorType: { ignoreStatusCodes: [404] },
                }),
              )
                .unwrap()
                .then(() => {})
                .catch(() => {});
            })
            .catch(() => {});
        } else if (!items?.blurThumbnail) {
          items.blurThumbnail = blurThumbUrlPlaceholder;
          dispatch(
            updateFolderMediaItem({
              id: item._id!,
              data: { updatedAt, blurThumbnail: blurThumbUrlPlaceholder },
              index: index,
              customErrorType: { ignoreStatusCodes: [404] },
            }),
          )
            .unwrap()
            .then(() => {})
            .catch(() => {});
        }

        dispatch(
          addMediaToSelectedMedias({
            item: { ...items, updatedAt: updatedAt, index },
            isChecked: value,
          }),
        );
        return;
      }
      dispatch(
        removeFromSelectedMedia({
          item: items,
          itemId: items?._id,
          folderId: activeFolder?._id,
        }),
      );
    },
    [activeFolder?._id],
  );

  const loadMore = (scrollbarRef: any) => {
    const { items = [], totalCount = 0 } = activeLibrary || {};
    if (items.length < totalCount) {
      setLoading(true);
      dispatch(
        getPaginatedMediaByFolderId({
          id: activeFolder?._id || '',

          params: {
            sort: 'createdAt',
            order: 'desc',
            limit: LIMIT,
            skip: items.length,
            sellerId: managedAccountId,
          },
        }),
      ).finally(() => {
        setLoading(false);
        scrollbarRef?.current?.scrollToBottom();
      });
    }
  };
  const onDeleteHandler = () => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, your gallery items will be moved to Trash folder!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    } as any)
      .then(async (willDelete) => {
        if (willDelete) {
          dispatch(
            deleteFolderWithMedia({
              folderId: activeFolder?._id || '',
              options: {
                params: {
                  sellerId: managedAccountId,
                },
              },
            }),
          )
            .unwrap()
            .then(() => {
              // dispatch(resetActiveFolder());
              dispatch(resetActiveLibrary());
              toast.success('Media Library Deleted Successfully!');
            });
        }
      })
      .catch((e) => console.log(e));
  };
  const onSubmitHandler = async (e: any) => {
    e.stopPropagation();
    return new Promise((res) => {
      // eslint-disable-next-line

      const newMedia = media?.map((f: any) => {
        const newFile = { ...f };
        if (!f?._id && !isValidUrl(f?.path)) {
          const { file } = appendScreenSizesToId({
            id: f?.id,
            sizes: [...ImagesScreenSizes.post],
            rotateAll: f?.rotate,
            userId: user?._id,
            file: newFile.orignalFile,
            createpathagain: true,
          });
          newFile.orignalFile = file || newFile.orignalFile;
          return {
            ...newFile,
            height: f.orignalFile.height || 0,
            width: f.orignalFile.width || 0,
            isNew: true,
          };
        }
      });
      dispatch(onFilesUpload({ libraryMedia: [] }));
      dispatch(addInProgressGellaryId(activeFolder?._id));
      dispatch(
        uploadFiles({
          key: activeFolder?._id,
          url: '/image/upload',
          socket,
          files: newMedia as any,
          onCancelFileUpload: ({
            group,
            isAllCancelled,
            isAllUploaded,
          }: CancelFileUploadCallbackProps) => {
            if (isAllUploaded || isAllCancelled) {
              return res(onSubmitMedia?.(group));
            }
          },
          onFileUploadingFailed: ({
            groupId,
            group,

            isUploadingProcessCompleted,
            isAllFailed,
          }: any) => {
            if (isAllFailed && isUploadingProcessCompleted) {
              console.log({ activeFolder: activeFolder?._id });
              dispatch(removeInProgressGellaryId(activeFolder?._id || ''));
              setTimeout(() => {
                dispatch(
                  onRemoveGroup({
                    groupId: groupId,
                  }),
                );
              }, 200);
            }
            if (!isAllFailed && isUploadingProcessCompleted) {
              res(onSubmitMedia?.(group));
            }
          },
          onCompletedCallback: (fileGroup: any) => {
            // dispatch(onFilesUpload({ libraryMedia: [] }));
            dispatch(removeInProgressGellaryId(activeFolder?._id || ''));
            return res(onSubmitMedia?.(fileGroup));
          },
        }),
      );
    });
  };
  const DeleteButton = () => {
    const checkifMorethanOneFolder = useAppSelector((state) =>
      checkifOneOrMoreFolderExist(state, ''),
    );

    return !isProgressUploadingMedia && checkifMorethanOneFolder ? (
      <div
        className="link"
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          onDeleteHandler();
        }}
      >
        <RecycleBin width={18} height={18} />
      </div>
    ) : null;
  };
  const onDeleteTrashItem = (item: MediaLibrary, index: number) => {
    dispatch(
      deleteMediaInTrashLibrary({
        mediaId: item._id || '',
        index,
        folderId: activeFolder?._id,
        errorConfig: {
          ignoreStatusCodes: [500, 404],
        },
        options: {
          params: {
            sellerId: managedAccountId,
          },
        },
      }),
    )
      .unwrap()
      .then(() => {
        toast.success('Media deleted successfully!');
        dispatch(setLibraryLoading({ loading: false }));
      })
      .catch(() => {
        // dispatch(
        //   addLibraryItem({ itemId: item._id, folderId: folderId, item }),
        // );
        dispatch(setLibraryLoading({ loading: false }));
        dispatch(
          addMediaToSelectedMedias({
            item: { ...item, index },
            isChecked: true,
          }),
        );
        toast.error('Unable to delete the Media!');
      });
  };
  const onDeleteItem = (item: MediaLibrary, index: number) => {
    let message = 'Once deleted, your media will be moved to Trash folder!';
    if (activeFolder?._id === 'trash') {
      message = 'Once deleted, you will not be able to restore it!';
    }
    swal({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    } as any)
      .then(async (willDelete) => {
        if (willDelete) {
          dispatch(
            removeFromSelectedMediaandUpdateSort({
              item: { ...item },
              index: index,
              folderId: activeFolder?._id,
              itemId: item._id,
            }),
          );
          dispatch(setLibraryLoading({ loading: true }));
          if (activeFolder?._id === 'trash') {
            return onDeleteTrashItem(item, index);
          }
          dispatch(
            deleteMediaInLibrary({
              mediaId: item._id || '',
              index,
              folderId: activeFolder?._id,
              errorConfig: {
                ignoreStatusCodes: [500, 404],
              },
              options: {
                params: {
                  sellerId: managedAccountId,
                },
              },
            }),
          )
            .unwrap()
            .then(() => {
              toast.success('Media deleted successfully!');
              dispatch(setLibraryLoading({ loading: false }));
            })
            .catch(() => {
              // dispatch(
              //   addLibraryItem({ itemId: item._id, folderId: folderId, item }),
              // );
              dispatch(setLibraryLoading({ loading: false }));
              dispatch(
                addMediaToSelectedMedias({
                  item: { ...item, index },
                  isChecked: true,
                }),
              );
              toast.error('Unable to delete the Media!');
            });
        }
      })
      .catch((e) => console.log(e));
  };

  const ShowProgressForUploading = () => {
    const uploadingGroup = useAppSelector((state) =>
      selectGroupBykey(state, activeFolder?._id || ''),
    );
    const libraryMedia = useAppSelector(
      (state) => state?.libraryMedia?.libraryMedia,
    );
    const handleChangeFiles = (files: any) => {
      dispatch(
        onFilesUpload({
          libraryMedia: files,
        }),
      );
    };
    const show = !!uploadingGroup?.files?.length || !!libraryMedia?.length;
    return show ? (
      <UploaderView
        accept={{ 'image/*': [], 'video/*': [], 'audio/*': [] }}
        files={uploadingGroup?.files || libraryMedia || []}
        onChange={handleChangeFiles}
        openinGallery={!isProgressUploadingMedia}
        className="uploader_view"
        showButton={!isProgressUploadingMedia}
        showCloseIcon={!isProgressUploadingMedia}
      />
    ) : null;
  };
  const ShowActionsButtons = () => {
    const libraryMedia = useAppSelector(
      (state) => state?.libraryMedia?.libraryMedia,
    );

    return !!libraryMedia?.length ? (
      <div className="text-center btn-publish-holder">
        <Button
          className="btn-publish"
          size="middle"
          shape="circle"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(onFilesUpload({ libraryMedia: [] }));
          }}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={onSubmitHandler}
          className="btn-publish"
          size="middle"
          shape="circle"
        >
          Save to collection
        </Button>
      </div>
    ) : null;
  };

  const ShowUploadButton = () => {
    return isProgressUploadingMedia ? null : (
      <LibrarayUploadEditor GalleryIcon={true} showPreview={false} title="" />
    );
  };
  const ShowUploaderView = () => {
    const libraryMedia = useAppSelector(
      (state) => state?.libraryMedia?.libraryMedia,
    );
    const isShow =
      !activeLibrary?.items?.length &&
      !isProgressUploadingMedia &&
      !loading &&
      !libraryMedia?.length;
    return isShow ? (
      <FileUploader
        className="empty_uploader"
        noClick={!!activeLibrary?.items?.length || !!isProgressUploadingMedia}
        disabled={!!isProgressUploadingMedia}
        customRequest={async (fls) => {
          const newFiles: MediaType[] = await fileChanges(fls, 'standard');
          const totalFiles = newFiles.map((f) => ({
            ...f,
            isPaidType: false,
            islocK: false,
          }));
          dispatch(onFilesUpload({ libraryMedia: totalFiles }));
        }}
        accept={{ 'image/*': [], 'video/*': [], 'audio/*': [] }}
      >
        <DragAndDropView>
          <div className="uploader-wrap">
            <UploadMedia />
            <div className="text">
              Upload or Drag and Drop Images, Audios and Videos
            </div>
          </div>
        </DragAndDropView>
      </FileUploader>
    ) : null;
  };
  const ArrowBackBUtton = () => {
    const [open, onOpen, onClose] = useOpenClose();
    const checkifFilesExist = useAppSelector((state) =>
      checkIfFilesareReadytoUpload(state, ''),
    );
    const onClickbackArrow = (e: any) => {
      e?.stopPropagation();

      if (checkifFilesExist) {
        onOpen();
        return;
      }
      dispatch(resetActiveLibrary());
      setActiveView('left');
    };
    return !isDesktop ? (
      <>
        <span onClick={onClickbackArrow} className="btn-back">
          <ArrowBack />
        </span>
        <ConfirmationModal
          description="You have unsaved changes! Your changes will be discarded."
          isOpen={open}
          onSave={() => {
            onClose();
            dispatch(resetActiveLibrary());
            setActiveView('left');
          }}
          okbuttonText="Discard"
          onClose={onClose}
        />
      </>
    ) : null;
  };
  const TopBar = () => {
    return activeFolder?._id !== 'trash' ? (
      <>
        <LibraryInputModal
          managedAccountId={managedAccountId}
          value={activeFolder}
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
        />
        <div className="top-bar">
          <div className="left-area">
            <ArrowBackBUtton />
            <strong className="title">
              <FolderSvg />
              {activeFolder?.name}
            </strong>
          </div>
          <div className="links-holder">
            <div className="link">
              <ShowUploadButton />
            </div>
            <div
              className="link"
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <EditPencil />
            </div>
            <DeleteButton />
          </div>
        </div>
        <ShowUploaderView />
      </>
    ) : (
      <div className="top-bar">
        <div className="left-area">
          <ArrowBackBUtton />
          <strong className="title">
            <FolderSvg />
            {activeFolder?.name}
          </strong>
        </div>
      </div>
    );
  };
  return (
    <div className={className}>
      {activeFolder?._id ? (
        <>
          <TopBar />
          <FileUploader
            noClick={true}
            disabled={
              !!isProgressUploadingMedia ||
              activeFolder._id === 'trash' ||
              isDragging
            }
            customRequest={async (fls) => {
              const newFiles: MediaType[] = await fileChanges(fls, 'standard');
              const totalFiles = newFiles.map((f) => ({
                ...f,
                isPaidType: false,
                islocK: false,
              }));

              dispatch(onFilesUpload({ libraryMedia: totalFiles }));
            }}
            // accept={['image/*', 'video/*', 'audio/*']}
            accept={{ 'image/*': [], 'video/*': [], 'audio/*': [] }}
          >
            <div className="uploader-box">
              {/* <PaidMessageComp /> */}
              {/* <ShowProgress /> */}
              <div className="uploader-images-parent">
                <ShowProgressForUploading />
                <ShowActionsButtons />
              </div>
              {/* {!!activeLibrary?.items?.length && ( */}
              <LibraryTemplateModal
                className={className}
                templates={activeLibrary?.items || []}
                loadMore={loadMore}
                isOpen={true}
                setActiveView={setActiveView}
                isLoading={loading}
                onItemSelect={onItemSelect}
                onDeleteItem={onDeleteItem}
                notAllowedTypes={notAllowedTypes}
                showEmptyMessage={false}
              />
            </div>
          </FileUploader>
          {showActionFooter ? (
            <ModalFooter
              addtoButtontext={addtoButtontext}
              onSubmit={onPostHandler}
              onCancel={() => {
                dispatch(resetSelectedItems());
              }}
            />
          ) : null}
          {/* )} */}
        </>
      ) : null}
    </div>
  );
};
export default styled(MediaLibraryRightView)`
  .uploader-images-parent {
    .btn-publish-holder {
      padding: 8px;
    }
  }

  .btn-publish-holder {
    .button {
      min-width: 107px;
      padding: 8px 15px;
    }
  }
  .empty_uploader {
    margin-top: 5px;
  }
`;
