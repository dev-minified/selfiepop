// import { Announcement } from 'assets/svgs';
import { FolderAdd, FolderGellary, RecycleBin } from 'assets/svgs';
import Button from 'components/NButton';
import Scrollbar from 'components/Scrollbar';
import { RequestLoader } from 'components/SiteLoader';
import Model from 'components/modal';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useOpenClose from 'hooks/useOpenClose';
import { ReactElement, useEffect, useState } from 'react';
import { isDesktop } from 'react-device-detect';
import {
  checkIfFilesareReadytoUpload,
  createLibraryFolderName,
  getLibraryFolder,
  resetMediaLibraryState,
  setActiveFolder,
} from 'store/reducer/libraryFileUpload';
import styled from 'styled-components';
import DragerPreview from './DragThumnail';
import LibraryInputModal from './LibraryInputModal';
import ListItem from './ListItem';
import MediaLibraryRightView from './MediaLibraryRightView';
import ConfirmationModal from './model/ConfirmationModal';
type Props = {
  isOpen?: boolean;
  showActionFooter?: boolean;
  className?: string;
  onPostHandler?: (files?: any) => void;
  onSave?: (...args: any) => void;
  onCancel?: (...args: any) => void;
  buyer?: Record<string, any>;
  notAllowedTypes?: string[];
  managedAccountId?: string;
  addtoButtontext?: string;
};

function LibraryModal({
  isOpen,
  className,
  onPostHandler,
  // eslint-disable-next-line
  onSave,
  onCancel,
  buyer,
  notAllowedTypes = [],
  managedAccountId = '',
  addtoButtontext = 'Add to Post',
  showActionFooter = true,
}: Props): ReactElement {
  const [libraryInput, setLibraryInput] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'left' | 'right'>('left');
  const libraryList = useAppSelector((state) => state.libraryMedia.libraryList);
  const libraryLoading = useAppSelector(
    (state) => state.libraryMedia.libraryLoading,
  );
  const activeFolder = useAppSelector(
    (state) => state.libraryMedia.activeFolder,
  );
  const isDragging = useAppSelector(
    (state) => state.libraryMedia.itemsDragging,
  );
  const [open, onOpen, onClose] = useOpenClose();
  const trashId = activeFolder?._id === 'trash';
  const dispatch = useAppDispatch();
  const checkifFilesExist = useAppSelector((state) =>
    checkIfFilesareReadytoUpload(state, ''),
  );
  useEffect(() => {
    if (isDragging && !isDesktop) {
      setActiveView('left');
    }
  }, [isDragging]);
  const handleClose = () => {
    onCancel?.();
    setActiveView('left');
  };
  useEffect(() => {
    setLoading(true);
    dispatch(resetMediaLibraryState());
    dispatch(
      getLibraryFolder({
        options: {
          params: {
            sort: 'createdAt',
            order: 'desc',
            sellerId: managedAccountId,
          },
        },
        callback: (data: any) => {
          if (data.success && !!data?.totalCount) {
            dispatch(setActiveFolder({ ...data.items[0], index: 0 }));
            return;
          }
          if (data.success && !data.totalCount) {
            setLoading(true);
            dispatch(
              createLibraryFolderName({
                name: 'My Media',
                options: {
                  params: {
                    sellerId: managedAccountId,
                  },
                },
              }),
            )
              .unwrap()
              .then((data) => {
                dispatch(setActiveFolder({ ...data, index: 0 }));
              })
              .finally(() => {
                setLoading(false);
              });
          }
        },
      }),
    ).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <Model
      className={`${className} ${!isDesktop ? 'library-mobile-view' : ''}`}
      isOpen={!!isOpen}
      title={
        <div className="title-holder user_list">
          <span>
            <span className={`title-icon`}>{<FolderGellary />}</span>
            <span className="title-text">{'MEDIA LIBRARY'}</span>
          </span>
        </div>
      }
      showFooter={false}
      onClose={() => {
        if (checkifFilesExist) {
          onOpen();
          return;
        }
        handleClose();
      }}
    >
      <ConfirmationModal
        description="You have unsaved changes! Your changes will be discarded."
        isOpen={open}
        onSave={() => {
          onClose();
          handleClose();
        }}
        okbuttonText="Discard"
        onClose={onClose}
      />
      {libraryLoading && (
        <div className="library_loading mt-5">
          <RequestLoader
            isLoading={true}
            width="28px"
            height="28px"
            color="var(--pallete-primary-main)"
          />
        </div>
      )}

      {loading && (
        <RequestLoader
          className="mt-5"
          isLoading={true}
          width="28px"
          height="28px"
          color="var(--pallete-primary-main)"
        />
      )}
      <LibraryInputModal
        managedAccountId={managedAccountId}
        isOpen={libraryInput}
        onClose={() => {
          setLibraryInput(false);
        }}
      />

      {libraryList?.items?.length === 0 && !loading && (
        <div className="empty-library">
          <h3>No Library added</h3>
          <Button onClick={() => setLibraryInput(true)} type="primary">
            Add Folder
          </Button>
        </div>
      )}
      {!!libraryList?.items?.length && (
        <div className={`two-cols ${!isDesktop ? 'two-cols-mobile' : ''}`}>
          <DragerPreview />
          <div
            className={`${
              activeView === 'left' || isDesktop ? '' : 'd-none'
            } col-left`}
          >
            <Scrollbar
              autoHeight={true}
              autoHeightMax={'calc(100vh - 87px)'}
              style={{ overflow: 'hidden' }}
            >
              <div className="text-center btn-holder">
                <Button
                  onClick={() => setLibraryInput(true)}
                  outline
                  size="middle"
                  icon={<FolderAdd />}
                  block
                >
                  New Collection
                </Button>
              </div>
              <ul className={`list-gallery`}>
                <ListItem
                  managedAccountId={managedAccountId}
                  key={'Trash'}
                  item={{
                    _id: 'trash',
                    name: 'Trash',
                    userId: user?._id,
                  }}
                  icon={<RecycleBin width={18} height={18} />}
                  onClick={() => {
                    setActiveView('right');
                    dispatch(
                      setActiveFolder({
                        _id: 'trash',
                        name: 'Trash',
                        userId: managedAccountId || user?._id,
                        type: 'trash',
                      }),
                    );
                  }}
                />
                {libraryList?.items?.map((ele: MediaFolder, index: number) => {
                  return (
                    <ListItem
                      managedAccountId={managedAccountId}
                      key={ele._id}
                      item={ele}
                      onClick={() => {
                        setActiveView('right');
                        dispatch(setActiveFolder({ ...ele, index }));
                      }}
                    />
                  );
                })}
              </ul>
            </Scrollbar>
          </div>
          <MediaLibraryRightView
            notAllowedTypes={notAllowedTypes}
            onPostHandler={onPostHandler}
            setActiveView={setActiveView}
            className={`${
              activeView === 'right' || isDesktop ? '' : 'd-none'
            } col-right`}
            isDesktop={isDesktop}
            buyer={buyer}
            managedAccountId={managedAccountId}
            addtoButtontext={addtoButtontext}
            showActionFooter={showActionFooter && !trashId}
          />
        </div>
      )}
    </Model>
  );
}
export default styled(LibraryModal)`
  max-width: 100%;
  padding: 15px;
  margin: 0;
  &.library-mobile-view {
    height: 100%;
  }
  .library_loading {
    position: fixed;
    inset: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    background-color: rgba(255, 255, 255, 0.6);
  }
  .modal-title {
    font-size: 16px;

    .title-icon {
      display: inline-block;
      vertical-align: top;
      margin: -3px 5px 0 0;
    }
  }

  .modal-content {
    border: none;
    height: 100%;
  }

  .modal-body {
    padding: 0;
  }

  .empty-library {
    text-align: center;
    padding: 20px;

    h3 {
      font-size: 20px;
      line-height: 24px;
      color: #333;
      margin: 0 0 10px;
    }
  }

  .sp__card {
    overflow: visible;
    padding: 20px;
    background: none;

    .header {
      display: none;
    }

    .dashed {
      display: none;
    }

    .body {
      padding: 0;
      border: none;
    }

    .footer-card {
      padding: 20px 10px 0;
      background: none;
    }

    .text-input {
      margin-bottom: 0 !important;
    }
  }

  .list-gallery {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 16px;
    line-height: 20px;
    color: #a7b0ba;

    li {
      padding: 12px 12px 12px 54px;
      position: relative;
      cursor: pointer;
      transition: all 0.4s ease;

      &.active,
      &:hover {
        color: #495057;
      }
    }

    .img {
      width: 20px;
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translate(0, -50%);

      svg {
        width: 100%;
        height: auto;
        display: block;

        path {
          fill: currentColor !important;
          fill-opacity: 1 !important;
        }
      }
    }
  }

  .img-container {
    width: calc(33.333% - 2px);
    padding-top: calc(33.333% - 2px);
    margin: 0 1px 2px;

    @media (min-width: 1200px) {
      width: calc(25% - 2px);
      padding-top: calc(25% - 2px);
    }
    @media (min-width: 1600px) {
      width: calc(20% - 2px);
      padding-top: calc(20% - 2px);
    }
    @media (max-width: 1023px) {
      width: calc(50% - 2px);
      padding-top: calc(50% - 2px);
    }

    &:hover {
      .info-area,
      .media-image {
        opacity: 1;
        visibility: visible;
      }
    }
  }

  .media-image {
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s ease;
  }

  .lg-react-element {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow: hidden;
    padding: 2px;

    .image-comp {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }

    .timestamp {
      position: absolute;
      left: 10px;
      top: 10px;
      min-width: 50px;
      text-align: center;
      background: rgba(0, 0, 0, 0.88);
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
      /* min-width: 50px; */
      text-align: center;
      background: rgba(0, 0, 0, 0.8);
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

        &:before {
          opacity: 1;
        }
      }

      .custom-input {
        margin: 0;
        width: 24px;
        height: 24px;
        border: 2px solid rgba(255, 255, 255, 0.8);
        border-radius: 100%;
        background: rgba(0, 0, 0, 0.05);

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

  .top-bar {
    padding: 16px 20px;
    border-bottom: 1px solid #edf1f3;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 767px) {
      padding: 16px;
    }

    .left-area {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
      display: flex;
      align-items: center;
    }

    .btn-back {
      width: 18px;
      margin: 0 10px 0 0;
      display: inline-block;
      vertical-align: middle;

      svg {
        width: 100%;
        height: auto;
        display: block;
      }
    }

    .title {
      color: var(--pallete-text-main-550);
      position: relative;
      font-size: 16px;
      line-height: 20px;
      font-weight: 500;
      padding: 0 0 0 35px;
      min-width: 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      flex-grow: 1;
      flex-basis: 0;

      svg {
        position: absolute;
        left: 0;
        width: 20px;
        height: auto;
        top: 50%;
        transform: translate(0, -50%);
      }
    }

    .placeholder-area {
      display: none;
    }

    .links-holder {
      display: flex;
      align-items: center;
    }

    .link {
      color: var(--pallete-primary-main);
      cursor: pointer;
      margin: 0 0 0 20px;

      path {
        fill: var(--pallete-primary-main);
      }
    }
  }

  .two-cols {
    display: flex;
    height: calc(100vh - 87px);
    @media (max-width: 767px) {
      display: block;
    }
  }
  .two-cols-mobile {
    height: 100%;
  }

  #libraryModalTwoPanel {
    height: calc(100vh - 110px);
  }

  .col-inner-content {
    padding: 0 !important;
  }

  .col-left {
    width: 328px;
    border-right: 1px solid #edf1f3;
    min-width: 328px;
    background: none;

    .sp_dark & {
      border-right: 1px solid #edf1f3;
    }

    @media (max-width: 767px) {
      width: 100%;
      min-width: inherit;
    }

    .rc-scollbar {
      width: auto;
    }

    .btn-holder {
      padding: 14px 20px 5px;

      .button-outline {
        border: 1px solid var(--pallete-text-main-550);
        color: var(--pallete-text-main-550);

        &:hover {
          border-color: var(--pallete-primary-main);
          color: var(--pallete-primary-main);
          background: none;
        }

        svg {
          margin-right: 10px;
        }
      }
    }
  }

  .modal-templates {
    padding: 0;
    flex-grow: 1;
    flex-basis: 0;
    min-height: 0;
  }

  .col-right {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    display: flex;
    flex-direction: column;

    @media (max-width: 767px) {
      width: 100%;
      height: 100%;
      flex: inherit;
    }
  }

  .uploader-parent {
    flex-grow: 1;
    flex-basis: 0;
    min-height: 0;
  }

  .uploader-box {
    padding: 4px;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;
