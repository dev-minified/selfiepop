import { updateImagesPhysically } from 'api/sales';
import {
  DollarChat,
  EditPencil,
  // ImageThumbnail,
  MessageActions as MessageActionsIcon,
  MessageRules as MessageRulesIcon,
  StarFill,
  Tag,
} from 'assets/svgs';
import attrAccept from 'attr-accept';
import Button from 'components/NButton';
import Tabs from 'components/Tabs';
import InlineTagger from 'components/Tags/InlineTagger';
import { toast } from 'components/toaster';
import dayjs from 'dayjs';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import Message from 'pages/chat/components/ChatWidget/Message';
import React, { Fragment, useState } from 'react';
import { resetLibraryMedia, updateibraryMedia } from 'store/reducer/global';
import {
  setSelectedMessage,
  updateMessage,
} from 'store/reducer/scheduledMessaging';
import styled, { css } from 'styled-components';

import { ImagesScreenSizes } from 'appconstants';
import {
  getFilemetaData,
  getImageURL,
  getUrlParts,
  isValidUrl,
  processFilesForRotation,
} from 'util/index';
import AddMessage, { ScheduleTimingHeader } from './AddMessage';
// import ScheduledMessageAttachments from './ScheduledMessageAttachments';

interface Props {
  className?: string;
  customButton?: React.ReactElement;
  view?: 'add' | 'edit';
  ImageSizes?: string[];
  managedAccountId?: string;
  scheduleMode?: boolean;
}

const MessageRules: React.FC<{
  includedTags: string[];
  includedSubList: string[];
  excludedTags: string[];
  excludedSubList: string[];

  // excludedMedia: MediaType[];
  onIncludeTagsUpdate(tags: string[]): void;
  onIncludeSubListUpdate(subList: string[]): void;
  onExcludeTagsUpdate(tags: string[]): void;
  onExcludeSubList(subList: string[]): void;
  // onExcludedMediaUpdate(media: MediaType[]): void;
}> = (props) => {
  const {
    includedTags,
    // excludedMedia,
    excludedTags,
    excludedSubList,
    includedSubList,
    onExcludeTagsUpdate,
    // onExcludedMediaUpdate,
    onIncludeTagsUpdate,
    onIncludeSubListUpdate,
    onExcludeSubList,
  } = props;
  return (
    <div>
      <InlineTagger
        name="send-tags"
        value={includedTags.join(',')}
        placeholder="Add Tag"
        showAddButton
        title={
          <div className="tags-title">
            <span className="tag-image">
              <Tag />
            </span>
            <span className="text-blue">Only </span>send if user has these tags:
          </div>
        }
        subtitle={null}
        onChange={(e: any) => {
          onIncludeTagsUpdate(e.target.value?.split(',').filter(Boolean));
        }}
      />
      <InlineTagger
        name="dont-send-tags"
        value={excludedTags.toString()}
        placeholder="Add Tag"
        showAddButton
        title={
          <div className="tags-title">
            <span className="tag-image">
              <Tag />
            </span>
            <span className="text-blue">Don't </span> send if user has these
            tags:
          </div>
        }
        subtitle={null}
        onChange={(e: any) =>
          onExcludeTagsUpdate(e.target.value?.split(',').filter(Boolean))
        }
      />
      <InlineTagger
        name="send-tags"
        value={includedSubList.join(',')}
        placeholder="Add list title"
        showAddButton
        title={
          <div className="tags-title">
            <span className="tag-image">
              <StarFill />
            </span>
            <span className="text-blue">Send </span> if on list:
          </div>
        }
        subtitle={null}
        onChange={(e: any) => {
          onIncludeSubListUpdate(e.target.value?.split(',').filter(Boolean));
        }}
      />
      <InlineTagger
        name="dont-send-tags"
        value={excludedSubList.toString()}
        placeholder="Add list title"
        showAddButton
        title={
          <div className="tags-title">
            <span className="tag-image">
              <StarFill />
            </span>
            <span className="text-blue">Don't </span> send if on list:
          </div>
        }
        subtitle={null}
        onChange={(e: any) =>
          onExcludeSubList(e.target.value?.split(',').filter(Boolean))
        }
      />
      {/* <div className="tags-area">
        <ScheduledMessageAttachments
          attachments={excludedMedia}
          onUpdate={(media) => onExcludedMediaUpdate(media)}
          showAddButton
          title={
            <div className="mb-20 tags-title">
              <span className="tag-image">
                <ImageThumbnail />
              </span>
              <span className="text-blue">Don’t </span> send if user already has
              this media:
            </div>
          }
        />
      </div> */}
    </div>
  );
};

const MessageActions: React.FC<{
  tagsToAdd: string[];
  tagsToRemove: string[];
  onTagsToAddUpdate(tags: string[]): void;
  onTagsToRemoveUpdate(tags: string[]): void;
}> = (props) => {
  const { tagsToAdd, tagsToRemove, onTagsToAddUpdate, onTagsToRemoveUpdate } =
    props;
  return (
    <div>
      <InlineTagger
        name="send-tags"
        value={tagsToAdd.toString()}
        placeholder="Add Tag"
        showAddButton
        title={
          <div className="tags-title">
            <span className="tag-image">
              <Tag />
            </span>
            <span className="text-blue">Add </span>this tag on send:
          </div>
        }
        subtitle={null}
        onChange={(e: any) =>
          onTagsToAddUpdate(e.target.value?.split(',').filter(Boolean))
        }
      />
      <InlineTagger
        name="dont-send-tags"
        value={tagsToRemove.toString()}
        placeholder="Add Tag"
        showAddButton
        title={
          <div className="tags-title">
            <span className="tag-image">
              <Tag />
            </span>
            <span className="text-blue">Remove </span>this tag on send:
          </div>
        }
        subtitle={null}
        onChange={(e: any) =>
          onTagsToRemoveUpdate(e.target.value?.split(',').filter(Boolean))
        }
      />
    </div>
  );
};

const MessageEditor: React.FC<Props> = (props) => {
  const {
    className,
    customButton,
    ImageSizes = ImagesScreenSizes.scheduleChat,
    managedAccountId,
    scheduleMode = false,
  } = props;
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const message = useAppSelector(
    (state) => state.scheduledMessaging.selectedMessage,
  );
  const messageMedia = useAppSelector(
    (state) => state.global.selectedLibraryMedia,
  );
  const [editMessage, setEditMessage] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const isPaidType = messageMedia?.some((m) => m.isPaidType);
  const excludeMediaUpdate = (media: MediaType[]) => {
    const ids = media.map((m) => m._id!);
    const msg = { ...message, excludedMedia: ids };
    dispatch(
      updateMessage({
        id: msg._id!,
        data: { ...msg, _id: undefined, sellerId: managedAccountId },
      }),
    ).then(() => {
      dispatch(setSelectedMessage({ ...msg, excludedMedia: media } as any));
    });
  };

  const updateMessageWithFiles = async (files: any[], m: ChatMessage) => {
    if (m) {
      const newFilesMedia = [];
      for (let index = 0; index < files?.length; index++) {
        const f = files[index];
        const isVideo = attrAccept({ type: f.type }, 'video/*');
        const file = await getFilemetaData({ ...f });
        const id =
          file._id ||
          file.id ||
          getUrlParts(file.path ? file.path : file.url)
            ?.pathname?.split('_')
            ?.pop()
            ?.split('.')?.[0];
        const width = file.width || 0;
        const height = file.height || 0;
        newFilesMedia.push({
          videoDuration: file?.videoDuration,
          duration: file?.duration,
          size: file.size || 0,
          id: id,
          _id: id,
          type: isVideo ? 'video/mp4' : file.type,
          name: file.name,
          path: file._id ? file.path : file.url,
          isPaidType: file.isPaidType,
          thumbnail: file.thumbnail,
          rotate: file._id ? file.rotate : undefined,
          blurThumbnail: file?.blurThumbnail,
          width,
          height,
        });
      }
      // const MediaFile = files?.map(async (f: any) => {});
      const promises: any = [];
      const { filesWithoutRotation = [], newFiles } = processFilesForRotation(
        newFilesMedia,
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
      const data = {
        ...m,
        messageMedia: filesWithoutRotation,
        blurThumnail: filesWithoutRotation.find((f) => f.blurThumbnail)
          ?.blurThumbnail,
      };
      await Promise.all([...promises]).then(() => {
        updateScheduledMessage(data);
      });
    }
  };
  const updateScheduledMessage = async (msg: ChatMessage) => {
    dispatch(
      updateMessage({
        id: msg._id!,
        data: { ...msg, _id: undefined, sellerId: managedAccountId },
      }),
    ).then((data: any) => {
      setEditMessage(false);
      setIsSending(false);
      dispatch(
        setSelectedMessage({
          ...data?.payload,
          messageMedia: data?.payload?.messageMedia?.map(
            (media: MediaType) => ({
              ...media,
              id: media?._id,
            }),
          ),
        } as ChatMessage),
      );
    });
  };
  let viewBy: 'BUYER' | 'SELLER' = 'BUYER';
  if (managedAccountId) {
    viewBy = 'SELLER';
  } else {
    message?.postedBy === user?._id ? (viewBy = 'SELLER') : (viewBy = 'BUYER');
  }
  return message ? (
    <div className={className}>
      <ScheduleTimingHeader
        selectedTime={dayjs(message.publishDateTime).format('hh:mm a')}
        onChange={(time) => {
          if (
            dayjs(
              `${dayjs(message.publishDateTime).format('MM-DD-YYYY')} ${time}`,
              'MM-DD-YYYY hh:mm a',
            ).isBefore(dayjs(), 'minute')
          ) {
            toast.error('Please select a valid time');
            return;
          }
          const msg = {
            ...message,
            publishDateTime: dayjs(
              `${dayjs(message.publishDateTime).format('YYYY-MM-DD')} ${time}`,
            )
              .utc()
              .format(),
          };
          updateScheduledMessage(msg);
        }}
      />
      <div className="message-preview">
        {editMessage ? (
          <AddMessage
            showTemplate={false}
            scheduleMode={scheduleMode}
            customButton={customButton}
            selectedMessageType={isPaidType ? 'pay-to-view' : 'standard'}
            setSelectedMessageType={() => {}}
            onSend={(uploadGroup) => {
              setTimeout(() => {
                updateMessageWithFiles(uploadGroup.files, message);
              }, 0);
            }}
            media={messageMedia}
            ImageSizes={ImageSizes}
            onSendStart={() => setIsSending(true)}
            isSending={isSending}
            files={messageMedia.map((p) => {
              if (
                attrAccept({ name: p?.name, type: p.type }, 'image/*') &&
                isValidUrl(p?.path || p?.url)
              ) {
                const f: any = { ...p };
                const { url, fallbackUrl } = getImageURL({
                  url: p?.path || p?.url || '',
                  settings: {
                    onlysMobile: true,

                    defaultUrl: f?.path || p?.url,

                    imgix: {
                      all: 'w=480&h=220',
                    },
                  },
                });
                f.path = url;
                f.fallbackUrl = fallbackUrl ? fallbackUrl : p?.path || p?.url;
                return f;
              }
              return p;
            })}
            hasPaid={false}
            price={message.price}
            message={message.messageValue}
            onPriceChange={(price) =>
              dispatch(setSelectedMessage({ ...message, price }))
            }
            onMessageChange={(msg) =>
              dispatch(setSelectedMessage({ ...message, messageValue: msg }))
            }
            showChooseTabsOptions={false}
            showClose
            onCloseTabs={() => setEditMessage(false)}
            validateFiles={(files) => {
              if (!message.messageValue?.trim().length) {
                toast.error('Please enter a message');
                return false;
              }
              if (
                !message?.messageValue?.trim().length &&
                !files?.length &&
                !isPaidType
              ) {
                toast.error(
                  'Please enter a message or attach at least one media',
                );
                return false;
              }
              if (isPaidType) {
                if (message.price && message.price < 1) {
                  toast.error('Enter Price should be at least $1');
                  return false;
                }
                if (files.findIndex((i) => i.isPaidType) === -1) {
                  toast.error('Please add at least one paid media');
                  return false;
                }
              }

              return true;
            }}
            onFileChange={(libraryObjectFiles) => {
              const newMedia = [...(libraryObjectFiles || [])];
              const nFiles: any = {};
              newMedia?.forEach((med: any) => {
                nFiles[med._id] = med;
              });
              dispatch(resetLibraryMedia());
              dispatch(updateibraryMedia({ items: nFiles }));
            }}
            managedAccountId={managedAccountId}
          />
        ) : (
          <Fragment>
            {isPaidType ? (
              <Tabs defaultActiveKey="1" type="card">
                <Tabs.TabPane
                  key="1"
                  tab={
                    <span className="text-blue">
                      <DollarChat /> Pay to View
                    </span>
                  }
                >
                  <Message
                    medias={messageMedia}
                    message={{
                      ...message,
                      messageMedia: messageMedia?.filter(
                        (media) => media?.isPaidType,
                      ),
                    }}
                    viewPaidContent={true}
                    image={(user as IUser).profileImage}
                    viewBy={viewBy}
                    buyPaidMessage={async () => {}}
                    orientation="left"
                    showActions={false}
                    managedAccountId={managedAccountId}
                  />
                </Tabs.TabPane>
              </Tabs>
            ) : (
              <Fragment>
                <Message
                  medias={messageMedia}
                  showActions={false}
                  message={{
                    ...message,
                    messageMedia: messageMedia,
                  }}
                  image={(user as IUser).profileImage}
                  viewBy={viewBy}
                  buyPaidMessage={async () => {}}
                  orientation="left"
                  managedAccountId={managedAccountId}
                />
              </Fragment>
            )}
            <Button
              type="primary"
              shape="round"
              icon={<EditPencil />}
              block
              className="mb-40 bg-blue py-15"
              onClick={() => setEditMessage(true)}
            >
              EDIT MESSAGE
            </Button>
          </Fragment>
        )}
      </div>
      <ScheduleMessagingTags
        message={message}
        updateScheduledMessage={updateScheduledMessage}
        excludeMediaUpdate={excludeMediaUpdate}
        managedAccountId={managedAccountId}
      />
    </div>
  ) : null;
};
const ScheduleTags = ({
  message,
  updateScheduledMessage,
  // excludeMediaUpdate,
  className,
}: {
  message: ChatMessage<MessagesType> | null;
  updateScheduledMessage: (data: any) => void;
  excludeMediaUpdate: (media: MediaType[]) => void;
  className?: string;
  managedAccountId?: string;
}) => {
  return (
    <div className={`tags-editor ${className}`}>
      <Tabs defaultActiveKey="1" type="card">
        <Tabs.TabPane
          key="1"
          tab={
            <span>
              <MessageRulesIcon /> Rules
            </span>
          }
        >
          <MessageRules
            includedTags={message?.includedTags || []}
            includedSubList={message?.listToAdd || []}
            excludedTags={message?.excludedTags || []}
            excludedSubList={message?.listToRemove || []}
            // excludedMedia={(message?.excludedMedia as MediaType[]) || []}
            onExcludeTagsUpdate={(tags) =>
              updateScheduledMessage({ ...message, excludedTags: tags })
            }
            onExcludeSubList={(subList) =>
              updateScheduledMessage({ ...message, listToRemove: subList })
            }
            onIncludeTagsUpdate={(tags) =>
              updateScheduledMessage({ ...message, includedTags: tags })
            }
            // onExcludedMediaUpdate={(media) => excludeMediaUpdate(media)}
            onIncludeSubListUpdate={(subList) =>
              updateScheduledMessage({ ...message, listToAdd: subList })
            }
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          key="2"
          tab={
            <span>
              <MessageActionsIcon /> Actions
            </span>
          }
        >
          <MessageActions
            tagsToAdd={message?.tagsToAdd || []}
            tagsToRemove={message?.tagsToRemove || []}
            onTagsToRemoveUpdate={(tags) =>
              updateScheduledMessage({ ...message, tagsToRemove: tags })
            }
            onTagsToAddUpdate={(tags) =>
              updateScheduledMessage({ ...message, tagsToAdd: tags })
            }
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

const commonCss = css`
  .rc-tabs-content-holder {
    margin: 0 -15px;
    padding: 20px;

    @media (max-width: 767px) {
      margin: 0;
      padding: 20px;
    }
  }

  .rc-tabs-card {
    .rc-tabs-tab {
      &.rc-tabs-tab-active {
        color: var(--pallete-text-light-150);
      }
    }
  }

  .tags-area {
    background: var(--pallete-background-gray-primary);
    border-radius: 8px;
    padding: 20px;
    margin: 0 0 14px;

    .tags-title {
      position: relative;
      padding: 0 0 0 33px;
      color: var(--pallete-text-main-550);
      font-size: 16px;
      line-height: 20px;
      font-weight: 500;

      .text-blue {
        color: var(--pallete-primary-main);
      }

      .tag-image {
        color: rgba(3, 5, 61, 0.22);
        position: absolute;
        left: 0;
        top: 0;
        width: 20px;

        .sp_dark & {
          color: rgba(255, 255, 255, 0.6);
        }

        svg {
          width: 100%;
          height: auto;
          display: block;
        }

        path {
          fill: currentColor;
        }
      }
    }

    .tagslist {
      margin: 0 !important;
      border: 1px solid var(--pallete-colors-border);
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
`;
export const ScheduleMessagingTags = styled(ScheduleTags)`
  ${commonCss}
`;
export default styled(MessageEditor)`
  padding: 18px 20px;
  max-width: 900px;
  margin: 0 auto;

  .time-edit {
    background: var(--pallete-primary-main);
    color: #fff;
    padding: 9px 40px 9px 47px;
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    position: relative;
    border-radius: 5px;
    margin: 0 0 24px;

    path {
      fill: currentColor;
    }

    .icon-time {
      position: absolute;
      left: 8px;
      top: 50%;
      transform: translate(0, -50%);
      font-size: 24px;
      line-height: 24px;
    }

    .img-edit {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translate(0, -50%);
    }
  }

  ${commonCss}
`;
