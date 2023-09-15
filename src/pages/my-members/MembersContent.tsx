import { createPost, editPost, updateImagesPhysically } from 'api/sales';
import { ArrowRightAlt, PostIcon } from 'assets/svgs';
import attrAccept from 'attr-accept';
// import Createpost from 'components/CreatePost';
import Createpost from 'components/CreatePost';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';

import { ReactElement } from 'react';
import { isDesktop } from 'react-device-detect';
import { onRemoveGroup, uploadFiles } from 'store/reducer/files';

import {
  insertBeginningOfUserPosts,
  removeSelectedPost,
  toggleEditPost,
  updateEditSchedulePost,
} from 'store/reducer/member-post';
import styled from 'styled-components';
import swal from 'sweetalert';
import {
  getFilemetaData,
  // getImageURL,
  // isValidUrl,
  processFilesForRotation,
} from 'util/index';

import { ImagesScreenSizes } from 'appconstants';
import { toast } from 'components/toaster';
import useSocket from 'hooks/useSocket';
import { resetLibraryMedia } from 'store/reducer/global';

interface Props {
  className?: string;
}
// const PAGE_LIMIT = 10;
function Index({ className }: Props): ReactElement {
  // const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { socket } = useSocket();
  // const cancelToken = useRef<any>();
  const selectedPost = useAppSelector(
    (state) => state.memberPost.selectedPostTemplate,
  );

  // useEffect(() => {
  //   cancelToken.current = axios.CancelToken.source();
  //   if (
  //     !isDesktop &&
  //     user.links?.find(
  //       (link: any) => link.popLinksId?.popType === 'chat-subscription',
  //     )
  //   ) {
  //     dispatch(
  //       getUserMemberships({
  //         customError: { ignoreStatusCodes: [404] },
  //         options: {
  //           cancelToken: cancelToken.current.token,
  //         },
  //       }),
  //     ).catch((e) => console.log(e));
  //   }
  //   // if (isDesktop) {
  //   //   dispatch(reInitializeState());
  //   //   const paramsList: any = {
  //   //     skip: 0 * PAGE_LIMIT,
  //   //     limit: PAGE_LIMIT,
  //   //     sort: getSortbyParam('publishAt'),
  //   //     order: 'desc',
  //   //   };
  //   //   getPaginatedPosts(paramsList, () => {}, {
  //   //     cancelToken: cancelToken.current.token,
  //   //   }).catch((e) => console.log(e));
  //   // }
  //   return () => {
  //     cancelToken.current.cancel('Operation canceled due to Unmount.');
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  // const getPaginatedPosts = async (
  //   params: Record<string, any> = {},
  //   callback?: (...args: any) => void,
  //   options?: AxiosRequestConfig,
  // ) => {
  //   dispatch(
  //     myPostsList({
  //       params,
  //       callback,
  //       customError: { ignoreStatusCodes: [404] },
  //       options,
  //     }),
  //   ).catch((e) => console.log(e));
  // };

  const { showRightView } = useControllTwopanelLayoutView();
  const messagekey = 'members-content';
  const processFilesAfterGroupUpload = async (files: any[], key: string) => {
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

      const isImage = attrAccept({ type: f.type }, 'image/*');
      // const isAudio = attrAccept({ type: f.type }, 'audio/*');
      f = await getFilemetaData(f);
      const isVideo = attrAccept({ type: f.type }, 'video/*');
      const width = f.width || 0;
      const height = f.height || 0;
      // const isUploaded: boolean = isValidUrl(f?.path);
      const blurThumbnail = f?.blurThumbnail;
      // if (!blurThumbnail && isUploaded && !isAudio) {
      //   blurThumbnail = getImageURL({
      //     url: f.imageURL || f.thumb || f.url || f.path,
      //     settings: {
      //       bdesktop: true,
      //     },
      //   })?.url;
      // }
      const file: any = {
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
        blurThumbnail: blurThumbnail,
        width,
        height,
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
  const onSubmitPost = async (values: Record<string, any>, form: any) => {
    // const messagekey = uuid();
    return new Promise((res) => {
      if (!!values?.media?.length) {
        // eslint-disable-next-line
        const { media, ...rest } = values;
        dispatch(
          uploadFiles({
            key: messagekey,
            url: '/image/upload',
            socket,
            files: values.media,
            onCancelFileUpload: ({
              group,
              isAllCancelled,
              isAllUploaded,
            }: CancelFileUploadCallbackProps) => {
              if (isAllUploaded || isAllCancelled) {
                return res(onSubmit(rest, form, group));
              }
            },
            onCompletedCallback: (fileGroup: any) => {
              dispatch(resetLibraryMedia());
              return res(onSubmit(rest, form, fileGroup));
            },
          }),
        );
      } else {
        return res(onSubmit(values, form, { files: [] }));
      }
    });
  };
  const onSubmit = async (
    values: any,
    form: any,
    fileGroup: Record<string, any>,
  ) => {
    // return;
    const media = await processFilesAfterGroupUpload(
      fileGroup?.files || [],
      fileGroup?.key,
    );
    if (!media?.length && values.text === '') {
      toast.error('Please select aleast one media or enter text');
      return;
    }

    delete values?.postType;
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
    const objTem = selectedPost?.template_id
      ? {
          media: [...fWithoutRotation],
          membershipAccessType: values?.membershipAccessType,
          text: values?.text as string,
          templateId: !newFiles?.length ? selectedPost?.template_id : null,
          userId: selectedPost?.userId,
          _id: selectedPost?._id,
        }
      : {};
    const post: any = { ...values, media: fWithoutRotation, ...objTem };
    const promises: any = [];
    newFiles?.forEach((f: any) => {
      promises.push(
        updateImagesPhysically({
          url: f.oldUrl,
          name: f.path.split('/').pop(),
        }),
      );
    });
    if (selectedPost?._id && !selectedPost?.template_id) {
      const EditPost: any = {
        ...values,
        media: fWithoutRotation,

        postText: values.text,
      };
      delete EditPost.publishAt;
      return await Promise.all([...promises])
        .then(async () => {
          return await editPost((EditPost as any)?._id, {
            ...EditPost,
          }).then((data: any) => {
            dispatch(updateEditSchedulePost(data));
            dispatch(toggleEditPost({ isOpen: false }));
            form.resetForm();
          });
        })
        .catch((e) => console.log({ e }));
    } else {
      delete post.publishAt;
      return await Promise.all([...promises])
        .then(async () => {
          return await createPost(post)
            .then((v) => {
              dispatch(insertBeginningOfUserPosts({ data: v }));
              dispatch(removeSelectedPost());
              form.resetForm();
            })
            .catch((err) => swal('', err.message, 'error'));
        })
        .catch((e) => console.log({ e }));
    }
  };
  return (
    <div className={`${className}`}>
      {!isDesktop && (
        <div className="mobile-posts-arrow">
          <div
            className="post-link"
            onClick={() => {
              showRightView();
            }}
          >
            <strong className="mr-10">See Posts</strong>
            <ArrowRightAlt />
          </div>
        </div>
      )}
      <div className="members-header">
        <div className="header-image">
          <PostIcon />
        </div>
        <div className="header-text">
          <strong className="header-title">
            Post to your members only page
          </strong>
          <p>
            Post content to your members only page and set which tier of member
            gets access to the post!
          </p>
        </div>
      </div>
      <div className="create">
        <Createpost
          uploadingFilesKey={messagekey}
          onSubmit={onSubmitPost}
          selectedPost={selectedPost}
          showBackButton={false}
          showForwardButton={false}
          getMemberships={!isDesktop}
        />
      </div>
    </div>
  );
}
export default styled(Index)`
  background: var(--pallete-background-default);
  padding: 25px 20px;

  @media (max-width: 767px) {
    padding: 15px 20px;
  }

  .mobile-posts-arrow {
    margin: 0 0 15px;
    text-align: right;

    .post-link {
      display: inline-block;
      vertical-align: top;
    }

    svg {
      path {
        fill: #000;

        .sp_dark & {
          fill: #fff;
        }
      }
    }
  }

  .materialized-input {
    .form-control {
      padding: 0;
    }
  }

  .imag_media {
    .img-container {
      width: 136px;
      height: 136px;
      min-width: 136px;

      @media (max-width: 767px) {
        width: 77px;
        height: 77px;
        min-width: 77px;
      }
    }

    .upload_placeholder {
      height: 136px;
      width: 60px;
      min-width: 60px;
      transition: all 0.4s ease;

      @media (max-width: 767px) {
        height: 77px;
      }

      &:hover {
        svg {
          color: var(--pallete-primary-main);
        }
      }

      svg {
        width: 26px;
        height: 26px;
        color: #a3a5ba;
      }
    }
  }

  .members-header {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    color: var(--pallete-text-lighter-50);
    font-size: 14px;
    line-height: 18px;
    font-weight: 400;
    margin: 0 0 15px;

    .header-image {
      width: 40px;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }

    .header-text {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
      padding: 0 0 0 10px;
    }

    .header-title {
      display: block;
      font-size: 15px;
      line-height: 18px;
      font-weight: 500;
      margin: 0 0 4px;
      color: var(--pallete-text-main);
    }

    p {
      margin: 0;
    }
  }

  .price-box {
    background: var(--pallete-background-gray-secondary-light);

    .selection-title {
      color: var(--pallete-text-secondary-250);
    }
  }

  .btns-actions-area {
    .icons-actions {
      color: var(--pallete-primary-main);

      @media (max-width: 767px) {
        margin: 5px 0;
      }
    }
  }
`;
