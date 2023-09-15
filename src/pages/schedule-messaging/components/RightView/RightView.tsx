import { createPost, editPost, updateImagesPhysically } from 'api/sales';
import { addMessage as addMessageApi } from 'api/schedule-messaging';
import {
  ChevronLeft,
  ChevronRight,
  Cross,
  ImageThumbnail,
  PlusFilled,
} from 'assets/svgs';
import attrAccept from 'attr-accept';
import CreatePost from 'components/CreatePost';
import LibraryModal from 'components/LibraryView';
import Button from 'components/NButton';
import { toast } from 'components/toaster';
import dayjs from 'dayjs';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import useOpenClose from 'hooks/useOpenClose';
import useQuery from 'hooks/useQuery';
import useSocket from 'hooks/useSocket';
import React, { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { removeMessageFiles, removeTemplateMessage } from 'store/reducer/chat';
import { onRemoveGroup, uploadFiles } from 'store/reducer/files';
import {
  resetLibraryMedia,
  setLibraryMedia,
  updateibraryMedia,
} from 'store/reducer/global';

import { ImagesScreenSizes } from 'appconstants';
import {
  editedPostTemplate,
  insertBeginningOfUserPosts,
  updateSelectedScheduledPost,
} from 'store/reducer/member-post';
import {
  addMessage,
  insertpostAttheEnd,
  setMessage,
  setPrice,
  setSelectedDate,
  setSelectedScheduledPost,
  setSelectedTime,
  setSelectedView,
  updatescheduleMessage,
  updateSchedulePost,
} from 'store/reducer/scheduledMessaging';
import styled from 'styled-components';
import swal from 'sweetalert';
import {
  getFilemetaData,
  getImageURL,
  getUrlParts,
  isValidUrl,
  processFilesForRotation,
} from 'util/index';
import AddMessage, { ScheduleTimingHeader } from './AddMessage';
import MessageEditor, { ScheduleMessagingTags } from './MessageEditor';
import MessagesListing from './MessagesListing';
interface Props {
  className?: string;
  managedAccountId?: string;
  messagePrefix?: string;
}

const Header: React.FC<{
  view?: string;
  onBack?(): void;
  onClose?(): void;
  onDateClick(): void;
}> = ({ view, onBack, onClose, onDateClick }) => {
  const dispatch = useAppDispatch();
  const selectedDate = useAppSelector(
    (state) => state.scheduledMessaging.selectedDate,
  );
  return view === 'listing' ? (
    <div className="scheduling-header">
      <span className="icon-holder">
        <Button
          type="text"
          icon={<ChevronLeft />}
          onClick={() =>
            dispatch(setSelectedDate(selectedDate.subtract(1, 'day')))
          }
        />
      </span>
      <span onClick={onDateClick}>
        {dayjs(selectedDate).format('dddd - MMM DD, YYYY')}
      </span>
      <span className="icon-holder">
        <Button
          type="text"
          icon={<ChevronRight />}
          onClick={() => dispatch(setSelectedDate(selectedDate.add(1, 'day')))}
        />
      </span>
    </div>
  ) : (
    <div className="scheduling-header">
      <span className="icon-holder">
        {view !== 'edit' && (
          <Button type="text" icon={<ChevronLeft />} onClick={onBack} />
        )}
      </span>
      <span onClick={onDateClick}>
        {dayjs(selectedDate).format('MMM DD, YYYY')}
      </span>
      <span className="icon-holder">
        <Button type="text" icon={<Cross />} onClick={onClose} />
      </span>
    </div>
  );
};

const RightView: React.FC<Props> = (props) => {
  const { className, managedAccountId, messagePrefix = '' } = props;
  const [selectedMessageType, setSelectedMessageType] = useState<
    'standard' | 'pay-to-view'
  >('standard');
  const [isSending, setIsSending] = useState(false);
  const pendingEditMessages = useAppSelector(
    (state) => state.mysales.pendingEditMessages,
  );
  const { date } = useQuery();
  const { socket } = useSocket();
  const { showLeftView } = useControllTwopanelLayoutView();
  const dispatch = useAppDispatch();
  const [isNewListModelOpen, onNewListOpenModel, onNewListCloseModel] =
    useOpenClose();
  // const templateMessage = useAppSelector((state) => state.chat.templateMessage);
  const messageMedia = useAppSelector(
    (state) => state.global.selectedLibraryMedia,
  );
  const selectedView = useAppSelector(
    (state) => state.scheduledMessaging.selectedView,
  );
  const price = useAppSelector((state) => state.scheduledMessaging.price);
  const selectedScheduledPost = useAppSelector(
    (state) => state.scheduledMessaging.selectedScheduledPost,
  );

  const selectedPost = useAppSelector(
    (state) => state.memberPost.selectedPostTemplate,
  );
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const message = useAppSelector((state) => state.scheduledMessaging.message);
  const messageActionRules = useAppSelector(
    (state) => state.scheduledMessaging.messageActionsRules,
  );
  const selectedDate = useAppSelector(
    (state) => state.scheduledMessaging.selectedDate,
  );
  const selectedTime = useAppSelector(
    (state) => state.scheduledMessaging.selectedTime,
  );
  const messagekey = `schedule-${messagePrefix}${
    selectedScheduledPost?._id || selectedPost?._id || date
  }`;
  useEffect(() => {
    // if (templateMessage) {
    //   dispatch(setMessage(templateMessage?.messageValue));
    //   if (
    //     templateMessage?.isPaidType &&
    //     !!templateMessage?.messageMedia?.length
    //   ) {
    //     setIsPaid(true);
    //     setSelectedMessageType('pay-to-view');
    //     dispatch(setPrice(templateMessage?.price as number));
    //     dispatch(setMessageFiles(templateMessage.messageMedia));
    //   } else if (
    //     !templateMessage?.isPaidType &&
    //     !!templateMessage?.messageMedia?.length
    //   ) {
    //     dispatch(setMessageFiles(templateMessage.messageMedia));
    //     setSelectedMessageType('standard');
    //   }
    // } else {
    //   dispatch(setMessage(''));
    //   dispatch(setPrice(5));
    //   dispatch(removeMessageFiles());
    // }
    // }, [dispatch, templateMessage]);
  }, [dispatch]);
  useEffect(() => {
    if (
      !selectedPost?._id &&
      (selectedView === 'editPost' || selectedView === 'addPost')
    ) {
      dispatch(setSelectedView('listing'));
    }
    return () => {
      dispatch(removeTemplateMessage());
      dispatch(resetLibraryMedia());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPost?._id]);
  const onBack = () => {
    dispatch(setSelectedView('listing'));
    dispatch(setMessage(''));
    dispatch(setPrice(5));
    dispatch(removeMessageFiles());
    dispatch(resetLibraryMedia());
  };

  const scheduleMessage = async (uploadGroup: any) => {
    const rules = {
      ...messageActionRules,
    };
    const mediaTypes = messageActionRules.excludedMedia as MediaType[];
    if (!!mediaTypes?.length) {
      rules['excludedMedia'] = mediaTypes.map((m: any) => m?._id);
    }
    // const blurthumb = uploadGroup?.files?.find((f: any) => {
    //   const isAudio = attrAccept({ type: f.type }, 'audio/*');
    //   return f.isPaidType && !isAudio;
    // });
    const uploaingfiles = uploadGroup?.files || [];
    const MediaFile: any = [];
    for (let index = 0; index < uploaingfiles.length; index++) {
      const element = uploaingfiles[index];
      const f = { ...element };
      const isVideo = attrAccept({ type: f.type }, 'video/*');
      const isAudio = attrAccept({ type: f.type }, 'audio/*');

      const newFile = await getFilemetaData(f);

      const isUploaded: boolean = isValidUrl(newFile?.path);
      let blurThumnail = newFile?.blurThumbnail;
      if (!blurThumnail && isUploaded && !isAudio) {
        blurThumnail = getImageURL({
          url:
            newFile.imageURL ||
            newFile.thumbnail ||
            newFile.thumb ||
            newFile.url ||
            newFile.path,
          settings: {
            bdesktop: true,
          },
        })?.url;
      }
      const id = newFile._id
        ? newFile._id
        : newFile.id ||
          getUrlParts(newFile.path ? newFile.path : newFile.url)
            ?.pathname?.split('_')
            ?.pop()
            ?.split('.')?.[0];
      // let file = {
      //   // id: getUrlParts(file.path ? file.path : file.url)
      //   //   ?.pathname?.split('_')
      //   //   ?.pop()
      //   //   ?.split('.')?.[0],
      //   id: id,
      //   _id: id,
      //   type: isVideo ? 'video/mp4' : file.type,
      //   name: file.name,
      //   path: file._id ? file.path : file.url,
      //   isPaidType: file.isPaidType,
      //   thumbnail: file.thumbnail,
      //   // rotate: file._id ? file.rotate : undefined,
      //   duration,
      //   videoDuration: timeDuration,
      //   blurThumnail: file.isPaidType ? file?.blurThumnail : undefined,
      // };
      const file: any = {
        // id: getUrlParts(f.path ? f.path : f.url)
        //   ?.pathname?.split('_')
        //   ?.pop()
        //   ?.split('.')?.[0],
        id: id,
        _id: id,
        type: isVideo
          ? 'video/mp4'
          : !isAudio
          ? `image/${(newFile.path ? newFile.path : newFile.url)
              ?.split('.')
              ?.pop()}`
          : newFile.type,
        path: newFile.path ? newFile.path : newFile.url,
        thumbnail: newFile.thumbnail,
        isPaidType: !!newFile.isPaidType,
        name: newFile.name,
        videoDuration: newFile?.timeDuration,
        size: newFile.size || 0,
        duration: newFile?.duration,
        blurThumbnail: blurThumnail,
        width: newFile.width,
        height: newFile.height,
      };
      if (newFile.rotate !== undefined && newFile._id) {
        const isRotateable = (((newFile.rotate || 0) % 360) + 360) % 360 !== 0;
        if (isRotateable) {
          file.rotate = newFile.rotate;
        }
      }
      MediaFile.push(file);
    }

    // const MediaFile = uploadGroup?.files?.map((file: any) => {
    // const isVideo = attrAccept({ type: file.type }, 'video/*');
    // /**
    //  *
    //  *         id: f._id,
    //   _id: f._id,
    //   type: isVideo
    //     ? 'video/mp4'
    //     : !isAudio
    //     ? `image/${(f.path ? f.path : f.url)?.split('.')?.pop()}`
    //     : f.type,
    //   path: f.path ? f.path : f.url,
    //   thumbnail: f.thumbnail,
    //   isPaidType: !!f.isPaidType,
    //   name: !!f.name,
    //   videoDuration: timeDuration,
    //   size: f.size || 0,
    //   duration,
    //   blurThumnail: blurThumnail,
    //   width,
    //   height,
    //  */
    // const f = { ...file };
    // let timeDuration = f.videoDuration;
    // let duration = f.duration;
    // const isVideo = attrAccept({ type: f.type }, 'video/*');
    // const isAudio = attrAccept({ type: f.type }, 'audio/*');
    // const isImage = attrAccept({ type: f.type }, 'image/*');
    // if (!timeDuration && isVideo) {
    //   try {
    //     const data: any = await getDuration(f as any);
    //     timeDuration = data?.timeDuration || undefined;
    //     duration = data?.duration || undefined;
    //   } catch (error) {
    //     console.log({ error });
    //   }
    // }
    // if (!timeDuration && isAudio) {
    //   try {
    //     const data: any = await getAudioDuration(f as any);
    //     timeDuration = data?.timeDuration || undefined;
    //     duration = data.duration || undefined;
    //   } catch (error) {
    //     console.log({ error });
    //   }
    // }
    // let width = f.width || 0;
    // let height = f.height || 0;
    // if ((!width || !height) && isImage) {
    //   try {
    //     const getUrl = getChangeUrlsOnly(f.path ? f.path : f.url);
    //     const widthHeight = await getImageURLDimension(getUrl.url);
    //     width = widthHeight.width;
    //     height = widthHeight.height;
    //   } catch (error) {}
    // }
    // const isUploaded: boolean = isValidUrl(f?.path);
    // let blurThumnail = f.isPaidType ? f?.blurThumnail : null;
    // if (!blurThumnail && isUploaded && f.isPaidType && !isAudio) {
    //   blurThumnail = getImageURL({
    //     url: f.imageURL || f.thumb || f.url || f.path,
    //     settings: {
    //       bdesktop: true,
    //     },
    //   })?.url;
    // }
    // const id = file._id
    //   ? file._id
    //   : file.id ||
    //     getUrlParts(file.path ? file.path : file.url)
    //       ?.pathname?.split('_')
    //       ?.pop()
    //       ?.split('.')?.[0];
    // return {
    //   // id: getUrlParts(file.path ? file.path : file.url)
    //   //   ?.pathname?.split('_')
    //   //   ?.pop()
    //   //   ?.split('.')?.[0],
    //   id: id,
    //   _id: id,
    //   type: isVideo ? 'video/mp4' : file.type,
    //   name: file.name,
    //   path: file._id ? file.path : file.url,
    //   isPaidType: file.isPaidType,
    //   thumbnail: file.thumbnail,
    //   rotate: file._id ? file.rotate : undefined,
    //   duration,
    //   videoDuration: timeDuration,
    //   blurThumnail: file.isPaidType ? file?.blurThumnail : undefined,
    // };
    // });
    const promises: any = [];
    const { filesWithoutRotation = [], newFiles } = processFilesForRotation(
      MediaFile,
      ImagesScreenSizes.chat,
    );
    newFiles?.forEach((f: any) => {
      promises.push(
        updateImagesPhysically({
          url: f.oldUrl,
          name: f.path.split('/').pop(),
        }),
      );
    });
    await Promise.all([...promises]).then(() => {
      addMessageApi({
        price: selectedMessageType === 'pay-to-view' ? price : 0,
        messageValue: message!,
        blurThumnail: filesWithoutRotation.find((f) => f?.blurThumbnail)
          ?.blurThumbnail,
        sellerId: managedAccountId,
        messageMedia: filesWithoutRotation,
        // templateId: templateMessage?._id,
        publishDateTime: dayjs(
          `${selectedDate.format('MM/DD/YYYY')} ${selectedTime}`,
        )
          .utc()
          .format(),
        ...rules,
      })
        .then((res) => {
          dispatch(addMessage({ ...res, excludedMedia: mediaTypes }));
          dispatch(removeTemplateMessage());
          dispatch(setSelectedView('listing'));
          setIsSending(false);
          dispatch(setPrice(0));
          dispatch(setMessage(''));
          dispatch(updatescheduleMessage({}));
          dispatch(removeMessageFiles());
        })
        .catch(() => {
          setIsSending(false);
          dispatch(setPrice(0));
          dispatch(setMessage(''));
          dispatch(removeMessageFiles());
        });
    });
  };

  const updateScheduledMessages = async (msg: Record<string, any>) => {
    dispatch(updatescheduleMessage({ ...messageActionRules, ...msg }));
  };
  const excludeMediaUpdate = (media: MediaType[]) => {
    // const ids = media.map((m) => m._id!);
    const msg = { ...messageActionRules, excludedMedia: media };
    dispatch(updatescheduleMessage(msg as any));
  };
  const processFilesAfterGroupUpload = async (files: any[], key: string) => {
    dispatch(
      onRemoveGroup({
        groupId: key,
      }),
    );
    const newFiles = [];
    for (let j = 0; j < files.length; j++) {
      let f = files[j];

      f = await getFilemetaData(f);
      const isVideo = attrAccept({ type: f.type }, 'video/*');
      const width = f.width || 0;
      const height = f.height || 0;
      const isImage = attrAccept({ type: f.type }, 'image/*');
      const file: any = {
        duration: f.duration,

        _id: f._id ? f._id : f.id,
        id: f._id ? f._id : f.id,
        imageURL: isImage ? f.path || f.imageURL : f.thumb,
        isTrusted: f.isTrusted,
        islocK: f.islocK,
        size: f.size,
        url: f.path || f.url,
        type: isVideo ? 'video/mp4' : f?.orignalFile?.type || f.type,
        path: f.path || f.url,
        thumbnail: f.thumbnail || f.thumb,
        isPaidType: f.isPaidType,
        name: f.name,
        videoDuration: f.timeDuration,
        updatedAt: f.updatedAt || new Date().getTime() + '',
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
    return new Promise((res) => {
      if (!!values?.media?.length) {
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
                res(handleSchedulePost(values, form, group));
              }
            },
            onCompletedCallback: (fileGroup: any) => {
              res(handleSchedulePost(values, form, fileGroup));
            },
          }),
        );
      } else {
        res(handleSchedulePost(values, form, { files: [] }));
      }
    });
  };
  const handleSchedulePost = async (
    values: any,
    form: any,
    fileGroup: Record<string, any>,
  ) => {
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
      ImagesScreenSizes.schedulePost,
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
    const objTem = selectedScheduledPost?.template_id
      ? {
          media: [...fWithoutRotation],
          membershipAccessType: values?.membershipAccessType,
          text: values?.text as string,
          templateId: !newFiles?.length
            ? selectedScheduledPost?.template_id
            : null,
          userId: selectedScheduledPost?.userId,
          _id: selectedScheduledPost?._id,
          sellerId: managedAccountId,
        }
      : { sellerId: managedAccountId };

    const promises: any = [];
    newFiles?.forEach((f: any) => {
      promises.push(
        updateImagesPhysically({
          url: f.oldUrl,
          name: f.path.split('/').pop(),
        }),
      );
    });
    if (selectedScheduledPost?._id && !selectedScheduledPost?.template_id) {
      const EditPost: any = {
        ...values,
        media: fWithoutRotation,
        postText: values.text,
        publishAt: dayjs(
          `${selectedDate.format('MM/DD/YYYY')} ${dayjs(
            selectedScheduledPost?.publishAt,
          ).format('hh:mm a')}`,
        )
          .utc()
          .format(),
      };

      return await Promise.all([...promises])
        .then(async () => {
          return await editPost(
            (EditPost as any)?._id,
            {
              ...EditPost,
            },
            { sellerId: managedAccountId },
          ).then((data: any) => {
            dispatch(updateSchedulePost(data));
            dispatch(setSelectedView('listing'));
            dispatch(setSelectedScheduledPost({}));
            form.resetForm();
          });
        })
        .catch(console.log);
    } else {
      const post: any = {
        ...values,
        media: [
          ...(newMedia || [])?.map((file) => {
            const isVideo = attrAccept({ type: file.type }, 'video/*');
            const isAudio = attrAccept({ type: file.type }, 'audio/*');
            const type = isVideo
              ? 'video/mp4'
              : !isAudio
              ? `image/${(file.path ? file.path : file.url)?.split('.')?.pop()}`
              : file.type;
            return { ...file, type };
          }),
        ],
        postType: 'scheduled',
        postText: values.text,
        publishAt: dayjs(`${selectedDate.format('MM/DD/YYYY')} ${selectedTime}`)
          .utc()
          .format(),
        ...objTem,
      };
      return await Promise.all([...promises]).then(async () => {
        return await createPost(post)
          .then((v) => {
            dispatch(insertpostAttheEnd(v));
            dispatch(setSelectedView('listing'));

            dispatch(insertBeginningOfUserPosts({ data: v }));
            dispatch(editedPostTemplate({}));
            form.resetForm();
          })
          .catch((err) => swal('', err.message, 'error'));
      });
    }
  };
  const onSubmitHandler = useCallback((props: any) => {
    if (!!props) {
      dispatch(setLibraryMedia({ items: props }));
    }
    onNewListCloseModel();
    return;
  }, []);
  const onCancelHandler = useCallback(() => {
    onNewListCloseModel();
    return;
  }, []);
  let notAllowedFileTypes = ['audio'];
  let addtoButtontext = 'Add to Message';
  if (['addPost', 'editPost'].includes(selectedView || '')) {
    addtoButtontext = 'Add to Post';
    notAllowedFileTypes = [];
  }
  return (
    <div className={className}>
      <Header
        view={selectedView}
        onDateClick={() => {
          if (!isMobile) {
            return;
          }
          dispatch(setSelectedView());
          showLeftView();
        }}
        onBack={onBack}
        onClose={() => {
          dispatch(resetLibraryMedia());
          setSelectedMessageType('standard');
          dispatch(setSelectedView('listing'));
          dispatch(setMessage(''));
          dispatch(setPrice(5));
          dispatch(removeMessageFiles());
        }}
      />
      {selectedView === 'listing' && (
        <MessagesListing
          onAddClick={(value?: any) => {
            dispatch(resetLibraryMedia());
            if (value === 'scheduledPost') {
              dispatch(setSelectedView('addPost'));
              return;
            }
            dispatch(setSelectedView('add'));
          }}
          managedAccountId={managedAccountId}
        />
      )}
      {selectedView === 'add' && (
        <>
          <AddMessage
            scheduleMode={true}
            onFileChange={(libraryObjectFiles) => {
              const newMedia = [...(libraryObjectFiles || [])];
              const nFiles: any = {};
              newMedia?.forEach((med: any) => {
                nFiles[med._id] = med;
              });
              dispatch(resetLibraryMedia());
              dispatch(updateibraryMedia({ items: nFiles }));
            }}
            customButton={
              <>
                {messageMedia?.length > 0 ? (
                  <div
                    className="upload_placeholder"
                    onClick={onNewListOpenModel}
                  >
                    <PlusFilled />
                  </div>
                ) : (
                  <Button
                    icon={<ImageThumbnail />}
                    block
                    type="primary"
                    shape="circle"
                    className="bg-blue"
                    onClick={onNewListOpenModel}
                  >
                    ATTACH MEDIA
                  </Button>
                )}
              </>
            }
            showButton={false}
            selectedMessageType={isPaid ? 'pay-to-view' : 'standard'}
            setSelectedMessageType={(val: 'pay-to-view' | 'standard') => {
              setSelectedMessageType(val);
              val === 'pay-to-view' ? setIsPaid(true) : setIsPaid(false);
            }}
            onSend={(uploadGroup, message, price, messageKey) => {
              if (uploadGroup.key === messageKey) {
                scheduleMessage(uploadGroup);
              }
            }}
            preivewMessage={
              selectedMessageType === 'standard'
                ? 'Create Your Message'
                : undefined
            }
            preivewSubMessage={
              selectedMessageType === 'standard'
                ? 'You can attach multiple media your message.'
                : undefined
            }
            media={messageMedia}
            files={messageMedia}
            ImageSizes={ImagesScreenSizes.scheduleChat}
            onSendStart={() => setIsSending(true)}
            isSending={isSending}
            price={price}
            message={message}
            onPriceChange={(price) => dispatch(setPrice(price))}
            onMessageChange={(message) => dispatch(setMessage(message))}
            selectedTime={selectedTime}
            showTemplate={false}
            onTimeChange={(time) => {
              dispatch(setSelectedTime(time));
            }}
            validateFiles={(files) => {
              if (
                !message?.trim().length &&
                !files?.length &&
                selectedMessageType !== 'pay-to-view'
              ) {
                toast.error(
                  'Please enter a message or attach at least one media',
                );
                return false;
              }
              if (selectedMessageType === 'pay-to-view') {
                if (price < 1) {
                  toast.error('Price should be at least $1');
                  return false;
                }
                if (!files || files?.findIndex((i) => i.isPaidType) === -1) {
                  toast.error('Please add at least one paid media');
                  return false;
                }
              }
              if (
                dayjs(
                  `${selectedDate.format('MM-DD-YYYY')} ${selectedTime}`,
                  'MM-DD-YYYY hh:mm a',
                ).isBefore(dayjs(), 'minute')
              ) {
                toast.error('Please select a valid time');
                return false;
              }
              const [t, a] = selectedTime.split(' ');
              if (!t || !a) {
                toast.error('Please select a time');
                return false;
              }
              return true;
            }}
            managedAccountId={managedAccountId}
          />
          {selectedMessageType && (
            <ScheduleMessageTagWrapper>
              <ScheduleMessagingTags
                updateScheduledMessage={updateScheduledMessages}
                message={messageActionRules as any}
                excludeMediaUpdate={excludeMediaUpdate}
                managedAccountId={managedAccountId}
              />
            </ScheduleMessageTagWrapper>
          )}
        </>
      )}
      {selectedView === 'addPost' ? (
        <>
          <ScheduleMessageTagWrapper>
            <ScheduleTimingHeader
              headerTitle={'Time to send this post:'}
              selectedTime={selectedTime}
              onChange={(time: any) => {
                dispatch(setSelectedTime(time));
              }}
            />
            <CreatePost
              uploadingFilesKey={messagekey}
              onSubmit={onSubmitPost}
              selectedPost={selectedPost}
              hasTemplate={false}
              changeSubmitLabel={'Schedule'}
              pendingEditMessages={pendingEditMessages}
              schedulePost={true}
              showBackButton={false}
              showForwardButton={false}
              getMemberships={true}
              ImageSizes={ImagesScreenSizes.schedulePost}
              onValidate={() => {
                if (
                  dayjs(
                    `${selectedDate.format('MM-DD-YYYY')} ${selectedTime}`,
                    'MM-DD-YYYY hh:mm a',
                  ).isBefore(dayjs(), 'minute')
                ) {
                  toast.error('Please select a valid time');
                  return false;
                }

                const [t, a] = selectedTime.split(' ');
                if (!t || !a) {
                  toast.error('Please select a time');
                  return false;
                }
                return true;
              }}
              managedAccountId={managedAccountId}
            />
          </ScheduleMessageTagWrapper>
        </>
      ) : null}
      {selectedView === 'editPost' ? (
        <>
          <ScheduleMessageTagWrapper>
            <ScheduleTimingHeader
              headerTitle={'Time to send this post:'}
              selectedTime={dayjs(selectedScheduledPost?.publishAt).format(
                'hh:mm a',
              )}
              onChange={(time) => {
                if (
                  dayjs(
                    `${dayjs(selectedDate).format('MM-DD-YYYY')} ${time}`,
                    'MM-DD-YYYY hh:mm a',
                  ).isBefore(dayjs(), 'minute')
                ) {
                  toast.error('Please select a valid time');
                  return;
                }
                const post = {
                  ...selectedScheduledPost,
                  publishAt: dayjs(
                    `${dayjs(selectedDate).format('YYYY-MM-DD')} ${time}`,
                  )
                    .utc()
                    .format(),
                };
                dispatch(updateSelectedScheduledPost(post));
                dispatch(setSelectedScheduledPost(post));
              }}
            />
            <CreatePost
              pendingEditMessages={pendingEditMessages}
              onSubmit={onSubmitPost}
              uploadingFilesKey={messagekey}
              hasTemplate={false}
              editPost={true}
              selectedPost={selectedScheduledPost}
              schedulePost={true}
              showBackButton={false}
              showForwardButton={false}
              getMemberships={true}
              ImageSizes={ImagesScreenSizes.schedulePost}
              managedAccountId={managedAccountId}
            />
          </ScheduleMessageTagWrapper>
        </>
      ) : null}
      {selectedView === 'edit' && (
        <MessageEditor
          scheduleMode={true}
          customButton={
            <>
              {messageMedia?.length > 0 ? (
                <div
                  className="upload_placeholder"
                  onClick={onNewListOpenModel}
                >
                  <PlusFilled />
                </div>
              ) : (
                <Button
                  icon={<ImageThumbnail />}
                  block
                  type="primary"
                  shape="circle"
                  className="bg-blue"
                  onClick={onNewListOpenModel}
                >
                  ATTACH MEDIA
                </Button>
              )}
            </>
          }
          ImageSizes={ImagesScreenSizes.scheduleChat}
          managedAccountId={managedAccountId}
        />
      )}
      {isNewListModelOpen && (
        <LibraryModal
          notAllowedTypes={notAllowedFileTypes}
          isOpen={isNewListModelOpen}
          onPostHandler={onSubmitHandler}
          onCancel={onCancelHandler}
          managedAccountId={managedAccountId}
          addtoButtontext={addtoButtontext}
        />
      )}
    </div>
  );
};
const ScheduleMessageTagWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;
export default styled(RightView)`
  .scheduling-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    color: var(--colors-darkGrey-300);
    font-size: 18px;
    line-height: 22px;
    font-weight: 500;
    border-bottom: 1px solid var(--pallete-colors-border);

    .icon-holder {
      cursor: pointer;
    }

    svg {
      vertical-align: top;
    }
  }
`;
