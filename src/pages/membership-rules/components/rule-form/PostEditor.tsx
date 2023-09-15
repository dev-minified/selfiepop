import { updateImagesPhysically } from 'api/sales';
import { ImagesScreenSizes } from 'appconstants';
import { PostMember, RuleMedia, TipDollar } from 'assets/svgs';
import attrAccept from 'attr-accept';
import classNames from 'classnames';
import Createpost from 'components/CreatePost';
import NewButton from 'components/NButton';
import FocusInput from 'components/focus-input';
import EditBack from 'components/partials/components/profileBack';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useSocket from 'hooks/useSocket';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import smoothScrollIntoView from 'smooth-scroll-into-view-if-needed';
import { onRemoveGroup, uploadFiles } from 'store/reducer/files';
import styled from 'styled-components';
import { processFilesForRotation } from 'util/index';
import { v4 } from 'uuid';
import * as yup from 'yup';
import Tagger from './Tagger';

type Props = {
  className?: string;
  onSave?: (values: any) => void;
  onCancel?: () => void;
  value?: any;
  showHeader?: boolean;
  managedAccountId?: string;
};

const validationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  minTip: yup.number().min(0, 'Must be greater than 0'),
});

const UploadRulesMedia: React.FC<Props> = (props) => {
  const { className, onSave, onCancel, value, showHeader, managedAccountId } =
    props;

  const dispatch = useAppDispatch();
  const { socket } = useSocket();
  const postContent = useRef<any>(null);
  const uploadingGroupKey = useRef<string>('');
  const container = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [post, setPost] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const { ruleId } = useParams<any>();
  const postFormRef = useRef<any>();
  const selectedPost = useAppSelector(
    (state) => state.memberPost.selectedPostTemplate,
  );
  const title = useAppSelector((state) => state.header.title);

  useEffect(() => {
    setTimeout(() => {
      if (container.current) {
        smoothScrollIntoView(container.current, {
          scrollMode: 'if-needed',
          block: 'start',
        });
      }
    }, 600);
  }, []);

  useEffect(() => {
    setPost(value);
  }, [value]);

  const setUploadingGroupKey = (key: string) => {
    uploadingGroupKey.current = key;
  };
  const key = `rules-post${managedAccountId + '-' + ruleId || v4()}`;
  const handleSave = async () => {
    const res = await validationSchema
      .validate(post, { abortEarly: false })
      .catch((err) => {
        const errs = err.inner.reduce((acc: any, error: any) => {
          acc[error.path] = error.message;
          return acc;
        }, {});
        setErrors(errs);
      });
    if (!res) {
      return;
    }
    setUploading(true);

    setUploadingGroupKey(key);
    if (postFormRef?.current) {
      postFormRef.current.clearForm();
    }
    if (postContent.current?.files?.length > 0) {
      dispatch(
        uploadFiles({
          key,
          url: '/image/upload',
          socket,
          files: postContent.current.files,
          onCompletedCallback: (fileGroup: any) => {
            dispatch(
              onRemoveGroup({
                groupId: fileGroup?.key,
              }),
            );
            const { filesWithoutRotation = [], newFiles } =
              processFilesForRotation(fileGroup.files, ImagesScreenSizes.post);
            const promises: any = [];
            newFiles?.forEach((f: any) => {
              promises.push(
                updateImagesPhysically({
                  url: f.oldUrl,
                  name: f.path.split('/').pop(),
                }),
              );
            });
            Promise.all([...promises])
              .then(async () => {
                onSave?.({
                  ...post,
                  ...postContent.current,
                  files: filesWithoutRotation.map((file: any) => {
                    const isVideo = attrAccept({ type: file.type }, 'video/*');
                    const isAudio = attrAccept({ type: file.type }, 'audio/*');
                    const width = file.width;
                    const height = file.height;
                    return {
                      path: file.path,
                      url: file.url,
                      size: file.size,
                      isTrusted: file.isTrusted,
                      name: file.name,
                      type: isVideo
                        ? 'video/mp4'
                        : !isAudio
                        ? `image/${(file.path ? file.path : file.url)
                            ?.split('.')
                            ?.pop()}`
                        : file.type,
                      isPaidType: file.isPaidType,
                      isLocK: file.islocK,
                      thumbnail: file.thumbnail,
                      thumb: file.thumbnail,
                      videoDuration: file.videoDuration,
                      duration: file.duration,
                      id: file.id,
                      _id: file.id,
                      updatedAt: file.updatedAt || new Date().getTime() + '',
                      width,
                      height,
                    };
                  }),
                });
                setUploading(false);
              })
              .catch((e) => console.log({ e }));
          },
        }),
      );
    } else {
      onSave?.({ ...post, ...postContent.current });
    }
  };

  return (
    <div className={classNames(className, 'block-creation')} ref={container}>
      {showHeader && (
        <EditBack title={title} onClick={() => onCancel?.()} backUrl="#" />
      )}
      <div className="heading-holder">
        <FocusInput
          materialDesign
          label="Post Title"
          name="title"
          onChange={(e) => {
            if (e.target.value) {
              setErrors((err: any) => ({ ...err, title: undefined }));
            }
            setPost((prev: any) => ({ ...prev, title: e.target.value }));
          }}
          value={post?.title}
          touched={true}
          error={errors.title}
        />
      </div>
      <div className="create">
        <div className="block-heading">
          <div className="img-holder">
            <PostMember />
          </div>
          <p>Add this post to this Member Page</p>
        </div>
        <Createpost
          showBackButton={false}
          showForwardButton={false}
          selectedPost={selectedPost}
          uploadingFilesKey={key}
          getMemberships
          ref={postFormRef}
          text={value?.text}
          membershipAccessType={value?.membershipAccessType}
          files={uploading ? [] : value?.files}
          onChange={(values) => {
            postContent.current = {
              ...postContent.current,
              text: values.text || '',
              membershipAccessType: values.membershipAccessType,
            };
          }}
          onFilesChange={(files) => {
            postContent.current = { ...postContent.current, files };
          }}
          actions={false}
          managedAccountId={managedAccountId}
        />
      </div>
      <div className="tags-frame">
        <div className="block-heading">
          <div className="img-holder">
            <RuleMedia />
          </div>
          <p>Post Actions</p>
        </div>
        <div className="tags-block">
          <div className="label-title">Date Offset (days):</div>
          <FocusInput
            materialDesign
            label="Add date offset"
            name="dateOffset"
            type="number"
            min={0}
            value={post?.dateOffset}
            touched={true}
            error={errors.dateOffset}
            onChange={(e) =>
              setPost((prev: any) => ({
                ...prev,
                dateOffset: e.target.value,
              }))
            }
          />
        </div>
        <div className="tags-block">
          <Tagger
            name="addTagsOnUnlock"
            title="If user unlocks, add tag(s):"
            value={post?.addTagsOnUnlock || []}
            onChange={(e) => {
              setPost((prev: any) => ({
                ...prev,
                addTagsOnUnlock: e.target.value,
              }));
            }}
          />
          <Tagger
            title="If user unlocks, remove tag(s):"
            value={post?.removeTagsOnUnlock || []}
            name="removeTagsOnUnlock"
            onChange={(e) => {
              setPost((prev: any) => ({
                ...prev,
                removeTagsOnUnlock: e.target.value,
              }));
            }}
          />
        </div>
        <div className="tags-block">
          <div className="label-title">If user tips at least:</div>
          <FocusInput
            materialDesign
            label="Add minimum price"
            name="minTip"
            hasIcon={true}
            type="number"
            min={0}
            value={post?.minTip}
            prefixElement={<TipDollar />}
            touched={true}
            error={errors.minTip}
            onChange={(e) =>
              setPost((prev: any) => ({
                ...prev,
                minTip: e.target.value,
              }))
            }
          />
          <Tagger
            title="Add tag(s):"
            value={post?.addTagsMinTip || []}
            name="addTagsMinTip"
            onChange={(e) => {
              setPost((prev: any) => ({
                ...prev,
                addTagsMinTip: e.target.value,
              }));
            }}
          />
          <Tagger
            title="Remove tag(s):"
            value={post?.removeTagsMinTip || []}
            name="removeTagsMinTip"
            onChange={(e) => {
              setPost((prev: any) => ({
                ...prev,
                removeTagsMinTip: e.target.value,
              }));
            }}
          />
        </div>
      </div>
      <footer className="footer-btns">
        <NewButton
          type="default"
          size="large"
          shape="circle"
          onClick={onCancel}
          disabled={uploading}
        >
          Cancel
        </NewButton>
        <NewButton
          type="primary"
          size="large"
          shape="circle"
          onClick={handleSave}
          disabled={uploading}
          isLoading={uploading}
        >
          Save
        </NewButton>
      </footer>
    </div>
  );
};

export default styled(UploadRulesMedia)`
  background: var(--pallete-background-default);

  .heading-holder {
    padding: 20px 20px 0;
    border: 1px solid #eaeef1;

    .mb-20 {
      margin: 0;
    }
  }

  .create {
    padding: 20px;

    .materialized-input textarea.form-control {
      padding: 0;
    }
  }

  .tags-area {
    margin: 0 0 18px;

    &:last-child {
      margin: 0;
    }

    .label-area {
      margin: 0 !important;
    }

    .tagslist {
      margin: 0 !important;
      border: 1px solid #e6ecf1;
      padding: 3px 30px 3px 3px;
      margin: 4px;
      position: relative;

      .button {
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translate(0, -50%);
        color: #e6dee8;

        &:hover {
          color: var(--pallete-text-main);
        }

        svg {
          width: 19px;
          height: 19px;
        }
      }

      .form-control {
        font-size: 15px;
        line-height: 22px;
        font-weight: 500;
        border-left-color: rgba(186, 163, 193, 0.36);
        min-width: 135px !important;
        margin: 4px !important;
        flex-grow: 1;
        flex-basis: 0;

        &::placeholder {
          color: #c3c4d2;
        }
      }

      .tag {
        background: var(--pallete-primary-main);
        margin: 3px 4px;
        font-size: 15px;
        line-height: 18px;
        font-weight: 400;
        text-transform: none;
        padding: 7px 44px 7px 16px;

        .icon-close {
          right: 9px;
          font-size: 18px;
          width: 19px;
          height: 19px;
          line-height: 1;

          &:before {
            display: none;
          }

          svg {
            width: 100%;
            height: auto;
            vertical-align: top;
          }
        }
      }
    }

    .images-list {
      margin: 0 0 -6px;
    }

    .btn-media {
      font-size: 16px;
      line-height: 20px;
      font-weight: 700;
      background: #e6dee8;
      padding: 10px;
      color: #fff;

      &:hover {
        background: var(--pallete-primary-main);
        border-color: transparent;
      }

      svg {
        margin: -2px 15px 0 0;
      }
    }
  }

  .tags-frame {
    padding: 20px;
  }

  .block-heading {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 15px;
    line-height: 18px;
    font-weight: 500;
    color: var(--pallete-text-main);
    margin: 0 0 20px;

    .img-holder {
      width: 40px;
      min-width: 40px;

      svg {
        width: 100%;
        height: auto;
        display: block;
      }
    }

    p {
      margin: 0 0 0 15px;
    }
  }

  .tags-block {
    border: 1px solid #e6ecf1;
    border-radius: 4px;
    background: var(--pallete-background-gray-secondary-light);
    padding: 15px;
    margin: 0 0 30px;

    .pre-fix {
      top: 9px;
      left: 12px;

      path {
        fill: #c3c4d2;
      }
    }
  }

  .label-title {
    font-size: 13px;
    line-height: 16px;
    color: var(--pallete-text-light-50);
    font-weight: 500;
    margin: 0 0 10px;
    display: block;
  }

  .footer-btns {
    text-align: center;
    border-top: 1px solid var(--pallete-colors-border);
    padding: 35px 20px;

    @media (max-width: 767px) {
      padding: 20px;
    }
  }
`;
