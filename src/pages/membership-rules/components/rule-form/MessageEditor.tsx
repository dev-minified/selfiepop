import { updateImagesPhysically } from 'api/sales';
import { ImagesScreenSizes } from 'appconstants';
import attrAccept from 'attr-accept';
import EditBack from 'components/partials/components/profileBack';
import { toast } from 'components/toaster';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import AddMessage from 'pages/schedule-messaging/components/RightView/AddMessage';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { removeMessageFiles, removeTemplateMessage } from 'store/reducer/chat';
import styled from 'styled-components';
import { getUrlParts, processFilesForRotation } from 'util/index';

type Props = {
  className?: string;
  onSubmit?(message: Partial<ChatMessage>): void;
  onCancel?(): void;
  value?: Partial<ChatMessage>;
  showHeader?: boolean;
  managedAccountId?: string;
};

const MessageEditor: React.FC<Props> = (props) => {
  const {
    className,
    onSubmit,
    onCancel,
    value,
    showHeader = true,
    managedAccountId,
  } = props;
  const dispatch = useAppDispatch();
  const templateMessage = useAppSelector((state) => state.chat.templateMessage);
  const title = useAppSelector((state) => state.header.title);
  const container = useRef<HTMLDivElement>(null);
  const [messageType, setMessageType] = useState<'standard' | 'pay-to-view'>(
    'standard',
  );
  const [message, setMessage] = useState<Partial<ChatMessage>>({
    messageValue: '',
    price: 5,
    messageMedia: [],
  });
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    if (value) {
      setMessageType(
        value?.messageType === 'pay-to-view' ? 'pay-to-view' : 'standard',
      );
      setMessage({
        ...value,
        messageValue: value?.messageValue,
        price: value?.price,
        messageMedia: value?.messageMedia,
      });
    }
  }, [value]);
  const handleCancel = () => {
    setMessageType('standard');
    onCancel?.();
    dispatch(removeTemplateMessage());
    dispatch(removeMessageFiles());
  };
  useEffect(() => {
    if (templateMessage) {
      setMessage(() => ({
        ...templateMessage,
        messageValue: templateMessage?.messageValue,
        price: templateMessage?.price || 5,
      }));
      if (
        templateMessage?.isPaidType &&
        !!templateMessage?.messageMedia?.length
      ) {
        setMessageType('pay-to-view');
      } else if (
        !templateMessage?.isPaidType &&
        !!templateMessage?.messageMedia?.length
      ) {
        setMessageType('standard');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateMessage?._id]);
  const handleMessageChange = useCallback(
    (value: any) => {
      setMessage((msg) => ({ ...msg, messageValue: value }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, message],
  );
  return (
    <div className={className} ref={container}>
      {showHeader && (
        <EditBack title={title} onClick={handleCancel} backUrl="#" />
      )}

      <AddMessage
        setSelectedMessageType={(val: 'standard' | 'pay-to-view') =>
          setMessageType(val)
        }
        selectedMessageType={messageType}
        showTimingHeader={false}
        onSend={async (fileGroup, message, price) => {
          dispatch(removeTemplateMessage());
          setUploading(false);
          if (price != null && price < 1) {
            toast.error('price must be more than $1');
            return;
          }
          const MediaFile = fileGroup?.files?.map((file: any) => {
            const isVideo = attrAccept({ type: file.type }, 'video/*');
            return {
              id: getUrlParts(file.path ? file.path : file.url)
                ?.pathname?.split('_')
                ?.pop()
                ?.split('.')?.[0],
              type: isVideo ? 'video/mp4' : file.type,
              name: file.name,
              path: file.path ?? file.url,
              isPaidType: file.isPaidType,
              thumbnail: file.thumbnail,
              rotate: file.rotate,
              blurThumbnail: file?.blurThumbnail,
              updatedAt: new Date().getTime(),
            };
          });
          const promises: any = [];
          const { filesWithoutRotation = [], newFiles } =
            processFilesForRotation(MediaFile, ImagesScreenSizes.chat);
          newFiles?.forEach((f: any) => {
            promises.push(
              updateImagesPhysically({
                url: f.oldUrl,
                name: f.path.split('/').pop(),
              }),
            );
          });
          await Promise.all([...promises]).then(() => {
            onSubmit?.({
              messageValue: message,
              price,
              messageType:
                messageType === 'pay-to-view' ? 'pay-to-view' : 'SIMPLE',
              messageMedia: filesWithoutRotation,
            });
            setMessageType('standard');
            dispatch(removeMessageFiles());
          });
        }}
        preivewMessage={
          messageType === 'standard' ? 'Create Your Message' : undefined
        }
        preivewSubMessage={
          messageType === 'standard'
            ? 'You can attach multiple media your message.'
            : undefined
        }
        message={message.messageValue}
        price={message.price}
        onMessageChange={handleMessageChange}
        media={message?.messageMedia}
        files={message?.messageMedia || []}
        onPriceChange={(price) => setMessage((msg) => ({ ...msg, price }))}
        isSending={uploading}
        onSendStart={() => setUploading(true)}
        managedAccountId={managedAccountId}
      />
    </div>
  );
};

export default styled(MessageEditor)`
  .items-area .rc-scollbar {
    width: auto;
  }
  .tab-close.top-align {
    top: 15px;
    right: 20px;
  }
`;
