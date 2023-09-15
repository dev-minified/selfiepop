import { createPost, editPost, updateImagesPhysically } from 'api/sales';
import { addMessage as addMessageApi } from 'api/schedule-messaging';
import { ImagesScreenSizes } from 'appconstants';
import { ChevronLeft, ChevronRight, Cross } from 'assets/svgs';
import attrAccept from 'attr-accept';
import CreatePost from 'components/CreatePost';
import Button from 'components/NButton';
import { toast } from 'components/toaster';
import dayjs from 'dayjs';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { removeMessageFiles, setMessageFiles } from 'store/reducer/chat';
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
import { processFilesForRotation } from 'util/index';
import AddMessage, { ScheduleTimingHeader } from './AddMessage';
import MessageEditor, { ScheduleMessagingTags } from './MessageEditor';
import MessagesListing from './MessagesListing';
interface Props {
  className?: string;
  managedAccountId?: string;
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
  const { className, managedAccountId } = props;
  const [selectedMessageType, setSelectedMessageType] = useState<
    'standard' | 'pay-to-view'
  >('standard');
  const [isSending, setIsSending] = useState(false);
  const { showLeftView } = useControllTwopanelLayoutView();
  const dispatch = useAppDispatch();
  const templateMessage = useAppSelector((state) => state.chat.templateMessage);
  const messageMedia = useAppSelector((state) => state.chat.messageFiles);
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
  useEffect(() => {
    if (templateMessage) {
      dispatch(setMessage(templateMessage?.messageValue));
      if (
        templateMessage?.isPaidType &&
        !!templateMessage?.messageMedia?.length
      ) {
        setIsPaid(true);
        setSelectedMessageType('pay-to-view');
        dispatch(setPrice(templateMessage?.price as number));
        dispatch(setMessageFiles(templateMessage.messageMedia));
      } else if (
        !templateMessage?.isPaidType &&
        !!templateMessage?.messageMedia?.length
      ) {
        dispatch(setMessageFiles(templateMessage.messageMedia));
        setSelectedMessageType('standard');
      }
    } else {
      dispatch(setMessage(''));
      dispatch(setPrice(5));
      dispatch(removeMessageFiles());
    }
  }, [dispatch, templateMessage]);
  useEffect(() => {
    if (
      !selectedPost?._id &&
      (selectedView === 'editPost' || selectedView === 'addPost')
    ) {
      dispatch(setSelectedView('listing'));
    }
  }, [selectedPost?._id]);
  const onBack = () => {
    dispatch(setSelectedView('listing'));
    dispatch(setMessage(''));
    dispatch(setPrice(5));
    dispatch(removeMessageFiles());
  };

  const scheduleMessage = (uploadGroup: any) => {
    const rules = {
      ...messageActionRules,
    };
    const mediaTypes = messageActionRules.excludedMedia as MediaType[];
    if (!!mediaTypes?.length) {
      rules['excludedMedia'] = mediaTypes.map((m: any) => m?._id);
    }
    const blurthumb = uploadGroup?.files?.find((f: any) => f.blurThumbnail);
    addMessageApi({
      price: selectedMessageType === 'pay-to-view' ? price : 0,
      messageValue: message!,
      blurThumnail: blurthumb?.blurThumbnail,
      sellerId: managedAccountId,
      messageMedia: uploadGroup?.files?.map((file: any) => {
        const isVideo = attrAccept({ type: file.type }, 'video/*');
        const isAudio = attrAccept({ type: file.type }, 'audio/*');
        const type = isVideo
          ? 'video/mp4'
          : !isAudio
          ? `image/${file.url?.split('.')?.pop()}`
          : file.type;

        return {
          type,
          name: file.name,
          path: file.url,
          isPaidType: file.isPaidType,
          thumbnail: file.thumbnail,
          blurThumbnail: file?.blurThumbnail,
        };
      }),
      templateId: templateMessage?._id,
      publishDateTime: dayjs(
        `${selectedDate.format('MM/DD/YYYY')} ${selectedTime}`,
      )
        .utc()
        .format(),
      ...rules,
    })
      .then((res) => {
        dispatch(addMessage({ ...res, excludedMedia: mediaTypes }));
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
  };
  const updateScheduledMessages = async (msg: Record<string, any>) => {
    dispatch(updatescheduleMessage({ ...messageActionRules, ...msg }));
  };
  const excludeMediaUpdate = (media: MediaType[]) => {
    // const ids = media.map((m) => m._id!);
    const msg = { ...messageActionRules, excludedMedia: media };
    dispatch(updatescheduleMessage(msg as any));
  };
  const handleSchedulePost = async (values: any, form: any) => {
    if (!values?.media?.length && values.text === '') {
      toast.error('Please select aleast one media or enter text');
      return;
    }
    const newMedia: any[] = values?.media || [];
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
          membershipAccessType: selectedScheduledPost?.membershipAccessType,
          text: values?.text as string,
          templateId: !newFiles?.length
            ? selectedScheduledPost?.template_id
            : null,
          userId: selectedScheduledPost?.userId,
          _id: selectedScheduledPost?._id,
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

      Promise.all([...promises])
        .then(async () => {
          await editPost(
            (EditPost as any)?._id,
            {
              ...EditPost,
            },
            { sellerId: managedAccountId },
          ).then((data: any) => {
            dispatch(updateSchedulePost(data));
            dispatch(setSelectedView('listing'));
            dispatch(setSelectedScheduledPost({}));
          });

          form.resetForm();
        })
        .catch((e) => console.log({ e }));

      return;
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
            ImageSizes={ImagesScreenSizes.scheduleChat}
            onSendStart={() => setIsSending(true)}
            isSending={isSending}
            price={price}
            message={message}
            onPriceChange={(price) => dispatch(setPrice(price))}
            onMessageChange={(message) => dispatch(setMessage(message))}
            selectedTime={selectedTime}
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
      {selectedView === 'addPost' && (
        <>
          <ScheduleTimingHeader
            headerTitle={'Time to send this post:'}
            selectedTime={selectedTime}
            onChange={(time: any) => {
              dispatch(setSelectedTime(time));
            }}
          />
          <CreatePost
            onSubmit={handleSchedulePost}
            selectedPost={selectedPost}
            changeSubmitLabel={'Schedule'}
            // selectedTime={selectedTime}
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
        </>
      )}
      {selectedView === 'editPost' && (
        <>
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
            }}
          />
          <CreatePost
            onSubmit={handleSchedulePost}
            hasTemplate={false}
            selectedPost={selectedScheduledPost}
            // selectedTime={dayjs(selectedScheduledPost?.publishAt).format(
            //   'hh:mm a',
            // )}
            schedulePost={true}
            showBackButton={false}
            showForwardButton={false}
            getMemberships={true}
            ImageSizes={ImagesScreenSizes.schedulePost}
            managedAccountId={managedAccountId}
          />
        </>
      )}
      {selectedView === 'edit' && (
        <MessageEditor
          ImageSizes={ImagesScreenSizes.scheduleChat}
          managedAccountId={managedAccountId}
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
