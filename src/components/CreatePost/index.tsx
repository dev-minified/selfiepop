import { ImagesScreenSizes } from 'appconstants';
import { ArrowBack, ArrowRightAlt } from 'assets/svgs';
import LibraryModal from 'components/LibraryView';
import { Card } from 'components/PrivatePageComponents';
import { toast } from 'components/toaster';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { PostTierTypes } from 'enums';
import { useFormik } from 'formik';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import useOpenClose from 'hooks/useOpenClose';
import isEmpty from 'lodash/isEmpty';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { isMobileOnly } from 'react-device-detect';
import { checkIfGropExist } from 'store/reducer/files';
import {
  resetLibraryMedia,
  setLibraryMedia,
  updateibraryMedia,
} from 'store/reducer/global';
import { removeSelectedPost } from 'store/reducer/member-post';
import { getUserMemberships } from 'store/reducer/salesState';
import styled from 'styled-components';
import { appendScreenSizesToId, isValidUrl } from 'util/index';
import { v4 as uuid } from 'uuid';
import * as yup from 'yup';
import CreatePoll from './CreatePoll';
import UploadAttachmentContainer from './UploadAttachmentContainer';
import WritePost from './WritePost';
import { PaidMessage, StandardMessage } from './components/Message';

dayjs.extend(utc);
type CreatePostTabProps = {
  className?: string;
  selectedPost?: Partial<IPost>;
  selectedTime?: any;
  onClick?: () => void;
  onValidate?: () => boolean;
  showBackButton?: boolean;
  editPost?: boolean;
  changeSubmitLabel?: string;
  schedulePost?: boolean;
  showForwardButton?: boolean;
  setActiveView?: Function;
  getMemberships?: boolean;
  ImageSizes?: string[];
  onChange?: (values: any) => void;
  onFilesChange?: (files: any) => void;
  actions?: boolean;
  text?: string;
  pendingEditMessages?: any;
  view?: 'add' | 'edit';
  membershipAccessType?: IPostMembershipAccessTypes[];
  files?: MediaType[];
  managedAccountId?: string;
  hasTemplate?: boolean;
  onSubmit?: (...args: any) => void | Promise<any>;
  uploadingFilesKey?: string;
};

const BackArrow = styled.div`
  /* position: absolute; */
  /* left: -80%; */
  cursor: pointer;
  transition: all 0.3ms ease;
  &:hover {
    color: var(--pallete-primary-main);
  }
`;
const ForwardArrow = styled.div`
  /* position: absolute; */
  /* left: -80%; */

  text-align: right;
  cursor: pointer;
  transition: all 0.3ms ease;
  padding: 15px 15px 0 0;
  &:hover {
    color: var(--pallete-primary-main);
  }
  svg {
    path {
      fill: black;
    }
  }
`;

let messagekey = uuid();

const CreatePost = forwardRef((props: CreatePostTabProps, ref) => {
  const {
    className,
    setActiveView,
    selectedPost,
    showBackButton = true,
    hasTemplate = true,
    changeSubmitLabel = undefined,
    showForwardButton = false,
    getMemberships = false,
    onValidate,
    ImageSizes: sizes = ImagesScreenSizes.post,
    onChange: onChangeCallback,
    onFilesChange: onFilesChangeCallback,
    actions = true,
    editPost = false,
    text = '',
    membershipAccessType,
    files = [],
    managedAccountId,
    onSubmit: onSubmitCallback,
    uploadingFilesKey = messagekey,
  } = props;
  const [type, setMessageType] = useState('paid');
  const { user } = useAuth();
  const [isNewListModelOpen, onNewListOpenModel, onNewListCloseModel] =
    useOpenClose();
  const [showPoll, setShowPoll] = useState<boolean>(false);
  // const messageFiles = useAppSelector(
  //   (state) => state.global.selectedLibraryMedia,
  // );
  // const [postFiles, setpostFiles] = useState<any[]>([]);
  const { showRightView } = useControllTwopanelLayoutView();
  const isIdExist = useAppSelector((state) =>
    checkIfGropExist(state, messagekey),
  );
  const dispatch = useAppDispatch();
  const handleClick = (type: string) => {
    setMessageType(type);
    type !== 'paid' && showPoll && setShowPoll(false);
  };
  const validationSchema = yup.object().shape({
    media: yup.array().nullable().notRequired(),
    membershipAccessType: yup.array().nullable().notRequired(),
  });

  const form: any = useFormik({
    validationSchema,
    initialValues: {
      text: !isEmpty(selectedPost) ? selectedPost?.postText : '',
      media: [],
      membershipAccessType: !isEmpty(selectedPost)
        ? selectedPost?.membershipAccessType
        : [],
      postDate: dayjs().utc().format(),
      poll: {},
    },
    onSubmit: async (values) => {
      const formValues = { ...values };
      if (onSubmitCallback) {
        form.setFieldValue('media', []);
        await onSubmitCallback?.(formValues, form);
        form.setValues({ ...form.initialValues, media: [] });
      }
    },
  });

  const { setFieldValue, values, setValues, isSubmitting, handleSubmit } = form;

  useImperativeHandle(ref, () => ({
    clearForm() {
      setValues({ ...form.initialValues });
    },
  }));
  useEffect(() => {
    if (getMemberships) {
      dispatch(
        getUserMemberships({
          customError: { ignoreStatusCodes: [404] },
          params: { sellerId: managedAccountId },
        }),
      ).catch((e) => console.log(e));
    }

    return () => {
      dispatch(removeSelectedPost());
      dispatch(resetLibraryMedia());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (text) {
      setFieldValue('text', text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => {
    if (files?.length > 0) {
      setFieldValue('media', files);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  useEffect(() => {
    onChangeCallback?.(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);
  const submitHandler = async () => {
    return handleSubmit();
  };
  messagekey = uploadingFilesKey;

  useEffect(() => {
    if (!selectedPost?._id) {
      setValues(() => {
        return {
          text: text || '',
          media: files as any,
          membershipAccessType: [],
          postDate: dayjs().utc().format(),
          poll: {},
        };
      });
    }
    if (selectedPost?._id && !isIdExist) {
      setValues((value: any) => {
        return {
          ...value,
          ...selectedPost,
          text: selectedPost?.postText,
          media: selectedPost?.media,
        };
      });
      onFilesChangeCallback?.(selectedPost?.media);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPost?._id]);

  const checkMediaIds = (files: any) => {
    const newMedia = [...(files || [])];
    const mediaIds = [...(values?.mediaIds || [])];
    const oldIds: any = {};
    const newIds: any = {};

    if (!!mediaIds?.length) {
      mediaIds.forEach((id) => {
        oldIds[id] = id;
      });
    }

    const nFiles: any = {};
    newMedia.forEach((med) => {
      nFiles[med._id] = med;
      if (oldIds[med?._id]) {
        newIds[med?._id] = med._id;
      }
    });

    return { mediaIds: Object.keys(newIds || {}), libraryObjectFiles: nFiles };
  };
  const getComponent = (
    type: string,
    // onChange: Function,
    files: any,
    // updateFormFiles?: boolean,
  ) => {
    if (type === 'standard' && !!files?.length)
      return (
        <StandardMessage
          openinGallery={true}
          showButton={false}
          onNewListOpenModel={onNewListOpenModel}
          onFileChange={(files) => {
            // if (selectedPost?._id || updateFormFiles) {
            //   setFieldValue(
            //     'media',
            //     files,
            //     // ?.filter((f) => !!f?._id)
            //     // ?.map((f: any) => {
            //     //   const { ...rest } = f;
            //     //   return rest;
            //     // }),
            //   );
            // }

            let newFiles: any[] = files || [];
            if (newFiles?.length) {
              newFiles = files.map((f: any) => {
                const newFl = { ...f };
                if (!f?._id && !isValidUrl(f?.path)) {
                  const { file } = appendScreenSizesToId({
                    id: f?.id,
                    rotateAll: f?.rotate,
                    sizes,
                    userId: user?._id,
                    file: newFl.orignalFile,
                    createpathagain: true,
                  });

                  newFl.orignalFile = file || newFl.orignalFile;
                  return { ...newFl, isNew: true };
                }
                return f;
              });
            }
            const { mediaIds, libraryObjectFiles } = checkMediaIds(newFiles);
            dispatch(resetLibraryMedia());
            dispatch(updateibraryMedia({ items: libraryObjectFiles }));

            setFieldValue(
              'media',
              newFiles,
              // ?.filter((f) => !!f?._id)
              // ?.map((f: any) => {
              //   const { ...rest } = f;
              //   return rest;
              // }),
            );
            setFieldValue(
              'mediaIds',
              mediaIds,
              // ?.filter((f) => !!f?._id)
              // ?.map((f: any) => {
              //   const { ...rest } = f;
              //   return rest;
              // }),
            );
            onFilesChangeCallback?.(newFiles);
            // onChange(files) as any;
          }}
          files={files}
          customButton={true}
        />
      );

    if (type === 'paid' && !!files?.length)
      return (
        <PaidMessage
          openinGallery={true}
          showButton={false}
          onNewListOpenModel={onNewListOpenModel}
          onFileChange={(files) => {
            // if (selectedPost?._id || updateFormFiles) {
            //   setFieldValue(
            //     'media',
            //     files
            //       // ?.filter((f) => !!f?._id)
            //       // ?.map((f: any) => {
            //       //   const { ...rest } = { ...f, checkrotation: true };
            //       //   return rest;
            //       // }),
            //   );
            // }
            let newFiles: any[] = files || [];
            if (newFiles?.length) {
              newFiles = files?.map((f: any) => {
                const newFl = { ...f };
                if (!f?._id && !isValidUrl(f?.path)) {
                  const { file } = appendScreenSizesToId({
                    id: f?.id,
                    sizes,
                    rotateAll: f?.rotate,
                    userId: user?._id,
                    file: newFl.orignalFile,
                    createpathagain: true,
                  });

                  newFl.orignalFile = file || newFl.orignalFile;
                  return { ...newFl, isNew: true };
                }
                return f;
              });
            }
            const { mediaIds, libraryObjectFiles } = checkMediaIds(newFiles);
            dispatch(resetLibraryMedia());
            dispatch(updateibraryMedia({ items: libraryObjectFiles }));

            setFieldValue(
              'media',
              newFiles,
              // ?.filter((f) => !!f?._id)
              // ?.map((f: any) => {
              //   const { ...rest } = f;
              //   return rest;
              // }),
            );
            setFieldValue(
              'mediaIds',
              mediaIds,
              // ?.filter((f) => !!f?._id)
              // ?.map((f: any) => {
              //   const { ...rest } = f;
              //   return rest;
              // }),
            );
            onFilesChangeCallback?.(newFiles);
            // onChange(newFiles) as any;
          }}
          files={files}
          customButton={true}
        />
      );
    return null;
  };
  const memberShipAccessTypes = useMemo(() => {
    return membershipAccessType ?? selectedPost?.membershipAccessType;
  }, [selectedPost?._id, membershipAccessType]);
  const onSubmitHandler = useCallback(
    (mediaitems: any) => {
      if (!!mediaitems) {
        let newmediaItems = { ...(mediaitems || {}) };
        const keys = Object.keys(newmediaItems || {});
        const newMedia = [...(values.media || [])];
        const mediaIds = [...(values?.mediaIds || [])];
        const oldIds: any = {};
        const newIds: any = {};

        if (!!mediaIds?.length) {
          mediaIds.forEach((id) => {
            oldIds[id] = id;
          });
        }
        keys.forEach((k) => {
          newIds[k] = k;
        });

        newMedia.forEach((med) => {
          if (oldIds[med?._id]) {
            newIds[med?._id] = med._id;
          }
          if (newmediaItems?.[med?._id]) {
            delete newmediaItems[med?._id];
          } else if (editPost) {
            newmediaItems = {
              [med?._id]: med,
              ...newmediaItems,
            };
          }
        });

        setFieldValue('mediaIds', Object.keys(newIds || {}));
        dispatch(
          setLibraryMedia({
            items: newmediaItems,
            editPost,
            callback: (items: any) => {
              setFieldValue('media', items);
            },
          }),
        );
      }

      onNewListCloseModel();
      return;
    },
    [values?.media],
  );
  const onCancelHandler = useCallback(() => {
    onNewListCloseModel();
    return;
  }, []);
  return (
    <div className={className}>
      {showBackButton && (
        <BackArrow
          className="mb-15"
          onClick={() => {
            setActiveView?.('left');
          }}
        >
          <ArrowBack /> <strong className="ml-5">Back</strong>
        </BackArrow>
      )}
      {showForwardButton && isMobileOnly && (
        <ForwardArrow
          className="mb-15"
          onClick={() => {
            showRightView();
          }}
        >
          <strong className="mr-5">See Posts</strong>
          <ArrowRightAlt />
        </ForwardArrow>
      )}

      <Card>
        {isIdExist ? (
          <UploadAttachmentContainer messageKey={messagekey} />
        ) : null}

        <>
          {showPoll && (
            <CreatePoll
              setShowPoll={setShowPoll}
              onChangePoll={(values: any) => {
                setFieldValue('poll', values);
              }}
            />
          )}
          {getComponent(type, values?.media)}
          <WritePost
            hasTemplate={hasTemplate}
            onNewListOpenModel={onNewListOpenModel}
            changeSubmitLabel={changeSubmitLabel}
            membershipAccessType={memberShipAccessTypes}
            isDisabled={isSubmitting}
            setShowPoll={setShowPoll}
            form={form}
            actions={actions}
            managedAccountId={managedAccountId}
            onFileChanges={(files, type) => {
              let newFiles: any[] = files || [];
              if (newFiles?.length) {
                newFiles = files.map((f) => {
                  const newFi = { ...f };
                  if (!f?._id && !isValidUrl(f?.path) && newFi?.orignalFile) {
                    const { file } = appendScreenSizesToId({
                      id: f?.id,
                      sizes,
                      userId: user?._id,
                      file: newFi?.orignalFile,
                      rotateAll: f.rotate,
                      createpathagain: true,
                    });
                    newFi.orignalFile = file ?? newFi.orignalFile;
                    return { ...newFi, isNew: true };
                  }
                  return f;
                });
              }
              // onChange(newFiles);
              setFieldValue('media', newFiles);
              onFilesChangeCallback?.(newFiles);
              handleClick(type);
            }}
            messageKey={messagekey}
            isPaid={type === 'paid'}
            onPublish={() => {
              if (
                values?.membershipAccessType?.some(
                  (mem: any) => mem.accessType === PostTierTypes.pay_to_view,
                ) &&
                !values.media?.length
              ) {
                toast.info('At least one media is required for paid post.');
                return;
              }
              if (onValidate) {
                if (onValidate()) {
                  return submitHandler();
                }
                return;
              }

              return submitHandler();
            }}
          />
        </>
      </Card>
      {isNewListModelOpen && (
        <LibraryModal
          isOpen={isNewListModelOpen}
          onPostHandler={onSubmitHandler}
          onCancel={onCancelHandler}
          managedAccountId={managedAccountId}
        />
      )}
    </div>
  );
});

export default styled(CreatePost)`
  .galleryMediaUploadinig {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .audio_thumbnail {
      position: absolute;
    }
  }
  .img-container {
    .image_frame {
      position: relative;
      top: 0;
      left: 0;
    }
  }
`;
