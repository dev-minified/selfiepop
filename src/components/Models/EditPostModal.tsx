// import { StarFill } from 'assets/svgs';
import { editPost, updateImagesPhysically } from 'api/sales';
import { FireIcon } from 'assets/svgs';
import Createpost from 'components/CreatePost';
import Model from 'components/modal';
import { toast } from 'components/toaster';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useSocket from 'hooks/useSocket';
import { ReactElement, useCallback, useEffect, useRef } from 'react';
import { onRemoveGroup, uploadFiles } from 'store/reducer/files';
import { v4 as uuid } from 'uuid';

import { ImagesScreenSizes } from 'appconstants';
import attrAccept from 'attr-accept';
import { resetLibraryMedia } from 'store/reducer/global';
import {
  toggleEditPost,
  updateEditSchedulePost,
} from 'store/reducer/member-post';
import styled from 'styled-components';
import { getFilemetaData, processFilesForRotation } from 'util/index';
type Props = {
  onClose?: (...args: any) => void;
  isOpen: boolean;
  className?: string;
  managedAccountId?: string;
};

function EditPostModal({
  onClose,

  className,
  managedAccountId,
}: Props): ReactElement {
  const selectedPost = useAppSelector(
    (state) => state.memberPost.selectedScheduledPost,
  );
  const showEditPost = useAppSelector((state) => state.memberPost.showEditPost);
  const { socket } = useSocket();
  const postRef = useRef('');

  const dispatch = useAppDispatch();
  const messagekey = `edit-post-${selectedPost?._id || uuid()}`;
  useEffect(() => {
    if (selectedPost?._id && postRef.current !== selectedPost?._id) {
      postRef.current = messagekey;
    }
  }, [selectedPost?._id]);

  const handleClose = () => {
    dispatch(toggleEditPost({ isOpen: false }));
    dispatch(resetLibraryMedia());
    onClose && onClose();
  };
  const onSubmitPost = async (values: Record<string, any>, form: any) => {
    // form?.resetForm();
    return new Promise((res) => {
      if (!!(values?.media || [])?.length) {
        dispatch(
          uploadFiles({
            key: messagekey,
            url: '/image/upload',
            socket,
            files: values.media,
            onCancelFileUpload: ({
              group,
              isInprogress,
            }: CancelFileUploadCallbackProps) => {
              if (!isInprogress) {
                return res(onSubmit(values, form, group));
              }
            },
            onCompletedCallback: (fileGroup: any) => {
              dispatch(resetLibraryMedia());
              return res(onSubmit(values, form, fileGroup));
            },
          }),
        );
      } else {
        return res(onSubmit(values, form, { files: [], key: messagekey }));
      }
    });
  };
  const processFilesAfterGroupUpload = async (files: any[], key: string) => {
    dispatch(
      onRemoveGroup({
        groupId: key,
      }),
    );
    const newFiles = [];
    for (let j = 0; j < files?.length; j++) {
      let f = files[j];

      const isVideo = attrAccept({ type: f.type }, 'video/*');
      const isImage = attrAccept({ type: f.type }, 'image/*');
      f = await getFilemetaData(f);
      const blurThumbnail = f?.blurThumbnail || undefined;
      const file: any = {
        blurThumbnail,
        duration: f.duration,
        _id: f._id ? f._id : f.id,
        id: f._id ? f._id : f.id,
        imageURL: isImage ? f.path || f.imageURL : f.thumb,
        isTrusted: !!f.isTrusted,
        islocK: !!f.islocK,
        size: f.size,
        url: f.path || f.url,
        // type: isVideo ? 'video/mp4' : f?.orignalFile?.type || f.type,
        type: isVideo ? 'video/mp4' : f.type || f?.orignalFile?.type,
        path: f.path || f.url,
        thumbnail: f.thumbnail || f.thumb,
        isPaidType: !!f.isPaidType,
        name: f.name,
        videoDuration: f.timeDuration,
        updatedAt: f.updatedAt || new Date().getTime() + '',
        width: f.width,
        height: f.height,
      };

      if (f.rotate !== undefined && !f.isNew) {
        const isRotateable = (((f.rotate || 0) % 360) + 360) % 360 !== 0;
        if (isRotateable) {
          file.rotate = f.rotate;
          file.updatedAt = new Date().getTime();
        }
      }

      newFiles.push(file);
    }
    return newFiles;
  };
  const onSubmit = useCallback(
    async (values: any, form: any, fileGroup?: Record<string, any>) => {
      // return;
      const media = await processFilesAfterGroupUpload(
        fileGroup?.files || [],
        fileGroup?.key,
      );
      if (!media?.length && values.text === '') {
        toast.error('Please select aleast one media or enter text');
        return;
      }
      const newMedia: any[] = media || [];

      const { filesWithoutRotation = [], newFiles } = processFilesForRotation(
        newMedia,
        ImagesScreenSizes.post,
      );
      const fWithoutRotation = filesWithoutRotation.map((file) => {
        const isVideo = attrAccept({ type: file.type }, 'video/*');
        const isAudio = attrAccept({ type: file.type }, 'audio/*');
        const type = isVideo
          ? 'video/mp4'
          : !isAudio
          ? `image/${(file.path ? file.path : file.url)?.split('.')?.pop()}`
          : file.type;
        return { ...file, type };
      });
      if (selectedPost?._id) {
        const EditPost: any = {
          ...values,
          media: fWithoutRotation,
          postText: values.text,
        };
        const promises: any = [];
        newFiles?.forEach((f: any) => {
          promises.push(
            updateImagesPhysically({
              url: f.oldUrl,
              name: f.path.split('/').pop(),
            }),
          );
        });
        return await Promise.all([...promises])
          .then(async () => {
            return await editPost(
              (EditPost as any)?._id,
              {
                ...EditPost,
              },
              { sellerId: managedAccountId },
            ).then((data: any) => {
              dispatch(updateEditSchedulePost(data));
              if (fileGroup?.key) {
                if (postRef.current === fileGroup?.key) {
                  dispatch(toggleEditPost({ isOpen: false }));
                }
              }
            });
          })
          .catch((e) => console.log({ e }));
      }
    },
    [selectedPost?._id],
  );
  return (
    <>
      {showEditPost ? (
        <Model
          className={className}
          isOpen={showEditPost}
          title={
            <div className="title-holder user_list">
              <span className="title-area">
                <span className={`title-icon`}>{<FireIcon />}</span>
                <span className="title-text">{'Edit Post'}</span>
              </span>
            </div>
          }
          showFooter={false}
          onClose={handleClose}
        >
          <Createpost
            editPost={true}
            uploadingFilesKey={messagekey}
            onSubmit={onSubmitPost}
            hasTemplate={false}
            selectedPost={selectedPost}
            showBackButton={false}
            showForwardButton={false}
          />
        </Model>
      ) : null}
    </>
  );
}

export default styled(EditPostModal)`
  max-width: 493px;
  border-radius: 10px;
  overflow: hidden;

  .modal-header {
    padding: 20px 24px 13px;
    border: none;

    .title-icon {
      display: inline-block;
      vertical-align: top;
      margin: 0 15px 0 0;
      width: 14px;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }

    .title-text {
      display: inline-block;
      vertical-align: middle;
    }
  }

  .modal-title {
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    flex-grow: 1;
    flex-basis: 0;

    .title-holder {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .modal-body {
    padding: 0;
    max-height: calc(100vh - 120px);
    overflow: auto;
  }

  .action_buttons {
    display: flex;
    justify-content: flex-end;
    padding: 13px 16px;
    border-top: 1px solid #e6ecf1;

    .button {
      min-width: inherit;
      font-size: 16px;
      line-height: 20px;
      margin-bottom: 0;
    }
  }

  .btn-note {
    color: #357ea9;
    text-transform: uppercase;
    background: transparent;
    padding: 3px 10px;

    &:hover {
      color: #fff;
    }

    &.button-sm {
      padding: 3px 10px;
    }

    svg {
      width: 14px;
    }
  }

  .loader-holder {
    padding: 20px;
    text-align: center;
  }

  .membership-area {
    padding: 23px 20px;
    text-align: center;
    font-size: 16px;
    line-height: 22px;
    font-weight: 400;
    max-height: calc(100vh - 170px);
    overflow: auto;

    .title {
      display: block;
      color: #050505;
      margin: 0 0 23px;
      font-weight: 400;

      .sp_dark & {
        /* color: #fff; */
      }
    }

    .profile-detail {
      background: #f4f6f9;
      border-radius: 4px;
      padding: 15px;
    }

    .profile-image {
      border: 2px solid #fff;
      width: 54px;
      height: 54px;
      border-radius: 100%;
      margin: 0 auto 10px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .user-name {
      display: block;
      font-weight: 500;
      margin: 0 0 4px;
    }

    .button {
      min-width: 103px;
      padding: 6px 10px;
    }
  }

  .pop-card {
    border-color: rgb(230, 236, 245);
  }

  .duration {
    display: block;
    font-size: 14px;
    line-height: 18px;
    padding: 10px 0 0;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);

    .sp_dark & {
      /* color: rgba(255, 255, 255, 0.85); */
    }
  }
`;
