import {
  defaultImage,
  MEDIA_UPLOAD_STATUSES,
  USERCHARGEBACKMESSAGE,
} from 'appconstants';
import {
  AvatarName,
  MessageCheckDelivered,
  MessageCheckSent,
  RecycleBin,
  Refresh,
  Spinner,
  VerticalDots,
  Warning,
} from 'assets/svgs';
import attrAccept from 'attr-accept';
import classNames from 'classnames';
import AttachmentLightBoxChat from 'components/AttachmentLightBoxChat';
import Image from 'components/Image';
import ImageModifications from 'components/ImageModifications';
import Button from 'components/NButton';
import { toast } from 'components/toaster';
import dayjs from 'dayjs';
import { Emoji, EmojiData, getEmojiDataFromNative } from 'emoji-mart';
import data from 'emoji-mart/data/all.json';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useDropDown from 'hooks/useDropDown';
import React, { useState } from 'react';
import {
  onCardModalOpen,
  setCallbackForPayment,
} from 'store/reducer/cardModal';
import { addEmoji } from 'store/reducer/chat';
import { IFileGroup } from 'store/reducer/files';
import styled from 'styled-components';
// type MessageStatus = 'sent' | 'delivered' | 'seen';
import EmojiBar from './EmojiBar';
import PayingModal from './PayingModel';
interface Props {
  className?: string;
  name?: string;
  postBy?: PostedBy | undefined;
  readBy?: ReadBy | undefined;
  attachments?: {
    type: 'image' | 'video' | 'file';
    path?: string;
    name?: string;
  }[];
  orientation?: 'left' | 'right';
  image?: string;
  showActions?: boolean;
  viewPaidContent?: boolean;
  viewBy: 'SELLER' | 'BUYER';
  message?: ChatMessage & {
    messageMedia: (ChatMessage['messageMedia'][number] &
      Partial<IFileGroup['files'][number]>)[];
  };
  onAttachmentClick?(
    attachment: {
      name?: string;
      type?: string;
      path?: string;
    }[],
  ): void;
  buyPaidMessage(
    subId: string,
    messageId: string,
    viewBy: 'BUYER' | 'SELLER',
    price?: number,
  ): Promise<void>;
  medias?: any[];
  managedAccountId?: string;
  onDeleteMessage?: (messageId: string) => void | Promise<any>;
  currentUser?: Record<string, any>;
}

interface StatusIconProps {
  isRead?: boolean;
  isSent?: boolean;
}

const StatusIcon: React.FC<StatusIconProps> = ({ isRead, isSent }) => {
  if (isRead) {
    return <MessageCheckDelivered />;
  }

  if (isSent) {
    return <MessageCheckSent />;
  }

  return null;
};

const parseEmoji = (message: string) => {
  let msg = message;
  const r =
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  const found = message.match(r);
  const elements: any[] = [];
  if (found?.length) {
    for (const emoji of found) {
      const str = msg.substring(0, msg.indexOf(emoji));
      if (str) elements.push(<span key={elements.length}>{str}</span>);
      msg = msg.substring(msg.indexOf(emoji) + emoji.length);
      const emojiData = getEmojiDataFromNative(emoji, 'apple', data as any);
      if (emojiData) {
        elements.push(
          <Emoji
            key={elements.length}
            emoji={emojiData}
            size={24}
            fallback={(emoji: any, props) => {
              return emoji ? (
                <>{`:${emoji.short_names[0]}:`}</>
              ) : (
                <>{props.emoji}</>
              );
            }}
          />,
        );
      } else {
        elements.push(<span>{emoji}</span>);
      }
    }

    if (msg) {
      elements.push(<span key={elements.length}>{msg}</span>);
    }

    return <>{elements.map((el) => el)}</>;
  }

  return message;
};

export const ChatBubble: React.FC<{
  message?: string;
  timestamp?: string;
  postBy?: PostedBy | undefined;
  readBy?: ReadBy | undefined;
  isRead?: boolean;
  isSent?: boolean;
  showStatusIcon?: boolean;
  emojis?: { type: string; from: 'BUYER' | 'SELLER'; _id: string }[];
  onEmojiClick?(from: 'SELLER' | 'BUYER', id: string): void;
}> = ({
  message,
  timestamp,
  isRead,
  emojis,
  postBy,
  showStatusIcon = true,
  isSent,
  onEmojiClick,
  readBy,
}) => {
  return (
    <div className="chat-bubble">
      <p>{parseEmoji(message || '')}</p>

      <span className="time-info">
        {!!postBy?._id && (
          <div className="user-message-meta">
            <span className="userName">{postBy?.pageTitle || ''} </span>
          </div>
        )}
        {!!readBy?._id && (
          <div className="user-message-meta">
            <span className="userName">
              Read By: {readBy?.pageTitle || ''}{' '}
            </span>
          </div>
        )}
        <span className="time">{dayjs(timestamp).format('ddd hh:mm A')} </span>
        {showStatusIcon && <StatusIcon isRead={isRead} isSent={isSent} />}
      </span>
      <span className="reaction-emoji">
        {emojis?.map((emoji) => (
          <span
            title={emoji.from}
            key={emoji._id + timestamp}
            className="reaction-emoji-holder"
          >
            <Emoji
              emoji={emoji.type}
              size={26}
              onClick={() => onEmojiClick?.(emoji.from, emoji._id)}
            />
          </span>
        ))}
      </span>
    </div>
  );
};

const ImageComp = styled(Image)<{ rotation?: number | string }>`
  height: 100%;
  width: 100%;
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    ${({ rotation = 0 }) => {
      return ` transform: rotate(${rotation}deg)`;
    }}
  }
`;
// const ImageComp = styled.img<{ rotation?: number | string }>`
//   ${({ rotation = 0 }) => {
//     return ` transform: rotate(${rotation}deg)`;
//   }}
// `;
export const ImageBubble: React.FC<{
  timestamp?: string;
  isRead?: boolean;
  isSent?: boolean;
  url?: string;
  urls?: any;
  showTimestamp?: boolean;
  isVideo?: boolean;
  showStatusIcon?: boolean;
  emojis?: { type: string; from: 'BUYER' | 'SELLER'; _id: string }[];
  progress?: number;
  status?: string;
  thumbnail?: string;
  onEmojiClick?(from: 'SELLER' | 'BUYER', id: string): void;
  onAttachmentClick?(): void;
  length?: number;
  pending: number;
  showEmojis?: boolean;
  isImage?: boolean;
  isPaymentComplete?: boolean;
  fallbackurl?: string;
  rotate?: number;
  messageId?: string;
}> = ({
  timestamp,
  isRead,
  urls,
  url,
  thumbnail,
  showTimestamp = true,
  isVideo = false,
  emojis,
  showStatusIcon = true,
  status,
  isSent,
  onEmojiClick,
  length = 1,
  onAttachmentClick,
  pending,
  showEmojis = true,
  isPaymentComplete = true,
  rotate = 0,
  messageId,
}) => {
  const isPending = pending;
  const classes = classNames('image-message', { group: length > 1 });
  const src = isVideo ? thumbnail : url;
  return (
    <div className={classes} onClick={onAttachmentClick}>
      <div className="image-message-holder">
        {isPending ? (
          <ImageComp
            rotation={rotate}
            className="placeholderImage"
            src={isVideo ? src : `${url}`}
            alt="ImageMessage"
            fallbackUrl={defaultImage}
            key={messageId}
          />
        ) : (
          <AttachmentLightBoxChat
            key={messageId}
            urls={urls}
            isPaymentComplete={isPaymentComplete}
          />
        )}
      </div>
      {isPending ? (
        <span className="play-btn">
          <Spinner color="#C30585" />
          {pending > 0 ? (
            <div className="image-progress">
              Uploaded {length - pending} of {length}
            </div>
          ) : null}
        </span>
      ) : status === MEDIA_UPLOAD_STATUSES.FAILED ? (
        <span className="play-btn">
          <Warning />
        </span>
      ) : null}
      {showTimestamp && (
        <span className="time-info">
          <span className="time">
            {dayjs(timestamp).format('ddd hh:mm A')}{' '}
          </span>
          {showStatusIcon && <StatusIcon isRead={isRead} isSent={isSent} />}
        </span>
      )}
      {showEmojis && (
        <span className="reaction-emoji">
          {emojis?.map((emoji) => (
            <span
              title={emoji.from}
              key={emoji._id}
              className="reaction-emoji-holder"
            >
              <Emoji
                emoji={emoji.type}
                size={26}
                onClick={() => onEmojiClick?.(emoji.from, emoji._id)}
              />
            </span>
          ))}
        </span>
      )}
    </div>
  );
};

const MessageBox: React.FC<Props> = (props) => {
  const {
    message,
    image,
    postBy,
    className,
    name,
    orientation,
    showActions = true,
    viewPaidContent = false,
    buyPaidMessage,
    viewBy,
    managedAccountId,
    readBy,
    onDeleteMessage,
    currentUser = {},
  } = props;

  const [openModel, setOpenModel] = useState(false);
  const { isVisible, ref, setIsVisible } = useDropDown(false, false);
  const appDispatch = useAppDispatch();
  const { user: loggedUser } = useAuth();
  const selectedSubscription = useAppSelector(
    (state) => state.chat.selectedSubscription,
  );
  const userCards = useAppSelector((state) => state.global.userCards);

  const [isPaying, setIsPaying] = useState(false);
  const dispatch = useAppDispatch();
  const {
    isRead,
    isSent,
    createdAt,
    messageType,
    messageValue,
    isPaidType,
    price,
    messageMedia,
    subscriptionId,
    _id,
    paymentComplete,

    sentFrom,
  } = message || {};
  const onEmojiSelect = (emoji: EmojiData) => {
    dispatch(
      addEmoji({
        subscriptionId: subscriptionId!,
        messageId: _id!,
        data: { type: emoji.colons!, sellerId: managedAccountId },
      }),
    );
    setIsVisible(false);
  };

  const isSeller = viewBy === 'SELLER' ?? false;
  const onEmojiClick = (from: 'SELLER' | 'BUYER', id: string) => {
    if (selectedSubscription?._id === message?.subscriptionId) {
      const viewedBy = viewBy;
      if (viewedBy === from) {
        dispatch(
          addEmoji({
            subscriptionId: subscriptionId!,
            messageId: _id!,
            data: { type: '', sellerId: managedAccountId },
            emojiId: id,
          }),
        );
      }
    }
  };
  const payToViewHasFreeView: any = messageMedia?.find((i) =>
    viewPaidContent
      ? i.isPaidType
      : paymentComplete
      ? i.isPaidType
      : !i.isPaidType,
  );
  const pending = (messageMedia || []).filter((media: any) =>
    [
      MEDIA_UPLOAD_STATUSES.IN_PROGRESS,
      MEDIA_UPLOAD_STATUSES.ENCODING,
    ].includes(media.status),
  ).length;

  const isImage = messageMedia?.length
    ? attrAccept(
        { name: messageMedia[0]?.name, type: messageMedia[0].type },
        'image/*',
      )
    : false;
  const isVideo = messageMedia?.length
    ? attrAccept(
        { name: messageMedia[0]?.name, type: messageMedia[0]?.type },
        'video/*',
      )
    : false;
  let previewUrl = payToViewHasFreeView?.thumbnail;
  const rotation = payToViewHasFreeView?.rotate || 0;
  const isPending = pending > 0;
  if (isPending && messageMedia?.length) {
    if (
      attrAccept(
        { name: messageMedia[0]?.name, type: messageMedia[0].type },
        'image/*',
      )
    ) {
      previewUrl = messageMedia[0].path;
    } else {
      previewUrl = messageMedia[0].thumbnail;
    }
  }

  const BuyMessage = async () => {
    if (!loggedUser?.allowPurchases) {
      toast.error(USERCHARGEBACKMESSAGE);
      return;
    }
    setOpenModel(false);
    setIsPaying(true);

    await buyPaidMessage(subscriptionId!, _id!, viewBy, price).catch(
      console.log,
    );
    setIsPaying(false);
  };
  return (
    <div className={`${className} ${orientation} `} key={message?._id}>
      <div className="profile-photo">
        <ImageModifications
          // fallbackUrl={'/assets/images/default-profile-img.svg'}
          // src={image || '/assets/images/default-profile-img.svg'}
          src={image}
          fallbackComponent={
            <AvatarName text={currentUser?.pageTitle || 'Incognito User'} />
          }
          alt={name}
          imgeSizesProps={{
            onlyMobile: true,
            imgix: {
              all: 'w=200&h=200',
            },
          }}
        />
      </div>
      <div className="message">
        {showActions && (
          <div className="message-actions">
            {(!paymentComplete || !isPaidType) &&
              isSeller &&
              sentFrom === 'SELLER' && (
                <span
                  className="message-delete"
                  onClick={() => {
                    return onDeleteMessage?.(_id || '');
                  }}
                >
                  <RecycleBin />
                </span>
              )}
            <span ref={ref}>
              {paymentComplete || !isPaidType || isSeller ? (
                <>
                  <VerticalDots />
                  {isVisible && <EmojiBar onSelect={onEmojiSelect} />}
                </>
              ) : null}
            </span>
          </div>
        )}

        {!isPaidType && messageType !== 'GIFT' && (
          <>
            {messageMedia?.length ? (
              <>
                <ImageBubble
                  key={message?._id}
                  messageId={message?._id}
                  rotate={rotation}
                  isRead={isRead}
                  isSent={isSent ?? true}
                  url={messageMedia[0].path}
                  urls={messageMedia}
                  isImage={isImage}
                  isPaymentComplete={true}
                  fallbackurl={messageMedia[0]?.fallbackUrl}
                  thumbnail={
                    messageMedia[0].thumbnail ||
                    '/assets/images/video-placeholder.png'
                  }
                  timestamp={createdAt}
                  showTimestamp={!message?.messageValue}
                  emojis={message?.emojis}
                  onEmojiClick={onEmojiClick}
                  length={message?.messageMedia.length}
                  showStatusIcon={orientation === 'right'}
                  progress={message?.messageMedia[0]?.progress}
                  status={message?.messageMedia[0]?.status}
                  isVideo={isVideo}
                  pending={pending}
                  onAttachmentClick={
                    () => {}
                    // onAttachmentClick?.(message?.messageMedia || [])
                  }
                  showEmojis={!message?.messageValue}
                />
                {message?.messageValue && (
                  <ChatBubble
                    isRead={isRead}
                    isSent={isSent ?? true}
                    postBy={postBy}
                    readBy={readBy}
                    timestamp={createdAt}
                    message={messageValue}
                    emojis={message?.emojis}
                    onEmojiClick={onEmojiClick}
                    showStatusIcon={orientation === 'right'}
                  />
                )}
              </>
            ) : (
              <ChatBubble
                isRead={isRead}
                isSent={isSent ?? true}
                timestamp={createdAt}
                postBy={postBy}
                readBy={readBy}
                message={messageValue}
                emojis={message?.emojis}
                onEmojiClick={onEmojiClick}
                showStatusIcon={orientation === 'right'}
              />
            )}
          </>
        )}
        {isPaidType && (
          <div className="pay-to-view" key={message?._id}>
            <ImageBubble
              key={message?._id}
              messageId={message?._id}
              rotate={rotation}
              url={isSeller ? previewUrl : message?.blurThumnail}
              urls={message?.messageMedia.map((media) => {
                const isImge = attrAccept({ type: media?.type }, 'image/*');
                // if (!isSeller && !media?.paymentComplete && !pending) {
                if (
                  !isSeller &&
                  !pending &&
                  (!media?.path || !message.paymentComplete)
                ) {
                  if (isImge) {
                    return {
                      ...media,
                      path:
                        message?.blurThumnail ||
                        '/assets/images/svg/ChatblurPlaceholder.svg',
                      thumbnail:
                        message?.blurThumnail ||
                        '/assets/images/svg/ChatblurPlaceholder.svg',

                      fallback: '/assets/images/svg/ChatblurPlaceholder.svg',
                    };
                  } else {
                    return {
                      ...media,
                      thumbnail:
                        message?.blurThumnail ||
                        '/assets/images/svg/ChatblurPlaceholder.svg',
                      fallback: '/assets/images/svg/ChatblurPlaceholder.svg',
                    };
                  }
                }
                return media;
              })}
              thumbnail={isSeller ? previewUrl : message?.blurThumnail}
              isPaymentComplete={
                (message?.paymentComplete || isSeller) && !isPaying
              }
              showTimestamp={false}
              isVideo={isVideo}
              length={message?.messageMedia.length}
              pending={pending}
              showStatusIcon={orientation === 'right'}
              onAttachmentClick={() => {
                // onAttachmentClick?.(medias || message?.messageMedia || []);
              }}
            />
            <Button
              className={`btn-payment ${isPaying ? 'refresh_icon' : ''}`}
              block
              disabled={message?.paymentComplete || isSeller}
              onClick={async () => {
                if (!loggedUser?.allowPurchases) {
                  toast.error(USERCHARGEBACKMESSAGE);
                  return;
                }
                if (!userCards?.length) {
                  dispatch(onCardModalOpen());
                  return;
                }
                setOpenModel(true);
              }}
            >
              {isSeller && `$${price} `}
              {paymentComplete
                ? !isSeller
                  ? 'Unlocked'
                  : 'Paid'
                : isPaying
                ? 'Processing payment...'
                : !isSeller
                ? `Purchase for $${price}`
                : 'Not Paid Yet'}{' '}
              <Refresh />
            </Button>
            <PayingModal
              price={price}
              isOpen={openModel}
              onClose={() => setOpenModel(false)}
              onClick={async () => {
                appDispatch(
                  setCallbackForPayment({
                    callback: () => BuyMessage(),
                  }),
                );
                BuyMessage();
              }}
              userName={`${
                selectedSubscription?.sellerId.pageTitle ?? 'Incognito User'
              }`}
            />
            <ChatBubble
              isRead={isRead}
              isSent={isSent ?? true}
              timestamp={createdAt}
              postBy={postBy}
              readBy={readBy}
              message={messageValue}
              showStatusIcon={orientation === 'right'}
              emojis={message?.emojis}
              onEmojiClick={onEmojiClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default styled(MessageBox)`
  display: flex;
  padding: 0 0 0 61px;
  position: relative;
  width: 61.8%;
  margin: 0 0 40px;
  min-height: 30px;

  .gift_section {
    background: #fdf3fa;
    padding: 15px;
    width: 256px;
    border-radius: 14px 14px 14px 0;

    &.giftBlackRose_btn {
      .roses_amountbtn {
        color: #fff;
      }
    }

    &.giftRedRose_btn {
      .roses_amountbtn {
        background: #ff114f;
        color: #fff;
        border-color: #ff114f;
      }
    }

    .time-info {
      background: none !important;
      padding: 0 !important;
      color: #8b939e !important;
      text-align: left;
    }

    .title {
      display: block;
      font-size: 15px;
      line-height: 18px;
      font-weight: 500;
      color: #757b7f;
      margin: 0 0 10px;
    }

    .roses-container {
      display: flex;
      flex-direction: row;
      justify-content: center;
      flex-wrap: wrap;

      .play-btn {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 14px 14px 14px 0;

        path {
          fill: #fff;
        }
      }

      > div {
        margin: 0 7px 2px;
      }
    }

    .rose-block {
      padding: 5px 10px;

      svg {
        width: 40px;
        height: auto;
        vertical-align: top;
      }
    }

    h3 {
      font-size: 16px;
      line-height: 20px;
      color: #555c61;
      font-weight: 600;
      margin: 0 0 10px;
    }

    .roses_amountbtn {
      font-size: 18px;
      line-height: 22px;
      padding: 3px 10px;
      background: #000;
      border-color: #000;
      color: #f5da92;
      font-weight: 600;
      min-width: 98px;
      margin: 0 0 15px;
    }
  }

  @media (max-width: 1199px) {
    width: 80%;
  }

  @media (max-width: 767px) {
    padding: 0 0 0 46px;
    margin: 0 0 24px;
    width: 88%;
  }

  &.right {
    margin: 0 0 40px auto;
    padding: 0 61px 0 0;

    @media (max-width: 767px) {
      padding: 0 46px 0 0;
      margin: 0 0 24px auto;
    }

    .gift_section {
      border-radius: 14px 14px 0px 14px;

      .time-info {
        text-align: right;
      }

      .roses-container {
        .play-btn {
          border-radius: 14px 14px 0px 14px;
        }
      }
    }

    .emoji-bar-holder {
      left: auto !important;
      right: -4px;

      @media (max-width: 1550px) {
        right: auto;
        left: -20px !important;
      }

      @media (max-width: 767px) {
        left: 20px !important;
        right: auto;
      }

      @media (max-width: 479px) {
        left: 30px !important;
      }
    }

    .profile-photo {
      left: auto;
      right: 6px;
    }

    .chat-bubble {
      background: var(--pallete-background-blue);
      color: #fff;
      border-radius: 14px 14px 0 14px;
      text-align: right;

      @media (max-width: 767px) {
        margin: 0 0 0 auto;
      }

      .sp_dark & {
        background: #3b8df5;
      }
    }

    .message-emoji {
      right: auto;
      left: 7px;
    }

    .message {
      margin: 0 0 0 auto;

      @media (max-width: 767px) {
        min-width: 270px;
      }
    }

    .message-actions {
      display: flex;
      align-items: center;
      left: auto;
      right: 100%;
      margin: 0 6px 0 0;
    }
    .message-delete {
      margin-right: 10px;
      svg {
        height: 15px;
        width: 13px;
      }
    }
    .image-message {
      @media (max-width: 767px) {
        margin: 0 0 10px auto;
      }

      .image-message-holder {
        border-radius: 14px;

        &:after {
          border-radius: 14px;
        }
      }

      .time-info {
        left: auto;
        right: 12px;
      }
    }

    .actions {
      left: auto;
      right: 0;
    }

    .reaction-emoji {
      right: auto;
      left: 10px;
    }
  }

  .message {
    position: relative;
    max-width: 100%;

    p {
      margin: 0 0 9px;
      overflow: hidden;
    }
  }

  .chat-bubble {
    background: var(--pallete-background-secondary-light);
    border-radius: 14px 14px 14px 0;
    font-size: 15px;
    line-height: 18px;
    color: var(--pallete-text-light-50);
    font-weight: 400;
    padding: 10px 15px 7px;
    position: relative;
    min-width: 190px;

    @media (max-width: 767px) {
      /* max-width: 90%; */
    }

    .sp_dark & {
      color: rgba(255, 255, 255, 1);
      background: #e51075;
    }

    .emoji-mart-emoji {
      line-height: 1;
      vertical-align: top;
    }
  }

  .time-info {
    display: block;
    font-size: 11px;
    line-height: 13px;
    font-weight: 700;

    .user-message-meta {
      display: flex;
      flex-direction: column;
    }

    .userName {
      display: block;
      margin: 0 0 2px;
      opacity: 0.6;
      font-size: 13px;
      line-height: 15px;
    }

    .userId {
      opacity: 0.6;
      margin: 0 0 5px;
      display: block;
    }

    .time {
      opacity: 0.6;
    }

    svg {
      display: inline-block;
      vertical-align: top;
      margin: 0 0 0 2px;
      path {
        fill: currentColor;
      }
    }
  }

  .message-emoji {
    position: absolute;
    width: 32px;
    height: 32px;
    border: 2px solid var(--pallete-background-secondary-light);
    border-radius: 100%;
    background: #4f5968;
    font-size: 18px;
    line-height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 7px;
    bottom: -16px;
  }

  .message-actions {
    position: absolute;
    left: 100%;
    margin: 0 0 0 6px;
    cursor: pointer;

    svg {
      width: 12px;
      height: 12px;
    }

    .emoji-bar-holder {
      position: absolute;
      left: -4px;
      top: 0;
      z-index: 9999;

      @media (max-width: 1550px) {
        right: -30px;
        left: auto;
      }

      @media (max-width: 767px) {
        left: -184px;
      }
    }
  }
  .img-responsive {
    position: absolute;
  }
  .actions {
    position: absolute;
    top: 0;
    left: 0;
    width: 156px;
    background: var(--pallete-background-default);
    border: 2px solid var(--pallete-colors-border);
    border-radius: 14px;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.03);
    padding: 0;
    margin: 0;
    list-style: none;
    font-size: 15px;
    line-height: 19px;
    font-weight: 500;
    overflow: hidden;
    z-index: 2;

    li {
      color: var(--pallete-text-light-50);
      opacity: 0.42;
      padding: 14px 10px 14px 65px;
      position: relative;
      cursor: pointer;
      transition: all 0.4s ease;

      &:hover {
        background: rgba(230, 235, 245, 0.4);
        color: var(--pallete-text-main-550);
        opacity: 1;
      }
    }

    svg {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translate(0, -50%);
      width: 22px;
      height: auto;

      path {
        fill: currentColor;
        fill-opacity: 1;
      }
    }
  }

  .profile-photo {
    width: 42px;
    height: 42px;
    border-radius: 100%;
    margin: 0;
    overflow: hidden;
    position: absolute;
    left: 6px;
    bottom: -15px;

    @media (max-width: 767px) {
      width: 30px;
      height: 30px;
      bottom: -5px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .btn-payment {
    max-width: 358px;
    margin: 10px 0 10px;
    background: var(--pallete-text-secondary-200);
    padding: 5px 30px;
    font-size: 15px;
    line-height: 18px;
    font-weight: 700;
    color: #fff;

    &.refresh_icon {
      svg {
        animation: spin 1s linear infinite;
        opacity: 1;
        visibility: visible;
      }
    }

    svg {
      opacity: 0;
      visibility: hidden;
      width: 18px;
      height: 18px;
      position: absolute;
      right: 10px;
      top: 6px;
      margin: 0;
    }
  }

  .image-message {
    width: 358px;
    position: relative;
    margin-bottom: 10px;
    max-width: 100%;

    @media (max-width: 1199px) {
      width: 300px;
    }

    @media (max-width: 991px) {
      width: 260px;
    }

    @media (max-width: 767px) {
      width: 200px;
    }

    &.group {
      .image-message-holder {
        &:after {
          opacity: 1;
          visibility: visible;
        }
      }
    }

    .counter {
      position: absolute;
      inset: 0;
      /* background: rgba(81, 83, 101, 0.75); */
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-weight: 600;
      font-size: 30px;
      cursor: pointer;
      z-index: 2;
      transition: all 0.4s ease;
      &:hover {
        /* background: rgba(8, 62, 103, 0.8); */
      }
    }

    .image-message-holder {
      width: 100%;
      height: 358px;
      overflow: hidden;
      border-radius: 14px;
      position: relative;
      cursor: pointer;

      @media (max-width: 1199px) {
        height: 300px;
      }

      @media (max-width: 767px) {
        height: 200px;
      }

      &:after {
        pointer-events: none;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        content: '';
        background: rgba(0, 0, 0, 0.6);
        opacity: 0;
        visibility: hidden;
        border-radius: 14px;
      }

      .chat-image-area {
        height: 100%;

        .main-img {
          height: 100%;
          margin: 0;
          max-height: inherit;
        }

        .gallery-item {
          display: block;
        }

        .image-comp,
        .lightbox-gallary,
        .lg-react-element,
        .gallery-item {
          height: 100%;
        }

        img {
          width: 100%;
          margin: 0 0 5px;
          height: 100%;
          max-height: 100%;
          object-fit: cover;
          vertical-align: top;
          margin: 0;
        }
      }
    }

    .images-length {
      position: absolute;
      left: 50%;
      top: 50%;
      white-space: nowrap;
      transform: translate(-50%, -50%);
      color: #fff;
      font-size: 20px;
      line-height: 24px;
      font-weight: 700;
      z-index: 2;
    }
    .time-info {
      position: absolute;
      left: 12px;
      bottom: 12px;
      color: #fff;
      opacity: 1;
      padding: 5px;
      background: rgba(0, 0, 0, 0.4);

      .time {
        opacity: 0.8;
      }
    }

    /* img {
      width: 100%;
      margin: 0 0 5px;
      height: 100%;
      max-height: 100%;
      object-fit: cover;
      vertical-align: top;
    } */

    p {
      margin-bottom: 5px;
    }

    .play-btn {
      pointer-events: none;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, calc(-50% + 14px));
      cursor: pointer;
      color: #fff;
      background: rgba(0, 0, 0, 0.6);
      padding: 0 10px 10px;
      border-radius: 5px;

      &.is-video {
        width: 60px;
        height: 60px;
        border-radius: 100%;
        border: 2px solid #fff;
        background: none;
        padding: 0;
        border-radius: 100%;

        svg {
          margin: 0;
          width: 100%;
          height: 100%;
        }
      }

      .image-progress {
        color: #fff;
        text-align: center;
      }

      svg {
        display: block;
        margin: 10px auto 5px;
        width: 62px;
        height: 62px;
      }

      path {
        fill: #fff;
      }
    }

    .reaction-emoji {
      margin: -17px 0 0;
    }
  }

  .reaction-emoji {
    position: absolute;
    display: flex;
    align-items: center;
    top: 100%;
    margin: -14px 0 0;
    right: 10px;
    height: 26px;

    .emoji-mart-emoji {
      vertical-align: top;
    }

    .reaction-emoji-holder {
      margin: 0 2px;
      display: inline-block;
      vertical-align: top;
    }

    .emoji-mart-emoji {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #4f5968;
      width: 30px;
      height: 30px;
      border-radius: 100%;
      border: 2px solid var(--pallete-background-default);

      > span {
        width: 18px !important;
        height: 18px !important;
      }
    }
  }

  @-moz-keyframes spin {
    100% {
      -moz-transform: rotate(360deg);
    }
  }
  @-webkit-keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  .roses_sent,
  .roses_amountbtn {
    cursor: auto;
  }
  .placeholderImage {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;
